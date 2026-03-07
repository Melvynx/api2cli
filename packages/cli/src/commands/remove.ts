import { Command } from "commander";
import { getCliDir, getTokenFile } from "../lib/config.js";
import { removeFromPath } from "../lib/bashrc.js";
import { existsSync, rmSync } from "fs";
import { join } from "path";

export const removeCommand = new Command("remove")
  .description("Remove a CLI entirely")
  .argument("<app>", "Name of the CLI to remove")
  .option("--keep-token", "Keep the auth token")
  .action((app: string, options) => {
    const cliDir = getCliDir(app);

    if (!existsSync(cliDir)) {
      console.error(`${app}-cli not found.`);
      process.exit(1);
    }

    // Unlink from PATH
    removeFromPath(app, join(cliDir, "dist"));

    // Remove CLI directory
    rmSync(cliDir, { recursive: true, force: true });
    console.log(`Removed ${app}-cli`);

    // Remove token unless --keep-token
    if (!options.keepToken) {
      const tokenFile = getTokenFile(app);
      if (existsSync(tokenFile)) {
        rmSync(tokenFile);
        console.log(`Removed token for ${app}-cli`);
      }
    }
  });
