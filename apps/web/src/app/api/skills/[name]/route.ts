import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ name: string }>;

// GET /api/skills/:name - get a single skill by name
export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { name } = await params;

  const [skill] = await db
    .select()
    .from(skills)
    .where(eq(skills.name, name))
    .limit(1);

  if (!skill) {
    return NextResponse.json(
      { ok: false, error: "Skill not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, data: skill });
}
