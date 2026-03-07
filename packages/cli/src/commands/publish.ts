import { Command } from "commander";
import { getCliDir } from "../lib/config.js";
import { existsSync } from "fs";

export const publishCommand = new Command("publish")
  .description("Publish a CLI to the api2cli registry")
  .argument("<app>", "Name of the CLI to publish")
  .option("--scope <scope>", "npm scope", "@api2cli")
  .action(async (app: string, options) => {
    const cliDir = getCliDir(app);

    if (!existsSync(cliDir)) {
      console.error(`${app}-cli not found.`);
      process.exit(1);
    }

    console.log(`Publishing ${app}-cli to registry...`);

    // TODO: Package resources + config, publish to npm under @api2cli/<app>
    // and register on api2cli.dev
    console.log(`\nWill publish as: ${options.scope}/${app}`);
    console.log("Registry: api2cli.dev");
    console.log("\n🚧 Publishing not yet implemented. Coming soon.");
  });
