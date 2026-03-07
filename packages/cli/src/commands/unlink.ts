import { Command } from "commander";
import { getDistDir } from "../lib/config.js";
import { removeFromPath } from "../lib/shell.js";

export const unlinkCommand = new Command("unlink")
  .description("Remove a CLI from your PATH")
  .argument("<app>", "CLI to unlink")
  .addHelpText("after", "\nExample:\n  api2cli unlink typefully")
  .action((app: string) => {
    removeFromPath(app, getDistDir(app));
  });
