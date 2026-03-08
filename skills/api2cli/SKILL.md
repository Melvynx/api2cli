---
name: api2cli
description: "Generate a CLI + AgentSkill from any REST API documentation. Use when: (1) wrapping a SaaS API as a CLI tool, (2) creating agent-ready integrations for APIs like Typefully, Dub, Mercury, Front, etc., (3) user says 'create a CLI for X API', 'wrap this API', 'make a skill for X', or 'publish my CLI'. Handles API discovery, scaffold generation, resource implementation, building, PATH linking, and publishing to GitHub + api2cli.dev registry."
---

# api2cli

Turn any REST API into a standardized, agent-ready CLI.

Always use `npx api2cli` to run commands (no install needed).

## Prerequisites

Before anything else, check if `bun` is installed. It is required to build the generated CLIs.

```bash
bun --version || curl -fsSL https://bun.sh/install | bash
```

Always run this check first - do not skip it.

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
<app>-cli --help
<app>-cli <resource> list --json
```

`api2cli link` creates a symlink in `~/.local/bin/` and adds it to the user's shell profile (`.zshrc`/`.bashrc`) automatically. The CLI is available immediately in the next shell command - no `export PATH` needed.

### Step 5: Update the AgentSkill and README

The scaffold already includes `skills/<app>-cli/SKILL.md` and `README.md` with placeholder sections.

After implementing resources, update these files:
1. Edit `~/.cli/<app>-cli/skills/<app>-cli/SKILL.md` - fill in `{{RESOURCES_LIST}}` and `{{RESOURCES_HELP}}` with actual resource names and commands
2. Edit `~/.cli/<app>-cli/README.md` - fill in `{{RESOURCES_HELP}}` and `{{GITHUB_REPO}}`

See [references/skill-generation.md](references/skill-generation.md) for the template and rules.

### Step 6: Install the skill for your agent

After updating the skill, symlink it to the agent's skills directory so the agent can use the CLI in future sessions.

Detect which agent is running and symlink accordingly:

```bash
# Claude Code
mkdir -p ~/.claude/skills/<app>-cli
ln -sf ~/.cli/<app>-cli/skills/<app>-cli/SKILL.md ~/.claude/skills/<app>-cli/SKILL.md

# Cursor
mkdir -p ~/.cursor/skills/<app>-cli
ln -sf ~/.cli/<app>-cli/skills/<app>-cli/SKILL.md ~/.cursor/skills/<app>-cli/SKILL.md

# OpenClaw
mkdir -p ~/.openclaw/workspace/skills/<app>-cli
ln -sf ~/.cli/<app>-cli/skills/<app>-cli/SKILL.md ~/.openclaw/workspace/skills/<app>-cli/SKILL.md
```

Use a symlink (`ln -sf`), not a copy - this keeps the skill in sync with the repo. Only symlink to agents that are installed on the system (check if the directory exists: `~/.claude/`, `~/.cursor/`, etc.).

### Step 7: Publish (when user asks)

Only do this step when the user explicitly asks to publish or share their CLI.

1. Initialize a git repo and push to GitHub:
```bash
cd ~/.cli/<app>-cli
git init
git add -A
git commit -m "feat: <app>-cli - manage <app> via CLI"
gh repo create <app>-cli --public --source . --push
```

2. Publish to the api2cli registry:
```bash
curl -X POST https://api2cli.dev/api/publish-cli \
  -H "Content-Type: application/json" \
  -d '{"githubUrl": "<github-user>/<app>-cli"}'
```

After publishing, anyone can install the CLI and skill with:
```bash
npx api2cli install <github-user>/<app>-cli
```

## Generated CLI Conventions

All generated CLIs follow these exact patterns:

```
<app>-cli <resource> <action> [flags]
<app>-cli auth set|show|remove|test
```

**Always use `--json` when calling CLI commands programmatically.** The table output is for humans only - it wraps and is unreadable by AI. `--json` returns structured data:

```json
{ "ok": true, "data": [...], "meta": { "total": 42 } }
```

Other flags: `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`

Exit codes: 0 = success, 1 = API error, 2 = usage error

Tokens: `~/.config/tokens/<app>-cli.txt` (chmod 600)
