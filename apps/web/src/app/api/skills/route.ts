import { db } from "@/db";
import { skills, type NewSkill } from "@/db/schema";
import { eq, count as drizzleCount } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { tweetNewCLI } from "@/lib/twitter";
import {
  getVisibleSkillsQuery,
  searchRegistrySkills,
  type RegistrySort,
} from "@/lib/registry-query";

const DEFAULT_PAGE_SIZE = 12;

// GET /api/skills — list all skills, optional search + pagination
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  const category = req.nextUrl.searchParams.get("category");
  const tag = req.nextUrl.searchParams.get("tag");
  const sort = (req.nextUrl.searchParams.get("sort") ?? "popular") as RegistrySort;
  const offset = Math.max(0, Number(req.nextUrl.searchParams.get("offset")) || 0);
  const limit = Math.min(50, Math.max(1, Number(req.nextUrl.searchParams.get("limit")) || DEFAULT_PAGE_SIZE));

  const registryQuery = getVisibleSkillsQuery(category, sort);

  // For search & tag queries, fetch all then filter/score client-side
  if ((query && query.trim()) || (tag && tag !== "all")) {
    const filteredSkills = await searchRegistrySkills({ query, category, tag, sort });
    return NextResponse.json({
      ok: true,
      data: filteredSkills,
      hasMore: false,
      total: filteredSkills.length,
    });
  }

  // Paginated query (no search/tag)
  const [totalResult] = await db
    .select({ count: drizzleCount() })
    .from(skills)
    .where(eq(skills.visible, true));
  const total = totalResult?.count ?? 0;

  const pageSkills = await registryQuery.offset(offset).limit(limit);

  return NextResponse.json({
    ok: true,
    data: pageSkills,
    hasMore: offset + pageSkills.length < total,
    total,
  });
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
      revalidatePath("/");
      revalidatePath("/cli");
      revalidatePath(`/cli/${body.name}`);
      return NextResponse.json({ ok: true, data: updated });
    }

    const [created] = await db.insert(skills).values(body).returning();

    revalidatePath("/");
    revalidatePath("/cli");
    revalidatePath(`/cli/${created.name}`);

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
