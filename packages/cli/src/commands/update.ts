import { Command } from "commander";
import { existsSync } from "fs";
import pc from "picocolors";
import { getCliDir } from "../lib/config.js";

export const updateCommand = new Command("update")
  .description("Re-sync a CLI when the upstream API changes")
  .argument("<app>", "CLI to update")
  .option("--docs <url>", "Updated API documentation URL")
  .option("--openapi <url>", "Updated OpenAPI spec URL")
  .addHelpText("after", "\nExample:\n  api2cli update typefully --docs https://docs.typefully.com")
  .action(async (app: string) => {
    const cliDir = getCliDir(app);

    if (!existsSync(cliDir)) {
      console.error(`${pc.red("✗")} ${app}-cli not found. Run: ${pc.cyan(`api2cli create ${app}`)}`);
      process.exit(1);
    }

    // TODO: Agent-driven update flow
    // Re-read API docs -> diff endpoints -> add/update resources -> rebuild
    console.log(`${pc.yellow("🚧")} Update is agent-driven.`);
    console.log(`\nUse your AI agent to update resources in:`);
    console.log(`  ${pc.dim(`${cliDir}/src/resources/`)}`);
    console.log(`\nThen rebuild: ${pc.cyan(`api2cli bundle ${app}`)}`);
  });
