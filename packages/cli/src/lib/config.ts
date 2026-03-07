import { homedir } from "os";
import { join, resolve } from "path";

/** Root directory for all generated CLIs */
export const CLI_ROOT = join(homedir(), ".cli");

/** Centralized token storage directory */
export const TOKENS_DIR = join(homedir(), ".config", "tokens");

/** GitHub repo for fetching the template */
export const TEMPLATE_REPO = "https://github.com/Melvynx/api2cli.git";

/** Path to template within the repo */
export const TEMPLATE_REPO_PATH = "packages/template";

/** Placeholders used in the template that get replaced during create */
export const PLACEHOLDERS = [
  "{{APP_NAME}}",
  "{{APP_CLI}}",
  "{{BASE_URL}}",
  "{{AUTH_TYPE}}",
  "{{AUTH_HEADER}}",
] as const;

/** Get the installation directory for a CLI */
export function getCliDir(app: string): string {
  return join(CLI_ROOT, `${app}-cli`);
}

/** Get the token file path for a CLI */
export function getTokenFile(app: string): string {
  return join(TOKENS_DIR, `${app}-cli.txt`);
}

/** Get the dist directory for a CLI */
export function getDistDir(app: string): string {
  return join(getCliDir(app), "dist");
}
