"use client";

import { useState, useEffect } from "react";
import type { Agent } from "@/lib/arc";

type Step = "review" | "connect" | "confirm" | "success" | "error";

interface HireModalProps {
  agent:   Agent;
  onClose: () => void;
}

export default function HireModal({ agent, onClose }: HireModalProps) {
  const [step, setStep]       = useState<Step>("review");
  const [txHash, setTxHash]   = useState("");
  const [jobDesc, setJobDesc] = useState("");

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const price = agent.metadata.price_usdc ?? 10;

  // Simulate a hire transaction (replace with actual wallet + USDC transfer logic)
  const handleConfirm = async () => {
    setStep("confirm");
    await new Promise((r) => setTimeout(r, 2000));
    // Fake txHash for demo — replace with real viem writeContract call
    setTxHash("0x" + Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join(""));
    setStep("success");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-arc-bg/60"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animated-border w-full max-w-md rounded-2xl bg-arc-card overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-arc-border">
          <h2 className="font-display font-bold text-white text-lg">
            {step === "success" ? "🎉 Agent Hired!" : "Hire Agent"}
          </h2>
          <button
            onClick={onClose}
            className="text-arc-muted hover:text-white transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">

          {/* Review step */}
          {step === "review" && (
            <>
              {/* Agent summary */}
              <div className="bg-arc-surface rounded-xl p-4 mb-4 border border-arc-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-arc-accent/10 border border-arc-accent/20 flex items-center justify-center text-lg text-arc-accent">
                    ◈
                  </div>
                  <div>
                    <p className="font-display font-semibold text-white text-sm">
                      {agent.metadata.name}
                    </p>
                    <p className="font-mono text-[10px] text-arc-muted mt-0.5">
                      Agent #{agent.id} · Reputation {agent.reputation}/100
                    </p>
                  </div>
                </div>
              </div>

              {/* Job description */}
              <div className="mb-4">
                <label className="block font-mono text-xs text-arc-muted mb-2 uppercase tracking-wider">
                  Describe the job (optional)
                </label>
                <textarea
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="e.g. Monitor ETH/USDC pool and execute when spread > 0.5%"
                  rows={3}
                  className="w-full bg-arc-surface border border-arc-border rounded-xl px-4 py-3 text-arc-text text-sm placeholder:text-arc-muted resize-none focus:outline-none focus:border-arc-accent/50 transition-colors font-body"
                />
              </div>

              {/* Price breakdown */}
              <div className="bg-arc-surface rounded-xl p-4 mb-5 border border-arc-border space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-arc-muted">Service fee</span>
                  <span className="text-arc-text">${price}.00 USDC</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-arc-muted">Platform fee (2%)</span>
                  <span className="text-arc-text">${(price * 0.02).toFixed(2)} USDC</span>
                </div>
                <div className="border-t border-arc-border my-1" />
                <div className="flex justify-between font-mono text-sm">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-arc-green font-bold">
                    ${(price * 1.02).toFixed(2)} USDC
                  </span>
                </div>
              </div>

              <button
                onClick={() => setStep("connect")}
                className="hire-btn w-full py-3 rounded-xl text-sm font-mono"
              >
                Continue →
              </button>
            </>
          )}

          {/* Connect wallet step */}
          {step === "connect" && (
            <>
              <p className="text-arc-muted text-sm mb-4 font-body">
                Connect your wallet to pay <span className="text-arc-green font-mono">${(price * 1.02).toFixed(2)} USDC</span> on Arc Testnet.
              </p>

              <div className="space-y-2 mb-5">
                {["MetaMask", "Coinbase Wallet", "WalletConnect"].map((w) => (
                  <button
                    key={w}
                    onClick={handleConfirm}
                    className="w-full flex items-center gap-3 bg-arc-surface hover:bg-arc-border/40 border border-arc-border rounded-xl px-4 py-3 text-arc-text text-sm font-mono transition-colors"
                  >
                    <span className="w-6 h-6 rounded-md bg-arc-accent/10 flex items-center justify-center text-xs">
                      ◆
                    </span>
                    {w}
                  </button>
                ))}
              </div>

              <p className="font-mono text-[10px] text-arc-muted text-center">
                Payment is processed onchain via USDC smart contract
              </p>
            </>
          )}

          {/* Confirming step */}
          {step === "confirm" && (
            <div className="py-8 text-center">
              <div className="w-12 h-12 rounded-full border-2 border-arc-accent border-t-transparent animate-spin mx-auto mb-4" />
              <p className="font-display text-white font-semibold mb-1">
                Confirming transaction...
              </p>
              <p className="font-mono text-xs text-arc-muted">
                Sending {(price * 1.02).toFixed(2)} USDC on Arc Testnet
              </p>
            </div>
          )}

          {/* Success step */}
          {step === "success" && (
            <>
              <div className="py-4 text-center mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl"
                  style={{ background: "rgba(0,255,148,0.1)", border: "2px solid rgba(0,255,148,0.4)" }}
                >
                  ✓
                </div>
                <p className="font-body text-arc-muted text-sm">
                  <span className="text-arc-green font-semibold font-display text-base">
                    ${(price * 1.02).toFixed(2)} USDC
                  </span>{" "}
                  sent to Agent #{agent.id}
                </p>
              </div>

              <div className="bg-arc-surface rounded-xl p-3 border border-arc-border mb-5">
                <p className="font-mono text-[9px] text-arc-muted mb-1">Transaction</p>
                <p className="font-mono text-[10px] text-arc-accent break-all">{txHash}</p>
              </div>

              <div className="flex gap-2">
                <a
                  href={`https://testnet.arcscan.app/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2.5 rounded-xl text-xs font-mono text-arc-accent border border-arc-accent/30 hover:bg-arc-accent/5 transition-colors"
                >
                  View on Explorer ↗
                </a>
                <button
                  onClick={onClose}
                  className="flex-1 hire-btn py-2.5 rounded-xl text-xs font-mono"
                >
                  Done
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
