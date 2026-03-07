import { Command } from "commander";
import { existsSync, readdirSync, readFileSync } from "fs";
import pc from "picocolors";
import { TOKENS_DIR } from "../lib/config.js";
import { join } from "path";

export const tokensCommand = new Command("tokens")
  .description("List all configured API tokens")
  .option("--show", "Show full unmasked tokens")
  .addHelpText("after", "\nExamples:\n  api2cli tokens\n  api2cli tokens --show")
  .action((opts) => {
    if (!existsSync(TOKENS_DIR)) {
      console.log("No tokens configured yet.");
      return;
    }

    const files = readdirSync(TOKENS_DIR).filter((f) => f.endsWith(".txt"));
    if (files.length === 0) {
      console.log("No tokens configured yet.");
      return;
    }

    console.log(`\n${pc.bold("Configured tokens:")}\n`);
    for (const f of files) {
      const name = f.replace(".txt", "");
      const token = readFileSync(join(TOKENS_DIR, f), "utf-8").trim();
      const display = opts.show
        ? token
        : token.length > 8
          ? `${token.slice(0, 4)}${pc.dim("...")}${token.slice(-4)}`
          : pc.dim("****");
      console.log(`  ${pc.bold(name.padEnd(25))} ${display}`);
    }
    console.log();
  });
