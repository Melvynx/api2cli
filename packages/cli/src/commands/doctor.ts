import { Command } from "commander";
import { existsSync } from "fs";
import pc from "picocolors";
import { CLI_ROOT, TOKENS_DIR, TEMPLATE_DIR } from "../lib/config.js";

export const doctorCommand = new Command("doctor")
  .description("Check system requirements and configuration")
  .addHelpText("after", "\nExample:\n  api2cli doctor")
  .action(async () => {
    console.log(`\n${pc.bold("api2cli doctor")}\n`);
    let issues = 0;

    // Bun
    try {
      const proc = Bun.spawn(["bun", "--version"], { stdout: "pipe", stderr: "pipe" });
      const version = (await new Response(proc.stdout).text()).trim();
      console.log(`  ${pc.green("✓")} Bun ${version}`);
    } catch {
      console.log(`  ${pc.red("✗")} Bun not found. Install: ${pc.cyan("https://bun.sh")}`);
      issues++;
    }

    // CLI root
    if (existsSync(CLI_ROOT)) {
      console.log(`  ${pc.green("✓")} CLI root: ${pc.dim(CLI_ROOT)}`);
    } else {
      console.log(`  ${pc.yellow("~")} CLI root not yet created: ${pc.dim(CLI_ROOT)}`);
    }

    // Tokens dir
    if (existsSync(TOKENS_DIR)) {
      console.log(`  ${pc.green("✓")} Tokens dir: ${pc.dim(TOKENS_DIR)}`);
    } else {
      console.log(`  ${pc.yellow("~")} Tokens dir not yet created: ${pc.dim(TOKENS_DIR)}`);
    }

    // Template
    if (existsSync(TEMPLATE_DIR)) {
      console.log(`  ${pc.green("✓")} Template: ${pc.dim(TEMPLATE_DIR)}`);
    } else {
      console.log(`  ${pc.red("✗")} Template not found: ${pc.dim(TEMPLATE_DIR)}`);
      issues++;
    }

    console.log(
      issues === 0 ? `\n${pc.green("All good!")} 🎉\n` : `\n${pc.red(`${issues} issue(s) found.`)}\n`,
    );
  });
