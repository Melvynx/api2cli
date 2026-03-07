# Skill Generation for Generated CLIs

After building and linking a CLI, generate an AgentSkill so AI agents can discover and use it.

## Where to create

- Personal (all projects): `~/.claude/skills/<app>-cli/SKILL.md`
- Project-specific: `.claude/skills/<app>-cli/SKILL.md`

## Template

Generate the SKILL.md by reading the CLI's actual `--help` output to list all resources and commands.

```markdown
---
name: <app>-cli
description: "Manage <APP_NAME> via CLI - <list key resources like: drafts, links, accounts, etc.>. Use when user mentions '<APP_NAME>', '<resource names>', or wants to interact with the <APP_NAME> API."
---

# <app>-cli

Manage <APP_NAME> resources from the command line.

Always run `export PATH="$HOME/.local/bin:$PATH"` before using commands so `<app>-cli` is available.

## Authentication

```bash
<app>-cli auth set "your-token"
```

## Resources

### <resource1>

```bash
<app>-cli <resource1> list [--limit <n>] [--json]
<app>-cli <resource1> get <id> [--json]
<app>-cli <resource1> create --name <name> [--json]
<app>-cli <resource1> update <id> --name <name> [--json]
<app>-cli <resource1> delete <id> [--json]
```

### <resource2>

(repeat for each resource)

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
```

## Rules

1. Run `<app>-cli --help` and each `<resource> --help` to get actual commands
2. Only list resources that actually exist in the CLI
3. Always include `export PATH="$HOME/.local/bin:$PATH"` instruction so the CLI is usable
4. Keep description concise - list the key resources and trigger words
5. Include actual flags from `--help` output, not guessed ones
6. Always include the auth setup section
