export default function Marketplace() {
  return (
    <div>
      <h1>Registry</h1>
      <p>
        The api2cli registry lets the community share CLI wrappers. Before
        building a CLI from scratch, check if someone already built it.
      </p>

      <h2>Install a CLI</h2>
      <p>
        Install any CLI from its GitHub repo. This clones the repo, installs
        dependencies, builds it, links it to your PATH, and symlinks the
        AgentSkill to your coding agents.
      </p>
      <pre>
        <code>{`# From GitHub repo
npx api2cli install owner/repo
npx api2cli install https://github.com/owner/repo

# Reinstall (overwrite existing)
npx api2cli install owner/repo --force`}</code>
      </pre>
      <p>
        One command. Your CLI is ready to use and your agent knows how to use
        it via the symlinked skill.
      </p>

      <h2>What install does</h2>
      <ol>
        <li>Clones the GitHub repo to <code>~/.cli/&lt;app&gt;-cli/</code></li>
        <li>Runs <code>bun install</code> to install dependencies</li>
        <li>Builds the CLI with <code>bun build</code></li>
        <li>Creates a symlink in <code>~/.local/bin/</code> and updates your shell PATH</li>
        <li>Symlinks <code>skills/&lt;app&gt;-cli/SKILL.md</code> to your agent directories (<code>~/.claude/skills/</code>, <code>~/.cursor/skills/</code>, etc.)</li>
      </ol>

      <h2>Publish Your CLI</h2>
      <p>
        Share your CLI with the community. Push your repo to GitHub, then
        publish it to the registry:
      </p>

      <h3>Via the website</h3>
      <p>
        Click the <strong>&quot;+ Add my CLI&quot;</strong> button on the{" "}
        <a href="/">registry homepage</a>. Paste your GitHub URL
        (<code>owner/repo</code> or full URL).
      </p>

      <h3>Via the API</h3>
      <pre>
        <code>{`curl -X POST https://api2cli.dev/api/publish-cli \\
  -H "Content-Type: application/json" \\
  -d '{"githubUrl": "owner/repo"}'`}</code>
      </pre>

      <h3>What gets auto-detected</h3>
      <p>The registry fetches from your GitHub repo:</p>
      <ul>
        <li><strong>Repo info</strong> - description, stars, topics</li>
        <li><strong>package.json</strong> - name, version</li>
        <li><strong>README.md</strong> - auth type detection (bearer, api-key, basic)</li>
        <li><strong>SKILL.md</strong> - skill name and description from frontmatter</li>
        <li><strong>Category</strong> - auto-assigned from keywords (social, finance, devtools, etc.)</li>
      </ul>

      <h2>Categories</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Keywords</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Social Media", "social, twitter, mastodon, bluesky"],
            ["Developer Tools", "dev, git, ci, cd, deploy, build"],
            ["Finance", "finance, bank, payment, stripe, invoice"],
            ["Marketing", "marketing, email, newsletter, seo, campaign"],
            ["Productivity", "productivity, task, todo, note, calendar"],
            ["Communication", "chat, message, slack, discord"],
            ["Analytics", "analytics, metric, monitor, dashboard"],
            ["AI & ML", "ai, ml, llm, gpt, claude, openai"],
            ["E-Commerce", "ecommerce, shop, store, product, order"],
          ].map(([cat, keywords]) => (
            <tr key={cat}>
              <td>
                <strong>{cat}</strong>
              </td>
              <td><code>{keywords}</code></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="callout">
        <div className="callout-title">Your repo needs a skills/ folder</div>
        <p className="!mb-0">
          When you create a CLI with <code>npx api2cli create</code>, it
          automatically includes <code>skills/&lt;app&gt;-cli/SKILL.md</code>.
          Update it with your actual resources before publishing. See{" "}
          <a href="/docs/create-cli">Create a CLI</a> for the full workflow.
        </p>
      </div>
    </div>
  );
}
