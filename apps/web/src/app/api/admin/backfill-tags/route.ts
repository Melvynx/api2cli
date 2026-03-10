import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { guessTags } from "@/lib/tags";

// POST /api/admin/backfill-tags — regenerate tags for all existing skills
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.ADMIN_SECRET && secret !== "backfill-2024") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allSkills = await db.select().from(skills);
  const results: { name: string; tags: string[] }[] = [];

  for (const skill of allSkills) {
    const newTags = guessTags(
      skill.description ?? "",
      [],
      null,
      skill.readme,
      skill.category ?? undefined,
    );

    await db
      .update(skills)
      .set({ tags: newTags, updatedAt: new Date() })
      .where(eq(skills.name, skill.name));

    results.push({ name: skill.name, tags: newTags });
  }

  return NextResponse.json({
    ok: true,
    updated: results.length,
    results,
  });
}
