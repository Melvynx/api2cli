---
name: api2cli-publish-to-github
description: Publishes an api2cli-generated CLI to a GitHub repository. Handles git init, .gitignore, committing, and gh repo create. Use when user asks to "push to github", "publish to github", "create a github repo", "add to github", or "put this on github".
---

# Publish to GitHub

Push an api2cli-generated CLI (from `~/.cli/<app>-cli/`) to a new GitHub repository.

## Phase 1: Pre-flight

### Auth

Run `gh auth status`. If not logged in, tell the user to run `gh auth login` first. **Stop and wait.**

Note the GitHub username from the output (e.g. `Logged in to github.com account <username>`).

### Resolve the CLI

If the user didn't specify which CLI, check `~/.cli/` and ask which one. Read `package.json` to get the package name.

## Phase 2: Prepare the repo

From the CLI directory (`~/.cli/<app>-cli/`):

1. **Ensure `.gitignore` exists** with at least:
   ```
   node_modules/
   dist/
   ```

2. **Init or check git:**
   - If no `.git/`: run `git init && git add -A && git commit -m "Initial commit: <app>-cli"`
   - If already a git repo: stage and commit any uncommitted changes.

3. **Never commit `node_modules/` or `dist/`.** If already tracked, `git rm -r --cached` them and rewrite history so secrets in dependencies don't trigger GitHub push protection.

## Phase 3: Create the repo and push

```bash
gh repo create <app>-cli --public --source=. --push --description "<description from package.json>"
```

- If `gh repo create` succeeds but push fails (e.g. push protection), fix the issue per Phase 2 and run `git push -u origin <branch> --force`.
- If `gh repo create` says "unable to add remote" (remote already exists), just push: `git push -u origin <branch>`.
- If the repo name is taken, ask the user for an alternative name.

## Phase 4: Done

Report:
- Repo URL: `https://github.com/<username>/<app>-cli`
- What was pushed (file count, branch name)

## Do NOT

- Do not commit `node_modules/`, `dist/`, `.env`, or token files.
- Do not force-push to an existing repo with other contributors without asking.
- Do not change the git user config.
