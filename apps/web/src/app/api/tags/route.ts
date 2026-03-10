import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/tags — returns all unique tags with their count, sorted by frequency
export async function GET() {
  const allSkills = await db.select({ tags: skills.tags }).from(skills).where(eq(skills.visible, true));

  const tagCounts = new Map<string, number>();
  for (const skill of allSkills) {
    const tags = (skill.tags as string[]) ?? [];
    for (const tag of tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const sorted = [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json({ ok: true, data: sorted });
}
