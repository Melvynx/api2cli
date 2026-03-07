import { Command } from "commander";
import { getCliDir } from "../lib/config.js";
import { existsSync } from "fs";

export const updateCommand = new Command("update")
  .description("Re-sync a CLI with upstream API changes")
  .argument("<app>", "Name of the CLI to update")
  .option("--docs <url>", "Updated API documentation URL")
  .option("--openapi <url>", "Updated OpenAPI spec URL")
  .action(async (app: string, options) => {
    const cliDir = getCliDir(app);

    if (!existsSync(cliDir)) {
      console.error(`${app}-cli not found. Run: api2cli create ${app}`);
      process.exit(1);
    }

    console.log(`Updating ${app}-cli...`);

    // TODO: Re-read API docs, diff endpoints, add new resources, update existing
    // This will be driven by the agent skill in most cases
    console.log("Update functionality will be driven by the agent skill.");
    console.log("The skill re-reads API docs, diffs endpoints, and updates resource files.");
    console.log(`\nFor now, manually update resources in: ${cliDir}/src/resources/`);
    console.log(`Then rebuild: api2cli bundle ${app}`);
  });
