import { createPublicClient, http, parseAbiItem, getContract } from "viem";
import { arcTestnet } from "viem/chains";
import { CONTRACTS, IDENTITY_ABI, REPUTATION_ABI } from "./contracts";

export const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(),
});

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AgentMetadata {
  name:         string;
  description:  string;
  image?:       string;
  agent_type?:  string;
  capabilities?: string[];
  version?:     string;
  price_usdc?:  number;  // optional hire price set by marketplace
}

export interface Agent {
  id:           string;
  owner:        string;
  metadataURI:  string;
  metadata:     AgentMetadata;
  reputation:   number;
  feedbackCount: number;
  isVerified:   boolean;
  tags:         string[];
}

// ─── Fetch helpers ───────────────────────────────────────────────────────────

/** Resolve ipfs:// → HTTP gateway URL */
export function ipfsToHttp(uri: string): string {
  if (uri.startsWith("ipfs://"))
    return `https://ipfs.io/ipfs/${uri.slice(7)}`;
  return uri;
}

/** Fetch IPFS metadata, return safe defaults on failure */
async function fetchMetadata(uri: string): Promise<AgentMetadata> {
  try {
    const url = ipfsToHttp(uri);
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("fetch failed");
    return await res.json();
  } catch {
    return {
      name:        "Unknown Agent",
      description: "Metadata unavailable",
      agent_type:  "unknown",
    };
  }
}

/** Get the last N Transfer events from IdentityRegistry */
export async function fetchRegisteredAgentIds(limit = 50): Promise<bigint[]> {
  const latest    = await publicClient.getBlockNumber();
  const blockRange = 50000n;
  const fromBlock  = latest > blockRange ? latest - blockRange : 0n;

  const logs = await publicClient.getLogs({
    address: CONTRACTS.IDENTITY_REGISTRY,
    event:   parseAbiItem(
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
    ),
    args:    { from: "0x0000000000000000000000000000000000000000" },
    fromBlock,
    toBlock: latest,
  });

  // Return unique token IDs, newest first
  const ids = logs
    .map((l) => l.args.tokenId!)
    .filter(Boolean)
    .reverse()
    .slice(0, limit);

  return ids;
}

/** Build a full Agent object for a given token ID */
export async function fetchAgent(tokenId: bigint): Promise<Agent | null> {
  try {
    const identity = getContract({
      address: CONTRACTS.IDENTITY_REGISTRY,
      abi:     IDENTITY_ABI,
      client:  publicClient,
    });

    const [owner, metadataURI] = await Promise.all([
      identity.read.ownerOf([tokenId]),
      identity.read.tokenURI([tokenId]),
    ]);

    // Fetch reputation events for this agent
    const latest = await publicClient.getBlockNumber();
    const from   = latest > 50000n ? latest - 50000n : 0n;

    const reputationLogs = await publicClient.getLogs({
      address:   CONTRACTS.REPUTATION_REGISTRY,
      event:     parseAbiItem(
        "event FeedbackGiven(uint256 indexed agentId, address indexed validator, int128 score, uint8 feedbackType, string tag)"
      ),
      args:      { agentId: tokenId },
      fromBlock: from,
      toBlock:   latest,
    });

    const scores = reputationLogs
      .map((l) => Number(l.args.score ?? 0))
      .filter(Boolean);

    const avgReputation = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    const tags = [...new Set(
      reputationLogs
        .map((l) => l.args.tag as string)
        .filter(Boolean)
    )];

    const metadata = await fetchMetadata(metadataURI);

    return {
      id:            tokenId.toString(),
      owner,
      metadataURI,
      metadata,
      reputation:    avgReputation,
      feedbackCount: scores.length,
      isVerified:    scores.length > 0,
      tags,
    };
  } catch {
    return null;
  }
}

/** Fetch up to `limit` agents from chain */
export async function fetchAgents(limit = 20): Promise<Agent[]> {
  const ids = await fetchRegisteredAgentIds(limit);
  const results = await Promise.allSettled(ids.map(fetchAgent));
  return results
    .filter((r): r is PromiseFulfilledResult<Agent> =>
      r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value as Agent);
}
