---
name: api2cli-publish-to-npm
description: Publishes an api2cli-generated CLI package to the npm registry. Handles package.json validation, version bumping, building, and npm publish. Use when user asks to "publish to npm", "release to npm", "publish this CLI", "npm publish", "make this installable via npx", "publish a new version", or "update npm".
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
  - **"Unpublished":** the name is frozen for 24 hours after unpublish. Ask the user to pick a different name or wait. Check alternatives like `<app>-cli`, `<app>db-cli`, etc.
  - **Returns a version owned by the same npm user:** this is a repeat publish.
  - **Returns a version owned by someone else:** the name is taken. Switch to `@<npm-username>/<name>` automatically.

### Resolve version

- **First-time publish:** use the version already in `package.json`.
- **Repeat publish:** read the currently published version, increment the patch number (e.g. `0.1.2` → `0.1.3`). If the user explicitly asked for a minor or major bump, use that instead.

## Phase 2: Validate package.json

Fix `package.json` so it's npm-ready. See [references/package-checklist.md](references/package-checklist.md) for details.

Apply silently:
- `name` and `version` match resolved values
- `bin` key matches the npm package name and points to `./dist/index.js`
- `files` is `["dist/index.js", "README.md"]` — explicitly exclude compiled binaries (e.g. `dist/<app>-cli`) which can be 50MB+
- `type` is `"module"`

Apply and mention briefly:
- `description` — set if missing or placeholder
- `repository` — read from `git remote get-url origin`
- `license` — default to `"MIT"` if missing
- `engines` — add `"bun": ">=1.0"` if shebang is `#!/usr/bin/env bun`

### Name changes

If the npm package name differs from the scaffold name, update `name` and `bin` key in `package.json`, all command references in `README.md`, and `SKILL.md`. Do a thorough search — partial find-and-replace easily misses references in code blocks.

## Phase 3: Audit README for npm consumers

**Before building**, read the README and check it makes sense to a stranger who found this package on npmjs.com — not a monorepo contributor.

### Required sections

The README must have all of the following. If any are missing or wrong, rewrite them:

1. **Install section** at the top with:
   ```
   npm i -g <name>
   # or
   npx <name> --help
   ```

2. **Usage section** using the final npm package name as the command (e.g. `breweries-cli breweries list`), not internal dev invocations like `bun run dev --`, `make brew`, or `bun run src/index.ts`.

3. **No absolute local paths** — scan for `/Users/`, `/home/`, `~/g/`, or any path that only exists on the author's machine. Remove or replace with generic instructions.

4. **No monorepo-internal instructions** — remove any steps that require cloning the repo, running `bun install` at a workspace root, using `make`, or cd-ing into a sub-package. Move these to a `## Development` section at the bottom if needed.

### Angle bracket escaping

npm's markdown renderer strips bare `<text>` as HTML tags. Check all option descriptions and replace unescaped angle brackets:

- Bad: `--format <text|json|csv|yaml>`
- Good: `--format <fmt>` where `<fmt>` is one of: `text`, `json`, `csv`, `yaml`
- Or: wrap in a code block where angle brackets are safe

## Phase 4: Build

```bash
bun run build
```

- **If build fails**: **STOP**. Show the error. Do not continue. Help fix the build if possible, then retry.

After building, verify the shebang survived:

```bash
head -1 dist/index.js
```

It must be `#!/usr/bin/env bun`. If missing, prepend it:

```bash
echo '#!/usr/bin/env bun' | cat - dist/index.js > dist/tmp && mv dist/tmp dist/index.js
chmod +x dist/index.js
```

## Phase 5: Verify

Run `npm pack --dry-run` and check:
- `dist/index.js` is included
- No `src/`, `node_modules/`, `.env`, token files, or large compiled binaries leaked in
- Total tarball size is under 200KB (typical for a bundled JS CLI). If larger, warn the user and check `files` in package.json

Then show the pack summary as a final sanity check:

```bash
npm pack --dry-run 2>&1 | head -30
```

Ask the user: **"Does the README look right for an npm package page?"** before continuing.

## Phase 6: Confirm and publish

Present one summary for confirmation:

```
Ready to publish:
  <name>@<version>  (first-time / update)
  account: <npm-username>
  files:   dist/index.js, README.md, package.json (<size>)
  install: npm i -g <name>
  npx:     npx <name> --help
```

Ask: **"Publish?"**

If user confirms, tell them to run this command in their terminal:

```bash
cd <cli-directory> && npm publish --access public
```

The agent cannot run `npm publish` itself because npm's 2FA requires interactive browser authentication. The user must run the command, which will:
1. Show "Authenticate your account at: `<url>`"
2. Open their browser to authenticate (passkey, OTP, etc.)
3. Complete the publish

If publish fails, read the error and help the user resolve it.

## Phase 7: Done

After successful publish, report:
- `https://www.npmjs.com/package/<name>`
- `npm i -g <name>`
- `npx <name> --help`


## Updating an existing npm package

When the user asks to "update npm" or "publish a new version":

1. **Bump version** in `package.json` (patch by default, e.g. `0.1.1` → `0.1.2`). Do not use `npm version` (it creates git tags).
2. **Rebuild**: `bun run build`
3. **Verify shebang**: `head -1 dist/index.js` must be `#!/usr/bin/env bun`
4. **Verify pack**: `npm pack --dry-run 2>&1` — confirm files and size look correct
5. **Tell user to publish** in their terminal: `cd <cli-directory> && npm publish --access public`

If the update includes a name change (e.g. renaming the command), follow the Name Changes checklist in Phase 2 before building.

## Do NOT

- Do not publish if the build failed.
- Do not run `npm publish` from the agent shell — it requires interactive browser auth. Always tell the user to run it in their terminal.
- Do not retry `npm login` or handle 2FA programmatically.
- Do not publish files outside `dist/index.js` and `README.md` unless the user explicitly asks.
- Do not run `npm version` (creates git tags); bump version in `package.json` directly.
- Do not include the compiled standalone binary (`dist/<app>-cli`) in the published package — it is 50MB+ and not needed for npm consumers.
