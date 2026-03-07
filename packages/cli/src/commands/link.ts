import { Command } from "commander";
import { getCliDir, PATHS } from "../lib/config.js";
import { addToPath } from "../lib/bashrc.js";
import { existsSync, readdirSync } from "fs";
import { join } from "path";

export const linkCommand = new Command("link")
  .description("Add a CLI to your PATH")
  .argument("[app]", "Name of the CLI to link (omit for --all)")
  .option("--all", "Link all installed CLIs")
  .action((app: string | undefined, options) => {
    if (options.all || !app) {
      if (!existsSync(PATHS.cliRoot)) {
        console.log("No CLIs installed.");
        return;
      }
      const dirs = readdirSync(PATHS.cliRoot).filter((d) => d.endsWith("-cli"));
      for (const d of dirs) {
        const name = d.replace(/-cli$/, "");
        addToPath(name, join(PATHS.cliRoot, d, "dist"));
      }
      return;
    }

    const cliDir = getCliDir(app);
    if (!existsSync(cliDir)) {
      console.error(`${app}-cli not found. Run: api2cli create ${app}`);
      process.exit(1);
    }

    addToPath(app, join(cliDir, "dist"));
  });
