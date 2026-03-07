import { existsSync, readFileSync, writeFileSync, appendFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import pc from "picocolors";

const MARKER_START = "# >>> api2cli >>>";
const MARKER_END = "# <<< api2cli <<<";

/** Detect the user's shell rc file */
function getShellRc(): string {
  const shell = process.env.SHELL ?? "";
  if (shell.includes("zsh")) return join(homedir(), ".zshrc");
  if (shell.includes("fish")) return join(homedir(), ".config", "fish", "config.fish");
  // Check if .zshrc exists even if SHELL isn't set
  const zshrc = join(homedir(), ".zshrc");
  if (existsSync(zshrc)) return zshrc;
  return join(homedir(), ".bashrc");
}

/** Add a CLI's dist directory to PATH via the shell rc file. Idempotent. */
export function addToPath(app: string, binDir: string): void {
  const rcFile = getShellRc();
  const content = existsSync(rcFile) ? readFileSync(rcFile, "utf-8") : "";
  const exportLine = `export PATH="${binDir}:$PATH"`;

  if (content.includes(exportLine)) {
    console.log(`${pc.dim(app)} already in PATH`);
    return;
  }

  if (content.includes(MARKER_START)) {
    const updated = content.replace(MARKER_END, `${exportLine}\n${MARKER_END}`);
    writeFileSync(rcFile, updated);
  } else {
    appendFileSync(rcFile, `\n${MARKER_START}\n${exportLine}\n${MARKER_END}\n`);
  }

  console.log(`${pc.green("+")} Added ${pc.bold(app)} to PATH in ${pc.dim(rcFile)}`);
  console.log(`  Run: ${pc.cyan(`source ${rcFile}`)}`);
}

/** Remove a CLI from PATH in the shell rc file */
export function removeFromPath(app: string, binDir: string): void {
  const rcFile = getShellRc();
  if (!existsSync(rcFile)) return;

  const content = readFileSync(rcFile, "utf-8");
  const exportLine = `export PATH="${binDir}:$PATH"\n`;

  if (!content.includes(exportLine)) {
    console.log(`${pc.dim(app)} not in PATH`);
    return;
  }

  writeFileSync(rcFile, content.replace(exportLine, ""));
  console.log(`${pc.red("-")} Removed ${pc.bold(app)} from PATH`);
}
