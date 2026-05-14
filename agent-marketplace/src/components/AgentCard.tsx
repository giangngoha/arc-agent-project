"use client";

import type { Agent } from "@/lib/arc";

const TYPE_COLORS: Record<string, string> = {
  trading:   "text-arc-accent  border-arc-accent/30  bg-arc-accent/5",
  yield:     "text-arc-green   border-arc-green/30   bg-arc-green/5",
  nft:       "text-purple-400  border-purple-400/30  bg-purple-400/5",
  liquidity: "text-amber-400   border-amber-400/30   bg-amber-400/5",
  risk:      "text-arc-red     border-arc-red/30     bg-arc-red/5",
  bridge:    "text-sky-400     border-sky-400/30     bg-sky-400/5",
  unknown:   "text-arc-muted   border-arc-muted/30   bg-arc-muted/5",
};

const TYPE_ICONS: Record<string, string> = {
  trading:   "◈",
  yield:     "⬡",
  nft:       "◆",
  liquidity: "◉",
  risk:      "◎",
  bridge:    "⬢",
  unknown:   "◌",
};

function ReputationRing({ score }: { score: number }) {
  const r  = 22;
  const c  = 2 * Math.PI * r;
  const pct = score / 100;

  const color =
    score >= 90 ? "#00ff94" :
    score >= 70 ? "#00d4ff" :
    score >= 50 ? "#ffb800" :
                  "#ff4466";

  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
        {/* Track */}
        <circle
          cx="28" cy="28" r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="3"
        />
        {/* Progress */}
        <circle
          cx="28" cy="28" r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-display font-bold text-sm leading-none"
          style={{ color }}
        >
          {score}
        </span>
      </div>
    </div>
  );
}

interface AgentCardProps {
  agent:   Agent;
  onHire:  () => void;
}

export default function AgentCard({ agent, onHire }: AgentCardProps) {
  const { metadata } = agent;
  const type         = metadata.agent_type ?? "unknown";
  const typeColor    = TYPE_COLORS[type] ?? TYPE_COLORS.unknown;
  const typeIcon     = TYPE_ICONS[type]  ?? TYPE_ICONS.unknown;
  const shortOwner   = `${agent.owner.slice(0, 6)}…${agent.owner.slice(-4)}`;

  return (
    <div className="agent-card bg-arc-card border border-arc-border rounded-2xl overflow-hidden flex flex-col">
      {/* Card header */}
      <div className="p-5 flex-1">
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border flex-shrink-0 ${typeColor}`}
          >
            {typeIcon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-semibold text-white text-sm leading-tight truncate">
                {metadata.name}
              </h3>
              {agent.isVerified && (
                <span
                  title="KYC Verified onchain"
                  className="text-arc-green text-xs flex-shrink-0"
                >
                  ✓
                </span>
              )}
            </div>
            <p className={`font-mono text-[10px] mt-0.5 capitalize ${typeColor.split(" ")[0]}`}>
              {type}
            </p>
          </div>

          {/* Reputation ring */}
          <ReputationRing score={agent.reputation} />
        </div>

        {/* Description */}
        <p className="text-arc-muted text-xs leading-relaxed line-clamp-3 mb-4">
          {metadata.description}
        </p>

        {/* Capabilities */}
        {metadata.capabilities && metadata.capabilities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {metadata.capabilities.slice(0, 3).map((cap) => (
              <span key={cap} className="tag-pill">
                {cap.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between text-[10px] font-mono text-arc-muted">
          <span title={agent.owner}>
            Owner: <span className="text-arc-text">{shortOwner}</span>
          </span>
          <span>
            {agent.feedbackCount} review{agent.feedbackCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div className="border-t border-arc-border p-4 flex items-center justify-between">
        <div>
          {metadata.price_usdc ? (
            <div>
              <span className="font-display font-bold text-white text-lg">
                ${metadata.price_usdc}
              </span>
              <span className="font-mono text-[10px] text-arc-muted ml-1">USDC/job</span>
            </div>
          ) : (
            <span className="font-mono text-[10px] text-arc-muted">Price on request</span>
          )}
        </div>

        <button
          onClick={onHire}
          className="hire-btn px-4 py-2 rounded-xl text-xs font-mono"
        >
          Hire Agent
        </button>
      </div>

      {/* Agent ID badge */}
      <div className="bg-arc-bg/50 px-4 py-1.5 flex items-center gap-1.5">
        <span className="font-mono text-[9px] text-arc-muted">Agent ID</span>
        <span className="font-mono text-[9px] text-arc-accent">#{agent.id}</span>
        <span className="flex-1" />
        <a
          href={`https://testnet.arcscan.app/token/0x8004A818BFB912233c491871b3d84c89A494BD9e?a=${agent.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[9px] text-arc-muted hover:text-arc-accent transition-colors"
        >
          View on Explorer ↗
        </a>
      </div>
    </div>
  );
}
