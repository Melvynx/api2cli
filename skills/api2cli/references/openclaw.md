# Using api2cli with OpenClaw

api2cli-generated CLIs work natively with OpenClaw. Skills get symlinked into `~/.openclaw/workspace/skills/` so the OpenClaw agent can discover and use them.

## One-Prompt Setup (copy-paste into OpenClaw)

Copy the entire block below and paste it as a message to your OpenClaw agent:

```
Set up api2cli for me:

1. Install bun if missing: bun --version || curl -fsSL https://bun.sh/install | bash
2. Install api2cli: npm i -g api2cli
3. Install the api2cli skill from ClawHub: npx clawhub install api2cli
4. Link the skill to OpenClaw: npx api2cli link --all --openclaw
5. Verify: npx api2cli --help

Once installed, I can ask you to:
- Create a CLI for any API: "Use api2cli to create CLI for <api-name>"
- Install an existing CLI: "npx api2cli install <name>"
- Browse available CLIs: "npx api2cli list" or check https://api2cli.dev
```

## Publish to ClawHub

Publish the api2cli skill so OpenClaw users can discover it via `npx clawhub search`.

```bash
npx clawhub login
npx clawhub whoami
npx clawhub publish ./skills/api2cli --slug api2cli --name "api2cli" --version 1.0.0
npx clawhub search api2cli
```

Publish a generated CLI skill:

```bash
npx clawhub publish ./skills/<app>-cli --slug <app>-cli
```

Users install with `npx clawhub install <app>-cli`.

## Link Commands Reference

```bash
npx api2cli link <app> --openclaw                    # single CLI
npx api2cli link --all --openclaw                    # all installed CLIs
npx api2cli link <app> --skills-path /custom/path    # custom skills directory
```

## How the Agent Uses It

Once linked, the OpenClaw agent discovers CLIs through `--help` navigation:

```
<app>-cli --help              → list resources (~90 tokens)
<app>-cli <resource> --help   → list actions (~50 tokens)
<app>-cli <resource> <action> --help → exact flags (~80 tokens)
```

No SKILL.md dump needed. The agent explores on demand.
