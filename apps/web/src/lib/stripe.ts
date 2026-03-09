import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export const SPONSOR_PRICE_ID = process.env.STRIPE_SPONSOR_PRICE_ID!;
