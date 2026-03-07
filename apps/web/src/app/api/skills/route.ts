import { db } from "@/db";
import { skills, type NewSkill } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/skills — list all skills
export async function GET() {
  const allSkills = await db.select().from(skills);
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
