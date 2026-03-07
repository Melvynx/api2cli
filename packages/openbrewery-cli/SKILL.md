---
name: openbrewery-cli
description: "Query the Open Brewery DB from the terminal or an agent. Use when: listing breweries by city/country/state/type, getting a brewery by ID, searching by name, getting random breweries, or fetching metadata. No API key required."
---

# openbrewery-cli

CLI for the Open Brewery DB API. No authentication required.

## Commands

### breweries list

List breweries with optional filters and pagination.

```bash
openbrewery-cli breweries list [options]
```

Options: `--page`, `--per-page` (max 200), `--by-city`, `--by-country`, `--by-state`, `--by-postal`, `--by-type`, `--by-name`, `--by-ids` (comma-separated), `--by-dist` (lat,lng), `--sort` (e.g. name:asc), `--fields`, `--json`, `--format`.

### breweries get &lt;id&gt;

Get a single brewery by its ID (e.g. `10-barrel-brewing-san-diego`).

```bash
openbrewery-cli breweries get <id> [--json]
```

### breweries random

Get one or more random breweries.

```bash
openbrewery-cli breweries random [--size 1-50] [--json]
```

### breweries search &lt;query&gt;

Search breweries by name (partial, case-insensitive).

```bash
openbrewery-cli breweries search <query> [--page] [--per-page] [--json]
```

### breweries meta

Get total count with same filters as list.

```bash
openbrewery-cli breweries meta [--by-city] [--by-country] [--by-state] [--by-type] ... [--json]
```

### auth test

Verify API connectivity (no token required).

```bash
openbrewery-cli auth test
```

## Output

- Default: human-readable tables (list/search/random) or key-value (get/meta).
- `--json`: envelope `{ "ok": true, "data": ..., "meta": { "total" } }`.
- `--format csv|yaml` for other formats.

## Brewery types (for --by-type)

`micro`, `nano`, `regional`, `brewpub`, `large`, `planning`, `contract`, `proprietor`, `closed`.
