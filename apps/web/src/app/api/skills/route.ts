import { db } from "@/db";
import { skills, type NewSkill } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { tweetNewCLI } from "@/lib/twitter";

// GET /api/skills — list all skills, optional search
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  const category = req.nextUrl.searchParams.get("category");
  const tag = req.nextUrl.searchParams.get("tag");
  const sort = req.nextUrl.searchParams.get("sort") ?? "popular";

  let q = db.select().from(skills).where(eq(skills.visible, true)).$dynamic();

  if (category && category !== "all") {
    q = q.where(and(eq(skills.visible, true), eq(skills.category, category)));
  }

  if (sort === "popular") {
    q = q.orderBy(desc(skills.downloads));
  } else if (sort === "votes") {
    q = q.orderBy(desc(skills.upvotes));
  } else if (sort === "newest") {
    q = q.orderBy(desc(skills.createdAt));
  }

  let allSkills = await q.limit(100);

  // Filter by tag
  if (tag && tag !== "all") {
    allSkills = allSkills.filter((skill) => {
      const tags = (skill.tags as string[]) ?? [];
      return tags.some((t) => t.toLowerCase() === tag.toLowerCase());
    });
  }

  // Search with relevance scoring
  if (query && query.trim()) {
    const terms = query.toLowerCase().split(/\s+/);
    const scored = allSkills
      .map((skill) => {
        let score = 0;
        const readmeLower = skill.readme?.toLowerCase() ?? "";

        for (const term of terms) {
          if (skill.name.toLowerCase() === term) score += 50;
          if (skill.displayName.toLowerCase().includes(term)) score += 30;
          if (skill.description?.toLowerCase().includes(term)) score += 20;
          if (skill.category?.toLowerCase().includes(term)) score += 15;
          if ((skill.tags as string[] ?? []).some((t: string) => t.toLowerCase().includes(term)))
            score += 25;
          if (readmeLower.includes(term)) score += 10;
        }

        return { ...skill, relevance: Math.min(score, 100) };
      })
      .filter((s) => s.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);

    return NextResponse.json({ ok: true, data: scored });
  }

  return NextResponse.json({ ok: true, data: allSkills });
}

// POST /api/skills — publish a new skill
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as NewSkill;

    if (!body.name || !body.displayName) {
      return NextResponse.json(
        { ok: false, error: "name and displayName are required" },
        { status: 400 }
      );
    }

    // Upsert: update if exists, insert if not
    const existing = await db
      .select()
      .from(skills)
      .where(eq(skills.name, body.name))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(skills)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(skills.name, body.name))
        .returning();
      return NextResponse.json({ ok: true, data: updated });
    }

    const [created] = await db.insert(skills).values(body).returning();

    console.log("[skills] new skill created, about to tweet:", created.name);
    try {
      await tweetNewCLI({
        name: created.name,
        description: created.description ?? "",
      });
      console.log("[skills] tweetNewCLI completed for:", created.name);
    } catch (err) {
      console.error("[skills] tweetNewCLI threw:", err);
    }

    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
