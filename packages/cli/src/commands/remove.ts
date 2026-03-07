import { Command } from "commander";
import { existsSync, rmSync } from "fs";
import pc from "picocolors";
import { getCliDir, getTokenFile, getDistDir } from "../lib/config.js";
import { removeFromPath } from "../lib/shell.js";

export const removeCommand = new Command("remove")
  .description("Remove a CLI entirely")
  .argument("<app>", "CLI to remove")
  .option("--keep-token", "Keep the auth token")
  .addHelpText("after", "\nExamples:\n  api2cli remove typefully\n  api2cli remove typefully --keep-token")
  .action((app: string, opts) => {
    const cliDir = getCliDir(app);

    if (!existsSync(cliDir)) {
      console.error(`${pc.red("✗")} ${app}-cli not found.`);
      process.exit(1);
    }

    // Remove from PATH
    removeFromPath(app, getDistDir(app));

    // Remove directory
    rmSync(cliDir, { recursive: true, force: true });
    console.log(`${pc.green("✓")} Removed ${pc.bold(`${app}-cli`)}`);

    // Remove token unless --keep-token
    if (!opts.keepToken) {
      const tokenFile = getTokenFile(app);
      if (existsSync(tokenFile)) {
        rmSync(tokenFile);
        console.log(`${pc.green("✓")} Removed token`);
      }
    }
  });
