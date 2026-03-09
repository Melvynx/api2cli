"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SponsorData = {
  name: string;
  logoUrl: string;
  linkUrl: string;
  description: string;
};

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getFaviconUrl(url: string): string {
  const domain = getDomain(url);
  if (!domain) return "";
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export function SponsorForm({
  token,
  initialData,
  onSuccess,
}: {
  token: string;
  initialData?: Partial<SponsorData>;
  onSuccess?: () => void;
}) {
  const [form, setForm] = useState<SponsorData>({
    name: initialData?.name ?? "",
    logoUrl: initialData?.logoUrl ?? "",
    linkUrl: initialData?.linkUrl ?? "",
    description: initialData?.description ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const domain = useMemo(() => getDomain(form.linkUrl), [form.linkUrl]);
  const faviconUrl = useMemo(() => getFaviconUrl(form.linkUrl), [form.linkUrl]);
  const displayLogoUrl = form.logoUrl || faviconUrl;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      name: form.name || domain,
    };

    try {
      const res = await fetch(`/api/sponsors/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to save");
        return;
      }

      setSaved(true);
      onSuccess?.();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="font-mono text-xs text-muted-foreground">
          Website URL *
        </label>
        <Input
          value={form.linkUrl}
          onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
          placeholder="https://codelynx.dev"
          type="url"
          required
        />
        {domain && (
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-border/40 bg-card/30 p-3">
            {displayLogoUrl && (
              <img
                src={displayLogoUrl}
                alt={domain}
                className="h-7 w-7 rounded-md object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <span className="font-mono text-sm text-foreground/70">
              {domain}
            </span>
            <span className="text-[10px] text-muted-foreground/30">
              preview
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="font-mono text-xs text-muted-foreground">
          Company / Name
        </label>
        <Input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder={domain || "Acme Inc."}
        />
        <p className="text-xs text-muted-foreground/40">
          Leave empty to use the domain name
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="font-mono text-xs text-muted-foreground">
          Custom logo URL
        </label>
        <Input
          value={form.logoUrl}
          onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
          placeholder="Auto-detected from your site"
          type="url"
        />
        <p className="text-xs text-muted-foreground/40">
          Optional. We auto-fetch your favicon if left empty.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="font-mono text-xs text-muted-foreground">
          Tagline
        </label>
        <Input
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Build faster with Acme"
          maxLength={60}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {saved && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-2 text-sm text-emerald-400">
          Sponsor saved successfully!
        </div>
      )}

      <Button type="submit" disabled={saving} size="lg" className="w-full">
        {saving ? "Saving..." : saved ? "Saved" : "Save sponsor"}
      </Button>
    </form>
  );
}
