import { Command } from "commander";
import { PATHS } from "../lib/config.js";
import { existsSync, readdirSync, readFileSync } from "fs";

export const tokensCommand = new Command("tokens")
  .description("List all configured API tokens")
  .option("--show", "Show full tokens (not masked)")
  .action((options) => {
    if (!existsSync(PATHS.tokensDir)) {
      console.log("No tokens configured yet.");
      return;
    }

    const files = readdirSync(PATHS.tokensDir).filter((f) => f.endsWith(".txt"));

    if (files.length === 0) {
      console.log("No tokens configured yet.");
      return;
    }

    console.log("Configured tokens:\n");
    for (const f of files) {
      const name = f.replace(".txt", "");
      const token = readFileSync(`${PATHS.tokensDir}/${f}`, "utf-8").trim();
      const display = options.show
        ? token
        : token.length > 8
          ? `${token.slice(0, 4)}...${token.slice(-4)}`
          : "****";
      console.log(`  ${name.padEnd(25)} ${display}`);
    }
  });
