"use client";

import { useState } from "react";

const INSTALL_COMMAND = "npx api2cli create my-api";

export function Hero() {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-background to-muted/30">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Open Source
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Any API.
            <br />
            <span className="text-muted-foreground">One CLI pattern.</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Turn any REST API into a standardized, agent-ready CLI in minutes.
            Same commands, same flags, same output. Works with every AI agent.
          </p>

          {/* Install command */}
          <button
            onClick={copyCommand}
            className="group mt-8 inline-flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3 font-mono text-sm transition-all hover:border-primary/50 hover:bg-card/80"
          >
            <span className="text-muted-foreground">$</span>
            <span>{INSTALL_COMMAND}</span>
            <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
              {copied ? "✓" : "⎘"}
            </span>
          </button>

          {/* Stats */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
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
              <span>Startup time</span>
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
