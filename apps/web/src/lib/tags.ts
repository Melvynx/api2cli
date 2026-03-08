const TAG_RULES: [RegExp, string][] = [
  // Platforms & services
  [/twitter|tweet|x\.com/, "twitter"],
  [/mastodon|fediverse/, "mastodon"],
  [/bluesky|bsky/, "bluesky"],
  [/instagram/, "instagram"],
  [/linkedin/, "linkedin"],
  [/threads/, "threads"],
  [/reddit/, "reddit"],
  [/youtube/, "youtube"],
  [/tiktok/, "tiktok"],
  [/slack/, "slack"],
  [/discord/, "discord"],
  [/telegram/, "telegram"],
  [/notion/, "notion"],
  [/github/, "github"],
  [/gitlab/, "gitlab"],
  [/vercel/, "vercel"],
  [/cloudflare/, "cloudflare"],
  [/aws|amazon web/, "aws"],
  [/stripe/, "stripe"],
  [/shopify/, "shopify"],
  [/openai/, "openai"],
  [/claude|anthropic/, "anthropic"],
  [/supabase/, "supabase"],
  [/firebase/, "firebase"],
  [/twilio/, "twilio"],
  [/sendgrid/, "sendgrid"],
  [/mailchimp/, "mailchimp"],
  [/typefully/, "typefully"],
  [/plausible/, "plausible"],
  [/hubspot/, "hubspot"],
  [/jira|atlassian/, "jira"],
  [/linear/, "linear"],
  [/airtable/, "airtable"],
  [/zapier/, "zapier"],

  // Capabilities
  [/automat|workflow|pipeline/, "automation"],
  [/schedul|cron|recurring/, "scheduling"],
  [/monitor|uptime|health.?check/, "monitoring"],
  [/notif|alert|webhook/, "notifications"],
  [/analytic|metric|insight|dashboard/, "analytics"],
  [/deploy|ci\/cd|release/, "deployment"],
  [/auth|login|oauth|sso/, "authentication"],
  [/email|newsletter|inbox/, "email"],
  [/payment|billing|invoice|subscript/, "payments"],
  [/search|index|query/, "search"],
  [/storage|upload|file|s3|blob/, "storage"],
  [/database|sql|postgres|mongo|redis/, "database"],
  [/cache|cdn|edge/, "caching"],
  [/log|debug|trace/, "logging"],
  [/test|spec|assert/, "testing"],
  [/chat|messag|conversation/, "messaging"],
  [/content|cms|blog|post/, "content"],
  [/crm|customer|lead/, "crm"],
  [/seo|ranking|sitemap/, "seo"],
  [/image|photo|media|video/, "media"],
  [/pdf|document|report/, "documents"],
  [/translate|i18n|locale/, "i18n"],
  [/scrape|crawl|extract/, "scraping"],

  // Tech
  [/rest\s?api|http|endpoint/, "rest-api"],
  [/graphql/, "graphql"],
  [/websocket|realtime|real-time/, "realtime"],
  [/\bai\b|machine.?learn|llm|gpt|model/, "ai"],
  [/nlp|text.?process|sentiment/, "nlp"],
  [/crypto|blockchain|web3|nft/, "crypto"],
  [/iot|sensor|device/, "iot"],
  [/dns|domain|ssl|certificate/, "dns"],
  [/map|geo|location|gps/, "geolocation"],
];

export function guessTags(
  description: string,
  topics: string[],
  readme?: string | null,
  skillMd?: string | null,
  category?: string,
  authType?: string,
): string[] {
  const text = `${description} ${topics.join(" ")} ${readme ?? ""} ${skillMd ?? ""}`.toLowerCase();
  const tags = new Set<string>();

  // Add category as a tag
  if (category && category !== "other") tags.add(category);

  // Add GitHub topics as tags (filtered & normalized)
  for (const topic of topics) {
    const normalized = topic.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (normalized.length > 1 && normalized.length < 30) {
      tags.add(normalized);
    }
  }

  // Match keyword rules
  for (const [pattern, tag] of TAG_RULES) {
    if (pattern.test(text)) tags.add(tag);
  }

  // Add auth type tag
  if (authType === "oauth") tags.add("oauth");
  if (authType === "api-key") tags.add("api-key");

  // Add "open-source" if it's on GitHub
  tags.add("open-source");

  // Add "cli" tag always
  tags.add("cli");

  return [...tags].slice(0, 15);
}
