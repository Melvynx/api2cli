# api2cli

Turn any REST API into a standardized, agent-ready CLI in minutes.

## Packages

- `packages/cli` - The `api2cli` CLI manager
- `packages/template` - CLI scaffold template
- `apps/web` - api2cli.dev marketplace (Next.js + Neon)

## Skills

Pre-built CLI definitions in `skills/` - install with `api2cli install <name>`.

## Quick Start

```bash
# Install
npm i -g api2cli

# Install a pre-built CLI
api2cli install typefully

# Or generate from API docs
api2cli create my-api --docs https://api.example.com/docs

# Use it
typefully-cli auth set "typ_xxx"
typefully-cli drafts list
```

## License

MIT
