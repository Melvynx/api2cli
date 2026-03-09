import { db } from "@/db";
import { sponsors, SPONSOR_SLOTS } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SponsorSlotClient } from "./sponsor-slot-client";

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getFaviconUrl(url: string): string {
  const domain = getDomain(url);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export async function SponsorBar() {
  let activeSponsors: {
    slot: number;
    name: string | null;
    logoUrl: string | null;
    linkUrl: string | null;
    description: string | null;
  }[] = [];

  try {
    activeSponsors = await db
      .select({
        slot: sponsors.slot,
        name: sponsors.name,
        logoUrl: sponsors.logoUrl,
        linkUrl: sponsors.linkUrl,
        description: sponsors.description,
      })
      .from(sponsors)
      .where(eq(sponsors.active, true));
  } catch (e) {
    console.error("SponsorBar: failed to fetch sponsors", e);
  }

  const sponsorMap = new Map(activeSponsors.map((s) => [s.slot, s]));

  const slots = Array.from({ length: SPONSOR_SLOTS }, (_, i) => ({
    slot: i + 1,
    sponsor: sponsorMap.get(i + 1) ?? null,
  }));

  return (
    <section className="border-y border-border/30 bg-muted/5 py-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-4 text-center">
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground/40 uppercase">
            Sponsors
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {slots.map(({ slot, sponsor }) =>
            sponsor?.linkUrl ? (
              <a
                key={slot}
                href={sponsor.linkUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group flex min-h-[72px] items-center gap-3 rounded-xl border border-border/40 bg-card/30 px-4 py-3 transition-all hover:border-[#D54747]/30 hover:bg-card/50"
              >
                <img
                  src={
                    sponsor.logoUrl || getFaviconUrl(sponsor.linkUrl)
                  }
                  alt={sponsor.name ?? getDomain(sponsor.linkUrl)}
                  width={28}
                  height={28}
                  className="h-7 w-7 shrink-0 rounded-md object-contain opacity-80 transition-opacity group-hover:opacity-100"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-mono text-xs font-medium text-foreground/80 group-hover:text-foreground">
                    {getDomain(sponsor.linkUrl)}
                  </div>
                  {sponsor.description && (
                    <div className="truncate text-[10px] text-muted-foreground/40">
                      {sponsor.description}
                    </div>
                  )}
                </div>
              </a>
            ) : (
              <SponsorSlotClient key={slot} />
            )
          )}
        </div>
      </div>
    </section>
  );
}
