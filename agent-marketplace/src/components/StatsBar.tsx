interface StatsBarProps {
  stats: {
    totalAgents:   number;
    verifiedCount: number;
    avgReputation: number;
    totalFeedback: number;
  };
}

export default function StatsBar({ stats }: StatsBarProps) {
  const items = [
    { label: "Registered Agents",    value: stats.totalAgents.toString()   },
    { label: "KYC Verified",          value: stats.verifiedCount.toString() },
    { label: "Avg Reputation Score",  value: `${stats.avgReputation}/100`   },
    { label: "Total Feedback Events", value: stats.totalFeedback.toLocaleString() },
  ];

  return (
    <div className="border-y border-arc-border bg-arc-surface/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-arc-border">
          {items.map(({ label, value }) => (
            <div key={label} className="px-6 py-4 text-center">
              <p className="font-display text-2xl font-bold text-white">{value}</p>
              <p className="font-mono text-[10px] text-arc-muted uppercase tracking-widest mt-0.5">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
