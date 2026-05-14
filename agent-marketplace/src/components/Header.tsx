"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-arc-bg/90 backdrop-blur-xl border-b border-arc-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8">
            {/* Hexagon logo mark */}
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <polygon
                points="16,2 28,9 28,23 16,30 4,23 4,9"
                fill="none"
                stroke="#00d4ff"
                strokeWidth="1.5"
                className="transition-all duration-300 group-hover:stroke-[#00ff94]"
              />
              <polygon
                points="16,8 23,12 23,20 16,24 9,20 9,12"
                fill="rgba(0,212,255,0.15)"
                stroke="none"
                className="transition-all duration-300 group-hover:fill-[rgba(0,255,148,0.15)]"
              />
            </svg>
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">
            Arc<span className="text-arc-accent">Agents</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="#marketplace">Marketplace</NavLink>
          <NavLink href="https://docs.arc.network/arc/tutorials/register-your-first-ai-agent" external>
            Register Agent
          </NavLink>
          <NavLink href="https://testnet.arcscan.app" external>
            Explorer
          </NavLink>
        </nav>

        {/* CTA */}
        <a
          href="https://docs.arc.network/arc/tutorials/register-your-first-ai-agent"
          target="_blank"
          rel="noopener noreferrer"
          className="hire-btn text-xs font-mono px-4 py-2 rounded-lg"
        >
          + DEPLOY AGENT
        </a>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const props = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <a
      href={href}
      {...props}
      className="font-mono text-xs text-arc-muted hover:text-arc-accent transition-colors duration-200 tracking-wider uppercase"
    >
      {children}
    </a>
  );
}
