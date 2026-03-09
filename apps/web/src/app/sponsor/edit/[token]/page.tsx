import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { sponsors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Navbar } from "@/components/navbar";
import { SponsorForm } from "@/components/sponsor-form";

export const metadata: Metadata = {
  title: "Edit your sponsorship",
  robots: { index: false },
};

export default async function SponsorEditPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const [sponsor] = await db
    .select({
      name: sponsors.name,
      logoUrl: sponsors.logoUrl,
      linkUrl: sponsors.linkUrl,
      description: sponsors.description,
      slot: sponsors.slot,
      email: sponsors.email,
    })
    .from(sponsors)
    .where(eq(sponsors.editToken, token))
    .limit(1);

  if (!sponsor) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-1 flex-col px-6 py-16">
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D54747]/30 bg-[#D54747]/5 px-3 py-1">
            <span className="font-mono text-xs text-[#D54747]">
              Slot #{sponsor.slot}
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-geist-pixel-square)] text-2xl font-bold tracking-tight">
            Edit your sponsorship
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Update your sponsor details. Changes appear on api2cli.dev within a
            minute.
          </p>
        </div>

        <SponsorForm
          token={token}
          initialData={{
            name: sponsor.name ?? "",
            logoUrl: sponsor.logoUrl ?? "",
            linkUrl: sponsor.linkUrl ?? "",
            description: sponsor.description ?? "",
          }}
        />

        <div className="mt-8 rounded-xl border border-border/30 bg-card/20 p-4">
          <p className="text-xs text-muted-foreground/40">
            Linked to {sponsor.email}. Bookmark this page to return later.
          </p>
        </div>
      </main>
    </div>
  );
}
