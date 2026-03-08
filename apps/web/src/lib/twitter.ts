import { TwitterApi } from "twitter-api-v2";

function getTwitterClient(): TwitterApi | null {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    console.warn("[twitter] missing env vars:", {
      TWITTER_API_KEY: apiKey ? "set" : "MISSING",
      TWITTER_API_SECRET: apiSecret ? "set" : "MISSING",
      TWITTER_ACCESS_TOKEN: accessToken ? "set" : "MISSING",
      TWITTER_ACCESS_TOKEN_SECRET: accessSecret ? "set" : "MISSING",
    });
    return null;
  }

  console.log("[twitter] client created successfully");
  return new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken,
    accessSecret,
  });
}

export async function tweetNewCLI(cli: {
  name: string;
  description: string;
}) {
  console.log("[twitter] tweetNewCLI called for:", cli.name);
  console.log("[twitter] NODE_ENV:", process.env.NODE_ENV);

  if (process.env.NODE_ENV !== "production") {
    console.log("[twitter] skipping — not production");
    return;
  }

  const client = getTwitterClient();
  if (!client) {
    console.warn("[twitter] no client — aborting tweet");
    return;
  }

  const tweet = `🆕 New CLI published: ${cli.name}
${cli.description}

npx api2cli install ${cli.name}

#api2cli #devtools`;

  console.log("[twitter] sending tweet:", tweet);

  try {
    const result = await client.v2.tweet(tweet);
    console.log("[twitter] success! tweet id:", result.data.id);
  } catch (error: any) {
    console.error("[twitter] tweet FAILED:", error);
    if (error?.data) {
      console.error("[twitter] error data:", JSON.stringify(error.data));
    }
    if (error?.code) {
      console.error("[twitter] error code:", error.code);
    }
  }
}
