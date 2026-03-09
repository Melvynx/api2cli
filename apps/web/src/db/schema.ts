import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(), // e.g. "typefully"
  displayName: text("display_name").notNull(), // e.g. "Typefully"
  description: text("description"),
  category: text("category").default("other"), // social, finance, devtools, marketing, productivity, communication, analytics, other
  apiBaseUrl: text("api_base_url"),
  authType: text("auth_type").default("bearer"), // bearer, api-key, basic
  docsUrl: text("docs_url"),
  openapiUrl: text("openapi_url"),
  npmPackage: text("npm_package"), // @api2cli/typefully
  githubRepo: text("github_repo"),
  readme: text("readme"),
  resources: jsonb("resources").$type<ResourceDef[]>(),
  version: text("version").default("0.1.0"),
  downloads: integer("downloads").default(0),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  verified: boolean("verified").default(false),
  visible: boolean("visible").default(true),
  authorGithub: text("author_github"),
  authorName: text("author_name"),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

export interface ResourceDef {
  name: string;
  description?: string;
  actions: {
    name: string;
    method: string;
    path: string;
    description?: string;
    params?: {
      name: string;
      type: string;
      required?: boolean;
      description?: string;
    }[];
  }[];
}

export const sponsors = pgTable("sponsors", {
  id: uuid("id").primaryKey().defaultRandom(),
  slot: integer("slot").notNull(),
  name: text("name"),
  logoUrl: text("logo_url"),
  linkUrl: text("link_url"),
  description: text("description"),
  email: text("email").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  editToken: text("edit_token").notNull().unique(),
  active: boolean("active").default(false),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Sponsor = typeof sponsors.$inferSelect;
export type NewSponsor = typeof sponsors.$inferInsert;

export const SPONSOR_SLOTS = 4;

export const CATEGORIES = [
  { value: "social", label: "Social Media", icon: "📱" },
  { value: "finance", label: "Finance & Banking", icon: "💰" },
  { value: "devtools", label: "Developer Tools", icon: "🛠️" },
  { value: "marketing", label: "Marketing", icon: "📣" },
  { value: "productivity", label: "Productivity", icon: "⚡" },
  { value: "communication", label: "Communication", icon: "💬" },
  { value: "analytics", label: "Analytics", icon: "📊" },
  { value: "ai", label: "AI & ML", icon: "🤖" },
  { value: "ecommerce", label: "E-Commerce", icon: "🛒" },
  { value: "other", label: "Other", icon: "📦" },
] as const;
