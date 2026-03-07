# Skill Generation for Generated CLIs

The scaffold already includes `skills/<app>-cli/SKILL.md` with placeholders. After implementing resources, update it.

## Location

The skill lives inside the CLI repo at `skills/<app>-cli/SKILL.md`. This way when pushed to GitHub, anyone can install it:

```bash
npx skills-cli add <github-user>/<app>-cli
```

## What to update

1. Replace `{{RESOURCES_LIST}}` with comma-separated resource names (e.g. "drafts, links, accounts")
2. Replace `{{RESOURCES_HELP}}` with actual commands from `<app>-cli --help` and each `<resource> --help`
3. In `README.md`, replace `{{GITHUB_REPO}}` with the actual GitHub repo path (e.g. `Melvynx/typefully-cli`)

## Rules

1. Run `<app>-cli --help` and each `<resource> --help` to get actual commands
2. Only list resources that actually exist in the CLI
3. Keep description concise - list the key resources and trigger words
4. Include actual flags from `--help` output, not guessed ones
5. Always include the auth setup section
6. All command examples must include `--json` flag
7. Always use `--json` when calling commands - table output is for humans only
