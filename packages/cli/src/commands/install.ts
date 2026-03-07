import { Command } from "commander";
import { existsSync, mkdirSync, readdirSync, symlinkSync, unlinkSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import pc from "picocolors";
import { getCliDir, getDistDir } from "../lib/config.js";
import { addToPath } from "../lib/shell.js";

const REGISTRY_API = "https://api2cli.dev/api";

function parseGithubInput(input: string): { owner: string; repo: string } | null {
  const cleaned = input.trim().replace(/\.git$/, "").replace(/\/$/, "");

  const shortMatch = cleaned.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
  if (shortMatch) return { owner: shortMatch[1], repo: shortMatch[2] };

  const urlMatch = cleaned.match(
    /(?:https?:\/\/)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/,
  );
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2] };

  return null;
}

function getAppName(repo: string): string {
  return repo.replace(/-cli$/, "");
}

function symlinkSkill(cliDir: string, appCli: string): void {
  const skillSource = join(cliDir, "skills", appCli, "SKILL.md");
  if (!existsSync(skillSource)) return;

  const agentDirs: { name: string; path: string }[] = [
    { name: "Claude Code", path: join(homedir(), ".claude", "skills") },
    { name: "Cursor", path: join(homedir(), ".cursor", "skills") },
    { name: "OpenClaw", path: join(homedir(), ".openclaw", "workspace", "skills") },
  ];

  for (const agent of agentDirs) {
    if (!existsSync(join(agent.path, ".."))) continue;

    const skillDir = join(agent.path, appCli);
    mkdirSync(skillDir, { recursive: true });

    const target = join(skillDir, "SKILL.md");
    if (existsSync(target)) unlinkSync(target);
    symlinkSync(skillSource, target);
    console.log(`  ${pc.green("+")} Skill symlinked for ${pc.dim(agent.name)}`);
  }
}

export const installCommand = new Command("install")
  .description("Install a CLI from GitHub repo")
  .argument("<source>", "GitHub repo (owner/repo) or app name from registry")
  .option("--force", "Overwrite existing CLI", false)
  .addHelpText(
    "after",
    `
Examples:
  api2cli install Melvynx/typefully-cli
  api2cli install https://github.com/Melvynx/typefully-cli
  api2cli install typefully`,
  )
  .action(async (source: string, opts) => {
    let owner: string;
    let repo: string;

    const parsed = parseGithubInput(source);
    if (parsed) {
      owner = parsed.owner;
      repo = parsed.repo;
    } else {
      // Treat as app name - look up from registry
      console.log(`Looking up ${pc.bold(source)} in registry...`);
      try {
        const res = await fetch(`${REGISTRY_API}/skills/${source}`);
        if (!res.ok) {
          console.error(`${pc.red("✗")} ${source} not found in registry.`);
          console.error(`  Try: ${pc.cyan(`api2cli install owner/repo`)}`);
          process.exit(1);
        }
        const data = await res.json();
        const githubUrl = data.data?.githubRepo || data.githubRepo;
        if (!githubUrl) {
          console.error(`${pc.red("✗")} No GitHub repo found for ${source}.`);
          process.exit(1);
        }
        const repoParsed = parseGithubInput(githubUrl);
        if (!repoParsed) {
          console.error(`${pc.red("✗")} Invalid repo URL from registry: ${githubUrl}`);
          process.exit(1);
        }
        owner = repoParsed.owner;
        repo = repoParsed.repo;
      } catch {
        console.error(`${pc.red("✗")} Could not reach registry. Use ${pc.cyan("owner/repo")} format instead.`);
        process.exit(1);
      }
    }

    const app = getAppName(repo);
    const appCli = `${app}-cli`;
    const cliDir = getCliDir(app);

    if (existsSync(cliDir) && !opts.force) {
      console.error(`${pc.red("✗")} ${appCli} already installed at ${cliDir}`);
      console.error(`  Use ${pc.cyan("--force")} to reinstall.`);
      process.exit(1);
    }

    console.log(`\n${pc.bold("Installing")} ${pc.cyan(appCli)} from ${pc.dim(`${owner}/${repo}`)}...\n`);

    // 1. Clone repo
    mkdirSync(cliDir, { recursive: true });
    const clone = Bun.spawn(
      ["git", "clone", "--depth", "1", `https://github.com/${owner}/${repo}.git`, cliDir],
      { stdout: "ignore", stderr: "pipe" },
    );
    const cloneCode = await clone.exited;
    if (cloneCode !== 0) {
      const stderr = await new Response(clone.stderr).text();
      // If dir exists (force), remove and retry
      if (opts.force) {
        Bun.spawn(["rm", "-rf", cliDir], { stdout: "ignore", stderr: "ignore" });
        await Bun.spawn(["rm", "-rf", cliDir]).exited;
        const retry = Bun.spawn(
          ["git", "clone", "--depth", "1", `https://github.com/${owner}/${repo}.git`, cliDir],
          { stdout: "ignore", stderr: "pipe" },
        );
        const retryCode = await retry.exited;
        if (retryCode !== 0) {
          const retryErr = await new Response(retry.stderr).text();
          console.error(`${pc.red("✗")} Clone failed: ${retryErr}`);
          process.exit(1);
        }
      } else {
        console.error(`${pc.red("✗")} Clone failed: ${stderr}`);
        process.exit(1);
      }
    }
    console.log(`  ${pc.green("+")} Cloned ${pc.dim(`${owner}/${repo}`)}`);

    // 2. Install dependencies
    console.log(`  ${pc.dim("Installing dependencies...")}`);
    const install = Bun.spawn(["bun", "install"], {
      cwd: cliDir,
      stdout: "ignore",
      stderr: "pipe",
    });
    await install.exited;
    console.log(`  ${pc.green("+")} Dependencies installed`);

    // 3. Build
    const entry = join(cliDir, "src", "index.ts");
    const distDir = getDistDir(app);
    mkdirSync(distDir, { recursive: true });
    const outfile = join(distDir, `${appCli}.js`);

    const build = Bun.spawn(
      ["bun", "build", entry, "--outfile", outfile, "--target", "bun"],
      { cwd: cliDir, stdout: "ignore", stderr: "pipe" },
    );
    const buildCode = await build.exited;
    if (buildCode !== 0) {
      const stderr = await new Response(build.stderr).text();
      console.error(`${pc.red("✗")} Build failed: ${stderr}`);
      process.exit(1);
    }
    console.log(`  ${pc.green("+")} Built`);

    // 4. Link to PATH
    addToPath(app, distDir);

    // 5. Symlink skill to agent directories
    symlinkSkill(cliDir, appCli);

    console.log(`\n${pc.green("✓")} Installed ${pc.bold(appCli)}`);
    console.log(`\n${pc.bold("Next:")}`);
    console.log(`  ${pc.cyan(`${appCli} auth set "your-token"`)}`);
    console.log(`  ${pc.cyan(`${appCli} --help`)}`);
  });
