import { homedir } from "os";
import { join } from "path";
import { existsSync, readFileSync } from "fs";

const APP_NAME = "{{APP_NAME}}";
const BASE_URL = "{{BASE_URL}}";
const AUTH_TYPE = "{{AUTH_TYPE}}"; // bearer | api-key | basic
const AUTH_HEADER = "{{AUTH_HEADER}}"; // Authorization | X-Api-Key | etc.

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // exponential backoff

export function getTokenPath(): string {
  return join(homedir(), ".config", "tokens", `${APP_NAME}-cli.txt`);
}

function getToken(): string {
  const tokenPath = getTokenPath();
  if (!existsSync(tokenPath)) {
    console.error(`No token configured. Run: ${APP_NAME}-cli auth set <token>`);
    process.exit(1);
  }
  return readFileSync(tokenPath, "utf-8").trim();
}

function buildAuthHeader(): Record<string, string> {
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

async function request(
  method: string,
  path: string,
  options: { body?: any; params?: Record<string, string> } = {}
): Promise<any> {
  let url = `${BASE_URL}${path}`;

  if (options.params) {
    const qs = new URLSearchParams(options.params).toString();
    url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...buildAuthHeader(),
  };

  const fetchOptions: RequestInit = { method, headers };
  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(url, fetchOptions);

    // Rate limited - retry
    if (res.status === 429 && attempt < MAX_RETRIES) {
      const delay = RETRY_DELAYS[attempt] || 4000;
      console.error(`Rate limited. Retrying in ${delay / 1000}s...`);
      await Bun.sleep(delay);
      continue;
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const msg = data?.message || data?.error?.message || res.statusText;
      throw new Error(`${res.status}: ${msg}`);
    }

    return data;
  }
}

export function getClient() {
  return {
    get: (path: string, params?: Record<string, string>) =>
      request("GET", path, { params }),
    post: (path: string, body?: any) =>
      request("POST", path, { body }),
    patch: (path: string, body?: any) =>
      request("PATCH", path, { body }),
    put: (path: string, body?: any) =>
      request("PUT", path, { body }),
    delete: (path: string) =>
      request("DELETE", path),
  };
}
