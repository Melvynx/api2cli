"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { Skill } from "@/db/schema";
import Link from "next/link";

type ScoredSkill = Skill & { relevance?: number };

export function SearchResults({
  results,
  query,
}: {
  results: ScoredSkill[];
  query: string;
}) {
  const [copied, setCopied] = useState(false);

  if (results.length === 0) {
    return (
      <div className="mt-4 rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
        <p className="text-sm text-muted-foreground">
          No CLI found for &quot;{query}&quot;
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          This CLI doesn&apos;t exist yet. Ask your agent to create it.
        </p>
        <button className="mt-4 inline-flex h-10 items-center rounded-xl bg-primary px-6 font-mono text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          Ask your agent to create it →
        </button>
        <pre className="mt-3 font-mono text-xs text-muted-foreground">
          Ask your agent: &quot;Create a CLI for {query.trim() || "my API"}&quot;
        </pre>
      </div>
    );
  }

  // Build combined install command
  const installCommands = results
    .slice(0, 10)
    .map((s) => `npx api2cli install ${s.name}`);
  const combinedCommand = installCommands.join(" && ");

  const copyAll = () => {
    navigator.clipboard.writeText(combinedCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 space-y-3">
      {/* Multi-CLI install banner */}
      {results.length > 1 && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {results.length} CLI{results.length > 1 ? "s" : ""} match your
                need
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Install all at once with one command
              </p>
            </div>
            <button
              onClick={copyAll}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 font-mono text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {copied ? "Copied!" : "Copy all install commands"}
            </button>
          </div>
        </div>
      )}

      {/* Results list */}
      <div className="rounded-2xl border border-border bg-card shadow-lg">
        {results.map((skill, i) => (
          <Link
            key={skill.id}
            href={`/cli/${skill.name}`}
            className={`flex items-center gap-4 p-4 transition-colors hover:bg-muted/50 ${
              i !== results.length - 1 ? "border-b border-border/50" : ""
            }`}
          >
            {/* Relevance badge */}
            {skill.relevance != null && skill.relevance > 0 && (
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                  skill.relevance >= 70
                    ? "bg-emerald-500/10 text-emerald-500"
                    : skill.relevance >= 40
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {skill.relevance}%
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold">
                  {skill.displayName}
                </span>
                {skill.verified && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] uppercase tracking-wider"
                  >
                    Verified
                  </Badge>
                )}
                {skill.category && (
                  <Badge variant="outline" className="text-[10px]">
                    {skill.category}
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {skill.description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-shrink-0 items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                ▲ {skill.upvotes ?? 0}
              </span>
              <span className="flex items-center gap-1">
                ↓ {(skill.downloads ?? 0).toLocaleString()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
