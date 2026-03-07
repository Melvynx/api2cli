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

      <h2>2. Tell Your Agent What You Need</h2>
      <p>Just ask in natural language. Your agent reads the skill and does everything:</p>

      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
          <p className="!mb-0 font-mono text-sm">
            &ldquo;Create a CLI for the Typefully API&rdquo;
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
          <p className="!mb-0 font-mono text-sm">
            &ldquo;I need to manage Stripe subscriptions from the terminal&rdquo;
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
          <p className="!mb-0 font-mono text-sm">
            &ldquo;Wrap the Notion API so I can query databases via CLI&rdquo;
          </p>
        </div>
      </div>

      <p className="mt-4">Your agent will automatically:</p>
      <ol>
        <li>Search for the API documentation</li>
        <li>Identify endpoints, auth type, and base URL</li>
        <li>Generate a standardized CLI with all resources</li>
        <li>Build it and add it to your PATH</li>
        <li>Test the connection</li>
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
        <a href="/">marketplace</a>. Someone may have already built it:
      </p>
      <pre>
        <code>npx api2cli install typefully</code>
      </pre>
      <p>
        One command. Downloads, builds, and links to your PATH instantly.
      </p>

      <h2>Manage Your Skills</h2>
      <pre>
        <code>{`# List installed skills
npx skills list

# Search for skills
npx skills find api

# Check for updates
npx skills check

# Update all skills
npx skills update

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
