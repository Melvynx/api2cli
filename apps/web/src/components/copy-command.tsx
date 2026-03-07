"use client";

import { useState } from "react";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="group flex w-full items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3 font-mono text-sm backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/80"
    >
      <span className="text-muted-foreground/60">$</span>
      <span className="flex-1 text-left">{command}</span>
      <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        {copied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
}
