export default function Commands() {
  return (
    <div>
      <h1>Commands Reference</h1>
      <p>Every command available in the api2cli ecosystem.</p>

      <h2>CLI Manager: api2cli</h2>
      <table>
        <thead>
          <tr>
            <th>Command</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["create <app>", "Generate a new CLI from API docs"],
            ["bundle <app>", "Build a CLI from source"],
            ["bundle --all", "Build all installed CLIs"],
            ["link <app>", "Add a CLI to PATH"],
            ["link --all", "Link all CLIs"],
            ["unlink <app>", "Remove from PATH"],
            ["list", "List all installed CLIs"],
            ["tokens", "List all configured tokens (masked)"],
            ["remove <app>", "Remove a CLI entirely"],
            ["doctor", "Check system requirements"],
            ["install <repo>", "Install a CLI from GitHub (clone, build, link, symlink skill)"],
            ["publish <app>", "Publish to registry (use web UI or API instead)"],
            ["update <app>", "Re-sync with API changes"],
          ].map(([cmd, desc]) => (
            <tr key={cmd}>
              <td>
                <code>api2cli {cmd}</code>
              </td>
              <td>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Generated CLIs: &lt;app&gt;-cli</h2>
      <p>
        Every generated CLI follows these exact conventions. Replace{" "}
        <code>&lt;app&gt;</code> with your CLI name (e.g.{" "}
        <code>typefully-cli</code>).
      </p>

      <h3>Authentication</h3>
      <pre>
        <code>{`<app>-cli auth set <token>     # Save token (chmod 600)
<app>-cli auth show            # Display masked token
<app>-cli auth show --raw      # Display full token
<app>-cli auth test            # Verify token works
<app>-cli auth remove          # Delete token`}</code>
      </pre>

      <h3>Resources (CRUD)</h3>
      <pre>
        <code>{`<app>-cli <resource> list      # GET /resource
<app>-cli <resource> get <id>  # GET /resource/:id
<app>-cli <resource> create    # POST /resource
<app>-cli <resource> update <id>  # PATCH /resource/:id
<app>-cli <resource> delete <id>  # DELETE /resource/:id`}</code>
      </pre>

      <h3>Global Flags</h3>
      <table>
        <thead>
          <tr>
            <th>Flag</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["--json", "JSON output {ok, data, meta}"],
            ["--format <text|json|csv|yaml>", "Output format"],
            ["--verbose", "Debug logging"],
            ["--no-color", "Disable colors"],
            ["--no-header", "Omit table headers (for piping)"],
          ].map(([flag, desc]) => (
            <tr key={flag}>
              <td>
                <code>{flag}</code>
              </td>
              <td>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Help</h3>
      <pre>
        <code>{`# Help at every level
<app>-cli --help
<app>-cli <resource> --help
<app>-cli <resource> <action> --help`}</code>
      </pre>
    </div>
  );
}
