import { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { sponsors, SPONSOR_SLOTS } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import crypto from "node:crypto";
import { SponsorSetupClient } from "./client";

export const metadata: Metadata = {
  title: "Set up your sponsorship",
  robots: { index: false },
};

export default async function SponsorSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/");
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch {
    redirect("/");
  }

  if (session.payment_status !== "paid") {
    redirect("/");
  }

  const email = session.customer_details?.email;
  if (!email) {
    redirect("/");
  }

  // Look for existing sponsor (created by webhook or previous visit)
  const [existing] = await db
    .select({ editToken: sponsors.editToken })
    .from(sponsors)
    .where(eq(sponsors.email, email))
    .limit(1);

  if (existing) {
    return <SponsorSetupClient editToken={existing.editToken} />;
  }

  // Webhook hasn't fired yet -- create the sponsor record directly
  const slot = Number(session.metadata?.slot);
  let assignedSlot = slot;

  if (!assignedSlot || assignedSlot < 1 || assignedSlot > SPONSOR_SLOTS) {
    const taken = await db
      .select({ slot: sponsors.slot })
      .from(sponsors);
    const takenSet = new Set(taken.map((s) => s.slot));
    assignedSlot = 1;
    for (let i = 1; i <= SPONSOR_SLOTS; i++) {
      if (!takenSet.has(i)) {
        assignedSlot = i;
        break;
      }
    }
  }

  const editToken = crypto.randomUUID();

  await db.insert(sponsors).values({
    slot: assignedSlot,
    email,
    editToken,
    stripeCustomerId:
      typeof session.customer === "string" ? session.customer : null,
    stripeSubscriptionId:
      typeof session.subscription === "string" ? session.subscription : null,
    active: false,
  });

  return <SponsorSetupClient editToken={editToken} />;
}
