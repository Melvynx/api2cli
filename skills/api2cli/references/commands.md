# api2cli Commands Reference

All commands use `npx api2cli` (no global install needed).

## Core Commands

### create

Generate a new CLI from API documentation.

```bash
npx api2cli create <app> [options]
```

| Flag | Description | Default |
|------|-------------|---------|
| `<app>` | API/app name (e.g. typefully, dub) | required |
| `--base-url <url>` | API base URL | `https://api.example.com` |
| `--auth-type <type>` | bearer, api-key, basic, custom | `bearer` |
| `--auth-header <name>` | Auth header name | `Authorization` |
| `--docs <url>` | API docs URL | - |
| `--openapi <url>` | OpenAPI/Swagger spec URL | - |
| `--force` | Overwrite existing CLI | `false` |

Examples:
```bash
npx api2cli create typefully --base-url https://api.typefully.com --auth-type bearer
npx api2cli create dub --openapi https://api.dub.co/openapi.json
npx api2cli create my-api --docs https://docs.example.com/api
```

### bundle

Build a CLI from source.

```bash
npx api2cli bundle [app] [options]
```

| Flag | Description | Default |
|------|-------------|---------|
| `[app]` | CLI to build (omit with --all) | - |
| `--compile` | Create standalone binary (~50MB) | `false` |
| `--all` | Build all installed CLIs | `false` |

### link / unlink

Add or remove a CLI from PATH.

```bash
npx api2cli link [app] [--all]
npx api2cli unlink <app>
```

## Management Commands

### list

List all installed CLIs with build and auth status.

```bash
npx api2cli list [--json]
```

### tokens

List all configured API tokens (masked by default).

```bash
npx api2cli tokens [--show]
```

### remove

Remove a CLI entirely (directory, PATH entry, and token).

```bash
npx api2cli remove <app> [--keep-token]
```

### doctor

Check system requirements (bun, git, directories).

```bash
npx api2cli doctor
```

### update

Re-sync a CLI when the upstream API changes.

```bash
npx api2cli update <app> [--docs <url>] [--openapi <url>]
```

This is agent-driven: update resources in `<cli>/src/resources/` then rebuild.

## Registry Commands

### search

Search the api2cli registry before generating a new wrapper.

```bash
npx api2cli search <query> [--type <all|wrapper|official>] [--category <cat>] [--sort <popular|votes|newest>] [--limit <n>] [--json]
```

| Flag | Description | Default |
|------|-------------|---------|
| `<query>` | Search term (e.g. agentmail, email, vercel) | required |
| `--type <type>` | Filter by CLI type | `all` |
| `--category <cat>` | Filter by category | - |
| `--sort <sort>` | Sort matches | `popular` |
| `--limit <n>` | Max results shown | `10` |
| `--json` | Output structured JSON results | `false` |

```bash
npx api2cli search agentmail
npx api2cli search email --type wrapper
npx api2cli search vercel --category devtools --json
```

### install

Install a CLI from a GitHub repo or from an app name found in the registry. Clones, builds, links to PATH, and symlinks the skill to agent directories.

```bash
npx api2cli install <source> [--force]
```

| Flag | Description |
|------|-------------|
| `<source>` | GitHub repo (`owner/repo`, full URL, or app name from registry) |
| `--force` | Overwrite existing CLI |

```bash
npx api2cli install Melvynx/typefully-cli
npx api2cli install https://github.com/Melvynx/typefully-cli
npx api2cli install typefully    # looks up in api2cli.dev registry
```
