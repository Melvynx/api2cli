import { existsSync, readFileSync, appendFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const MARKER_START = "# >>> api2cli >>>";
const MARKER_END = "# <<< api2cli <<<";

function getShellRc(): string {
  const zshrc = join(homedir(), ".zshrc");
  const bashrc = join(homedir(), ".bashrc");
  if (existsSync(zshrc)) return zshrc;
  return bashrc;
}

export function addToPath(appName: string, binDir: string): void {
  const rcFile = getShellRc();
  const content = existsSync(rcFile) ? readFileSync(rcFile, "utf-8") : "";

  const exportLine = `export PATH="${binDir}:$PATH"`;

  // Check if already linked
  if (content.includes(exportLine)) {
    console.log(`${appName} already in PATH`);
    return;
  }

  // Find or create api2cli block
  if (content.includes(MARKER_START)) {
    // Insert before the end marker
    const updated = content.replace(
      MARKER_END,
      `${exportLine}\n${MARKER_END}`
    );
    const { writeFileSync } = require("fs");
    writeFileSync(rcFile, updated);
  } else {
    appendFileSync(rcFile, `\n${MARKER_START}\n${exportLine}\n${MARKER_END}\n`);
  }

  console.log(`Added ${appName} to PATH in ${rcFile}`);
  console.log(`Run: source ${rcFile}`);
}

export function removeFromPath(appName: string, binDir: string): void {
  const rcFile = getShellRc();
  if (!existsSync(rcFile)) return;

  const content = readFileSync(rcFile, "utf-8");
  const exportLine = `export PATH="${binDir}:$PATH"`;
  const updated = content.replace(`${exportLine}\n`, "");

  const { writeFileSync } = require("fs");
  writeFileSync(rcFile, updated);
  console.log(`Removed ${appName} from PATH`);
}
