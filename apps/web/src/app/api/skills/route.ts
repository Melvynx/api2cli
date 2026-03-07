import { db } from "@/db";
import { skills, type NewSkill } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/skills — list all skills, optional search
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  const category = req.nextUrl.searchParams.get("category");
  const sort = req.nextUrl.searchParams.get("sort") ?? "popular";

  let q = db.select().from(skills).$dynamic();

  if (category && category !== "all") {
    q = q.where(eq(skills.category, category));
  }

  if (sort === "popular") {
    q = q.orderBy(desc(skills.downloads));
  } else if (sort === "votes") {
    q = q.orderBy(desc(skills.upvotes));
  } else if (sort === "newest") {
    q = q.orderBy(desc(skills.createdAt));
  }

  const allSkills = await q.limit(100);

  // Client-side search with relevance scoring
  if (query && query.trim()) {
    const terms = query.toLowerCase().split(/\s+/);
    const scored = allSkills
      .map((skill) => {
        let score = 0;
        const searchable = [
          skill.name,
          skill.displayName,
          skill.description ?? "",
          skill.category ?? "",
          ...(skill.tags as string[] ?? []),
        ]
          .join(" ")
          .toLowerCase();

        for (const term of terms) {
          if (skill.name.toLowerCase() === term) score += 50;
          if (skill.displayName.toLowerCase().includes(term)) score += 30;
          if (skill.description?.toLowerCase().includes(term)) score += 20;
          if (skill.category?.toLowerCase().includes(term)) score += 15;
          if ((skill.tags as string[] ?? []).some((t: string) => t.toLowerCase().includes(term)))
            score += 25;
          if (searchable.includes(term)) score += 5;
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
    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
