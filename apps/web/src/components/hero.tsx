"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

const INSTALL_COMMAND = "npx skills add Melvynx/api2cli";

export function Hero() {
  const [copied, setCopied] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 5;
    setMouseOffset({ x, y });
  }, []);

  const copyCommand = () => {
    navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative border-b border-border/50 bg-gradient-to-b from-background via-background to-muted/20"
    >
      {/* Red glow from top with subtle mouse parallax */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 transition-transform duration-700 ease-out"
        style={{
          top: "-120px",
          width: "800px",
          height: "500px",
          background: "radial-gradient(ellipse at center, rgba(213, 71, 71, 0.25) 0%, rgba(180, 50, 50, 0.10) 35%, transparent 65%)",
          filter: "blur(80px)",
          transform: `translate(calc(-50% + ${mouseOffset.x}%), ${mouseOffset.y}%)`,
        }}
      />
      {/* Grain overlay */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Open Source CLI Marketplace
            </span>
          </div>

          <h1 className="font-[family-name:var(--font-geist-pixel-square)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Superpower your agents
            <br />
            <span className="bg-gradient-to-r from-white to-[#D54747] bg-clip-text text-transparent">
              with tailor made CLI.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Install the skill once. Tell your agent which API you need.
            Get a standardized, agent-ready CLI in minutes.
          </p>

          {/* CTAs + Install command */}
          <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3">
            <div className="flex gap-3">
              <Link
                href="/docs/getting-started"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-primary font-mono text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Create my CLI
              </Link>
              <Link
                href="#cli"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-border bg-card/60 font-mono text-sm font-medium transition-colors hover:bg-card"
              >
                Browse CLIs →
              </Link>
            </div>
            <button
              onClick={copyCommand}
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-border/60 bg-card/40 px-5 py-3 font-mono text-sm backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/60"
            >
              <span className="text-muted-foreground/60">$</span>
              <span>{INSTALL_COMMAND}</span>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>
            <p className="text-left text-xs text-muted-foreground/50">
              Paste this into your coding agent.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-foreground">
                15+
              </span>
              <span>Agent platforms</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-foreground">
                ~25ms
              </span>
              <span>Startup</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-foreground">
                0
              </span>
              <span>Runtime deps</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
