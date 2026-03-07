export default function CreateCli() {
  return (
    <div>
      <h1>Create a CLI</h1>
      <p>
        Step-by-step guide to wrapping any REST API into a standardized CLI.
      </p>

      <h2>Step 1: Discover the API</h2>
      <p>
        Before creating anything, gather information about the API you want to
        wrap:
      </p>
      <ol>
        <li>Find the API documentation URL or OpenAPI spec</li>
        <li>
          Identify the <strong>base URL</strong> (e.g.{" "}
          <code>https://api.example.com</code>)
        </li>
        <li>
          Determine the <strong>auth type</strong>: bearer token, API key, or
          basic auth
        </li>
        <li>List all resources and their endpoints</li>
      </ol>

      <h2>Step 2: Scaffold</h2>
      <pre>
        <code>{`api2cli create <app-name> \\
  --base-url <api-base-url> \\
  --auth-type <bearer|api-key|basic> \\
  --docs <docs-url>            # optional
  --openapi <openapi-url>      # optional`}</code>
      </pre>

      <h3>Options</h3>
      <table>
        <thead>
          <tr>
            <th>Flag</th>
            <th>Description</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>--base-url</code>
            </td>
            <td>API base URL</td>
            <td>
              <code>https://api.example.com</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>--auth-type</code>
            </td>
            <td>Authentication method</td>
            <td>
              <code>bearer</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>--auth-header</code>
            </td>
            <td>Custom auth header name</td>
            <td>
              <code>Authorization</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>--docs</code>
            </td>
            <td>API docs URL (for AI-driven generation)</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <code>--openapi</code>
            </td>
            <td>OpenAPI/Swagger spec URL</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <code>--force</code>
            </td>
            <td>Overwrite existing CLI</td>
            <td>
              <code>false</code>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Step 3: Add Resources</h2>
      <p>
        Each API resource (drafts, users, links, etc.) gets its own file. See
        the <a href="/docs/resources">Resources guide</a> for the full pattern.
      </p>

      <h2>Step 4: Build and Link</h2>
      <pre>
        <code>{`# Build the CLI (generates a ~5KB JS bundle)
api2cli bundle <app>

# Add to your PATH (auto-updates .zshrc/.bashrc)
api2cli link <app>

# Verify it works
<app>-cli --help`}</code>
      </pre>
      <p>
        <code>api2cli link</code> creates a symlink in{" "}
        <code>~/.local/bin/</code> and adds it to your shell profile
        automatically. No manual PATH setup needed.
      </p>

      <h2>Step 5: Update the AgentSkill</h2>
      <p>
        The scaffold includes <code>skills/&lt;app&gt;-cli/SKILL.md</code>{" "}
        with placeholder sections. After implementing resources, update it
        with the actual commands and flags.
      </p>
      <p>
        This file teaches AI agents how to use your CLI. When you push the
        repo to GitHub, anyone can install the skill:
      </p>
      <pre>
        <code>npx skills add owner/repo</code>
      </pre>

      <h2>Step 6: Publish to the Registry</h2>
      <p>
        Push your repo to GitHub, then publish it to the{" "}
        <a href="/docs/marketplace">registry</a> so others can find and
        install it:
      </p>
      <ul>
        <li>
          <strong>Web:</strong> Click{" "}
          <strong>&quot;+ Add my CLI&quot;</strong> on the{" "}
          <a href="/">registry page</a> and paste your GitHub URL
        </li>
        <li>
          <strong>API:</strong>{" "}
          <code>curl -X POST api2cli.dev/api/publish-cli -d
          {`'{"githubUrl":"owner/repo"}'`}</code>
        </li>
      </ul>
      <p>
        Others can then install your CLI with one command:
      </p>
      <pre>
        <code>npx api2cli install owner/repo</code>
      </pre>

      <div className="callout">
        <div className="callout-title">What install does</div>
        <p className="!mb-0">
          Clones the repo, installs deps, builds, links to PATH, and
          symlinks the skill to the user&apos;s agent (Claude Code, Cursor,
          etc.). One command, fully ready.
        </p>
      </div>
    </div>
  );
}
