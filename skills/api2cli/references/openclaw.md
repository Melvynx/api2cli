# Using api2cli with OpenClaw

api2cli-generated CLIs work natively with OpenClaw. Skills get symlinked into `~/.openclaw/workspace/skills/` so the OpenClaw agent can discover and use them.

## 1. Publish to ClawHub

Publish the api2cli skill so OpenClaw users can discover it via `clawhub search`.

### Pre-flight

```bash
clawhub login
clawhub whoami
```

If not authenticated, stop and ask the user to complete login first.

### Publish

```bash
openclaw skill publish ./skills/api2cli
```

### Verify

```bash
clawhub search api2cli
```

Users can then install with:

```bash
clawhub install api2cli
```

## 2. One-Prompt Setup (copy-paste into OpenClaw)

Copy the entire block below and paste it as a message to your OpenClaw agent. It will install api2cli, detect your API keys, and set up matching CLIs automatically.

```
Set up api2cli and install all CLIs that match my existing API keys. Follow every step in order.

### Step 1 — Install prerequisites

Run these commands:

bun --version || curl -fsSL https://bun.sh/install | bash
npm i -g api2cli

Verify: npx api2cli --help

### Step 2 — Fetch available CLIs

Run:

curl -s https://api2cli.dev/api/skills | jq -r '.data[].name'

Save the full list. There are 18+ CLIs available.

### Step 3 — Detect my API keys

Check which of these environment variables are set (non-empty):

| Env var                  | CLI               |
|--------------------------|-------------------|
| TYPEFULLY_TOKEN          | typefully-cli     |
| DUB_API_KEY              | dub-cli           |
| MERCURY_API_TOKEN        | mercury-cli       |
| FRONTAPP_TOKEN           | frontapp-cli      |
| EXA_API_KEY              | exa-cli           |
| AGENTMAIL_API_KEY        | agentmail-cli     |
| LUMAIL_API_KEY           | lumail-cli        |
| CONTEXT7_API_KEY         | context7-cli      |
| CODELINE_API_KEY         | codeline-cli      |
| AVIATIONSTACK_API_KEY    | aviationstack-cli |
| TCHAO_API_KEY            | tchao-cli         |
| SAVEIT_API_KEY           | saveit-cli        |
| PORKBUN_API_KEY          | porkbun-cli       |
| RENTCAST_API_KEY         | rentcast-cli      |
| OPENSKY_USERNAME         | opensky-cli       |

Also check for existing token files:

ls ~/.config/tokens/*-cli.txt 2>/dev/null

Any token file like `typefully-cli.txt` means that CLI was previously configured.

### Step 4 — Present matches and confirm

Show me:
1. CLIs that match a detected env var or token file (mark as "recommended")
2. All other available CLIs (mark as "optional")

Ask me which ones to install. If I say "all matched" or "all", install every recommended one. If no keys are detected, show the full list and ask me to pick.

### Step 5 — Install each selected CLI

For each CLI the user confirmed, run:

npx api2cli install <name>

If it fails with "already installed", run:

npx api2cli install <name> --force

### Step 6 — Set auth tokens

For each installed CLI, set the auth token:

- If the env var exists: <name>-cli auth set "$ENV_VAR_VALUE"
- If a token file exists at ~/.config/tokens/<name>.txt: skip, already configured
- Otherwise: ask me for the token

Then verify: <name>-cli auth test

If auth test fails, tell me and move on to the next CLI.

### Step 7 — Link skills to OpenClaw

For each installed CLI, run:

npx api2cli link <app> --openclaw

This symlinks the SKILL.md into ~/.openclaw/workspace/skills/<name>/ so you can use the CLI in future conversations.

### Step 8 — Summary

Print a table:

| CLI | Installed | Auth | Linked |
|-----|-----------|------|--------|

Show checkmarks or X for each column. If any CLI failed, show the error.

Finally, run:

npx api2cli list

to confirm everything is registered.
```

## 3. Quick Install (single CLI)

For installing one CLI at a time, give this to your OpenClaw agent:

```
Install <app>-cli for me:

1. Run: npm i -g api2cli
2. Run: npx api2cli install <app>
3. Run: <app>-cli auth set "<YOUR_TOKEN>"
4. Run: npx api2cli link <app> --openclaw
5. Verify: <app>-cli auth test && <app>-cli --help
```

## 4. Full Install from Source

For CLIs not published to npm or the registry:

```
Install api2cli and set up <app>-cli for OpenClaw:

1. bun --version || curl -fsSL https://bun.sh/install | bash
2. npm i -g api2cli
3. npx api2cli install <github-user>/<app>-cli
4. npx api2cli link <app> --openclaw
5. <app>-cli auth set "<YOUR_TOKEN>"
6. <app>-cli auth test
```

## 5. Install via ClawHub

If you found api2cli through ClawHub:

```bash
clawhub install api2cli
```

This installs the api2cli skill into your OpenClaw workspace. Then paste the one-prompt from Section 2 to set up individual CLIs.

## How the Agent Uses It

Once linked, the OpenClaw agent discovers CLIs through `--help` navigation:

```
<app>-cli --help              → list resources (~90 tokens)
<app>-cli <resource> --help   → list actions (~50 tokens)
<app>-cli <resource> <action> --help → exact flags (~80 tokens)
```

No SKILL.md dump needed. The agent explores on demand.

## Link Commands Reference

```bash
npx api2cli link <app> --openclaw                    # single CLI
npx api2cli link --all --openclaw                    # all installed CLIs
npx api2cli link <app> --skills-path /custom/path    # custom skills directory
```
