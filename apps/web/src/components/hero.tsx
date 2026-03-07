"use client";

import { useState } from "react";
import { SearchBar } from "./search-bar";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-background via-background to-muted/20">
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
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

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Find the CLI you need.
            <br />
            <span className="bg-gradient-to-r from-muted-foreground to-muted-foreground/50 bg-clip-text text-transparent">
              Or create it in minutes.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Community-built CLI wrappers for every API. Search by describing
            your problem. Install with one command. Works with every AI agent.
          </p>

          {/* Search bar */}
          <div className="mt-10">
            <SearchBar />
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
