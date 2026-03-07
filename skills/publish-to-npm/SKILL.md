---
name: publish-to-npm
description: Publishes an api2cli-generated CLI package to the npm registry. Handles package.json validation, version bumping, building, and npm publish. Use when user asks to "publish to npm", "release to npm", "publish this CLI", "npm publish", "make this installable via npx", or "publish a new version".
---

# Publish to npm

Publish an api2cli-generated CLI to the npm registry so users can install it with `npm i -g <name>` or run it with `npx <name>`.

## Phase 1: Pre-flight

Run these checks silently. Only stop if auth is missing.

### Auth

Run `npm whoami`.

- If it succeeds: note the username, continue.
- If it fails: tell the user to run `npm login` first. **Stop and wait** until they confirm.

### Resolve package name

Read `name` from `package.json`. Determine the publish name:

- If `name` has template placeholders (`{{APP_CLI}}`), derive the name from the directory name (e.g. `~/.cli/typefully-cli/` → `typefully-cli`).
- Run `npm view <name> version`:
  - **404 (not found):** this is a first-time publish. Name is available; use it.
  - **Returns a version owned by the same npm user:** this is a repeat publish.
  - **Returns a version owned by someone else:** the name is taken. Switch to `@<npm-username>/<name>` automatically.

### Resolve version

- **First-time publish:** use the version already in `package.json`.
- **Repeat publish:** read the currently published version, increment the patch number (e.g. `0.1.2` → `0.1.3`). If the user explicitly asked for a minor or major bump, use that instead.

## Phase 2: Validate package.json

Fix `package.json` so it's npm-ready. See [references/package-checklist.md](references/package-checklist.md) for details.

Apply silently:
- `name` and `version` match resolved values
- `bin` points to `./dist/index.js`
- `files` is `["dist", "README.md"]`
- `type` is `"module"`

Apply and mention briefly:
- `description` — set if missing or placeholder
- `repository` — read from `git remote get-url origin`
- `license` — default to `"MIT"` if missing
- `engines` — add `"bun": ">=1.0"` if shebang is `#!/usr/bin/env bun`

## Phase 3: Build

```bash
bun run build
```

- **If build fails**: **STOP**. Show the error. Do not continue. Help fix the build if possible, then retry.

## Phase 4: Verify

Run `npm pack --dry-run` silently and check:
- `dist/index.js` is included
- No `src/`, `node_modules/`, `.env`, or token files leaked in
- Total size is under 100KB (typical for a bundled JS CLI; if larger, warn the user)

If anything looks wrong, stop and tell the user what's off. Otherwise continue.

## Phase 5: Confirm and publish

Present one summary for confirmation:

```
Ready to publish:
  <name>@<version>  (first-time / update)
  account: <npm-username>
  files:   dist/index.js, README.md, package.json (<size>)
  install: npm i -g <name>
```

Ask: **"Publish?"**

If user confirms:

```bash
npm publish --access public
```

- If 2FA prompts for OTP, tell the user to enter it.
- **If publish fails**:
  - `E403`: name taken or no permission → retry with scoped name
  - `E402`: scoped package defaulted to restricted → already using `--access public`, report
  - `ENEEDAUTH`: not logged in → tell user to `npm login`

## Phase 6: Done

After successful publish, report:
- `https://www.npmjs.com/package/<name>`
- `npm i -g <name>`
- `npx <name> --help`

## Do NOT

- Do not publish if the build failed.
- Do not retry `npm login` or handle 2FA programmatically.
- Do not publish files outside `dist/` and `README.md` unless the user explicitly asks.
- Do not run `npm version` (creates git tags); bump version in `package.json` directly.
