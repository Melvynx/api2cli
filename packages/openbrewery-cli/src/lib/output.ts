import { globalFlags } from "./config.js";

interface JsonEnvelope {
  ok: true;
  data: unknown;
  meta?: { total?: number; page?: number };
}

export function output(
  data: unknown,
  opts: { json?: boolean; format?: string; fields?: string[]; noHeader?: boolean } = {},
): void {
  const isJson = opts.json ?? globalFlags.json;
  const format = isJson ? "json" : (opts.format ?? globalFlags.format);

  switch (format) {
    case "json":
      printJson(data);
      break;
    case "csv":
      printCsv(data, opts.fields, opts.noHeader ?? globalFlags.noHeader);
      break;
    case "yaml":
      printYaml(data, 0);
      break;
    default:
      printText(data, opts.fields, opts.noHeader ?? globalFlags.noHeader);
  }
}

function printJson(data: unknown): void {
  const envelope: JsonEnvelope = { ok: true, data };
  if (Array.isArray(data)) {
    envelope.meta = { total: data.length };
  }
  console.log(JSON.stringify(envelope, null, 2));
}

function printText(
  data: unknown,
  fields?: string[],
  noHeader?: boolean,
): void {
  if (Array.isArray(data)) {
    printTable(data as Record<string, unknown>[], fields, noHeader);
  } else if (typeof data === "object" && data !== null) {
    for (const [k, v] of Object.entries(data)) {
      const display = typeof v === "object" ? JSON.stringify(v) : String(v ?? "");
      console.log(`${k}: ${display}`);
    }
  } else {
    console.log(String(data));
  }
}

function printTable(
  rows: Record<string, unknown>[],
  fields?: string[],
  noHeader?: boolean,
): void {
  if (rows.length === 0) {
    console.log("(no results)");
    return;
  }

  const cols = fields ?? Object.keys(rows[0] ?? {});
  const widths = cols.map((col) => {
    const values = rows.map((r) => String(r[col] ?? "").length);
    return Math.min(Math.max(col.length, ...values), 40);
  });

  if (!noHeader) {
    console.log(cols.map((c, i) => c.padEnd(widths[i] ?? 10)).join("  "));
    console.log(widths.map((w) => "\u2500".repeat(w)).join("  "));
  }

  for (const row of rows) {
    const line = cols.map((c, i) => {
      const val = String(row[c] ?? "");
      const w = widths[i] ?? 10;
      return val.length > w ? `${val.slice(0, w - 1)}\u2026` : val.padEnd(w);
    });
    console.log(line.join("  "));
  }
}

function printCsv(
  data: unknown,
  fields?: string[],
  noHeader?: boolean,
): void {
  if (!Array.isArray(data)) {
    console.log(JSON.stringify(data));
    return;
  }
  if (data.length === 0) return;

  const cols = fields ?? Object.keys((data[0] as Record<string, unknown>) ?? {});

  if (!noHeader) {
    console.log(cols.join(","));
  }

  for (const row of data as Record<string, unknown>[]) {
    console.log(cols.map((c) => csvEscape(String(row[c] ?? ""))).join(","));
  }
}

function csvEscape(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function printYaml(data: unknown, indent: number): void {
  const pad = "  ".repeat(indent);
  if (Array.isArray(data)) {
    for (const item of data) {
      if (typeof item === "object" && item !== null) {
        console.log(`${pad}-`);
        printYaml(item, indent + 1);
      } else {
        console.log(`${pad}- ${String(item)}`);
      }
    }
  } else if (typeof data === "object" && data !== null) {
    for (const [k, v] of Object.entries(data)) {
      if (typeof v === "object" && v !== null) {
        console.log(`${pad}${k}:`);
        printYaml(v, indent + 1);
      } else {
        console.log(`${pad}${k}: ${String(v)}`);
      }
    }
  }
}
