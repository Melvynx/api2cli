import { db } from "@/db";
import { skills, type Skill } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { getSkillTypeForRegistryType, type RegistryCliType } from "@/lib/cli-kind";

export type RegistrySort = "popular" | "votes" | "newest";
export type RegistrySkillResult = Skill & { relevance?: number };

type SearchRegistrySkillsOptions = {
  query?: string | null;
  category?: string | null;
  tag?: string | null;
  type?: RegistryCliType | null;
  sort?: RegistrySort;
};

export function getVisibleSkillsQuery(
  category?: string | null,
  type?: RegistryCliType | null,
  sort: RegistrySort = "popular",
) {
  const skillType = getSkillTypeForRegistryType(type);
  let query = db.select().from(skills).where(eq(skills.visible, true)).$dynamic();

  if ((category && category !== "all") || skillType) {
    const filters = [eq(skills.visible, true)];
    if (category && category !== "all") {
      filters.push(eq(skills.category, category));
    }
    if (skillType) {
      filters.push(eq(skills.skillType, skillType));
    }
    query = query.where(and(...filters));
  }

  if (sort === "popular") {
    query = query.orderBy(desc(skills.downloads));
  } else if (sort === "votes") {
    query = query.orderBy(desc(skills.upvotes));
  } else if (sort === "newest") {
    query = query.orderBy(desc(skills.createdAt));
  }

  return query;
}

export async function searchRegistrySkills({
  query,
  category,
  tag,
  type,
  sort = "popular",
}: SearchRegistrySkillsOptions): Promise<RegistrySkillResult[]> {
  let allSkills = await getVisibleSkillsQuery(category, type, sort);

  if (tag && tag !== "all") {
    allSkills = allSkills.filter((skill) => {
      const tags = (skill.tags as string[]) ?? [];
      return tags.some((item) => item.toLowerCase() === tag.toLowerCase());
    });
  }

  if (!query?.trim()) {
    return allSkills;
  }

  const terms = query.toLowerCase().split(/\s+/);

  return allSkills
    .map((skill) => {
      let score = 0;
      const readmeLower = skill.readme?.toLowerCase() ?? "";

      for (const term of terms) {
        if (skill.name.toLowerCase() === term) score += 50;
        if (skill.displayName.toLowerCase().includes(term)) score += 30;
        if (skill.description?.toLowerCase().includes(term)) score += 20;
        if (skill.category?.toLowerCase().includes(term)) score += 15;
        if (((skill.tags as string[]) ?? []).some((item) => item.toLowerCase().includes(term))) {
          score += 25;
        }
        if (readmeLower.includes(term)) score += 10;
      }

      return { ...skill, relevance: Math.min(score, 100) };
    })
    .filter((skill) => skill.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance);
}
