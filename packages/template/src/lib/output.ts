export type OutputFormat = "text" | "json" | "csv" | "yaml";

interface OutputOptions {
  format?: OutputFormat;
  json?: boolean;
  fields?: string[];
}

export function output(data: any, options: OutputOptions = {}): void {
  const format = options.json ? "json" : (options.format || "text");

  switch (format) {
    case "json":
      console.log(JSON.stringify({ ok: true, data }, null, 2));
      break;

    case "csv":
      if (Array.isArray(data)) {
        const headers = Object.keys(data[0] || {});
        console.log(headers.join(","));
        for (const row of data) {
          console.log(headers.map((h) => JSON.stringify(row[h] ?? "")).join(","));
        }
      } else {
        const entries = Object.entries(data);
        console.log("key,value");
        for (const [k, v] of entries) {
          console.log(`${k},${JSON.stringify(v)}`);
        }
      }
      break;

    case "yaml":
      // Simple YAML-ish output
      printYaml(data, 0);
      break;

    case "text":
    default:
      if (Array.isArray(data)) {
        printTable(data, options.fields);
      } else if (typeof data === "object" && data !== null) {
        for (const [k, v] of Object.entries(data)) {
          console.log(`${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`);
        }
      } else {
        console.log(data);
      }
      break;
  }
}

function printTable(rows: any[], fields?: string[]): void {
  if (rows.length === 0) {
    console.log("(empty)");
    return;
  }

  const headers = fields || Object.keys(rows[0]);
  const widths = headers.map((h) =>
    Math.max(h.length, ...rows.map((r) => String(r[h] ?? "").length))
  );

  // Header
  console.log(headers.map((h, i) => h.padEnd(widths[i])).join("  "));
  console.log(widths.map((w) => "─".repeat(w)).join("──"));

  // Rows
  for (const row of rows) {
    console.log(headers.map((h, i) => String(row[h] ?? "").padEnd(widths[i])).join("  "));
  }
}

function printYaml(data: any, indent: number): void {
  const prefix = "  ".repeat(indent);
  if (Array.isArray(data)) {
    for (const item of data) {
      if (typeof item === "object") {
        console.log(`${prefix}-`);
        printYaml(item, indent + 1);
      } else {
        console.log(`${prefix}- ${item}`);
      }
    }
  } else if (typeof data === "object" && data !== null) {
    for (const [k, v] of Object.entries(data)) {
      if (typeof v === "object") {
        console.log(`${prefix}${k}:`);
        printYaml(v, indent + 1);
      } else {
        console.log(`${prefix}${k}: ${v}`);
      }
    }
  }
}
