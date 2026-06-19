# Salla preview root cause — session conclude

**When:** 2026-05-03  
**Scope:** Why `localhost:8000/app.js` returns nothing; why the CLI auto-opens the preview tab but shows no custom CSS/JS; two confirmed bugs; one fix applied to the repo, one fix for the user to run.

---

## 1. Summary of findings

**The preview tab opens (CLI behaviour is fine) but theme assets never load. Root cause is two compounding bugs:**

### Bug 1 — ThemeWatcher passes invalid `theme sync` flags (confirmed primary)

- `@salla.sa/twilight` **`watcher.js`** builds **`salla theme sync`** with **`-store_id`** and **`-id`**. **`@salla.sa/cli@3.2.30`** expects **`--store_id`** (double-dash) and **`-i` / `--theme_id`** — **`unknown option '-store_id'`** kills **`execSync`**.
- When the watcher fires (even on a node_modules `.json` being picked up as modified on the first run), `execSync(...)` throws, webpack watch exits non-zero, and the **entire CLI process exits** — taking `http://localhost:8000` with it.
- The preview tab is already open. The browser tries to load `http://localhost:8000/app.js` but the server is gone → "not found".
- **The ThemeWatcher only syncs `.twig` / `.json` files — JS/CSS must come from `localhost:8000`. When the server dies, no custom assets load at all.**

### Bug 2 — `output.clean: true` wipes `public/` before webpack finishes (secondary, fixed in repo)

- In watch mode, `clean: true` deletes `public/` at the start of each webpack session.
- The CLI opens the browser tab immediately. The page loads before webpack re-emits files → `app.js` / `app.css` 404 during the compilation window.
- **Fixed:** `clean` is now `isProduction` in [`webpack.config.js`](../webpack.config.js). Watch and development modes no longer wipe output.

### Key data collected

- Read `node_modules/.salla-cli` cache: ThemeWatcher reads params (`theme_id`, `store_id`, `draft_id`, `upload_url`) from this file at startup.
- Confirmed via grep that `watcher.js:158` uses `-store_id` flag in its `execSync` call.
- `pnpm outdated` confirmed packages are 34 versions behind: `2.14.387` → `2.14.421` available.
- `ulimit -n` on this machine is **1,048,575** — EMFILE (too many open files) is **not** the issue here (was a sandbox artifact, not a real bug on the user's machine).
- `salla store list` works fine — auth is OK.
- `public/app.js` (1.2 MB) and `public/app.css` (851 KB) exist on disk from last build — the *files* are there; the *server* that serves them crashes.

---

## 2. Bugs we faced

- **Wrong hypothesis path:** Spent time chasing EMFILE (many open files) and mixed-content blocking as possible causes before reading `watcher.js` directly.
- **Sandbox network restriction:** `pnpm update` inside the agent sandbox failed with a pnpm store location conflict — user must run it themselves.
- **"Not found" ambiguity:** User's "not found" in step 3 could have meant connection refused (server dead) or 404 (file missing) — both consistent with the crash theory; should have read the watcher source earlier.

---

## 3. Solutions tried / shipped

| Action | Status |
|--------|--------|
| Read `watcher.js` source — confirmed `-store_id` mismatch | done |
| Confirmed `pnpm outdated` shows `2.14.387` → `2.14.421` available | done |
| Changed `clean: true` → `clean: isProduction` in [`webpack.config.js`](../webpack.config.js) | **shipped** |
| Added `## ROOT CAUSE` section to [`SALLA-PREVIEW-DEBUG.md`](./SALLA-PREVIEW-DEBUG.md) | **shipped** |
| `pnpm patch @salla.sa/twilight@2.14.421` → [`patches/@salla.sa__twilight@2.14.421.patch`](../patches/@salla.sa__twilight@2.14.421.patch) + `pnpm.patchedDependencies` — fixes **`theme sync`** argv (**`-i`**, **`--store_id`**, …) | **shipped** |
| `pnpm update @salla.sa/twilight …` | **ran** — **2.14.421 still had invalid `-store_id` in watcher**; patch required (see [SALLA-PREVIEW-DEBUG.md](./SALLA-PREVIEW-DEBUG.md)) |

---

## 4. Possible future solutions / next chat hooks

- **Run `pnpm install`** after pull so **`patchedDependencies`** applies; then **`pnpm run theme:preview`** (or **`pnpm run theme:preview:saudi`**) — see [SALLA-PREVIEW-DEBUG.md](./SALLA-PREVIEW-DEBUG.md).
- Official Salla: [Theme Preview](https://docs.salla.dev/422776m0) (**`--store`**, commit prompt), [Troubleshooting](https://docs.salla.dev/422765m0).
- After servers start: DevTools → Network → **`app.js` / `app.css`** from **Assets URL** → **200**.
- If preview shows Raed's default UI after assets load: **expected** — Twig templates in `src/views/` haven't been migrated yet. Your CSS/JS will still run against Raed's DOM (e.g. colour changes, font changes, JS behaviour). Full layout requires Twig migration → [TWILIGHT-MIGRATION-EXECUTION-PLAN.md](./TWILIGHT-MIGRATION-EXECUTION-PLAN.md).
- Long term: Twig migration is the next real deliverable after preview wiring is confirmed working.

---

## 5. Frustrations noted

- Strong frustration at "all this planning and nothing changed visually" — now addressed: the bugs were in the toolchain, not in the approach. Visual output requires the server to stay alive (Bug 1 fix) and the tab to load after webpack emits (Bug 2 fix).
- Previous sessions documented timeout / large-file issues. This session uncovered the version mismatch as the active bottleneck.

---

## 6. Indexed from

- [THEME-DOCS-INDEX.md](./THEME-DOCS-INDEX.md)
- See also: [SALLA-PREVIEW-DEBUG.md §ROOT CAUSE](./SALLA-PREVIEW-DEBUG.md)

_Last updated: 2026-05-03._
