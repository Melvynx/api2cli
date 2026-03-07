import { Command } from "commander";
import { existsSync } from "fs";
import pc from "picocolors";
import { getCliDir } from "../lib/config.js";

export const installCommand = new Command("install")
  .description("Install a pre-built CLI from the registry")
  .argument("<app>", "CLI to install (e.g. typefully, dub)")
  .option("--force", "Overwrite existing CLI", false)
  .addHelpText(
    "after",
    "\nExamples:\n  api2cli install typefully\n  api2cli install dub --force",
  )
  .action(async (app: string, opts) => {
    const cliDir = getCliDir(app);

    if (existsSync(cliDir) && !opts.force) {
      console.error(`${pc.red("✗")} ${app}-cli already installed. Use ${pc.cyan("--force")} to reinstall.`);
      process.exit(1);
    }

    console.log(`Installing ${pc.bold(`${app}-cli`)} from registry...`);

    // TODO: Fetch from npm @api2cli/<app> or api2cli.dev API
    // Download resources + config -> merge with template -> build -> link
    console.log(`\n${pc.yellow("🚧")} Registry not yet available.`);
    console.log(`\nCreate it manually instead:`);
    console.log(`  ${pc.cyan(`api2cli create ${app} --docs <api-docs-url>`)}`);
  });
