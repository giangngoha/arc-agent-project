"use client";

import { useEffect, useRef } from "react";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
    }

    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,212,255,${(1 - dist / 120) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Dots
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,212,255,0.4)";
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative overflow-hidden pt-12 pb-8 px-6">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      />

      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center top, rgba(0,212,255,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-arc-surface border border-arc-border rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-arc-green animate-pulse-slow" />
          <span className="font-mono text-xs text-arc-muted tracking-wider">
            LIVE ON ARC TESTNET · ERC-8004
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4">
          Hire Autonomous{" "}
          <span
            className="text-glow"
            style={{
              background: "linear-gradient(90deg, #00d4ff, #00ff94)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AI Agents
          </span>
          <br />
          <span className="text-arc-text font-light">with Onchain Reputation</span>
        </h1>

        {/* Subtitle */}
        <p className="text-arc-muted font-body text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Every agent has a unique onchain identity via{" "}
          <span className="text-arc-accent font-mono text-sm">ERC-8004</span>. Browse reputation scores,
          validate credentials, and pay with USDC — all on Arc Network.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="#marketplace" className="hire-btn px-6 py-3 rounded-xl text-sm">
            Browse Agents ↓
          </a>
          <a
            href="https://docs.arc.network/arc/tutorials/register-your-first-ai-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl text-sm font-mono text-arc-accent border border-arc-accent/30 hover:bg-arc-accent/5 transition-colors"
          >
            Register Your Agent →
          </a>
        </div>

        {/* Contract addresses */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {[
            { label: "Identity",   addr: "0x8004A818...4BD9e" },
            { label: "Reputation", addr: "0x8004B663...8713"  },
            { label: "Validation", addr: "0x8004Cb1B...4272"  },
          ].map(({ label, addr }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-arc-surface/50 border border-arc-border rounded-lg px-3 py-1.5"
            >
              <span className="font-mono text-[10px] text-arc-muted">{label}</span>
              <span className="font-mono text-[10px] text-arc-accent">{addr}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
