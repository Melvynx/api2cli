import { existsSync, cpSync, readdirSync, statSync, readFileSync, writeFileSync, rmSync, mkdtempSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { execSync } from "child_process";
import { TEMPLATE_REPO, TEMPLATE_REPO_PATH } from "./config.js";

interface TemplateVars {
  appName: string;
  appCli: string;
  baseUrl: string;
  authType: string;
  authHeader: string;
}

/** Clone the template from GitHub into a target directory */
export function copyTemplate(targetDir: string): void {
  const tmp = mkdtempSync(join(tmpdir(), "api2cli-"));
  try {
    execSync(`git clone --depth 1 --filter=blob:none --sparse ${TEMPLATE_REPO} ${tmp}/repo`, {
      stdio: "pipe",
    });
    execSync(`git -C ${tmp}/repo sparse-checkout set ${TEMPLATE_REPO_PATH}`, {
      stdio: "pipe",
    });
    const templateSrc = join(tmp, "repo", TEMPLATE_REPO_PATH);
    if (!existsSync(templateSrc)) {
      throw new Error(`Template not found in repo at ${TEMPLATE_REPO_PATH}`);
    }
    cpSync(templateSrc, targetDir, { recursive: true });
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
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
