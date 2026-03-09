import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sponsors } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const [sponsor] = await db
    .select({
      id: sponsors.id,
      slot: sponsors.slot,
      name: sponsors.name,
      logoUrl: sponsors.logoUrl,
      linkUrl: sponsors.linkUrl,
      description: sponsors.description,
      email: sponsors.email,
      active: sponsors.active,
    })
    .from(sponsors)
    .where(eq(sponsors.editToken, token))
    .limit(1);

  if (!sponsor) {
    return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
  }

  return NextResponse.json(sponsor);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await request.json();

  const { name, logoUrl, linkUrl, description } = body as {
    name?: string;
    logoUrl?: string;
    linkUrl?: string;
    description?: string;
  };

  if (!linkUrl) {
    return NextResponse.json(
      { error: "Link URL is required" },
      { status: 400 }
    );
  }

  const derivedName =
    name || (() => {
      try {
        return new URL(linkUrl).hostname.replace(/^www\./, "");
      } catch {
        return "Sponsor";
      }
    })();

  const [existing] = await db
    .select({ id: sponsors.id })
    .from(sponsors)
    .where(eq(sponsors.editToken, token))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
  }

  const [updated] = await db
    .update(sponsors)
    .set({
      name: derivedName,
      logoUrl: logoUrl || null,
      linkUrl,
      description: description || null,
      active: true,
      updatedAt: new Date(),
    })
    .where(eq(sponsors.editToken, token))
    .returning();

  return NextResponse.json({
    id: updated.id,
    slot: updated.slot,
    name: updated.name,
    logoUrl: updated.logoUrl,
    linkUrl: updated.linkUrl,
    description: updated.description,
    active: updated.active,
  });
}
