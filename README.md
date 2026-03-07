# api2cli

Turn any REST API into a standardized, agent-ready CLI in minutes.

One CLI pattern. Every API. Any AI agent can use it.

## The Problem

There are 10,000+ SaaS products with REST APIs. AI agents can only interact with a tiny fraction of them because:

- **No CLI exists** for most APIs (Typefully, Dub, Mercury, Front, etc.)
- **No MCP server** for 97% of APIs
- **No standardization** across the CLIs that do exist
- **No agent skills** that work across platforms

## The Solution

`api2cli` generates standardized CLIs from any API. Every generated CLI follows the exact same patterns, so an agent that learns one CLI knows them all.

```
api2cli create <app> → scaffold + build + link → <app>-cli ready to use
```

## Quick Start

```bash
# Install
bun install -g api2cli

# Create a CLI for any API
api2cli create typefully \
  --base-url https://api.typefully.com \
  --auth-type bearer

# Build and link to PATH
api2cli bundle typefully
api2cli link typefully

# Use it
typefully-cli auth set "typ_xxx"
typefully-cli drafts list
typefully-cli drafts create --text "Hello world" --platform x
```

## How It Works

### 1. Create a CLI scaffold

```bash
api2cli create <app> [options]
```

| Flag | Description | Default |
|------|-------------|---------|
| `--base-url <url>` | API base URL | `https://api.example.com` |
| `--auth-type <type>` | `bearer`, `api-key`, `basic`, `custom` | `bearer` |
| `--auth-header <name>` | Auth header name | `Authorization` |
| `--docs <url>` | API docs URL (for agent-driven generation) | - |
| `--openapi <url>` | OpenAPI/Swagger spec URL | - |
| `--force` | Overwrite existing CLI | `false` |

This creates `~/.cli/<app>-cli/` with:
- HTTP client with retry/backoff
- Auth module (tokens in `~/.config/tokens/`)
- Multi-format output (text, JSON, CSV, YAML)
- Example resource file to copy

### 2. Add resources

Create a file in `~/.cli/<app>-cli/src/resources/` for each API resource:

```typescript
import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const draftsResource = new Command("drafts")
  .description("Manage drafts");

draftsResource
  .command("list")
  .description("List all drafts")
  .option("--limit <n>", "Max results", "20")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.get("/drafts", { limit: opts.limit });
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
```

Register it in `src/index.ts`:

```typescript
import { draftsResource } from "./resources/drafts.js";
program.addCommand(draftsResource);
```

### 3. Build and link

```bash
api2cli bundle <app>        # Build the CLI (~5KB JS bundle)
api2cli link <app>          # Add to PATH (updates .bashrc/.zshrc)
```

### 4. Use it

```bash
<app>-cli auth set "your-token"
<app>-cli auth test
<app>-cli <resource> list --json
```

## All Commands

### CLI Manager (`api2cli`)

| Command | Description |
|---------|-------------|
| `api2cli create <app>` | Generate a new CLI from API docs |
| `api2cli bundle <app>` | Build a CLI from source |
| `api2cli bundle --all` | Build all installed CLIs |
| `api2cli link <app>` | Add a CLI to PATH |
| `api2cli link --all` | Link all CLIs |
| `api2cli unlink <app>` | Remove from PATH |
| `api2cli list` | List all installed CLIs |
| `api2cli tokens` | List all configured tokens (masked) |
| `api2cli remove <app>` | Remove a CLI entirely |
| `api2cli doctor` | Check system requirements |
| `api2cli install <app>` | Install from registry (coming soon) |
| `api2cli publish <app>` | Publish to registry (coming soon) |
| `api2cli update <app>` | Re-sync with API changes |

### Generated CLIs (`<app>-cli`)

Every generated CLI follows these exact conventions:

```bash
# Authentication
<app>-cli auth set <token>     # Save token (chmod 600)
<app>-cli auth show            # Display masked token
<app>-cli auth show --raw      # Display full token
<app>-cli auth test            # Verify token works
<app>-cli auth remove          # Delete token

# Resources (CRUD)
<app>-cli <resource> list      # GET /resource
<app>-cli <resource> get <id>  # GET /resource/:id
<app>-cli <resource> create    # POST /resource
<app>-cli <resource> update <id>  # PATCH /resource/:id
<app>-cli <resource> delete <id>  # DELETE /resource/:id

# Global flags
--json                         # JSON output {ok, data, meta}
--format <text|json|csv|yaml>  # Output format
--verbose                      # Debug logging
--no-color                     # Disable colors
--no-header                    # Omit table headers (for piping)

# Deep help at every level
<app>-cli --help
<app>-cli <resource> --help
<app>-cli <resource> <action> --help
```

### Output Formats

**Text (default):** Pretty tables for humans

```
id                    status    created_at
────────────────────  ────────  ──────────
abc123                draft     2026-03-07
def456                published 2026-03-06
```

**JSON (`--json`):** Structured envelope for agents

```json
{
  "ok": true,
  "data": [...],
  "meta": { "total": 42 }
}
```

**CSV (`--format csv`):** For spreadsheets and piping

**YAML (`--format yaml`):** For config files

## Agent Integration

### AgentSkills (Claude Code, Cursor, Gemini CLI, etc.)

The repo includes `skills/api2cli/SKILL.md` following the [AgentSkills](https://agentskills.io) open standard. Install it in your agent:

```bash
# Claude Code
cp -r skills/api2cli ~/.claude/skills/

# OpenClaw
cp -r skills/api2cli ~/.openclaw/workspace/skills/

# Or use skills-cli
npx skills-cli add api2cli
```

Once installed, just tell your agent:

> "Create a CLI for the Typefully API"

The agent reads the skill, discovers the API, generates resources, builds, and links -- all automatically.

### Supported Agents

Works with any tool that supports AgentSkills:
Claude Code, Cursor, Gemini CLI, GitHub Copilot, VS Code, OpenClaw, Goose, OpenHands, Junie, Amp, OpenCode, Letta, Firebender, Mux, Autohand

## Project Structure

```
api2cli/
├── packages/
│   ├── cli/              # api2cli manager (create, bundle, link...)
│   └── template/         # CLI scaffold (gets cloned per API)
├── apps/
│   └── web/              # api2cli.dev marketplace (Next.js + Neon)
├── skills/
│   └── api2cli/          # AgentSkills SKILL.md
├── biome.json            # Linter + formatter
├── tsconfig.base.json    # Shared TypeScript config
└── TODO.md               # Roadmap
```

## Tech Stack

- **Runtime:** [Bun](https://bun.sh) (fast startup, built-in bundler)
- **Language:** TypeScript (strict mode)
- **CLI Framework:** [Commander.js](https://github.com/tj/commander.js)
- **Linter:** [Biome](https://biomejs.dev)
- **Web:** Next.js + Neon (PostgreSQL)
- **Standard:** [AgentSkills](https://agentskills.io)

## Token Storage

All tokens are stored in `~/.config/tokens/<app>-cli.txt` with `chmod 600`.

```bash
api2cli tokens              # List all tokens (masked)
api2cli tokens --show       # Show full tokens
```

## License

MIT
