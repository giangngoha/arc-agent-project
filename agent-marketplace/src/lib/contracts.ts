// Arc Testnet — ERC-8004 contract addresses
export const CONTRACTS = {
  IDENTITY_REGISTRY:   "0x8004A818BFB912233c491871b3d84c89A494BD9e" as const,
  REPUTATION_REGISTRY: "0x8004B663056A597Dffe9eCcC1965A193B7388713" as const,
  VALIDATION_REGISTRY: "0x8004Cb1BF31DAf7788923b405b754f57acEB4272" as const,
} as const;

export const IDENTITY_ABI = [
  {
    name: "ownerOf",
    type: "function",
    stateMutability: "view",
    inputs:  [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "",        type: "address" }],
  },
  {
    name: "tokenURI",
    type: "function",
    stateMutability: "view",
    inputs:  [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "",        type: "string"  }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs:  [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "register",
    type: "function",
    stateMutability: "nonpayable",
    inputs:  [{ name: "metadataURI", type: "string" }],
    outputs: [],
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from",    type: "address", indexed: true },
      { name: "to",      type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
] as const;

export const REPUTATION_ABI = [
  {
    name: "giveFeedback",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "agentId",      type: "uint256"  },
      { name: "score",        type: "int128"   },
      { name: "feedbackType", type: "uint8"    },
      { name: "tag",          type: "string"   },
      { name: "metadataURI",  type: "string"   },
      { name: "evidenceURI",  type: "string"   },
      { name: "comment",      type: "string"   },
      { name: "feedbackHash", type: "bytes32"  },
    ],
    outputs: [],
  },
  {
    type: "event",
    name: "FeedbackGiven",
    inputs: [
      { name: "agentId",      type: "uint256", indexed: true  },
      { name: "validator",    type: "address", indexed: true  },
      { name: "score",        type: "int128",  indexed: false },
      { name: "feedbackType", type: "uint8",   indexed: false },
      { name: "tag",          type: "string",  indexed: false },
    ],
  },
] as const;

export const VALIDATION_ABI = [
  {
    name: "getValidationStatus",
    type: "function",
    stateMutability: "view",
    inputs:  [{ name: "requestHash", type: "bytes32" }],
    outputs: [
      { name: "validatorAddress", type: "address" },
      { name: "agentId",          type: "uint256" },
      { name: "response",         type: "uint8"   },
      { name: "responseHash",     type: "bytes32" },
      { name: "tag",              type: "string"  },
      { name: "lastUpdate",       type: "uint256" },
    ],
  },
  {
    name: "validationRequest",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "validator",   type: "address" },
      { name: "agentId",     type: "uint256" },
      { name: "requestURI",  type: "string"  },
      { name: "requestHash", type: "bytes32" },
    ],
    outputs: [],
  },
  {
    name: "validationResponse",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "requestHash",  type: "bytes32" },
      { name: "response",     type: "uint8"   },
      { name: "responseURI",  type: "string"  },
      { name: "responseHash", type: "bytes32" },
      { name: "tag",          type: "string"  },
    ],
    outputs: [],
  },
] as const;
