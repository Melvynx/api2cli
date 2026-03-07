import { Command } from "commander";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import pc from "picocolors";
import { getCliDir } from "../lib/config.js";
import { copyTemplate, replacePlaceholders } from "../lib/template.js";

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
    const install = Bun.spawn(["bun", "install"], {
      cwd: cliDir,
      stdout: "ignore",
      stderr: "pipe",
    });
    await install.exited;
    console.log(`  ${pc.green("+")} Dependencies installed`);

    // 5. Rename SKILL.md.template
    const skillTemplate = join(cliDir, "SKILL.md.template");
    const skillTarget = join(cliDir, "SKILL.md");
    if (existsSync(skillTemplate)) {
      const { renameSync } = require("fs");
      renameSync(skillTemplate, skillTarget);
    }

    console.log(`\n${pc.green("✓")} Created ${pc.bold(`${app}-cli`)} at ${pc.dim(cliDir)}`);
    console.log(`\n${pc.bold("Next steps:")}`);
    console.log(`  1. Edit resources in ${pc.dim(`${cliDir}/src/resources/`)}`);
    console.log(`  2. Build: ${pc.cyan(`api2cli bundle ${app}`)}`);
    console.log(`  3. Link: ${pc.cyan(`api2cli link ${app}`)}`);
    console.log(`  4. Auth: ${pc.cyan(`${app}-cli auth set "your-token"`)}`);
  });
