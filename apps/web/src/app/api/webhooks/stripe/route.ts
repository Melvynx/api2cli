import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sponsors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import crypto from "node:crypto";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const slot = Number(session.metadata?.slot);
      const email = session.customer_details?.email;

      console.log("[webhook] checkout.session.completed", {
        sessionId: session.id,
        slot,
        email,
        metadata: session.metadata,
        customer: session.customer,
        subscription: session.subscription,
      });

      if (!slot || !email) {
        console.error("[webhook] Missing slot or email, skipping insert");
        break;
      }

      // Skip if sponsor already created (by setup page or duplicate webhook)
      const [existingSponsor] = await db
        .select({ id: sponsors.id })
        .from(sponsors)
        .where(eq(sponsors.email, email))
        .limit(1);

      if (existingSponsor) {
        console.log("[webhook] Sponsor already exists for", email);
        break;
      }

      const editToken = crypto.randomUUID();

      await db.insert(sponsors).values({
        slot,
        email,
        editToken,
        stripeCustomerId:
          typeof session.customer === "string" ? session.customer : null,
        stripeSubscriptionId:
          typeof session.subscription === "string"
            ? session.subscription
            : null,
        active: false,
      });

      console.log("[webhook] Sponsor created for", email, "slot", slot);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const subId =
        typeof subscription === "string" ? subscription : subscription.id;

      await db
        .update(sponsors)
        .set({ active: false })
        .where(eq(sponsors.stripeSubscriptionId, subId));

      break;
    }
  }

  return NextResponse.json({ received: true });
}
