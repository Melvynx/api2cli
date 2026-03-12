export const OFFICIAL_CLI_TAG = "official";

export const CLI_TYPE_FILTERS = ["all", "wrapper", "official"] as const;

export type RegistryCliType = (typeof CLI_TYPE_FILTERS)[number];

export function getSkillTypeForRegistryType(type: string | null | undefined) {
  if (type === "official") return "public";
  if (type === "wrapper") return "generated";
  return null;
}

export function getRegistryTypeForSkillType(skillType: string | null | undefined): RegistryCliType {
  return skillType === "public" ? "official" : "wrapper";
}

export function getCliTypeLabel(skillType: string | null | undefined) {
  return skillType === "public" ? "Official CLI" : "Wrapper CLI";
}

export function normalizeSkillTags(
  skillType: string | null | undefined,
  tags: string[] | null | undefined,
) {
  const normalized = [...new Set((tags ?? []).map((tag) => tag.trim()).filter(Boolean))];
  const withoutOfficialTag = normalized.filter((tag) => tag.toLowerCase() !== OFFICIAL_CLI_TAG);

  if (skillType === "public") {
    return [OFFICIAL_CLI_TAG, ...withoutOfficialTag];
  }

  return withoutOfficialTag;
}
