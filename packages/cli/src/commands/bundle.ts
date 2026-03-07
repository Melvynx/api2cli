import { Command } from "commander";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import pc from "picocolors";
import { getCliDir, getDistDir, CLI_ROOT } from "../lib/config.js";
import { readdirSync } from "fs";

export const bundleCommand = new Command("bundle")
  .description("Build/rebuild a CLI from source")
  .argument("[app]", "CLI to build (omit with --all)")
  .option("--compile", "Create standalone binary (~50MB, no runtime needed)")
  .option("--all", "Build all installed CLIs")
  .addHelpText(
    "after",
    "\nExamples:\n  api2cli bundle typefully\n  api2cli bundle typefully --compile\n  api2cli bundle --all",
  )
  .action(async (app: string | undefined, opts) => {
    if (opts.all) {
      if (!existsSync(CLI_ROOT)) {
        console.log("No CLIs installed.");
        return;
      }
      const dirs = readdirSync(CLI_ROOT).filter((d) => d.endsWith("-cli"));
      for (const d of dirs) {
        await buildCli(d.replace(/-cli$/, ""), opts.compile);
      }
      return;
    }

    if (!app) {
      console.error("Specify an app name or use --all");
      process.exit(2);
    }

    await buildCli(app, opts.compile);
  });

async function buildCli(app: string, compile?: boolean): Promise<void> {
  const cliDir = getCliDir(app);
  if (!existsSync(cliDir)) {
    console.error(`${pc.red("✗")} ${app}-cli not found. Run: ${pc.cyan(`api2cli create ${app}`)}`);
    return;
  }

  const distDir = getDistDir(app);
  mkdirSync(distDir, { recursive: true });

  console.log(`Building ${pc.bold(`${app}-cli`)}...`);

  const entry = join(cliDir, "src", "index.ts");
  const outfile = join(distDir, compile ? `${app}-cli` : `${app}-cli.js`);
  const args = ["bun", "build", entry, "--outfile", outfile, "--target", "bun"];
  if (compile) args.push("--compile");

  const proc = Bun.spawn(args, { cwd: cliDir, stdout: "pipe", stderr: "pipe" });
  const code = await proc.exited;

  if (code === 0) {
    const size = Bun.file(outfile).size;
    const sizeStr = size > 1024 * 1024
      ? `${(size / 1024 / 1024).toFixed(1)}MB`
      : `${(size / 1024).toFixed(1)}KB`;
    console.log(`${pc.green("✓")} Built ${pc.bold(`${app}-cli`)} (${sizeStr})`);
  } else {
    const stderr = await new Response(proc.stderr).text();
    console.error(`${pc.red("✗")} Build failed: ${stderr}`);
  }
}
