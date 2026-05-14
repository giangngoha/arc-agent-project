# Arc Agent Project

This monorepo contains two packages:

| Package | Description |
|---------|-------------|
| `erc8004-quickstart/` | Script to register an AI agent on Arc Testnet (ERC-8004) |
| `agent-marketplace/`  | Next.js marketplace UI — browse, filter, and hire agents with USDC |

---

## Quick Start

### Option A — GitHub Codespaces (recommended)

1. Click **Code → Codespaces → Create codespace on main**
2. Wait for the container to build (~1 min). Dependencies install automatically.
3. In the terminal:
   ```bash
   cd agent-marketplace
   npm run dev
   ```
4. Open the forwarded port **3000** in the browser preview.

### Option B — Local

```bash
git clone <your-repo>
cd arc-agent-project

# Marketplace
cd agent-marketplace
npm install
npm run dev         # http://localhost:3000

# In a separate terminal — run the registration script
cd ../erc8004-quickstart
npm install
cp .env.example .env   # fill in your private keys
npm run start
```

---

## 1. ERC-8004 Quickstart (`erc8004-quickstart/`)

Registers an AI agent on Arc Testnet following the [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) standard.

### Setup

```bash
cd erc8004-quickstart
cp .env.example .env
```

Edit `.env`:
```env
OWNER_PRIVATE_KEY=0xYOUR_OWNER_PRIVATE_KEY
VALIDATOR_PRIVATE_KEY=0xYOUR_VALIDATOR_PRIVATE_KEY
```

> **Get test wallets:** Use `cast wallet new --json` (Foundry) twice.  
> **Fund wallets:** Visit the [Arc Testnet Faucet](https://testnet.arc.network/faucet) for USDC.

### Run

```bash
npm run start
```

**What it does:**
1. Creates two Arc Testnet wallets (owner + validator)
2. Registers agent identity → mints ERC-721 NFT via `IdentityRegistry`
3. Records reputation score via `ReputationRegistry`
4. Submits + verifies KYC validation via `ValidationRegistry`

### Contracts (Arc Testnet)

| Contract | Address |
|----------|---------|
| IdentityRegistry   | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |
| ReputationRegistry | `0x8004B663056A597Dffe9eCcC1965A193B7388713` |
| ValidationRegistry | `0x8004Cb1BF31DAf7788923b405b754f57acEB4272` |

---

## 2. Agent Marketplace (`agent-marketplace/`)

A Next.js 14 app to browse AI agents registered on Arc.

### Features

- 🔍 **Browse** all registered agents with search + type filters
- ⭐ **Reputation rings** — color-coded scores pulled from `ReputationRegistry`
- ✅ **Verification badges** — KYC status from `ValidationRegistry`
- 💸 **Hire modal** — USDC payment flow (demo mode; plug in your wallet)
- 📊 **Stats bar** — live counts from the chain
- 🌐 **Explorer links** — every agent links to ArcScan

### Live chain data

By default the app uses **demo seed data**. To show real onchain agents:

1. Open `src/app/page.tsx`
2. Uncomment the `fetchAgents()` lines
3. Comment out the `DEMO_AGENTS` line

```ts
// src/app/page.tsx
import { fetchAgents } from "@/lib/arc";
const agents = await fetchAgents(24);   // ← uncomment
// const agents = DEMO_AGENTS;          // ← comment out
```

### Environment variables

No required env vars for the marketplace. Optional:

```env
# .env.local (agent-marketplace/)
NEXT_PUBLIC_CHAIN=arc-testnet
```

---

## Deploy to Vercel

### One-click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

### Manual

```bash
npm install -g vercel
vercel --cwd agent-marketplace
```

Vercel will auto-detect Next.js. No env vars required for demo mode.

---

## Architecture

```
arc-agent-project/
├── .devcontainer/
│   └── devcontainer.json       ← Codespaces config
├── erc8004-quickstart/
│   ├── index.ts                ← Registration script
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── agent-marketplace/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx      ← Root layout + fonts
│   │   │   ├── globals.css     ← Design tokens + animations
│   │   │   └── page.tsx        ← Main marketplace page
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx ← Animated particle network
│   │   │   ├── StatsBar.tsx
│   │   │   ├── AgentGrid.tsx   ← Filter + sort + grid
│   │   │   ├── AgentCard.tsx   ← Reputation ring + hire button
│   │   │   └── HireModal.tsx   ← USDC payment flow
│   │   └── lib/
│   │       ├── contracts.ts    ← ERC-8004 ABIs + addresses
│   │       ├── arc.ts          ← Viem client + chain data fetchers
│   │       └── demo-data.ts    ← Seed agents for demo
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
├── .gitignore
├── vercel.json
└── README.md
```

---

## Tech Stack

- **Chain:** [Arc Network](https://arc.network) Testnet
- **Standard:** [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) — AI Agent Identity
- **Web3:** [viem](https://viem.sh) v2
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + custom CSS animations
- **Fonts:** Syne (display) + Space Mono + Inter

---

## Resources

- [Arc Docs](https://docs.arc.network)
- [ERC-8004 Tutorial](https://docs.arc.network/arc/tutorials/register-your-first-ai-agent)
- [ArcScan Testnet Explorer](https://testnet.arcscan.app)
- [Arc Testnet Faucet](https://testnet.arc.network/faucet)
