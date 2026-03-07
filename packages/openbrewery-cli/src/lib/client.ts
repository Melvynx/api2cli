import { buildAuthHeaders } from "./auth.js";
import { BASE_URL } from "./config.js";
import { CliError } from "./errors.js";
import { log } from "./logger.js";

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000];
const TIMEOUT_MS = 30_000;

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface RequestOptions {
  params?: Record<string, string>;
  body?: Record<string, unknown>;
  timeout?: number;
}

async function request(method: Method, path: string, opts: RequestOptions = {}): Promise<unknown> {
  let url = `${BASE_URL}${path}`;

  if (opts.params) {
    const filtered = Object.fromEntries(
      Object.entries(opts.params).filter(([, v]) => v !== undefined && v !== ""),
    );
    if (Object.keys(filtered).length > 0) {
      url += `?${new URLSearchParams(filtered).toString()}`;
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...buildAuthHeaders(),
  };

  const fetchOpts: RequestInit = {
    method,
    headers,
    signal: AbortSignal.timeout(opts.timeout ?? TIMEOUT_MS),
  };

  if (opts.body && method !== "GET") {
    fetchOpts.body = JSON.stringify(opts.body);
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    log.debug(`${method} ${url}${attempt > 0 ? ` (retry ${attempt})` : ""}`);

    const res = await fetch(url, fetchOpts);

    if ((res.status === 429 || res.status >= 500) && attempt < MAX_RETRIES) {
      const delay = RETRY_DELAYS[attempt] ?? 4000;
      log.warn(`${res.status} - retrying in ${delay / 1000}s...`);
      await Bun.sleep(delay);
      continue;
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const msg =
        (data as Record<string, unknown>)?.message ??
        ((data as Record<string, Record<string, unknown>>)?.error?.message as string) ??
        res.statusText;
      throw new CliError(res.status, `${res.status}: ${String(msg)}`);
    }

    return data;
  }

  throw new CliError(500, "Max retries exceeded");
}

export const client = {
  get(path: string, params?: Record<string, string>) {
    return request("GET", path, { params });
  },
  post(path: string, body?: Record<string, unknown>) {
    return request("POST", path, { body });
  },
  patch(path: string, body?: Record<string, unknown>) {
    return request("PATCH", path, { body });
  },
  put(path: string, body?: Record<string, unknown>) {
    return request("PUT", path, { body });
  },
  delete(path: string) {
    return request("DELETE", path);
  },
};
