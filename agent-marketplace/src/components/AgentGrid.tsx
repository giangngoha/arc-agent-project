"use client";

import { useState, useMemo } from "react";
import type { Agent } from "@/lib/arc";
import AgentCard from "./AgentCard";
import HireModal from "./HireModal";

const TYPES = ["all", "trading", "yield", "nft", "liquidity", "risk", "bridge"];

interface AgentGridProps {
  agents: Agent[];
}

export default function AgentGrid({ agents }: AgentGridProps) {
  const [filter, setFilter]         = useState("all");
  const [search, setSearch]         = useState("");
  const [sortBy, setSortBy]         = useState<"reputation" | "price" | "feedback">("reputation");
  const [selectedAgent, setSelected] = useState<Agent | null>(null);

  const filtered = useMemo(() => {
    return agents
      .filter((a) => {
        const matchType   = filter === "all" || a.metadata.agent_type === filter;
        const matchSearch = !search ||
          a.metadata.name.toLowerCase().includes(search.toLowerCase()) ||
          a.metadata.description.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === "reputation") return b.reputation - a.reputation;
        if (sortBy === "price")      return (a.metadata.price_usdc ?? 999) - (b.metadata.price_usdc ?? 999);
        return b.feedbackCount - a.feedbackCount;
      });
  }, [agents, filter, search, sortBy]);

  return (
    <section id="marketplace" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-arc-muted text-sm">⌕</span>
          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-arc-surface border border-arc-border rounded-xl text-arc-text font-mono text-sm placeholder:text-arc-muted focus:outline-none focus:border-arc-accent/50 transition-colors"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="bg-arc-surface border border-arc-border rounded-xl px-4 py-2.5 text-arc-text font-mono text-sm focus:outline-none focus:border-arc-accent/50 cursor-pointer"
        >
          <option value="reputation">Sort: Reputation</option>
          <option value="price">Sort: Price ↑</option>
          <option value="feedback">Sort: Most Reviewed</option>
        </select>
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`font-mono text-xs px-4 py-1.5 rounded-full border transition-all duration-200 capitalize ${
              filter === t
                ? "bg-arc-accent text-arc-bg border-arc-accent font-bold"
                : "bg-transparent text-arc-muted border-arc-border hover:border-arc-accent/40 hover:text-arc-text"
            }`}
          >
            {t === "all" ? "All Types" : t}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="font-mono text-xs text-arc-muted mb-6">
        {filtered.length} agent{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-arc-muted">
          <p className="font-display text-3xl mb-2">No agents found</p>
          <p className="font-mono text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onHire={() => setSelected(agent)}
            />
          ))}
        </div>
      )}

      {/* Hire modal */}
      {selectedAgent && (
        <HireModal
          agent={selectedAgent}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
