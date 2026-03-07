import { Command } from "commander";
import { existsSync, readdirSync } from "fs";
import pc from "picocolors";
import { getCliDir, getDistDir, CLI_ROOT } from "../lib/config.js";
import { addToPath } from "../lib/shell.js";

export const linkCommand = new Command("link")
  .description("Add a CLI to your PATH")
  .argument("[app]", "CLI to link (omit with --all)")
  .option("--all", "Link all installed CLIs")
  .addHelpText("after", "\nExamples:\n  api2cli link typefully\n  api2cli link --all")
  .action((app: string | undefined, opts) => {
    if (opts.all || !app) {
      if (!existsSync(CLI_ROOT)) {
        console.log("No CLIs installed.");
        return;
      }
      const dirs = readdirSync(CLI_ROOT).filter((d) => d.endsWith("-cli"));
      for (const d of dirs) {
        const name = d.replace(/-cli$/, "");
        addToPath(name, getDistDir(name));
      }
      return;
    }

    if (!existsSync(getCliDir(app))) {
      console.error(`${pc.red("✗")} ${app}-cli not found. Run: ${pc.cyan(`api2cli create ${app}`)}`);
      process.exit(1);
    }

    addToPath(app, getDistDir(app));
  });
