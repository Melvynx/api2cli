import { Command } from "commander";
import { PATHS } from "../lib/config.js";
import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

export const listCommand = new Command("list")
  .description("List all installed CLIs")
  .option("--json", "Output as JSON")
  .action((options) => {
    if (!existsSync(PATHS.cliRoot)) {
      console.log("No CLIs installed yet. Run: api2cli create <app>");
      return;
    }

    const dirs = readdirSync(PATHS.cliRoot).filter((d) => {
      const fullPath = join(PATHS.cliRoot, d);
      return statSync(fullPath).isDirectory() && d.endsWith("-cli");
    });

    if (dirs.length === 0) {
      console.log("No CLIs installed yet.");
      return;
    }

    if (options.json) {
      const clis = dirs.map((d) => {
        const name = d.replace(/-cli$/, "");
        const hasToken = existsSync(join(PATHS.tokensDir, `${d}.txt`));
        const hasDist = existsSync(join(PATHS.cliRoot, d, "dist"));
        return { name, dir: d, hasToken, built: hasDist };
      });
      console.log(JSON.stringify({ ok: true, data: clis }, null, 2));
    } else {
      console.log("Installed CLIs:\n");
      for (const d of dirs) {
        const name = d.replace(/-cli$/, "");
        const hasToken = existsSync(join(PATHS.tokensDir, `${d}.txt`));
        const hasDist = existsSync(join(PATHS.cliRoot, d, "dist"));
        const status = [
          hasDist ? "✅ built" : "⚠️  not built",
          hasToken ? "🔑 auth" : "🔒 no auth",
        ].join(" | ");
        console.log(`  ${name.padEnd(20)} ${status}`);
      }
    }
  });
