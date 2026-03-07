# api2cli - TODO & Roadmap

## Architecture Principles

- **Zero config** : tout marche out of the box, conventions > configuration
- **Composable** : chaque module fait UNE chose bien
- **Agent-first** : `--json` partout, help profond, erreurs structurées
- **Human-friendly** : belles tables, couleurs, messages clairs sans --json
- **Tiny** : JS bundles (~5KB), pas de binaires lourds sauf opt-in
- **Predictable** : même patterns partout, un agent qui apprend un CLI les connaît tous

---

## Phase 0 : Fondations (AVANT tout code)

### 0.1 - Conventions de code
- [ ] ESLint + Prettier config (shared au root)
- [ ] tsconfig strict shared
- [ ] Naming : `kebab-case` fichiers, `camelCase` variables, `PascalCase` types
- [ ] Pas de `any` sauf cast explicite documenté
- [ ] Pas de `console.log` brut -> utiliser `output()` ou `log()` wrappers
- [ ] Erreurs typées : jamais `throw new Error(string)`, toujours `CliError`
- [ ] Tests : au minimum un test par commande (`bun test`)
- [ ] Chaque fichier < 200 lignes, sinon split

### 0.2 - Structure monorepo clean
- [ ] `biome.json` au root (plus rapide que ESLint+Prettier, un seul outil)
- [ ] `bun.lockb` committed
- [ ] Scripts root : `bun run lint`, `bun run test`, `bun run build`
- [ ] CI GitHub Actions : lint + test + build sur chaque PR

---

## Phase 1 : Template (`packages/template`)

Le scaffold que `api2cli create` copie et customise. C'est LE coeur du projet.

### 1.1 - Core libs (ordre strict)
- [ ] `src/lib/errors.ts` - Types d'erreurs, formatage, exit codes
  - `CliError` class avec code, message, suggestion
  - `handleError()` qui respecte --json
  - Exit codes : 0 success, 1 API error, 2 usage error
- [ ] `src/lib/config.ts` - Constantes, chemins, app name
  - Lit `{{APP_NAME}}`, `{{BASE_URL}}`, etc. depuis le template
  - Exporte `APP_NAME`, `APP_CLI`, paths tokens
- [ ] `src/lib/auth.ts` - Token storage
  - `getToken()`, `setToken()`, `removeToken()`, `hasToken()`
  - Stockage : `~/.config/tokens/<app>-cli.txt`
  - Support multi-type : bearer, api-key, basic, custom header
  - `chmod 600` sur le fichier token
- [ ] `src/lib/client.ts` - HTTP client
  - Fetch natif Bun (zero deps)
  - Retry exponential backoff (429 + 5xx), max 3 tentatives
  - Timeout configurable (default 30s)
  - Intercepteur : inject auth header automatiquement
  - Logging debug avec `--verbose`
  - Support query params, body JSON, multipart/form-data (uploads)
- [ ] `src/lib/output.ts` - Formatage output
  - Formats : text (tables), json, csv, yaml
  - JSON envelope : `{ ok: true, data, meta: { total, page } }`
  - Tables : auto-width, truncate long values, header colors
  - `--fields` pour sélectionner les colonnes
  - `--no-header` pour piping
- [ ] `src/lib/logger.ts` - Logging
  - `log.info()`, `log.warn()`, `log.error()`, `log.debug()`
  - Silencieux en mode `--json` (sauf errors)
  - `--verbose` pour debug
  - Couleurs (chalk ou picocolors, ~2KB)

### 1.2 - Commandes built-in
- [ ] `src/commands/auth.ts` - Auth management
  - `auth set <token>` : sauvegarde + chmod 600
  - `auth show` : masqué par défaut, `--raw` pour full
  - `auth remove` : supprime le fichier
  - `auth test` : fait un GET sur un endpoint de test (configurable)
- [ ] `src/commands/help.ts` - Enhanced help
  - Chaque resource auto-documentée
  - Exemples inline dans le help
  - `--help` à chaque niveau de profondeur

### 1.3 - Resource pattern
- [ ] `src/resources/example.ts` - Le modèle de référence
  - CRUD complet : list, get, create, update, delete
  - Chaque action : description, arguments, options, exemples
  - Pagination : `--limit`, `--page`, `--cursor`, `--all`
  - Filtrage : `--filter`, `--sort`, `--fields`
  - Output : respecte `--json`, `--format`
  - Erreurs : toujours via `handleError()`

### 1.4 - Entry point
- [ ] `src/index.ts` - Commander setup
  - Auto-discover resources dans `src/resources/`
  - Global flags : `--json`, `--format`, `--verbose`, `--no-color`
  - Version, help

### 1.5 - Tests template
- [ ] `tests/auth.test.ts` - Test auth set/show/remove
- [ ] `tests/client.test.ts` - Test HTTP client, retry, errors
- [ ] `tests/output.test.ts` - Test each format

---

## Phase 2 : CLI Manager (`packages/cli`)

### 2.1 - Core commands (ordre de priorité)
- [ ] `create <app>` - Bootstrap un nouveau CLI
  - Copie template -> `~/.cli/<app>-cli/`
  - Remplace tous les `{{placeholders}}`
  - `--docs <url>` : l'agent lit les docs et génère les resources
  - `--openapi <url>` : parse le spec et génère automatiquement
  - `--base-url`, `--auth-type`, `--auth-header`
  - `--force` : overwrite
  - Auto `bun install` après création
- [ ] `bundle <app>` - Build le CLI
  - `bun build` -> `dist/<app>-cli.js`
  - `--compile` : standalone binary
  - Affiche la taille du bundle
  - `--all` : build tous les CLIs
- [ ] `link <app>` - Ajoute au PATH
  - Détecte shell (zsh/bash/fish)
  - Bloc marqué dans rc file (idempotent)
  - Crée aussi un symlink dans `/usr/local/bin/` si permission
  - `--all` : link tous
  - Affiche instruction `source ~/.zshrc`
- [ ] `list` - Liste les CLIs installés
  - Status : built/not built, auth/no auth
  - `--json` pour agents
- [ ] `doctor` - Health check
  - Bun installé + version
  - `~/.cli/` existe
  - `~/.config/tokens/` existe + permissions
  - Template accessible
  - PATH configuré

### 2.2 - Registry commands
- [ ] `install <app>` - Install depuis registry
  - Check npm `@api2cli/<app>` d'abord
  - Sinon fetch depuis api2cli.dev API
  - Download resources + config -> merge avec template -> build -> link
  - One command : tout est prêt
- [ ] `publish <app>` - Publie au registry
  - Package les resources + config.json
  - Publie sur npm sous `@api2cli/<app>`
  - Enregistre sur api2cli.dev (POST /api/skills)
- [ ] `update <app>` - Re-sync CLI
  - Re-lit les docs API
  - Diff les endpoints
  - Ajoute les nouvelles resources, met à jour les existantes
  - Rebuild automatique

### 2.3 - Utility commands
- [ ] `tokens` - Liste tous les tokens (masqués)
  - `--show` : full tokens
- [ ] `unlink <app>` - Retire du PATH
- [ ] `remove <app>` - Supprime CLI + token
  - `--keep-token` : garde le token

### 2.4 - Tests CLI
- [ ] `tests/create.test.ts` - Test scaffold + placeholder replacement
- [ ] `tests/bundle.test.ts` - Test build output
- [ ] `tests/link.test.ts` - Test PATH management
- [ ] `tests/list.test.ts` - Test listing

---

## Phase 3 : Skill AgentSkills (`skill/`)

### 3.1 - Meta-skill
- [ ] `skill/SKILL.md` - Le skill qui enseigne aux agents comment utiliser api2cli
  - Workflow complet : user request -> API discovery -> scaffold -> generate -> build -> link
  - Patterns de code à suivre
  - Exemples pour chaque type d'API
  - Troubleshooting

### 3.2 - Auto-install SKILL.md
- [ ] Script de détection des agents installés
  - `~/.claude/` -> Claude Code
  - `~/.openclaw/` -> OpenClaw
  - `.cursor/` -> Cursor
  - `~/.config/gemini-cli/` -> Gemini CLI
- [ ] Copie/symlink SKILL.md dans chaque agent trouvé

---

## Phase 4 : Web App (`apps/web` - api2cli.dev)

### 4.1 - API Routes
- [ ] `GET /api/skills` - Liste tous les skills publiés
  - Pagination, search, sort by downloads
- [ ] `GET /api/skills/[name]` - Détail d'un skill
  - Resources, config, SKILL.md content
- [ ] `POST /api/skills` - Publier un skill (auth required)
- [ ] `PATCH /api/skills/[name]` - Update un skill
- [ ] `POST /api/skills/[name]/download` - Increment download counter

### 4.2 - Pages
- [ ] Landing page : hero + how it works + featured skills
- [ ] `/explore` : browse skills avec search + filters
- [ ] `/skills/[name]` : detail page (readme, resources, install command)
- [ ] `/docs` : documentation

### 4.3 - Design
- [ ] Dark theme par défaut (dev tool vibes)
- [ ] Tailwind v4
- [ ] Minimal, fast, no bloat

---

## Phase 5 : Proof of Concept

### 5.1 - typefully-cli (premier CLI)
- [ ] Lire docs API Typefully
- [ ] Générer resources : drafts, social-sets, media, tags, me
- [ ] Tester le flow complet : create -> build -> link -> auth -> use
- [ ] Publier sur npm : `@api2cli/typefully`

### 5.2 - dub-cli (deuxième CLI)
- [ ] Lire docs API Dub
- [ ] Générer resources : links, domains, tags, folders, analytics
- [ ] Tester + publier

---

## Phase 6 : MCP Mode (bonus)

- [ ] `<app>-cli mcp serve` - Expose les commandes en MCP tools
- [ ] Stdio-based MCP server
- [ ] Auto-generate tool definitions depuis les resources
- [ ] Config templates pour Claude Desktop + Cursor

---

## Ordre d'exécution (critical path)

```
Phase 0.1 (biome config)
    ↓
Phase 1.1 (template core libs: errors → config → auth → client → output → logger)
    ↓
Phase 1.2 (template auth commands)
    ↓
Phase 1.3 (template resource pattern)
    ↓
Phase 1.4 (template entry point)
    ↓
Phase 2.1 (cli: create → bundle → link → list → doctor)
    ↓
Phase 5.1 (typefully-cli: PREMIER TEST E2E)
    ↓
Phase 1.5 + 2.4 (tests)
    ↓
Phase 3 (skill SKILL.md)
    ↓
Phase 2.2 (registry: install → publish → update)
    ↓
Phase 4 (web app api2cli.dev)
    ↓
Phase 5.2 (dub-cli)
    ↓
Phase 6 (MCP)
```

## Code Quality Rules

1. **Pas de God files** : max 200 lignes par fichier
2. **Pas de magic strings** : constantes dans config.ts
3. **Pas de silent failures** : toujours log ou throw
4. **Pas de nested callbacks** : async/await only
5. **Pas de deps inutiles** : Bun built-in d'abord (fetch, file, spawn, test)
6. **Chaque fonction exported = JSDoc** avec description + params + return
7. **Chaque commande = exemple dans le help** (pas juste description)
8. **DRY entre resources** : patterns réutilisables via helpers
9. **Exit codes cohérents** : 0/1/2, jamais autre chose
10. **Idempotent** : relancer une commande 2x donne le même résultat
