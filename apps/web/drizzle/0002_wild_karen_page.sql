CREATE TABLE "sponsors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slot" integer NOT NULL,
	"name" text,
	"logo_url" text,
	"link_url" text,
	"description" text,
	"email" text NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"edit_token" text NOT NULL,
	"active" boolean DEFAULT false,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "sponsors_edit_token_unique" UNIQUE("edit_token")
);
