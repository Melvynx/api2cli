"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SponsorRecoverPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/sponsors/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-6 py-24">
        <h1 className="font-[family-name:var(--font-geist-pixel-square)] text-2xl font-bold tracking-tight">
          Recover your edit link
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enter the email you used to sponsor. We'll send you a new edit link.
        </p>

        {sent ? (
          <div className="mt-8 w-full rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
            <p className="text-sm text-emerald-400">
              If a sponsorship exists for that email, we've sent an edit link.
              Check your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? "Sending..." : "Send edit link"}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
