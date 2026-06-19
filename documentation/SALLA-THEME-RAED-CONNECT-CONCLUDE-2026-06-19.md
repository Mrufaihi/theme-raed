# Salla Theme Raed — connect, preview, live-update (conclude 2026-06-19)

**For next chat:** Start here before frontend work on **Theme Raed** (`1507984290`, `Mrufaihi/theme-raed`). Preview loop is **proven** — local edits update without push; push is for **hosted** theme only.

**Indexed from:** [THEME-DOCS-INDEX(main).md](./THEME-DOCS-INDEX(main).md)

---

## 1. Summary of findings

### Repo / Partners linkage (do not change)

- **Theme record:** Theme Raed (`1507984290`, development).
- **GitHub:** `Mrufaihi/theme-raed` (public). **Do not** point at `Jawliner-Salla-Theme` (older Jawliner themes `383753470`, `799616680`).
- **Three-way match required:** `git remote origin`, `twilight.json` → `repository`, Partners linked repo — all **`Mrufaihi/theme-raed`**. CLI resolves theme ID from `git remote` via `get-theme-id` API.

### Local preview works **without push**

**User assumption corrected:** You do **not** need `git push` to see SCSS/JS changes during `salla theme preview`.

**How it works:**

| Layer | What runs | Role |
|-------|-----------|------|
| **Salla hosted shell** | `s.salla.sa` (store HTML, Twig, demo products) | Renders the storefront in the browser |
| **Local asset server** | `http://localhost:8000` (started by CLI) | Serves `public/app.js`, `public/app.css`, images |
| **Webpack watch** | `webpack --mode development --watch` (CLI starts this) | Rebuilds `public/*` when you edit `src/assets/**` |
| **Live reload** | `ws://localhost:8001` (or next free port) | Notifies preview tab to reload after rebuild |

The preview URL embeds `assets_url=http://localhost:8000&ws_port=8001`. The browser loads **CSS/JS from your machine**, not from GitHub. Edit `src/assets/styles/*.scss` → webpack writes `public/app.css` → local server serves it → preview shows the change.

**Twig** (`src/views/**`) is also watched by the CLI file watcher; SCSS/JS go through webpack first.

**Mental model:**

```
Browser (s.salla.sa preview)
  ├── HTML/Twig/data  →  Salla servers (demo store)
  └── app.css / app.js  →  localhost:8000  →  your disk (public/)
                                    ↑
                              webpack --watch ← src/assets/
```

### Live-update smoke test (2026-06-19) — **PASSED**

- Changed `.main-nav-container .inner { background-color: #ff00ff !important; }` in [header.scss](../src/assets/styles/04-components/header.scss).
- Webpack recompiled; `curl localhost:8000/app.css` returned **200** with `#ff00ff`.
- Salla editor preview showed **magenta header** after reload (F5). WebSocket hot reload may need manual refresh in the editor iframe.
- Reverted locally for clean tree; then **re-applied and pushed** to test hosted theme (see below).

### Preview commands (correct usage)

```bash
pnpm install
pnpm run development          # one-off build; preview also starts watch
salla theme preview --store="jawliner saudi"
# Non-interactive URL only (no commit prompt if tree clean enough):
salla theme preview --store="jawliner saudi" --only-link --without-editor
```

**Do not use:** `pnpm run theme:preview` — script missing in stock Raed `package.json`. Use global `salla theme preview` directly.

### Demo stores

- `jawliner saudi` — primary test store (`--store="jawliner saudi"`, store **name**, not email local-part)
- `jawliner testing 2`
- `Jawliner saudi twig testing 3`

### Push vs local preview

| Mode | When | What sees your change |
|------|------|------------------------|
| **Local preview** | `salla theme preview` running + URL has `assets_url=localhost:…` | Immediate (after webpack rebuild); **no push** |
| **Hosted / Partners** | Store or preview **without** localhost assets; after `git push` | Salla pulls theme from **GitHub**; uses committed `public/` + Twig on remote |

To verify **outside local**: push to `origin/master`, then open theme in Partners or demo store **without** the CLI asset override (or from another device). Magenta header commit is the hosted smoke test.

### CLI / auth

- Global `@salla.sa/cli@3.2.30`, logged in as **yaser ahmed** / GitHub **Mrufaihi**.
- Preview access tokens in URLs **expire**; if auth redirects to login, run fresh `salla theme preview --only-link --without-editor`.

---

## 2. Bugs we faced

- **`ERR_PNPM_NO_SCRIPT` for `theme:preview`** — docs referenced scripts never in stock `package.json`.
- **`Theme ID doesn't exist`** — wrong/missing Partners theme or `origin`/`twilight.json` mismatch.
- **Jawliner-Salla-Theme repoint** — tag `1.2.20` conflict; user wants **Theme Raed** only.
- **Dirty tree + `salla theme preview`** — blocks on “Shall the CLI commit those changes?” in non-TTY.
- **`--store=<email-local-part>`** failed; **`--store="jawliner saudi"`** worked.
- **Expired preview token** — old URL redirects to `s.salla.sa/auth` login.
- **Multiple preview stacks** — duplicate processes on 8000/8002; kill extras, keep one.
- **Editor iframe** — CSS change did not paint until **F5**; build pipeline OK, WS reload inconsistent in editor shell.
- **Stashed edits** — `stash@{0}: temp: preview connect` (master.twig + app.css) not restored.

---

## 3. Solutions we tried

| Action | Result |
|--------|--------|
| `pnpm run theme:preview` | Failed — script missing |
| Point at `Jawliner-Salla-Theme` | Theme ID OK; preview failed on tag |
| `Mrufaihi/theme-raed` + Theme Raed Partners | **Preview OK** |
| Reuse running preview + edit SCSS | **Live update OK** (no push) |
| `salla theme preview --only-link --without-editor` | Fresh URL without editor prompt |
| Commit + push magenta header test | **Hosted verification** (user requested) |
| Kill duplicate preview PIDs | Single stack on 8000/8001 |

---

## 4. Recommended workflow (frontend → preview)

1. **Terminal (keep open):**
   ```bash
   cd /Users/unrankedalzahrani/Desktop/theme-raed
   salla theme preview --store="jawliner saudi"
   ```
2. **Edit:** `src/assets/styles/`, `src/assets/js/`, `src/views/`, `src/locales/`
3. **Verify:** Open CLI **Preview URL**; Network tab → `app.css`/`app.js` from `localhost:8000` (200). Reload if editor iframe stale.
4. **When ready to ship:** `pnpm run prod`, commit, `git push origin master` — updates **hosted** theme on Partners/GitHub.

### Good smoke test

- SCSS: header background `#ff00ff` in [header.scss](../src/assets/styles/04-components/header.scss)
- Or Twig string in [master.twig](../src/views/layouts/master.twig)

---

## 5. Frustrations with the assistant’s approach

- User corrected: **do not change `twilight.json` repository to Jawliner** — keep **Theme Raed** + `Mrufaihi/theme-raed`.

---

## Quick reference

```bash
pnpm install
pnpm run development
salla login
salla theme list               # Theme Raed = 1507984290
salla store list
salla theme preview --store="jawliner saudi"
git push origin master         # only for hosted theme, not local preview loop
```

---

_Last updated: 2026-06-19 (live-update test passed; local vs push documented)._
