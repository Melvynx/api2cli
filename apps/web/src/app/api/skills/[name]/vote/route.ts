import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ name: string }>;

// POST /api/skills/:name/vote — upvote or downvote
export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { name } = await params;
  const body = await req.json();
  const direction = body.direction as "up" | "down";

  if (direction !== "up" && direction !== "down") {
    return NextResponse.json(
      { ok: false, error: "direction must be 'up' or 'down'" },
      { status: 400 }
    );
  }

  const column = direction === "up" ? skills.upvotes : skills.downvotes;

  const [updated] = await db
    .update(skills)
    .set({ [direction === "up" ? "upvotes" : "downvotes"]: sql`${column} + 1` })
    .where(eq(skills.name, name))
    .returning();

  if (!updated) {
    return NextResponse.json(
      { ok: false, error: "Skill not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, data: updated });
}
