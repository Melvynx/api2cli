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
): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/publish-cli`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ githubUrl }),
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

export const publishCommand = new Command("publish")
  .description("Publish a CLI to the api2cli marketplace")
  .argument("<app>", "CLI to publish")
  .option("--github <url>", "GitHub repo URL (e.g. user/repo)")
  .addHelpText(
    "after",
    "\nExamples:\n  api2cli publish typefully --github user/typefully-cli\n  api2cli publish dub",
  )
  .action(async (app: string, opts) => {
    const cliDir = getCliDir(app);

    if (!existsSync(cliDir)) {
      console.error(`${pc.red("✗")} ${app}-cli not found.`);
      process.exit(1);
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

    console.log(
      `\nPublishing ${pc.bold(`${app}-cli`)} to marketplace...\n`,
    );
    await publishToMarketplace(githubUrl);
  });
