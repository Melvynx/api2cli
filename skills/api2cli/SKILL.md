---
name: api2cli
description: "Generate a CLI + AgentSkill from any REST API documentation. Use when: (1) wrapping a SaaS API as a CLI tool, (2) creating agent-ready integrations for APIs like Typefully, Dub, Mercury, Front, etc., (3) user says 'create a CLI for X API', 'wrap this API', or 'make a skill for X'. Handles API discovery, scaffold generation, resource implementation, building, and PATH linking."
---

# api2cli

Turn any REST API into a standardized, agent-ready CLI.

Always use `npx api2cli` to run commands (no install needed).

## Workflow

### Step 1: Discover the API

Before creating anything, gather API information:
1. Find the API docs URL or OpenAPI spec (use web search if needed)
2. Identify: base URL, auth type (bearer/api-key/basic/custom), auth header name
3. List all resources and their endpoints (GET/POST/PATCH/DELETE)
4. Note any pagination, rate limiting, or special headers

### Step 2: Create the scaffold

```bash
npx api2cli create <app> \
  --base-url https://api.example.com \
  --auth-type bearer \
  --auth-header Authorization
```

See [references/commands.md](references/commands.md) for all `api2cli` commands and flags.

This creates `~/.cli/<app>-cli/` with: HTTP client (retry/backoff), auth module, multi-format output, example resource.

### Step 3: Implement resources

For each API resource, create `~/.cli/<app>-cli/src/resources/<resource>.ts`.

See [references/resource-patterns.md](references/resource-patterns.md) for the full CRUD template and conventions.

Key rules:
- One file per resource (drafts.ts, links.ts, accounts.ts)
- CRUD commands: list, get, create, update, delete
- Every command has `--json` flag and help examples
- Use `client.get/post/patch/delete()` for HTTP
- Use `output()` for formatted response
- Use `handleError()` for errors

Register each resource in `~/.cli/<app>-cli/src/index.ts`:
```typescript
import { draftsResource } from "./resources/drafts.js";
program.addCommand(draftsResource);
```

### Step 4: Build, link, and test

```bash
npx api2cli bundle <app>
npx api2cli link <app>
# After linking, use the full path to run (symlinked to ~/.local/bin/<app>-cli)
~/.local/bin/<app>-cli auth set "your-token"
~/.local/bin/<app>-cli auth test
~/.local/bin/<app>-cli <resource> list --json
```

Do NOT run `source ~/.zshrc` - it fails in non-interactive shells. Use `~/.local/bin/<app>-cli` directly.

## Generated CLI Conventions

All generated CLIs follow these exact patterns:

```
<app>-cli <resource> <action> [flags]
<app>-cli auth set|show|remove|test
```

Global flags: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`

JSON envelope: `{ ok: true, data: ..., meta: { total, page } }`

Exit codes: 0 = success, 1 = API error, 2 = usage error

Tokens: `~/.config/tokens/<app>-cli.txt` (chmod 600)
