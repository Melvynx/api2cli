import type { MetadataRoute } from "next";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let cliUrls: MetadataRoute.Sitemap = [];

  try {
    const allSkills = await db
      .select({ name: skills.name, updatedAt: skills.updatedAt })
      .from(skills)
      .where(eq(skills.visible, true));

    cliUrls = allSkills.map((skill) => ({
      url: `https://api2cli.dev/cli/${skill.name}`,
      lastModified: skill.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB unavailable at build time - dynamic CLIs will be added at runtime
  }

  return [
    {
      url: "https://api2cli.dev",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://api2cli.dev/cli",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://api2cli.dev/docs",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://api2cli.dev/docs/getting-started",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://api2cli.dev/docs/agent-integration",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://api2cli.dev/docs/create-cli",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://api2cli.dev/docs/resources",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://api2cli.dev/docs/commands",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://api2cli.dev/docs/marketplace",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...cliUrls,
  ];
}
