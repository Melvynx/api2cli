# Finalize Skill and README

After implementing resources, the skill MUST become a real operating guide for another agent, not just a command dump. A skill with TODO placeholders, shallow command lists, or missing resources is incomplete. Do not skip this step.

## 1. Introspect the CLI

Run these commands to discover all resources, actions, and flags. This is the source of truth — never guess commands or flags.

```bash
# Get the full list of resources
<app>-cli --help

# For each resource, get all actions
<app>-cli <resource> --help

# For each action, get all flags
<app>-cli <resource> <action> --help
```

Capture the output of every `--help` call. Use it to build the resource documentation below.

## 2. Update the SKILL.md description

The description in frontmatter is critical — it's what agents use to decide when to activate the skill.

**Requirements:**
- List ALL resource names as a comma-separated list
- Include trigger phrases specific to the API domain (what the user might say)
- Include the API service name
- Write in third person
- Keep under 1024 chars

**Format:**
```yaml
description: "Manage <Service> via CLI - <resource1>, <resource2>, <resource3>. Use when user mentions '<service>', '<trigger1>', '<trigger2>', or wants to interact with the <Service> API."
```

**Examples across different domains:**

Social media:
```yaml
description: "Manage Typefully via CLI - me, social-sets, drafts, media, tags, queue. Use when user mentions 'typefully', 'create draft', 'schedule post', 'social media drafts', or wants to interact with the Typefully API."
```

Email:
```yaml
description: "Manage agentmail.to via CLI - inboxes, messages, threads, webhooks, pods, api-keys. Use when user mentions 'agentmail', 'email inbox', 'send email via agentmail', or wants to interact with the AgentMail API."
```

Banking:
```yaml
description: "Manage Mercury Banking via CLI - accounts, transactions, recipients, transfers, invoices. Use when user mentions 'mercury', 'bank balance', 'wire transfer', 'send payment', or wants to interact with the Mercury API."
```

Link management:
```yaml
description: "Manage Dub.co via CLI - links, domains, tags, folders, customers, analytics. Use when user mentions 'dub', 'shorten URL', 'create short link', 'link analytics', or wants to interact with the Dub API."
```

**Bad example:**
```yaml
description: "Manage typefully via CLI. Use when user mentions 'typefully' or wants to interact with the typefully API."
```
Missing resource list, no domain-specific triggers — an agent can't tell what this CLI does.

## 3. Set the category

Replace `{{CATEGORY}}` with the most fitting value:

| Category | Use for |
|----------|---------|
| `social-media` | Twitter/X, LinkedIn, scheduling, drafts |
| `email` | Inboxes, messages, newsletters, transactional |
| `payments` | Billing, invoices, subscriptions, transfers |
| `analytics` | Metrics, tracking, dashboards |
| `devtools` | CI/CD, hosting, DNS, monitoring |
| `crm` | Contacts, deals, pipelines |
| `storage` | Files, buckets, CDN |
| `communication` | Chat, SMS, notifications |
| `other` | If nothing above fits |

## 4. Write the task-oriented sections first

Before adding command tables, replace these three sections near the top of the scaffold:

- `{{WHEN_TO_USE_HELP}}`
- `{{CAPABILITIES_HELP}}`
- `{{USE_CASES_HELP}}`

These sections are what make the skill useful to an agent before it reaches the reference tables.

### `When To Use This Skill`

Write 4-6 bullets starting with `Use the <app>-cli skill when you need to...`

Good bullets describe user intent, not implementation details:

- list or inspect important data in the service
- create, update, or delete records
- trigger operational workflows or one-off actions
- automate multi-step jobs using structured JSON output

Bad bullets just restate resource names:

- manage drafts
- manage messages
- manage inboxes

### `Capabilities`

Summarize what the CLI can actually do after introspection.
Prefer task clusters over endpoint lists:

- **Read operations**: list, get, search, filter, inspect status
- **Write operations**: create, update, delete, archive, send, publish, trigger, or other domain actions
- **Automation**: stable `--json` output for chaining with other tools
- **Discovery**: `--help` works at CLI, resource, and action level

If the API exposes special actions, call them out explicitly. Example:

- "Resolve LinkedIn URLs before creating a social post"
- "Send transactional email, inspect delivery state, and manage inboxes"
- "Create invoices, inspect account balances, and trigger transfers"

### `Common Use Cases`

Add 3-6 short examples phrased like real requests an agent might receive.

Example format:

- "List the latest unread inbox messages and summarize what needs a reply."
- "Create a draft from this text and schedule it for tomorrow."
- "Fetch the latest invoices, then export the result as JSON for another tool."

The goal is to teach the agent what the CLI is good at, not only what commands exist.

## 5. Build the resource documentation

For EACH resource, create a table with every available command. Use the actual output from `--help` to get flags and descriptions.

### Resource table format

```markdown
### <resource>

| Command | Description |
|---------|-------------|
| `<app>-cli <resource> list --json` | List all <resource> |
| `<app>-cli <resource> get <id> --json` | Get a <resource> by ID |
| `<app>-cli <resource> create --<flag1> "value" --<flag2> "value" --json` | Create a <resource> |
| `<app>-cli <resource> update <id> --<flag1> "value" --json` | Update a <resource> |
| `<app>-cli <resource> delete <id> --json` | Delete a <resource> |
```

### Rules for resource tables

1. **Run `--help` for every action** to get real flags — never guess
2. **Include all available actions**, not just CRUD (e.g. `resolve-linkedin`, `upload`, `schedule-set`)
3. **Show the most useful flag combinations** in examples — if an action has 5 optional flags, show the 2-3 most common ones
4. **Every command example must include `--json`**
5. **Include actual flags from `--help`**, not guessed ones
6. **For commands with required args**, show them as `<arg-name>` positional params
7. **For enum flags** (e.g. `--status scheduled|published|draft`), show one example per useful value if the resource has few actions, or the most common value if it has many

### Example of a complete resource section

```markdown
### drafts

| Command | Description |
|---------|-------------|
| `app-cli drafts list <social-set-id> --json` | List all drafts |
| `app-cli drafts list <social-set-id> --status scheduled --json` | List scheduled drafts |
| `app-cli drafts list <social-set-id> --tags marketing --json` | List drafts by tag |
| `app-cli drafts get <social-set-id> <draft-id> --json` | Get a draft by ID |
| `app-cli drafts create <social-set-id> --text "Hello!" --platform x,linkedin --json` | Create a draft |
| `app-cli drafts create <social-set-id> --text "Now!" --publish-at now --json` | Create and publish immediately |
| `app-cli drafts update <social-set-id> <draft-id> --text "Updated" --json` | Update draft text |
| `app-cli drafts delete <social-set-id> <draft-id> --json` | Delete a draft |
```

## 6. Include the Quick Reference and Output Format sections

Always include these two sections so the agent knows how to discover detailed flags and parse responses:

**Quick Reference** — so the agent can run `--help` at runtime for flags not listed in the skill:

    ## Quick Reference

    ```bash
    <app>-cli --help                    # List all resources and global flags
    <app>-cli <resource> --help         # List all actions for a resource
    <app>-cli <resource> <action> --help # Show flags for a specific action
    ```

**Output Format** — so the agent knows how to parse the JSON response:

    ## Output Format

    `--json` returns a standardized envelope:
    ```json
    { "ok": true, "data": { ... }, "meta": { "total": 42 } }
    ```

    On error: `{ "ok": false, "error": { "message": "...", "status": 401 } }`

## 7. Update the README

Edit `~/.cli/<app>-cli/README.md`:

1. Replace `{{RESOURCES_HELP}}` with the same resource tables from step 5
2. Replace `{{GITHUB_REPO}}` with the GitHub repo path (e.g. `Melvynx/typefully-cli`)

## 8. Symlink skill to agent directories

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

## 9. Validate the generated skill

After writing the skill, verify it works end-to-end:

```bash
# Pick one resource and run a read command to confirm the skill's examples are correct
<app>-cli <resource> list --json

# Verify the output matches the documented format
# Expected: { "ok": true, "data": [...], "meta": { ... } }
```

If the command fails or the output format differs, fix the skill before proceeding.

## Quality checklist

Before considering the skill done, verify:

- [ ] Description lists ALL resources by name
- [ ] Description includes domain-specific trigger phrases (not just the app name)
- [ ] Description is written in third person
- [ ] Category is set to a specific value (not `other` unless nothing fits)
- [ ] `When To Use This Skill` explains the jobs the CLI is good at
- [ ] `Capabilities` summarizes real operations, not only resource names
- [ ] `Common Use Cases` includes realistic, domain-specific agent tasks
- [ ] Every resource from `<app>-cli --help` has its own table
- [ ] Every action from `<resource> --help` has at least one row in the table
- [ ] All flags come from actual `--help` output, not guesses
- [ ] Every command example includes `--json`
- [ ] Quick Reference section with `--help` commands is present
- [ ] Output Format section documents the JSON envelope
- [ ] Auth section shows `set`, `test` commands
- [ ] No `{{...}}` placeholders remain in the file
- [ ] No `<!-- TODO -->` comments remain in the file
- [ ] At least one command was tested to verify the skill is accurate
- [ ] SKILL.md is under 500 lines
