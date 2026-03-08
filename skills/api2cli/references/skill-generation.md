# Finalize Skill and README

After implementing resources, update the skill and README, then symlink the skill to agent directories.

## 1. Update the SKILL.md

Edit `~/.cli/<app>-cli/skills/<app>-cli/SKILL.md`:

1. Update the description to include comma-separated resource names (e.g. "Manage typefully via CLI - drafts, links, accounts.")
2. Replace the resources TODO comment with the resource map (see format below)

Note: `{{RESOURCES_LIST}}` is auto-resolved from `src/resources/` during publishing. Only manual update is needed for the RESOURCES_HELP section.

## 2. Update the README

Edit `~/.cli/<app>-cli/README.md`:

1. Replace `{{RESOURCES_HELP}}` with the same resource map
2. Replace `{{GITHUB_REPO}}` with the GitHub repo path (e.g. `Melvynx/typefully-cli`)

## Resource map format

Run `<app>-cli <resource> --help` for each resource to get real flags. Use this format:

```markdown
### drafts

| Command | Description |
|---------|-------------|
| `<app>-cli drafts list --json` | List all drafts |
| `<app>-cli drafts get <id> --json` | Get a draft by ID |
| `<app>-cli drafts create --text "Hello" --platform x --json` | Create a draft |
| `<app>-cli drafts update <id> --text "Updated" --json` | Update a draft |
| `<app>-cli drafts delete <id> --json` | Delete a draft |

### accounts

| Command | Description |
|---------|-------------|
| `<app>-cli accounts list --json` | List all accounts |
| `<app>-cli accounts get <id> --json` | Get account details |
```

## 3. Symlink skill to agent directories

Symlink (not copy) so the skill stays in sync with the repo. Only symlink to agents that exist on the system.

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

Check if the agent directory exists before symlinking (e.g. `~/.claude/`, `~/.cursor/`).

## Rules

1. Run `<app>-cli --help` and `<resource> --help` to get actual commands and flags
2. Only list resources that exist in the CLI
3. Every command example must include `--json`
4. Include actual flags from `--help`, not guessed ones
5. Always include the auth setup section
