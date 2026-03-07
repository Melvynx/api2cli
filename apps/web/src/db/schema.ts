import { pgTable, text, timestamp, integer, boolean, uuid, jsonb } from "drizzle-orm/pg-core";

export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(), // e.g. "typefully"
  displayName: text("display_name").notNull(), // e.g. "Typefully"
  description: text("description"),
  apiBaseUrl: text("api_base_url"),
  authType: text("auth_type").default("bearer"), // bearer, api-key, basic
  docsUrl: text("docs_url"),
  openapiUrl: text("openapi_url"),
  npmPackage: text("npm_package"), // @api2cli/typefully
  githubRepo: text("github_repo"),
  resources: jsonb("resources").$type<ResourceDef[]>(),
  version: text("version").default("0.1.0"),
  downloads: integer("downloads").default(0),
  verified: boolean("verified").default(false),
  authorGithub: text("author_github"),
  authorName: text("author_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

interface ResourceDef {
  name: string;
  description?: string;
  actions: {
    name: string;
    method: string;
    path: string;
    description?: string;
    params?: { name: string; type: string; required?: boolean; description?: string }[];
  }[];
}
