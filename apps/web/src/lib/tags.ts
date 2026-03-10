const TAG_RULES: [RegExp, string][] = [
  [/deploy|ci\/cd|release/, "deployment"],
  [/database|sql|postgres|mongo|redis|drizzle|prisma/, "database"],
  [/chat|messag|slack|discord|telegram/, "communication"],
  [/storage|upload|file|s3|blob/, "storage"],
  [/task|todo|note|calendar|time|bookmark/, "productivity"],
  [/secret|vault|env.?var|password/, "secrets"],
  [/email|newsletter|inbox/, "email"],
  [/payment|billing|invoice/, "payments"],
  [/finance|bank|accounting/, "finance"],
  [/ecommerce|shop|store|cart/, "ecommerce"],
  [/dns|domain|ssl|certificate/, "dns"],
  [/container|docker/, "containers"],
  [/kubernetes|kubectl|k8s/, "kubernetes"],
  [/\bai\b|llm|gpt/, "ai"],
  [/schedul|cron|recurring/, "scheduling"],
  [/infrastructure|terraform/, "infrastructure"],
];

const MAX_TAGS = 4;

export function guessTags(
  description: string,
  topics: string[],
  readme?: string | null,
  skillMd?: string | null,
  category?: string,
): string[] {
  const text = `${description} ${topics.join(" ")} ${skillMd ?? ""}`.toLowerCase();
  const tags = new Set<string>();

  if (category && category !== "other") tags.add(category);

  for (const [pattern, tag] of TAG_RULES) {
    if (pattern.test(text)) tags.add(tag);
  }

  return [...tags].slice(0, MAX_TAGS);
}
