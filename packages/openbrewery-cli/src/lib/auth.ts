import { existsSync, readFileSync, writeFileSync, unlinkSync, mkdirSync, chmodSync } from "fs";
import { dirname } from "path";
import { TOKEN_PATH, AUTH_TYPE, AUTH_HEADER, APP_CLI } from "./config.js";
import { CliError } from "./errors.js";

export function hasToken(): boolean {
  return existsSync(TOKEN_PATH);
}

export function getToken(): string {
  if (!hasToken()) {
    throw new CliError(2, "No token configured.", `Run: ${APP_CLI} auth set <token>`);
  }
  return readFileSync(TOKEN_PATH, "utf-8").trim();
}

export function setToken(token: string): void {
  mkdirSync(dirname(TOKEN_PATH), { recursive: true });
  writeFileSync(TOKEN_PATH, token.trim(), { mode: 0o600 });
  chmodSync(TOKEN_PATH, 0o600);
}

export function removeToken(): void {
  if (existsSync(TOKEN_PATH)) {
    unlinkSync(TOKEN_PATH);
  }
}

export function maskToken(token: string): string {
  if (token.length <= 8) return "****";
  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}

/** Build auth headers. Returns {} for Open Brewery DB (no auth required). */
export function buildAuthHeaders(): Record<string, string> {
  if (AUTH_TYPE === "none") return {};
  const token = getToken();
  switch (AUTH_TYPE) {
    case "bearer":
      return { [AUTH_HEADER]: `Bearer ${token}` };
    case "api-key":
      return { [AUTH_HEADER]: token };
    case "basic":
      return { Authorization: `Basic ${Buffer.from(token).toString("base64")}` };
    default:
      return { [AUTH_HEADER]: token };
  }
}
