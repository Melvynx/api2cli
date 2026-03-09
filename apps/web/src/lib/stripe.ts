import Stripe from "stripe";

// @ts-expect-error -- let Stripe use the account's default API version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const SPONSOR_PRICE_ID = process.env.STRIPE_SPONSOR_PRICE_ID!;
