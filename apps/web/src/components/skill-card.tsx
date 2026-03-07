"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Skill } from "@/db/schema";
import Link from "next/link";

export function SkillCard({ skill }: { skill: Skill }) {
  const [copied, setCopied] = useState(false);
  const installCmd = `npx api2cli install ${skill.name}`;
  const score = (skill.upvotes ?? 0) - (skill.downvotes ?? 0);

  const copyInstall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const vote = async (direction: "up" | "down", e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await fetch(`/api/skills/${skill.name}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    });
  };

  const popularityColor =
    (skill.downloads ?? 0) >= 1000
      ? "text-emerald-500"
      : (skill.downloads ?? 0) >= 100
        ? "text-amber-500"
        : "text-muted-foreground";

  return (
    <Link href={`/skills/${skill.name}`}>
      <Card className="group flex h-full flex-col transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-mono text-xs font-bold transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                {skill.displayName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-mono text-sm font-semibold leading-tight">
                  {skill.name}-cli
                </h3>
                <p className="text-xs text-muted-foreground">
                  v{skill.version}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {skill.verified && (
                <Badge
                  variant="secondary"
                  className="text-[10px] font-medium uppercase tracking-wider"
                >
                  ✓
                </Badge>
              )}
              {skill.category && (
                <Badge variant="outline" className="text-[10px]">
                  {skill.category}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          {skill.description && (
            <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">
              {skill.description}
            </p>
          )}

          {/* Install command */}
          <button
            onClick={copyInstall}
            className="mb-3 flex w-full items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 font-mono text-xs transition-colors hover:bg-muted"
          >
            <span className="text-muted-foreground">$</span>
            <span className="flex-1 truncate text-left">{installCmd}</span>
            <span className="text-muted-foreground">
              {copied ? "✓" : "⎘"}
            </span>
          </button>

          {/* Footer stats */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => vote("up", e)}
                className="flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-emerald-500/10 hover:text-emerald-500"
              >
                ▲ {skill.upvotes ?? 0}
              </button>
              <button
                onClick={(e) => vote("down", e)}
                className="flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-red-500/10 hover:text-red-500"
              >
                ▼ {skill.downvotes ?? 0}
              </button>
            </div>
            <span className={`font-mono font-medium ${popularityColor}`}>
              {(skill.downloads ?? 0).toLocaleString()} installs
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
