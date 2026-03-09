import { NextResponse } from "next/server";
import { db } from "@/db";
import { sponsors } from "@/db/schema";
import { eq } from "drizzle-orm";

export const revalidate = 60;

export async function GET() {
  const activeSponsors = await db
    .select({
      slot: sponsors.slot,
      name: sponsors.name,
      logoUrl: sponsors.logoUrl,
      linkUrl: sponsors.linkUrl,
      description: sponsors.description,
    })
    .from(sponsors)
    .where(eq(sponsors.active, true));

  return NextResponse.json(activeSponsors);
}
