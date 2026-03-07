# Resource File Patterns

## File Location

Each resource file goes in `~/.cli/<app>-cli/src/resources/<resource>.ts`.

## CRUD Template

```typescript
import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const <resource>Resource = new Command("<resource>")
  .description("Manage <resource>");

// LIST
<resource>Resource
  .command("list")
  .description("List all <resource>")
  .option("--limit <n>", "Max results", "20")
  .option("--page <n>", "Page number", "1")
  .option("--sort <field>", "Sort by field (e.g. created_at:desc)")
  .option("--filter <expr>", "Filter expression (e.g. status=active)")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  <app>-cli <resource> list --limit 5\n  <app>-cli <resource> list --json\n  <app>-cli <resource> list --sort created_at:desc")
  .action(async (opts) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.page) params.page = opts.page;
      if (opts.sort) params.sort = opts.sort;
      if (opts.filter) params.filter = opts.filter;
      const data = await client.get("/<resource>", params);
      output(data, {
        json: opts.json,
        format: opts.format,
        fields: opts.fields?.split(","),
      });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// GET
<resource>Resource
  .command("get <id>")
  .description("Get a single <resource> by ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  <app>-cli <resource> get abc123\n  <app>-cli <resource> get abc123 --json")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/<resource>/${id}`);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// CREATE
<resource>Resource
  .command("create")
  .description("Create a new <resource>")
  .requiredOption("--name <name>", "Name for the <resource>")
  .option("--description <desc>", "Optional description")
  .option("--json", "Output as JSON")
  .addHelpText("after", "\nExamples:\n  <app>-cli <resource> create --name 'My Item'\n  <app>-cli <resource> create --name 'My Item' --description 'Details' --json")
  .action(async (opts) => {
    try {
      const body: Record<string, string> = { name: opts.name };
      if (opts.description) body.description = opts.description;
      const data = await client.post("/<resource>", body);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// UPDATE
<resource>Resource
  .command("update <id>")
  .description("Update an existing <resource>")
  .option("--name <name>", "New name")
  .option("--description <desc>", "New description")
  .option("--json", "Output as JSON")
  .addHelpText("after", "\nExamples:\n  <app>-cli <resource> update abc123 --name 'New Name'\n  <app>-cli <resource> update abc123 --name 'New Name' --json")
  .action(async (id, opts) => {
    try {
      const body: Record<string, string> = {};
      if (opts.name) body.name = opts.name;
      if (opts.description) body.description = opts.description;
      const data = await client.patch(`/<resource>/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// DELETE
<resource>Resource
  .command("delete <id>")
  .description("Delete a <resource>")
  .option("--json", "Output as JSON")
  .addHelpText("after", "\nExamples:\n  <app>-cli <resource> delete abc123\n  <app>-cli <resource> delete abc123 --json")
  .action(async (id, opts) => {
    try {
      await client.delete(`/<resource>/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
```

## Registration

Add each resource to `~/.cli/<app>-cli/src/index.ts`:

```typescript
import { <resource>Resource } from "./resources/<resource>.js";
program.addCommand(<resource>Resource);
```

## Template Library Reference

### client (lib/client.ts)

```typescript
client.get(path, params?)    // GET with query params
client.post(path, body?)     // POST with JSON body
client.patch(path, body?)    // PATCH with JSON body
client.put(path, body?)      // PUT with JSON body
client.delete(path)          // DELETE
```

- Retries 3 times on 429 and 5xx (delays: 1s, 2s, 4s)
- Timeout: 30s
- Auto-includes auth headers and Content-Type/Accept JSON

### output (lib/output.ts)

```typescript
output(data, { json?, format?, fields?, noHeader? })
```

- **text**: Pretty tables (arrays) or key-value (objects)
- **json**: `{ ok: true, data, meta: { total, page } }`
- **csv**: Comma-separated with optional header
- **yaml**: Indented YAML

### handleError (lib/errors.ts)

```typescript
handleError(err, json?)
```

Auto-suggests fixes based on HTTP status:
- 401: "Check your token"
- 403: "Insufficient permissions"
- 404: "Resource not found"
- 429: "Rate limited"

### logger (lib/logger.ts)

```typescript
log.info(msg)     // Suppressed in --json mode
log.success(msg)  // Green checkmark, suppressed in --json
log.warn(msg)     // Yellow warning, suppressed in --json
log.error(msg)    // Always shown
log.debug(msg)    // Only with --verbose
```

### auth (lib/auth.ts)

```typescript
hasToken()         // Check if token exists
getToken()         // Read token (throws if missing)
setToken(token)    // Save with chmod 600
removeToken()      // Delete token file
maskToken(token)   // "sk-abc...wxyz"
buildAuthHeaders() // Build auth header based on type
```

Auth types: bearer (`Bearer {token}`), api-key (raw), basic (base64), custom (raw)

Token storage: `~/.config/tokens/<app>-cli.txt`
