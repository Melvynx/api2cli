import { Command } from "commander";
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "fs";
import { dirname } from "path";
import { getTokenPath, getClient } from "../lib/client.js";

export const authCommand = new Command("auth")
  .description("Manage API authentication");

authCommand
  .command("set")
  .description("Save your API token")
  .argument("<token>", "Your API token")
  .action((token: string) => {
    const tokenPath = getTokenPath();
    mkdirSync(dirname(tokenPath), { recursive: true });
    writeFileSync(tokenPath, token.trim());
    console.log("✅ Token saved");
  });

authCommand
  .command("show")
  .description("Display current token (masked)")
  .option("--raw", "Show full token")
  .action((options) => {
    const tokenPath = getTokenPath();
    if (!existsSync(tokenPath)) {
      console.log("No token configured. Run: {{APP_CLI}} auth set <token>");
      return;
    }
    const token = readFileSync(tokenPath, "utf-8").trim();
    if (options.raw) {
      console.log(token);
    } else {
      const masked = token.length > 8
        ? `${token.slice(0, 4)}...${token.slice(-4)}`
        : "****";
      console.log(`Token: ${masked}`);
    }
  });

authCommand
  .command("remove")
  .description("Delete saved token")
  .action(() => {
    const tokenPath = getTokenPath();
    if (existsSync(tokenPath)) {
      rmSync(tokenPath);
      console.log("✅ Token removed");
    } else {
      console.log("No token to remove.");
    }
  });

authCommand
  .command("test")
  .description("Verify token works by making a test API call")
  .action(async () => {
    try {
      const client = getClient();
      // Override this in your CLI to hit a real endpoint
      const res = await client.get("/");
      console.log("✅ Token is valid");
    } catch (err: any) {
      console.error(`❌ Auth failed: ${err.message}`);
      process.exit(1);
    }
  });
