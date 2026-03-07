import { homedir } from "os";
import { join } from "path";

export const PATHS = {
  /** Root directory for all generated CLIs */
  cliRoot: join(homedir(), ".cli"),
  /** Centralized token storage */
  tokensDir: join(homedir(), ".config", "tokens"),
  /** Template source (resolved at runtime) */
  templateDir: join(import.meta.dir, "..", "..", "..", "template"),
} as const;

export const CLI_CONVENTIONS = {
  /** Standard auth subcommands */
  authCommands: ["set", "show", "remove", "test"] as const,
  /** Standard CRUD actions */
  crudActions: ["list", "get", "create", "update", "delete"] as const,
  /** Default output format */
  defaultFormat: "text" as const,
  /** JSON envelope shape */
  jsonEnvelope: { ok: true, data: null, meta: null },
} as const;

export function getCliDir(appName: string): string {
  return join(PATHS.cliRoot, `${appName}-cli`);
}

export function getTokenFile(appName: string): string {
  return join(PATHS.tokensDir, `${appName}-cli.txt`);
}
