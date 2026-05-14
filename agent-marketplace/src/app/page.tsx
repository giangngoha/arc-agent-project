import { Suspense } from "react";
import { DEMO_AGENTS } from "@/lib/demo-data";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AgentGrid from "@/components/AgentGrid";
import StatsBar from "@/components/StatsBar";

// In production, uncomment to fetch live data from chain:
// import { fetchAgents } from "@/lib/arc";
// const agents = await fetchAgents(24);

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function Home() {
  // Use demo data (replace with fetchAgents() once you have a funded wallet)
  const agents = DEMO_AGENTS;

  const stats = {
    totalAgents:   agents.length,
    verifiedCount: agents.filter((a) => a.isVerified).length,
    avgReputation: Math.round(
      agents.reduce((sum, a) => sum + a.reputation, 0) / agents.length
    ),
    totalFeedback: agents.reduce((sum, a) => sum + a.feedbackCount, 0),
  };

  return (
    <main className="min-h-screen bg-arc-bg noise-bg grid-bg">
      <div className="scanline" />
      <Header />
      <HeroSection />
      <StatsBar stats={stats} />
      <Suspense fallback={<AgentGridSkeleton />}>
        <AgentGrid agents={agents} />
      </Suspense>
      <Footer />
    </main>
  );
}

function AgentGridSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-72 rounded-xl bg-arc-surface border border-arc-border animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-arc-border mt-24 py-10 px-6 text-center">
      <p className="font-mono text-xs text-arc-muted">
        Built on{" "}
        <a
          href="https://arc.network"
          target="_blank"
          rel="noopener noreferrer"
          className="text-arc-accent hover:underline"
        >
          Arc Network
        </a>{" "}
        · ERC-8004 onchain agent identity ·{" "}
        <a
          href="https://testnet.arcscan.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-arc-accent hover:underline"
        >
          Testnet Explorer
        </a>
      </p>
    </footer>
  );
}
