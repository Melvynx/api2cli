# package.json Checklist for npm Publishing

Field-by-field reference for making an api2cli-generated CLI npm-ready.

## Required fields

| Field | Value | Notes |
|-------|-------|-------|
| `name` | `<app>-cli` or `@scope/<app>-cli` | Must be unique on npm. Check with `npm view <name>`. |
| `version` | semver, e.g. `0.1.0` | Bump before each publish. |
| `bin` | `{ "<command>": "./dist/index.js" }` | The command name users type. Entry must exist after build. |
| `files` | `["dist", "README.md"]` | Whitelist only published artifacts. Keeps package small. |
| `type` | `"module"` | api2cli template uses ESM. |

## Recommended fields

| Field | Value | Notes |
|-------|-------|-------|
| `description` | 1-sentence summary | Shown on npmjs.com and in search results. |
| `repository` | `{ "type": "git", "url": "git+https://github.com/…" }` | Read from `git remote get-url origin`. Required for trusted publishing. |
| `license` | `"MIT"` | Default for open-source CLIs. Ask user if unsure. |
| `keywords` | `["cli", "api", "<app-name>"]` | Helps discoverability. |
| `engines` | `{ "bun": ">=1.0" }` | If the shebang is `#!/usr/bin/env bun`. Warns users without bun. |
| `homepage` | GitHub repo URL or docs URL | Shown on npmjs.com. |
| `author` | Name or `"Name <email>"` | Shows on package page. |

## Fields to remove or avoid

| Field | Reason |
|-------|--------|
| `devDependencies` | Not needed in published package (npm ignores them on install anyway, but `files` already excludes source). |
| `scripts.dev` | Not useful to consumers. Keep `build` for contributors. |

## Shebang

The built entry (`dist/index.js`) must start with a shebang so `bin` works when installed globally:

```
#!/usr/bin/env bun
```

The api2cli template's `src/index.ts` already has this. Verify it survives the build:

```bash
head -1 dist/index.js
```

If the bundler strips it, add it back:

```bash
echo '#!/usr/bin/env bun' | cat - dist/index.js > dist/tmp && mv dist/tmp dist/index.js
```

## Example package.json (ready to publish)

```json
{
  "name": "typefully-cli",
  "version": "0.1.0",
  "description": "CLI for the Typefully API",
  "type": "module",
  "bin": {
    "typefully-cli": "./dist/index.js"
  },
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "build": "bun build src/index.ts --outfile dist/index.js --target bun"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/your-org/typefully-cli.git"
  },
  "keywords": ["cli", "api", "typefully"],
  "license": "MIT",
  "engines": {
    "bun": ">=1.0"
  },
  "dependencies": {
    "commander": "^13.0.0"
  }
}
```

## Verifying before publish

```bash
# Check what will be included
npm pack --dry-run

# Expected output (roughly):
#   dist/index.js
#   README.md
#   package.json
#   Total: ~5-20KB
```

## Scoped packages

If the unscoped name is taken, use a scope:

```json
{
  "name": "@yourname/typefully-cli"
}
```

Scoped packages default to `restricted` (private). To publish as public:

```bash
npm publish --access public
```

Or add to package.json:

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```
