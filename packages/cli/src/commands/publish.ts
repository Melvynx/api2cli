import { Command } from "commander";
import { existsSync } from "fs";
import pc from "picocolors";
import { getCliDir } from "../lib/config.js";

export const publishCommand = new Command("publish")
  .description("Publish a CLI to the api2cli registry")
  .argument("<app>", "CLI to publish")
  .option("--scope <scope>", "npm scope", "@api2cli")
  .addHelpText("after", "\nExample:\n  api2cli publish typefully")
  .action(async (app: string, opts) => {
    const cliDir = getCliDir(app);

    if (!existsSync(cliDir)) {
      console.error(`${pc.red("✗")} ${app}-cli not found.`);
      process.exit(1);
    }

    // TODO: Package resources + config, publish to npm + api2cli.dev
    console.log(`Publishing ${pc.bold(`${app}-cli`)} as ${pc.cyan(`${opts.scope}/${app}`)}...`);
    console.log(`\n${pc.yellow("🚧")} Publishing not yet implemented.`);
  });
