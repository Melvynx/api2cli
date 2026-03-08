import { Command } from "commander";
import { existsSync, mkdirSync, renameSync } from "fs";
import { join } from "path";
import pc from "picocolors";
import { createInterface } from "readline";
import {
  getCliDir,
  getPublishPreference,
  setPublishPreference,
} from "../lib/config.js";
import { copyTemplate, replacePlaceholders } from "../lib/template.js";
import { publishToMarketplace } from "./publish.js";

function askQuestion(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function createGithubRepo(
  app: string,
  cliDir: string,
): Promise<string | null> {
  const repoName = `${app}-cli`;
  const env = { ...process.env, PATH: `/usr/local/bin:/opt/homebrew/bin:${process.env.PATH || ""}` };

  // git init + initial commit
  console.log(`  ${pc.dim("Initializing git repo...")}`);
  const gitInit = Bun.spawnSync(["git", "init"], {
    cwd: cliDir,
    stdout: "ignore",
    stderr: "ignore",
    env,
  });
  if (gitInit.exitCode !== 0) {
    console.error(`  ${pc.red("✗")} Failed to init git repo`);
    return null;
  }

  Bun.spawnSync(["git", "add", "."], { cwd: cliDir, stdout: "ignore", stderr: "ignore", env });
  Bun.spawnSync(["git", "commit", "-m", "Initial commit"], {
    cwd: cliDir,
    stdout: "ignore",
    stderr: "ignore",
    env,
  });

  // Find gh CLI path
  const whichGh = Bun.spawnSync(["which", "gh"], {
    stdout: "pipe",
    stderr: "ignore",
    env: { ...process.env, PATH: `/usr/local/bin:/opt/homebrew/bin:${process.env.PATH || ""}` },
  });
  const ghPath = whichGh.stdout.toString().trim();

  if (!ghPath || whichGh.exitCode !== 0) {
    console.error(
      `  ${pc.red("✗")} GitHub CLI (gh) not found. Install it: ${pc.cyan("brew install gh")}`,
    );
    return null;
  }

  // Create GitHub repo with gh CLI
  console.log(`  ${pc.dim("Creating GitHub repo...")}`);
  const ghCreate = Bun.spawnSync(
    [ghPath, "repo", "create", repoName, "--public", "--source", ".", "--push"],
    { cwd: cliDir, stdout: "pipe", stderr: "pipe" },
  );

  if (ghCreate.exitCode !== 0) {
    const stderr = ghCreate.stderr.toString().trim();
    if (stderr.includes("not logged")) {
      console.error(
        `  ${pc.red("✗")} Not logged in to GitHub. Run: ${pc.cyan("gh auth login")}`,
      );
    } else {
      console.error(`  ${pc.red("✗")} Failed to create repo: ${stderr}`);
    }
    return null;
  }

  // Extract repo URL from gh output
  const output = ghCreate.stdout.toString().trim();
  const urlMatch = output.match(/https:\/\/github\.com\/[^\s]+/);
  if (urlMatch) return urlMatch[0];

  // Fallback: get from git remote
  const remote = Bun.spawnSync(["git", "remote", "get-url", "origin"], {
    cwd: cliDir,
    stdout: "pipe",
    env,
  });
  const remoteUrl = remote.stdout.toString().trim();
  if (remoteUrl) return remoteUrl;

  return null;
}

async function promptPublish(app: string, cliDir: string): Promise<void> {
  const pref = getPublishPreference();

  if (pref === "never") return;

  console.log(`\n${pc.bold("Marketplace")}`);

  if (pref === "ask") {
    const answer = await askQuestion(
      `  Share ${pc.cyan(`${app}-cli`)} on the marketplace? ${pc.dim("[y]es / [n]o / [a]lways / n[e]ver")}: `,
    );

    if (answer === "n" || answer === "no") return;

    if (answer === "e" || answer === "never") {
      setPublishPreference("never");
      console.log(
        `  ${pc.dim("Saved. Won't ask again. Change with: api2cli publish <app>")}`,
      );
      return;
    }

    if (answer === "a" || answer === "always") {
      setPublishPreference("always");
      console.log(`  ${pc.dim("Saved. Will always publish automatically.")}`);
    } else if (answer !== "y" && answer !== "yes") {
      return;
    }
  }

  // Create GitHub repo, push, and publish
  const githubUrl = await createGithubRepo(app, cliDir);

  if (!githubUrl) {
    console.log(
      `  ${pc.dim("Publish later with:")} ${pc.cyan(`api2cli publish ${app}`)}`,
    );
    return;
  }

  console.log(`  ${pc.green("+")} Pushed to ${pc.cyan(githubUrl)}`);
  await publishToMarketplace(githubUrl);
}

export const createCommand = new Command("create")
  .description("Generate a new CLI from API documentation")
  .argument("<app>", "API/app name (e.g. typefully, dub, mercury)")
  .option("--docs <url>", "URL to API documentation")
  .option("--openapi <url>", "URL to OpenAPI/Swagger spec")
  .option("--base-url <url>", "API base URL", "https://api.example.com")
  .option("--auth-type <type>", "Auth type: bearer, api-key, basic, custom", "bearer")
  .option("--auth-header <name>", "Auth header name", "Authorization")
  .option("--force", "Overwrite existing CLI", false)
  .addHelpText(
    "after",
    `
Examples:
  api2cli create typefully --base-url https://api.typefully.com --auth-type bearer
  api2cli create dub --openapi https://api.dub.co/openapi.json
  api2cli create my-api --docs https://docs.example.com/api`,
  )
  .action(async (app: string, opts) => {
    const cliDir = getCliDir(app);

    if (existsSync(cliDir) && !opts.force) {
      console.error(`${pc.red("✗")} ${app}-cli already exists at ${cliDir}`);
      console.error(`  Use ${pc.cyan("--force")} to overwrite.`);
      process.exit(1);
    }

    console.log(`\n${pc.bold("Creating")} ${pc.cyan(`${app}-cli`)}...\n`);

    // 1. Create target directory
    mkdirSync(cliDir, { recursive: true });
    console.log(`  ${pc.green("+")} Created ${pc.dim(cliDir)}`);

    // 2. Copy template
    copyTemplate(cliDir);
    console.log(`  ${pc.green("+")} Copied template scaffold`);

    // 3. Replace placeholders
    replacePlaceholders(cliDir, {
      appName: app,
      appCli: `${app}-cli`,
      baseUrl: opts.baseUrl,
      authType: opts.authType,
      authHeader: opts.authHeader,
    });
    console.log(`  ${pc.green("+")} Configured for ${pc.bold(app)}`);

    // 4. Install dependencies
    console.log(`  ${pc.dim("Installing dependencies...")}`);
    const bunPath = process.execPath;
    const install = Bun.spawn([bunPath, "install"], {
      cwd: cliDir,
      stdout: "ignore",
      stderr: "pipe",
    });
    await install.exited;
    console.log(`  ${pc.green("+")} Dependencies installed`);

    // 5. Move skill template into skills/<app>-cli/SKILL.md
    const skillTemplate = join(cliDir, "skills", "SKILL.md.template");
    if (existsSync(skillTemplate)) {
      const skillDir = join(cliDir, "skills", `${app}-cli`);
      mkdirSync(skillDir, { recursive: true });
      renameSync(skillTemplate, join(skillDir, "SKILL.md"));
    }

    // 6. Rename README.md.template
    const readmeTemplate = join(cliDir, "README.md.template");
    if (existsSync(readmeTemplate)) {
      renameSync(readmeTemplate, join(cliDir, "README.md"));
    }

    console.log(`\n${pc.green("✓")} Created ${pc.bold(`${app}-cli`)} at ${pc.dim(cliDir)}`);
    console.log(`\n${pc.bold("Next steps:")}`);
    console.log(`  1. Edit resources in ${pc.dim(`${cliDir}/src/resources/`)}`);
    console.log(`  2. Build: ${pc.cyan(`npx api2cli bundle ${app}`)}`);
    console.log(`  3. Link: ${pc.cyan(`npx api2cli link ${app}`)}`);
    console.log(`  4. Auth: ${pc.cyan(`${app}-cli auth set "your-token"`)}`);

    // Prompt to publish on marketplace
    await promptPublish(app, cliDir);
  });
