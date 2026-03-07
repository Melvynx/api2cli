---
name: api2cli
description: "Generate a CLI + AgentSkill from any REST API documentation. Use when: (1) wrapping a SaaS API as a CLI tool, (2) creating agent-ready integrations for APIs like Typefully, Dub, Mercury, Front, etc., (3) user says 'create a CLI for X API', 'wrap this API', or 'make a skill for X'. Handles API discovery, scaffold generation, building, and PATH linking."
---

# api2cli

Turn any REST API into a standardized, agent-ready CLI.

## Quick Start

```bash
# Create a CLI from an API
api2cli create <app> --base-url <url> --auth-type bearer

# Or install a pre-built one
api2cli install <app>
```

## Full Workflow

### Step 1: Discover the API

Before running `api2cli create`, gather API info:

1. Find the API docs URL or OpenAPI spec
2. Identify: base URL, auth type (bearer/api-key/basic), auth header name
3. List resources and their endpoints (GET/POST/PATCH/DELETE)

Use web search or fetch the docs URL to find this information.

### Step 2: Create the scaffold

```bash
api2cli create <app> \
  --base-url https://api.example.com \
  --auth-type bearer \
  --auth-header Authorization
```

This creates `~/.cli/<app>-cli/` with the full template.

### Step 3: Generate resource files

For each API resource, create a file in `~/.cli/<app>-cli/src/resources/<resource>.ts`.

Follow the pattern in `src/resources/example.ts`:
- One file per resource (drafts.ts, links.ts, accounts.ts)
- CRUD commands: list, get, create, update, delete
- Each command has: description, arguments, options, `--json` flag, help examples
- Use `client.get/post/patch/delete()` for HTTP calls
- Use `output()` for formatted response
- Use `handleError()` for error handling

Then register the resource in `src/index.ts`:
```typescript
import { draftsResource } from "./resources/drafts.js";
program.addCommand(draftsResource);
```

### Step 4: Build and link

```bash
api2cli bundle <app>
api2cli link <app>
```

### Step 5: Set auth token

```bash
<app>-cli auth set "your-token"
<app>-cli auth test
```

### Step 6: Test

```bash
<app>-cli --help
<app>-cli <resource> list --json
```

## CLI Conventions (all generated CLIs follow these)

```
<app>-cli <resource> <action> [flags]
<app>-cli auth set|show|remove|test
<app>-cli --help / <resource> --help / <resource> <action> --help
```

Global flags: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`

JSON output envelope: `{ ok: true, data: ..., meta: { total, page } }`

Exit codes: 0 = success, 1 = API error, 2 = usage error

Tokens stored at: `~/.config/tokens/<app>-cli.txt` (chmod 600)

## Management Commands

```bash
api2cli list              # Show all installed CLIs
api2cli bundle <app>      # Build a CLI
api2cli bundle --all      # Build all CLIs
api2cli link <app>        # Add to PATH
api2cli tokens            # List all tokens (masked)
api2cli doctor            # Health check
api2cli remove <app>      # Remove a CLI
api2cli update <app>      # Re-sync with API changes
```

## Resource File Template

```typescript
import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const <resource>Resource = new Command("<resource>")
  .description("Manage <resource>");

<resource>Resource
  .command("list")
  .description("List all <resource>")
  .option("--limit <n>", "Max results", "20")
  .option("--json", "Output as JSON")
  .addHelpText("after", "\nExample:\n  <app>-cli <resource> list --limit 5")
  .action(async (opts) => {
    try {
      const data = await client.get("/<resource>", { limit: opts.limit });
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
```
