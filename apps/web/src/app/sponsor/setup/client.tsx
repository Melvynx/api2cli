"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { SponsorForm } from "@/components/sponsor-form";
import Link from "next/link";

export function SponsorSetupClient({ editToken }: { editToken: string }) {
  const [done, setDone] = useState(false);

  const editUrl = `/sponsor/edit/${editToken}`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-1 flex-col px-6 py-16">
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1">
            <span className="text-sm">*</span>
            <span className="font-mono text-xs text-emerald-400">
              Payment confirmed
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-geist-pixel-square)] text-2xl font-bold tracking-tight">
            Set up your sponsor slot
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in your details below. Your sponsorship will appear on every
            page of api2cli.dev.
          </p>
        </div>

        <SponsorForm token={editToken} onSuccess={() => setDone(true)} />

        {done && (
          <div className="mt-6 space-y-3 rounded-xl border border-border/40 bg-card/30 p-4">
            <p className="text-sm text-muted-foreground">
              Bookmark this link to edit your sponsor info later:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 overflow-hidden truncate rounded-lg bg-[#0a0a0a] px-3 py-2 font-mono text-xs text-muted-foreground">
                {typeof window !== "undefined"
                  ? `${window.location.origin}${editUrl}`
                  : editUrl}
              </code>
              <Link
                href={editUrl}
                className="shrink-0 rounded-lg bg-primary px-3 py-2 font-mono text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Open
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
