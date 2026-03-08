# Using api2cli with OpenClaw

api2cli-generated CLIs work natively with OpenClaw. Skills get symlinked into `~/.openclaw/workspace/skills/` so the OpenClaw agent can discover and use them.

## Quick Setup

After creating and building a CLI:

```bash
npx api2cli link <app> --openclaw
```

This does two things:
1. Adds `<app>-cli` to your PATH (via `~/.local/bin`)
2. Symlinks the skill's `SKILL.md` into `~/.openclaw/workspace/skills/<app>-cli/`

For a custom skills path:

```bash
npx api2cli link <app> --skills-path /path/to/skills
```

Link all installed CLIs at once:

```bash
npx api2cli link --all --openclaw
```

## Copy-Paste Prompt for OpenClaw

Give this prompt to your OpenClaw agent to install any api2cli-generated CLI:

```
Install the <app>-cli for me:

1. Run: npm i -g <app>-cli
2. Run: <app>-cli auth set "<YOUR_TOKEN>"
3. Create the skill directory: mkdir -p ~/.openclaw/workspace/skills/<app>-cli
4. Create ~/.openclaw/workspace/skills/<app>-cli/SKILL.md with this content:

---
name: <app>-cli
description: "CLI for <app>. Run `<app>-cli --help` to discover all commands."
---

# <app>-cli

Run `<app>-cli --help` to discover available resources and commands.
Always use `--json` for programmatic output.

Auth: `<app>-cli auth set "<token>"` / `<app>-cli auth show`
```

## Full Install Prompt (from source)

For CLIs not published to npm, use this prompt:

```
Install api2cli and set up <app>-cli for OpenClaw:

1. Check bun is installed: bun --version || curl -fsSL https://bun.sh/install | bash
2. Install api2cli: npm i -g api2cli
3. Install the CLI: npx api2cli install <app>
4. Build and link with OpenClaw support: npx api2cli bundle <app> && npx api2cli link <app> --openclaw
5. Set auth: <app>-cli auth set "<YOUR_TOKEN>"
6. Verify: <app>-cli --help
```

## How the Agent Uses It

Once linked, the OpenClaw agent discovers the CLI through `--help` navigation:

```
<app>-cli --help          → list resources (~90 tokens)
<app>-cli <resource> --help   → list actions (~50 tokens)
<app>-cli <resource> <action> --help → exact flags (~80 tokens)
```

No SKILL.md dump needed. The agent explores on demand.
