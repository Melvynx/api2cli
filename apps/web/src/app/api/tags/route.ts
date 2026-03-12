import { type RegistryCliType } from "@/lib/cli-kind";
import { getVisibleSkillsQuery } from "@/lib/registry-query";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// GET /api/tags — returns all unique tags with their count, sorted by frequency
export async function GET(req: NextRequest) {
  const type = (req.nextUrl.searchParams.get("type") ?? "all") as RegistryCliType;
  const allSkills = await getVisibleSkillsQuery(null, type);

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
