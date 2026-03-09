"use client";

import { useState } from "react";

export function SponsorSlotClient() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sponsors/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Something went wrong");
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="group flex min-h-[72px] w-full items-center gap-3 rounded-xl border border-dashed border-border/40 bg-card/10 px-4 py-3 transition-all hover:border-[#D54747]/40 hover:bg-[#D54747]/5 disabled:opacity-50"
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-dashed border-border/30 bg-muted/20 text-muted-foreground/20 transition-colors group-hover:border-[#D54747]/30 group-hover:text-[#D54747]/40">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="font-mono text-xs text-muted-foreground/30 transition-colors group-hover:text-[#D54747]/60">
          {loading ? "Redirecting..." : "your-site.com"}
        </div>
        <div className="text-[10px] text-muted-foreground/20 transition-colors group-hover:text-muted-foreground/40">
          Become a sponsor
        </div>
      </div>
    </button>
  );
}
