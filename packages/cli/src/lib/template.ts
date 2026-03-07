import { existsSync, cpSync, readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { TEMPLATE_DIR } from "./config.js";

interface TemplateVars {
  appName: string;
  appCli: string;
  baseUrl: string;
  authType: string;
  authHeader: string;
}

/** Copy the template scaffold to a target directory */
export function copyTemplate(targetDir: string): void {
  if (!existsSync(TEMPLATE_DIR)) {
    throw new Error(`Template not found at ${TEMPLATE_DIR}. Run: api2cli doctor`);
  }
  cpSync(TEMPLATE_DIR, targetDir, { recursive: true });
}

/** Replace all {{PLACEHOLDER}} tokens in every file in a directory tree */
export function replacePlaceholders(dir: string, vars: TemplateVars): void {
  const replacements: [string, string][] = [
    ["{{APP_NAME}}", vars.appName],
    ["{{APP_CLI}}", vars.appCli],
    ["{{BASE_URL}}", vars.baseUrl],
    ["{{AUTH_TYPE}}", vars.authType],
    ["{{AUTH_HEADER}}", vars.authHeader],
  ];

  walkFiles(dir, (filePath) => {
    // Skip binary files and node_modules
    if (filePath.includes("node_modules")) return;
    const ext = filePath.split(".").pop() ?? "";
    if (!["ts", "js", "json", "md", "txt", "template"].includes(ext)) return;

    let content = readFileSync(filePath, "utf-8");
    let changed = false;

    for (const [placeholder, value] of replacements) {
      if (content.includes(placeholder)) {
        content = content.replaceAll(placeholder, value);
        changed = true;
      }
    }

    if (changed) {
      writeFileSync(filePath, content);
    }
  });
}

/** Recursively walk all files in a directory */
function walkFiles(dir: string, callback: (path: string) => void): void {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkFiles(full, callback);
    } else {
      callback(full);
    }
  }
}
