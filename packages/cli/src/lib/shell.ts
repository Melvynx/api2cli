import { existsSync, readFileSync, writeFileSync, appendFileSync, symlinkSync, unlinkSync, chmodSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import pc from "picocolors";

const BIN_DIR = join(homedir(), ".local", "bin");
const MARKER_START = "# >>> api2cli >>>";
const MARKER_END = "# <<< api2cli <<<";

/** Detect the user's shell rc file */
function getShellRc(): string {
  const shell = process.env.SHELL ?? "";
  if (shell.includes("zsh")) return join(homedir(), ".zshrc");
  if (shell.includes("fish")) return join(homedir(), ".config", "fish", "config.fish");
  const zshrc = join(homedir(), ".zshrc");
  if (existsSync(zshrc)) return zshrc;
  return join(homedir(), ".bashrc");
}

/** Ensure ~/.local/bin is in PATH via shell rc */
function ensureBinInPath(): void {
  const rcFile = getShellRc();
  const content = existsSync(rcFile) ? readFileSync(rcFile, "utf-8") : "";
  const exportLine = `export PATH="${BIN_DIR}:$PATH"`;

  if (content.includes(BIN_DIR)) return;

  if (content.includes(MARKER_START)) {
    const updated = content.replace(MARKER_END, `${exportLine}\n${MARKER_END}`);
    writeFileSync(rcFile, updated);
  } else {
    appendFileSync(rcFile, `\n${MARKER_START}\n${exportLine}\n${MARKER_END}\n`);
  }
}

/** Add a CLI by symlinking its built file to ~/.local/bin/<app>-cli */
export function addToPath(app: string, distDir: string): void {
  const { mkdirSync } = require("fs");
  mkdirSync(BIN_DIR, { recursive: true });

  const target = join(distDir, `${app}-cli.js`);
  const linkPath = join(BIN_DIR, `${app}-cli`);

  if (!existsSync(target)) {
    console.error(`${pc.red("✗")} Built file not found: ${target}`);
    console.error(`  Run: ${pc.cyan(`npx api2cli bundle ${app}`)}`);
    process.exit(1);
  }

  // Make the JS file executable
  chmodSync(target, 0o755);

  // Remove existing symlink
  if (existsSync(linkPath)) {
    unlinkSync(linkPath);
  }

  symlinkSync(target, linkPath);
  ensureBinInPath();

  console.log(`${pc.green("+")} Linked ${pc.bold(`${app}-cli`)} -> ${pc.dim(linkPath)}`);
}

/** Remove a CLI symlink from ~/.local/bin */
export function removeFromPath(app: string, _distDir: string): void {
  const linkPath = join(BIN_DIR, `${app}-cli`);

  if (!existsSync(linkPath)) {
    console.log(`${pc.dim(app)} not linked`);
    return;
  }

  unlinkSync(linkPath);
  console.log(`${pc.red("-")} Unlinked ${pc.bold(`${app}-cli`)}`);
}
