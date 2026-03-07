export default function GettingStarted() {
  return (
    <div>
      <h1>Getting Started</h1>
      <p>
        Install the api2cli skill in your AI agent and let it handle everything.
        No manual setup needed.
      </p>

      <h2>1. Install the Skill</h2>
      <p>
        Pick your agent and add the skill:
      </p>

      <h3>Claude Code</h3>
      <pre>
        <code>npx skills-cli add api2cli</code>
      </pre>
      <p>Or manually:</p>
      <pre>
        <code>cp -r skills/api2cli ~/.claude/skills/</code>
      </pre>

      <h3>Cursor</h3>
      <pre>
        <code>npx skills-cli add api2cli</code>
      </pre>

      <h3>OpenClaw</h3>
      <pre>
        <code>cp -r skills/api2cli ~/.openclaw/workspace/skills/</code>
      </pre>

      <p>
        Works with any agent that supports{" "}
        <a href="https://agentskills.io">AgentSkills</a>: Gemini CLI, GitHub
        Copilot, VS Code, Goose, Junie, Amp, and more.
      </p>

      <h2>2. Tell Your Agent What You Need</h2>
      <p>That&apos;s it. Just ask in natural language:</p>

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

      <div className="callout">
        <div className="callout-title">Want to go deeper?</div>
        <p className="!mb-0">
          Learn about the{" "}
          <a href="/docs/resources">resource pattern</a>,{" "}
          <a href="/docs/commands">all commands</a>, or how to{" "}
          <a href="/docs/marketplace">publish to the marketplace</a>.
        </p>
      </div>
    </div>
  );
}
