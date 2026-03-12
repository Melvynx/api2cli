import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { normalizeSkillTags } from "@/lib/cli-kind";
import { NextRequest, NextResponse } from "next/server";
import { guessTags } from "@/lib/tags";

// POST /api/admin/backfill-tags — regenerate tags for all existing skills
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allSkills = await db.select().from(skills);
  const results: { name: string; tags: string[] }[] = [];

  for (const skill of allSkills) {
    const newTags = guessTags(
      skill.description ?? "",
      [],
      skill.category ?? undefined,
    );
    const normalizedTags = normalizeSkillTags(skill.skillType, newTags);

    await db
      .update(skills)
      .set({ tags: normalizedTags, updatedAt: new Date() })
      .where(eq(skills.name, skill.name));

    results.push({ name: skill.name, tags: normalizedTags });
  }

  return NextResponse.json({
    ok: true,
    updated: results.length,
    results,
  });
}
