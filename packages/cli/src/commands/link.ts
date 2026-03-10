import { Command } from "commander";
import { existsSync, mkdirSync, readdirSync, symlinkSync, unlinkSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import pc from "picocolors";
import { getCliDir, getDistDir, CLI_ROOT } from "../lib/config.js";
import { addToPath } from "../lib/shell.js";
import { AGENT_DIRS } from "../lib/agents.js";

function linkSkill(app: string, skillsPath: string): void {
  const cliDir = getCliDir(app);
  const skillSource = join(cliDir, "skills", `${app}-cli`, "SKILL.md");

  if (!existsSync(skillSource)) {
    console.log(`  ${pc.dim("No SKILL.md found for")} ${app}-cli${pc.dim(", skipping skill link")}`);
    return;
  }

  const targetDir = join(skillsPath, `${app}-cli`);
  mkdirSync(targetDir, { recursive: true });

  const targetLink = join(targetDir, "SKILL.md");
  if (existsSync(targetLink)) unlinkSync(targetLink);
  symlinkSync(skillSource, targetLink);

  console.log(`${pc.green("+")} Skill linked ${pc.bold(`${app}-cli`)} -> ${pc.dim(targetLink)}`);
}

export const linkCommand = new Command("link")
  .description("Add a CLI to your PATH (and optionally link skills to agent directories)")
  .argument("[app]", "CLI to link (omit with --all)")
  .option("--all", "Link all installed CLIs")
  .option("--openclaw", "Also symlink skill to ~/.openclaw/workspace/skills/")
  .option("--skills-path <path>", "Custom path to symlink the skill into")
  .addHelpText("after", `
Examples:
  api2cli link typefully
  api2cli link typefully --openclaw
  api2cli link typefully --skills-path ~/.openclaw/workspace/skills
  api2cli link --all --openclaw`)
  .action((app: string | undefined, opts) => {
    const skillsPaths: string[] = [];
    if (opts.openclaw) {
      const openclaw = AGENT_DIRS.find((a) => a.name === "OpenClaw");
      if (openclaw) skillsPaths.push(openclaw.path);
    }
    if (opts.skillsPath) skillsPaths.push(opts.skillsPath.replace(/^~/, homedir()));

    if (opts.all || !app) {
      if (!existsSync(CLI_ROOT)) {
        console.log("No CLIs installed.");
        return;
      }
      const dirs = readdirSync(CLI_ROOT).filter((d) => d.endsWith("-cli"));
      for (const d of dirs) {
        const name = d.replace(/-cli$/, "");
        addToPath(name, getDistDir(name));
        for (const sp of skillsPaths) linkSkill(name, sp);
      }
      return;
    }

    if (!existsSync(getCliDir(app))) {
      console.error(`${pc.red("✗")} ${app}-cli not found. Run: ${pc.cyan(`api2cli create ${app}`)}`);
      process.exit(1);
    }

    addToPath(app, getDistDir(app));
    for (const sp of skillsPaths) linkSkill(app, sp);
  });
