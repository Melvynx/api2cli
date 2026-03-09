import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ name: string }>;

export async function POST(_req: NextRequest, { params }: { params: Params }) {
  const { name } = await params;

  const result = await db
    .update(skills)
    .set({ downloads: sql`${skills.downloads} + 1` })
    .where(eq(skills.name, name))
    .returning();

  if (result.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Skill not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, downloads: result[0]?.downloads });
}
