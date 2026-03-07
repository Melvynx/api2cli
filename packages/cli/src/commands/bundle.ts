import { Command } from "commander";
import { getCliDir } from "../lib/config.js";
import { existsSync } from "fs";
import { join } from "path";

export const bundleCommand = new Command("bundle")
  .description("Build/rebuild a CLI from source")
  .argument("<app>", "Name of the CLI to build")
  .option("--compile", "Create standalone binary (larger, no runtime needed)")
  .action(async (app: string, options) => {
    const cliDir = getCliDir(app);

    if (!existsSync(cliDir)) {
      console.error(`${app}-cli not found. Run: api2cli create ${app}`);
      process.exit(1);
    }

    console.log(`Building ${app}-cli...`);

    // Install deps
    const install = Bun.spawn(["bun", "install"], { cwd: cliDir, stdout: "inherit", stderr: "inherit" });
    await install.exited;

    // Build
    const entrypoint = join(cliDir, "src", "index.ts");
    const outfile = join(cliDir, "dist", `${app}-cli${options.compile ? "" : ".js"}`);

    const args = ["bun", "build", entrypoint, "--outfile", outfile, "--target", "bun"];
    if (options.compile) args.push("--compile");

    const build = Bun.spawn(args, { cwd: cliDir, stdout: "inherit", stderr: "inherit" });
    const exitCode = await build.exited;

    if (exitCode === 0) {
      console.log(`\n✅ Built ${app}-cli -> ${outfile}`);
      if (!options.compile) {
        console.log(`Size: ${(Bun.file(outfile).size / 1024).toFixed(1)}KB`);
      }
    } else {
      console.error(`\n❌ Build failed`);
      process.exit(1);
    }
  });
