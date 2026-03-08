import { NextResponse } from "next/server";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { tweetNewCLI } from "@/lib/twitter";
import { guessTags } from "@/lib/tags";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function parseGithubUrl(url: string): { owner: string; repo: string } | null {
  // Support: https://github.com/owner/repo, github.com/owner/repo, owner/repo
  const cleaned = url.trim().replace(/\.git$/, "").replace(/\/$/, "");

  // owner/repo shorthand
  const shortMatch = cleaned.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
  if (shortMatch) return { owner: shortMatch[1], repo: shortMatch[2] };

  // Full URL
  const urlMatch = cleaned.match(
    /(?:https?:\/\/)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/
  );
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2] };

  return null;
}

async function fetchGithub(path: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "api2cli-web",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) return null;
  return res.json();
}

async function fetchRawFile(owner: string, repo: string, path: string) {
  const headers: Record<string, string> = {
    "User-Agent": "api2cli-web",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  const res = await fetch(
    `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`,
    { headers }
  );
  if (!res.ok) {
    const res2 = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/master/${path}`,
      { headers }
    );
    if (!res2.ok) return null;
    return res2.text();
  }
  return res.text();
}

const VALID_CATEGORIES = [
  "social", "finance", "devtools", "marketing", "productivity",
  "communication", "analytics", "ai", "ecommerce", "other",
];

function guessCategory(
  description: string,
  topics: string[],
  readme?: string | null,
  skillMd?: string | null,
): string {
  const text = `${description} ${topics.join(" ")} ${readme ?? ""} ${skillMd ?? ""}`.toLowerCase();

  if (text.match(/social|twitter|tweet|mastodon|bluesky|instagram|linkedin|threads/))
    return "social";
  if (text.match(/finance|bank|payment|stripe|invoice|billing|mercury|accounting/))
    return "finance";
  if (text.match(/devtools|developer|github|ci\/cd|deploy|build|vercel|cloudflare/))
    return "devtools";
  if (text.match(/marketing|email|newsletter|seo|ads|campaign|typefully|mailchimp/))
    return "marketing";
  if (text.match(/productivity|task|todo|note|calendar|time|bookmark|notion/))
    return "productivity";
  if (text.match(/chat|message|slack|discord|telegram|communication|support/))
    return "communication";
  if (text.match(/analytics|metric|monitor|log|track|dashboard|plausible/))
    return "analytics";
  if (text.match(/\bai\b|ml\b|model|llm|gpt|claude|openai|machine learning/))
    return "ai";
  if (text.match(/ecommerce|shop|store|product|order|cart|shopify/))
    return "ecommerce";
  if (text.match(/flight|airport|airline|aviation|travel/))
    return "other";

  return "other";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { githubUrl, category: bodyCategory } = body;

    if (!githubUrl) {
      return NextResponse.json(
        { error: "githubUrl is required" },
        { status: 400 }
      );
    }

    const parsed = parseGithubUrl(githubUrl);
    if (!parsed) {
      return NextResponse.json(
        { error: "Invalid GitHub URL. Use owner/repo or https://github.com/owner/repo" },
        { status: 400 }
      );
    }

    const { owner, repo } = parsed;

    // Fetch repo info
    const repoData = await fetchGithub(`/repos/${owner}/${repo}`);
    if (!repoData) {
      return NextResponse.json(
        { error: `Repository ${owner}/${repo} not found` },
        { status: 404 }
      );
    }

    // Fetch package.json for version and name
    const packageJsonStr = await fetchRawFile(owner, repo, "package.json");
    let packageJson: Record<string, string> | null = null;
    if (packageJsonStr) {
      try {
        packageJson = JSON.parse(packageJsonStr);
      } catch {
        // ignore
      }
    }

    // Fetch README for description extraction
    const readme = await fetchRawFile(owner, repo, "README.md");

    // Fetch SKILL.md if it exists (check root first, then skills/<repo>/)
    let skillMd = await fetchRawFile(owner, repo, "SKILL.md");
    if (!skillMd) {
      skillMd = await fetchRawFile(owner, repo, `skills/${repo}/SKILL.md`);
    }

    // Extract description: prefer SKILL.md frontmatter > repo description > package.json
    let description = repoData.description || packageJson?.description || "";
    let skillName = repo
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-");

    let skillCategory: string | null = null;

    if (skillMd) {
      const frontmatterMatch = skillMd.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        const nameMatch = frontmatterMatch[1].match(/name:\s*(.+)/);
        const descMatch = frontmatterMatch[1].match(/description:\s*(.+)/);
        const catMatch = frontmatterMatch[1].match(/category:\s*(.+)/);
        if (nameMatch) skillName = nameMatch[1].trim();
        if (descMatch) description = descMatch[1].trim();
        if (catMatch) {
          const cat = catMatch[1].trim().toLowerCase();
          if (VALID_CATEGORIES.includes(cat)) skillCategory = cat;
        }
      }
    }

    if (!skillName.endsWith("-cli")) {
      skillName = `${skillName}-cli`;
    }

    const displayName = (repoData.name || repo).replace(/(-cli)+$/, "-cli");

    // Determine category: body > SKILL.md frontmatter > guessCategory
    const topics: string[] = repoData.topics || [];
    const validBodyCategory = bodyCategory && VALID_CATEGORIES.includes(bodyCategory.toLowerCase())
      ? bodyCategory.toLowerCase()
      : null;
    const category = validBodyCategory || skillCategory || guessCategory(description, topics, readme, skillMd);

    // Determine auth type from README
    let authType = "bearer";
    if (readme) {
      const readmeLower = readme.toLowerCase();
      if (readmeLower.includes("api-key") || readmeLower.includes("api_key"))
        authType = "api-key";
      if (readmeLower.includes("oauth")) authType = "oauth";
      if (readmeLower.includes("basic auth")) authType = "basic";
    }

    // Upsert into database
    const existing = await db
      .select()
      .from(skills)
      .where(eq(skills.name, skillName))
      .limit(1);

    const tags = guessTags(description, topics, readme, skillMd, category, authType);

    const skillData = {
      name: skillName,
      displayName,
      description,
      category,
      authType,
      version: packageJson?.version || "1.0.0",
      githubRepo: `https://github.com/${owner}/${repo}`,
      readme: readme || null,
      authorGithub: owner,
      authorName: repoData.owner?.login || owner,
      tags,
      verified: false,
    };

    const isNew = existing.length === 0;

    if (isNew) {
      await db
        .insert(skills)
        .values({ ...skillData, downloads: repoData.stargazers_count || 0 });
    } else {
      await db.update(skills).set(skillData).where(eq(skills.name, skillName));
    }

    console.log("[publish-cli] isNew:", isNew, "skillName:", skillName);
    if (isNew) {
      console.log("[publish-cli] about to call tweetNewCLI for:", skillName);
      try {
        await tweetNewCLI({ name: skillName, description });
        console.log("[publish-cli] tweetNewCLI completed for:", skillName);
      } catch (err) {
        console.error("[publish-cli] tweetNewCLI threw:", err);
      }
    }

    return NextResponse.json({
      success: true,
      skill: {
        name: skillName,
        displayName,
        description,
        category,
        githubRepo: `https://github.com/${owner}/${repo}`,
        stars: repoData.stargazers_count,
        url: `https://api2cli.dev/cli/${skillName}`,
      },
    });
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
