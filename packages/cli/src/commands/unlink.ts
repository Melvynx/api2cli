import { Command } from "commander";
import { getCliDir } from "../lib/config.js";
import { removeFromPath } from "../lib/bashrc.js";
import { join } from "path";

export const unlinkCommand = new Command("unlink")
  .description("Remove a CLI from your PATH")
  .argument("<app>", "Name of the CLI to unlink")
  .action((app: string) => {
    const cliDir = getCliDir(app);
    removeFromPath(app, join(cliDir, "dist"));
  });
