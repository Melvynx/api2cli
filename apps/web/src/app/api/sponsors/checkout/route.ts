import { NextResponse } from "next/server";
import { db } from "@/db";
import { sponsors, SPONSOR_SLOTS } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stripe, SPONSOR_PRICE_ID } from "@/lib/stripe";

export async function POST() {
  try {
    const activeSponsors = await db
      .select({ slot: sponsors.slot })
      .from(sponsors)
      .where(eq(sponsors.active, true));

    const takenSlots = new Set(activeSponsors.map((s) => s.slot));
    let availableSlot: number | null = null;

    for (let i = 1; i <= SPONSOR_SLOTS; i++) {
      if (!takenSlots.has(i)) {
        availableSlot = i;
        break;
      }
    }

    if (availableSlot === null) {
      return NextResponse.json(
        { error: "All sponsor slots are currently taken" },
        { status: 409 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: SPONSOR_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/sponsor/setup?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      metadata: { slot: String(availableSlot) },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
