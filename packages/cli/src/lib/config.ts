import { homedir } from "os";
import { join, resolve } from "path";

/** Root directory for all generated CLIs */
export const CLI_ROOT = join(homedir(), ".cli");

/** Centralized token storage directory */
export const TOKENS_DIR = join(homedir(), ".config", "tokens");

/** Template directory (relative to this package in the monorepo) */
export const TEMPLATE_DIR = resolve(import.meta.dir, "..", "..", "..", "template");

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
