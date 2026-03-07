export default function GettingStarted() {
  return (
    <div>
      <h1>Getting Started</h1>
      <p>
        Install the api2cli skill in your AI agent. Tell it what API you need.
        Done. Your agent handles everything.
      </p>

      <h2>1. Install the Skill</h2>
      <pre>
        <code>npx skills add Melvynx/api2cli</code>
      </pre>
      <p>
        That&apos;s it. The{" "}
        <a href="https://github.com/vercel-labs/skills">
          skills CLI
        </a>{" "}
        auto-detects your coding agents (Claude Code, Cursor, Codex, OpenClaw,
        Gemini CLI, and{" "}
        <a href="https://github.com/vercel-labs/skills#available-agents">
          37+ more
        </a>
        ) and installs the skill to all of them.
      </p>

      <h3>Options</h3>
      <pre>
        <code>{`# Install to specific agents only
npx skills add Melvynx/api2cli -a claude-code -a cursor

# Install globally (available across all projects)
npx skills add Melvynx/api2cli -g

# Install specific skill from the repo
npx skills add Melvynx/api2cli --skill api2cli

# Non-interactive (CI/CD friendly)
npx skills add Melvynx/api2cli -g -a claude-code -y

# Direct path to skill
npx skills add https://github.com/Melvynx/api2cli/tree/dev/skills/api2cli

# List available skills without installing
npx skills add Melvynx/api2cli --list`}</code>
      </pre>

      <h2>2. Ask Your Agent</h2>
      <p>
        Just tell your agent what you need in plain English:
      </p>

      <pre>
        <code>{`> Use api2cli to create CLI for typefully api

⏺ I'll create a CLI for the Typefully API. Let me start by discovering the API.
  → Finding API docs...
  → Base URL: https://api.typefully.com
  → Auth: Bearer token
  → Generating resources: drafts, notifications, accounts
  → Building CLI...
  → Linking to PATH...

✅ typefully-cli is ready to use!`}</code>
      </pre>

      <p>More examples:</p>

      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
          <p className="!mb-0 font-mono text-sm">
            Use api2cli to create CLI for stripe api
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
          <p className="!mb-0 font-mono text-sm">
            Use api2cli to create CLI for notion api
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
          <p className="!mb-0 font-mono text-sm">
            Use api2cli to create CLI for linear api
          </p>
        </div>
      </div>

      <p className="mt-4">Your agent automatically:</p>
      <ol>
        <li>Discovers the API documentation</li>
        <li>Identifies endpoints, auth type, and base URL</li>
        <li>Generates a standardized CLI with all resources</li>
        <li>Builds it and adds it to your PATH</li>
        <li>Tests the connection</li>
      </ol>

      <h2>3. Use Your CLI</h2>
      <p>
        Once the agent finishes, your CLI is ready:
      </p>
      <pre>
        <code>{`# Set your API token
typefully-cli auth set "typ_xxx"

# Start using it
typefully-cli drafts list
typefully-cli drafts create --text "Hello world"

# Works with any agent via --json
typefully-cli drafts list --json`}</code>
      </pre>

      <h2>Or Install an Existing CLI</h2>
      <p>
        Before creating a new CLI, check the{" "}
        <a href="/">registry</a>. Someone may have already built it:
      </p>
      <pre>
        <code>{`# Install from GitHub repo
npx api2cli install owner/repo`}</code>
      </pre>
      <p>
        This clones the repo, installs dependencies, builds, links to your
        PATH, and symlinks the AgentSkill to your coding agents. One command,
        fully ready.
      </p>

      <h2>Manage Your Skills</h2>
      <pre>
        <code>{`# List installed skills
npx skills list

# Remove a skill
npx skills remove api2cli`}</code>
      </pre>

      <div className="callout">
        <div className="callout-title">Want to go deeper?</div>
        <p className="!mb-0">
          Learn about the{" "}
          <a href="/docs/resources">resource pattern</a>,{" "}
          <a href="/docs/commands">all CLI commands</a>, or how to{" "}
          <a href="/docs/marketplace">publish to the marketplace</a>.
        </p>
      </div>
    </div>
  );
}
