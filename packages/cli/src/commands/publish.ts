import { Command } from "commander";
import { existsSync } from "fs";
import pc from "picocolors";
import { createInterface } from "readline";
import { API_URL, getCliDir } from "../lib/config.js";

function askQuestion(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function publishToMarketplace(
  githubUrl: string,
  category?: string,
  installCommand?: string,
  skillGithubPath?: string,
): Promise<boolean> {
  try {
    const payload: Record<string, string> = { githubUrl };
    if (category) payload.category = category;
    if (installCommand) payload.installCommand = installCommand;
    if (skillGithubPath) payload.skillGithubPath = skillGithubPath;

    const res = await fetch(`${API_URL}/api/publish-cli`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`  ${pc.red("✗")} ${data.error || "Failed to publish"}`);
      return false;
    }

    console.log(
      `  ${pc.green("✓")} Published ${pc.bold(data.skill.displayName)} to marketplace`,
    );
    console.log(
      `  ${pc.dim(`→ https://api2cli.dev/cli/${data.skill.name}`)}`,
    );
    return true;
  } catch {
    console.error(`  ${pc.red("✗")} Could not reach api2cli.dev`);
    return false;
  }
}

const VALID_CATEGORIES = [
  "social", "finance", "devtools", "marketing", "productivity",
  "communication", "analytics", "ai", "ecommerce", "other",
];

export const publishCommand = new Command("publish")
  .description("Publish a CLI to the api2cli marketplace")
  .argument("<app>", "CLI to publish")
  .option("--github <url>", "GitHub repo URL (e.g. user/repo)")
  .option("--category <cat>", `Category: ${VALID_CATEGORIES.join(", ")}`)
  .option("--install-command <cmd>", "Custom install command for public CLIs")
  .option("--skill-github-path <path>", "GitHub path to skill file")
  .addHelpText(
    "after",
    `\nExamples:\n  api2cli publish typefully --github user/typefully-cli --category social\n  api2cli publish dub --category marketing\n  api2cli publish vercel --github user/cli-skills --category devtools --install-command "npm i -g vercel"`,
  )
  .action(async (app: string, opts) => {
    const isPublic = !!opts.installCommand;

    if (!isPublic) {
      const cliDir = getCliDir(app);
      if (!existsSync(cliDir)) {
        console.error(`${pc.red("✗")} ${app}-cli not found.`);
        process.exit(1);
      }
    }

    let githubUrl = opts.github;

    if (!githubUrl) {
      githubUrl = await askQuestion(
        `  GitHub repo URL ${pc.dim("(e.g. user/repo)")}: `,
      );
    }

    if (!githubUrl) {
      console.log(`${pc.yellow("✗")} No GitHub URL provided. Skipped.`);
      return;
    }

    const category = opts.category?.toLowerCase();
    if (category && !VALID_CATEGORIES.includes(category)) {
      console.error(`${pc.red("✗")} Invalid category "${category}". Valid: ${VALID_CATEGORIES.join(", ")}`);
      process.exit(1);
    }

    console.log(
      `\nPublishing ${pc.bold(`${app}-cli`)} to marketplace...\n`,
    );
    await publishToMarketplace(githubUrl, category, opts.installCommand, opts.skillGithubPath);
  });
