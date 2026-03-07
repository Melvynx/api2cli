import { homedir } from "os";
import { join } from "path";

/** Application name (replaced during api2cli create) */
export const APP_NAME = "{{APP_NAME}}";

/** CLI binary name (replaced during api2cli create) */
export const APP_CLI = "{{APP_CLI}}";

/** API base URL (replaced during api2cli create) */
export const BASE_URL = "{{BASE_URL}}";

/** Auth type: bearer | api-key | basic | custom */
export const AUTH_TYPE = "{{AUTH_TYPE}}";

/** Auth header name (e.g. Authorization, X-Api-Key) */
export const AUTH_HEADER = "{{AUTH_HEADER}}";

/** Path to the token file for this CLI */
export const TOKEN_PATH = join(homedir(), ".config", "tokens", `${APP_NAME}-cli.txt`);

/** Global state for output flags (set by root command) */
export const globalFlags = {
  json: false,
  format: "text" as "text" | "json" | "csv" | "yaml",
  verbose: false,
  noColor: false,
  noHeader: false,
};
