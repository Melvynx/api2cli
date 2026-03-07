import { Command } from "commander";
import { PATHS } from "../lib/config.js";
import { existsSync } from "fs";

export const doctorCommand = new Command("doctor")
  .description("Check system requirements and configuration")
  .action(async () => {
    console.log("api2cli doctor\n");
    let issues = 0;

    // Check Bun
    try {
      const proc = Bun.spawn(["bun", "--version"], { stdout: "pipe" });
      const version = await new Response(proc.stdout).text();
      console.log(`  ✅ Bun ${version.trim()}`);
    } catch {
      console.log("  ❌ Bun not found. Install: https://bun.sh");
      issues++;
    }

    // Check ~/.cli directory
    if (existsSync(PATHS.cliRoot)) {
      console.log(`  ✅ CLI root: ${PATHS.cliRoot}`);
    } else {
      console.log(`  ⚠️  CLI root not created yet: ${PATHS.cliRoot}`);
    }

    // Check tokens dir
    if (existsSync(PATHS.tokensDir)) {
      console.log(`  ✅ Tokens dir: ${PATHS.tokensDir}`);
    } else {
      console.log(`  ⚠️  Tokens dir not created yet: ${PATHS.tokensDir}`);
    }

    // Check template
    if (existsSync(PATHS.templateDir)) {
      console.log(`  ✅ Template found: ${PATHS.templateDir}`);
    } else {
      console.log(`  ❌ Template not found: ${PATHS.templateDir}`);
      issues++;
    }

    console.log(issues === 0 ? "\nAll good! 🎉" : `\n${issues} issue(s) found.`);
  });
