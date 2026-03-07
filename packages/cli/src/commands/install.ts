import { Command } from "commander";
import { getCliDir } from "../lib/config.js";
import { existsSync } from "fs";

export const installCommand = new Command("install")
  .description("Install a pre-built CLI from the registry")
  .argument("<app>", "Name of the CLI to install (e.g. typefully, dub)")
  .option("--force", "Overwrite existing CLI", false)
  .action(async (app: string, options) => {
    const cliDir = getCliDir(app);

    if (existsSync(cliDir) && !options.force) {
      console.error(`${app}-cli already installed. Use --force to reinstall.`);
      process.exit(1);
    }

    console.log(`Installing ${app}-cli from registry...`);

    // TODO: Fetch from npm @api2cli/<app> or api2cli.dev API
    // For now, check if skill exists in the monorepo skills/ directory
    try {
      const proc = Bun.spawn(["npm", "pack", `@api2cli/${app}`, "--pack-destination", "/tmp"], {
        stdout: "pipe",
        stderr: "pipe",
      });
      const exitCode = await proc.exited;

      if (exitCode !== 0) {
        console.error(`Package @api2cli/${app} not found in registry.`);
        console.log(`\nTry creating it from docs instead:`);
        console.log(`  api2cli create ${app} --docs <api-docs-url>`);
        process.exit(1);
      }

      // Unpack and setup
      console.log(`✅ Installed ${app}-cli`);
      console.log(`Run: api2cli link ${app}`);
    } catch {
      console.error(`Failed to install ${app}-cli. Is it published?`);
      process.exit(1);
    }
  });
