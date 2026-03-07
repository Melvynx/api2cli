# openbrewery-cli

A CLI for the [Open Brewery DB](https://www.openbrewerydb.org/) API. No API key required.

## Setup

Install workspace dependencies from the **repo root** (so this package’s dependencies are resolved):

```bash
cd /Users/pyry/g/api2cli
bun install
```

Then build (optional, for a standalone script):

```bash
cd packages/openbrewery-cli && bun run build
```

## Run

**Just type this** (from repo root; no `bun` in the command):

```bash
make brew
make brew list --per-page 10
make brew search sierra
make brew random --size 3
make brew get 10-barrel-brewing-san-diego
```

`make brew` with no args lists 5 breweries. Build a standalone binary once so it runs without Bun at all:

```bash
make build-brew   # then "make brew" uses the binary
```

**From repo root** (with bun in the command):

```bash
bun run openbrewery -- breweries list --per-page 5
bun run openbrewery -- breweries random --size 2
bun run openbrewery -- breweries search "sierra" --json
```

**From this package** (after `bun install` at root):

```bash
cd packages/openbrewery-cli
bun run dev -- breweries list --per-page 5
```

**Using the built binary** (after `bun run build`):

```bash
./packages/openbrewery-cli/dist/index.js breweries list --per-page 5
```

## Usage

### Breweries

```bash
# List breweries (with optional filters)
openbrewery-cli breweries list
openbrewery-cli breweries list --by-city "San Diego" --per-page 10
openbrewery-cli breweries list --by-type micro --by-state "California"
openbrewery-cli breweries list --by-dist "37.7749,-122.4194" --per-page 5
openbrewery-cli breweries list --sort name:asc --json

# Get a single brewery by ID
openbrewery-cli breweries get 10-barrel-brewing-san-diego

# Random brewery(ies)
openbrewery-cli breweries random
openbrewery-cli breweries random --size 5 --json

# Search by name
openbrewery-cli breweries search "sierra"
openbrewery-cli breweries search "barrel" --per-page 20 --json

# Metadata (total count with same filters as list)
openbrewery-cli breweries meta
openbrewery-cli breweries meta --by-country "United States" --json
```

### Global flags

- `--json` — structured JSON output (for piping / agents)
- `--format <text|json|csv|yaml>`
- `--verbose` — debug logging
- `--no-color` / `--no-header`

### Auth

Open Brewery DB is a public API; no token is required. The `auth` commands are available for consistency with other api2cli CLIs:

```bash
openbrewery-cli auth test   # Verify API connectivity
openbrewery-cli auth show   # Show token if set (optional)
```

## Brewery types

Filter with `--by-type`: `micro`, `nano`, `regional`, `brewpub`, `large`, `planning`, `contract`, `proprietor`, `closed`.
