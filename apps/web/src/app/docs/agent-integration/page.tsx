export default function AgentIntegration() {
  return (
    <div>
      <h1>Agent Integration</h1>
      <p>
        api2cli uses the open{" "}
        <a href="https://agentskills.io">AgentSkills</a> standard. Install the
        skill once and it works across 40+ coding agents.
      </p>

      <h2>Install</h2>
      <pre>
        <code>npx skills add Melvynx/api2cli</code>
      </pre>
      <p>
        The{" "}
        <a href="https://github.com/vercel-labs/skills">skills CLI</a>{" "}
        auto-detects your installed agents and sets everything up.
      </p>

      <h2>Supported Agents</h2>
      <p>Works with any agent that supports AgentSkills:</p>

      <table>
        <thead>
          <tr>
            <th>Agent</th>
            <th>
              <code>--agent</code> flag
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Claude Code", "claude-code"],
            ["Cursor", "cursor"],
            ["Codex", "codex"],
            ["OpenClaw", "openclaw"],
            ["Gemini CLI", "gemini-cli"],
            ["GitHub Copilot", "github-copilot"],
            ["OpenCode", "opencode"],
            ["Amp", "amp"],
            ["Windsurf", "windsurf"],
            ["Cline", "cline"],
            ["Goose", "goose"],
            ["OpenHands", "openhands"],
            ["Junie", "junie"],
            ["Roo Code", "roo"],
            ["Kiro CLI", "kiro-cli"],
            ["Pi", "pi"],
          ].map(([name, flag]) => (
            <tr key={flag}>
              <td>{name}</td>
              <td>
                <code>{flag}</code>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={2}>
              <a href="https://github.com/vercel-labs/skills#available-agents">
                ...and 25+ more
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>How It Works</h2>
      <p>
        When you install the skill, it places a <code>SKILL.md</code> file in
        each agent&apos;s skill directory. This file teaches your agent:
      </p>
      <ul>
        <li>How to discover APIs and gather endpoint info</li>
        <li>
          How to run <code>api2cli create</code> with the right flags
        </li>
        <li>The resource pattern for implementing endpoints</li>
        <li>How to build, link, and test the CLI</li>
      </ul>

      <h2>Target Specific Agents</h2>
      <pre>
        <code>{`# Install only for Claude Code and Cursor
npx skills add Melvynx/api2cli -a claude-code -a cursor

# Install globally (all projects)
npx skills add Melvynx/api2cli -g

# Install globally for one agent
npx skills add Melvynx/api2cli -g -a claude-code`}</code>
      </pre>

      <h2>Usage</h2>
      <p>
        Once installed, just tell your agent in natural language:
      </p>
      <blockquote>
        &ldquo;Create a CLI for the Typefully API&rdquo;
      </blockquote>
      <p>
        The agent automatically discovers the API, generates resources, builds,
        and links the CLI. Zero manual work.
      </p>

      <h2>Why CLI for Agents?</h2>
      <p>
        CLIs are the most universal tool interface. Every AI agent can run shell
        commands. A standardized CLI means:
      </p>
      <ul>
        <li>
          <strong>Zero integration work</strong>: agents just run commands
        </li>
        <li>
          <strong>One pattern</strong>: learn one CLI, use them all
        </li>
        <li>
          <strong>JSON output</strong>: structured data with{" "}
          <code>--json</code>
        </li>
        <li>
          <strong>Deep help</strong>: agents discover commands via{" "}
          <code>--help</code>
        </li>
        <li>
          <strong>No MCP needed</strong>: works without servers or plugins
        </li>
      </ul>

      <div className="callout">
        <div className="callout-title">Discover more skills</div>
        <p className="!mb-0">
          Browse the skills directory at{" "}
          <a href="https://skills.sh">skills.sh</a> or search with{" "}
          <code>npx skills find</code>.
        </p>
      </div>
    </div>
  );
}
