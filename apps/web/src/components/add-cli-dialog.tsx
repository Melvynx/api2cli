"use client";

import { useState } from "react";

export function AddCliDialog() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    error?: string;
    skill?: { name: string; displayName: string; description: string };
  } | null>(null);

  const handleSubmit = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/publish-cli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl: url.trim() }),
      });
      const data = await res.json();
      setResult(data);
      if (data.success) {
        setUrl("");
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch {
      setResult({ error: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card/60 px-4 font-mono text-xs font-medium transition-colors hover:bg-card hover:border-primary/40"
      >
        <span className="text-base">+</span> Add my CLI
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card/80 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="owner/repo or https://github.com/..."
          className="h-10 flex-1 rounded-lg border border-border/60 bg-background px-3 font-mono text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !url.trim()}
          className="inline-flex h-10 items-center rounded-lg bg-primary px-4 font-mono text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Fetching..." : "Publish"}
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setResult(null);
          }}
          className="inline-flex h-10 items-center rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-card"
        >
          ✕
        </button>
      </div>
      {result?.success && (
        <p className="mt-2 text-xs text-emerald-400">
          ✓ Published {result.skill?.displayName}! Reloading...
        </p>
      )}
      {result?.error && (
        <p className="mt-2 text-xs text-red-400">✕ {result.error}</p>
      )}
    </div>
  );
}
