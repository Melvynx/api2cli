const TAG_RULES: [RegExp, string][] = [
  // Platforms & services
  [/twitter|tweet|x\.com/, "twitter"],
  [/mastodon|fediverse/, "mastodon"],
  [/bluesky|bsky/, "bluesky"],
  [/instagram/, "instagram"],
  [/linkedin/, "linkedin"],
  [/threads/, "threads"],
  [/youtube/, "youtube"],
  [/slack/, "slack"],
  [/discord/, "discord"],
  [/telegram/, "telegram"],
  [/github/, "github"],
  [/vercel/, "vercel"],
  [/cloudflare/, "cloudflare"],
  [/aws|amazon web/, "aws"],
  [/stripe/, "stripe"],
  [/supabase/, "supabase"],
  [/twilio/, "twilio"],
  [/linear/, "linear"],

  // Capabilities (high-signal only)
  [/schedul|cron|recurring/, "scheduling"],
  [/deploy|ci\/cd/, "deployment"],
  [/email|newsletter/, "email"],
  [/payment|billing|invoice/, "payments"],
  [/database|sql|postgres|mongo/, "database"],
  [/chat|messag/, "messaging"],
  [/dns|domain/, "dns"],
  [/container|docker/, "containers"],
  [/kubernetes|kubectl|k8s/, "kubernetes"],
  [/secret|vault|env.?var/, "secrets"],

  // Tech
  [/\bai\b|llm|gpt/, "ai"],
];

const MAX_TAGS = 5;

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
