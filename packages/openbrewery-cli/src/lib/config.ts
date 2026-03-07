import { homedir } from "os";
import { join } from "path";

export const APP_NAME = "openbrewery";
export const APP_CLI = "openbrewery-cli";
export const BASE_URL = "https://api.openbrewerydb.org/v1";

/** Auth type: none = no API key required (Open Brewery DB is public) */
export const AUTH_TYPE = "none";
export const AUTH_HEADER = "Authorization";

export const TOKEN_PATH = join(homedir(), ".config", "tokens", "openbrewery-cli.txt");

export const globalFlags = {
  json: false,
  format: "text" as "text" | "json" | "csv" | "yaml",
  verbose: false,
  noColor: false,
  noHeader: false,
};
