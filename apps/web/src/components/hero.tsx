"use client";

import { useState } from "react";
import Link from "next/link";

const INSTALL_COMMAND = "npx skills add Melvynx/api2cli";

export function Hero() {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-background via-background to-muted/20">
      {/* Red glow behind text */}
      <div
        className="pointer-events-none absolute left-1/2 top-[10%] -translate-x-1/2"
        style={{
          width: "500px",
          height: "300px",
          background: "radial-gradient(ellipse at center, rgba(213, 71, 71, 0.35) 0%, rgba(213, 71, 71, 0.15) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
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

          <h1 className="font-[family-name:var(--font-geist-pixel-square)] text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Any API.
            <br />
            <span className="bg-gradient-to-r from-white to-[#D54747] bg-clip-text text-transparent">
              One CLI pattern.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Install the skill once. Tell your agent which API you need.
            Get a standardized, agent-ready CLI in minutes.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/docs/getting-started"
              className="inline-flex h-11 items-center rounded-xl bg-primary px-6 font-mono text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Create my CLI
            </Link>
            <Link
              href="#registry"
              className="inline-flex h-11 items-center rounded-xl border border-border bg-card/60 px-6 font-mono text-sm font-medium transition-colors hover:bg-card"
            >
              Browse CLIs →
            </Link>
          </div>

          {/* Install command */}
          <div className="mt-6 flex flex-col items-start">
            <button
              onClick={copyCommand}
              className="group inline-flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 px-5 py-3 font-mono text-sm backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/60"
            >
              <span className="text-muted-foreground/60">$</span>
              <span>{INSTALL_COMMAND}</span>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>
            <p className="mt-1.5 pl-1 text-xs text-muted-foreground/50">
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
