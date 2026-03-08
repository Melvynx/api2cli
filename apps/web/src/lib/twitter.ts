import { TwitterApi } from "twitter-api-v2";

function getTwitterClient(): TwitterApi | null {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    console.warn("Twitter: missing env vars, skipping tweet", {
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
      hasAccessToken: !!accessToken,
      hasAccessSecret: !!accessSecret,
    });
    return null;
  }

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
  if (process.env.NODE_ENV !== "production") {
    console.log("Twitter: skipping tweet (not production)");
    return;
  }

  const client = getTwitterClient();
  if (!client) return;

  const tweet = `🆕 New CLI published: ${cli.name}
${cli.description}

npx api2cli install ${cli.name}

#api2cli #devtools`;

  try {
    await client.v2.tweet(tweet);
    console.log(`Twitter: tweeted about ${cli.name}`);
  } catch (error) {
    console.error("Tweet failed (non-blocking):", error);
  }
}
