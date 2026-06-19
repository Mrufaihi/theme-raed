# Salla Phase now — checklist (tooling + baseline preview)

This matches the **revised integration plan**: connect CLI and a **stock** Twilight theme to preview on a demo store. **Custom Twig / Jawliner port is deferred.**

**Official references:** [Salla CLI theme](https://docs.salla.dev/422774m0), [Theme preview](https://docs.salla.dev/422776m0), [Twilight](https://docs.salla.dev/?nav=01HNFTD5Y5ESFQS3P9MJ0721VM), [Theme Raed](https://github.com/SallaApp/theme-raed).

---

## Operating rules

| Who | Responsibility |
| --- | ---------------- |
| **You** | Salla Partners account, demo store, GitHub PAT (repo scope), linking theme ↔ Partners ↔ GitHub, `salla login`, any destructive or sensitive git/remote operations |
| **Assistant / docs** | Command syntax, flags, interpreting errors (paste logs), pointing to Salla docs |

---

## Steps you run (in order)

1. **Partners + demo store** — [Salla Partners](https://salla.partners/); ensure you have a store to target for preview.

2. **GitHub** — Create a **new** repository for the theme (recommended: separate from this Jawliner prototype). Create a **Personal Access Token** with appropriate **repo** access per [Salla CLI theme overview](https://docs.salla.dev/422774m0). Connect the repo in the Partners theme flow when prompted.

3. **Install CLI**

   - **Recommended (this repo):** CLI is a **devDependency**; after `npm install` in the Jawliner root, use:
     - `npm run salla -- <args>` (e.g. `npm run salla -- theme list`)
     - `npm run theme:baseline:preview` — runs `salla theme preview` from `theme-raed-baseline/` (folder is gitignored; clone per below if missing).
   - **Optional global:** `npm install @salla.sa/cli -g` then `salla` on your PATH (may require fixing npm global permissions on macOS).

4. **Log in (interactive)**

   ```bash
   npm run salla -- login
   ```
   (or `salla login` if installed globally)

5. **Theme project** — Either:
   - **`salla theme create`** (follow CLI prompts; syncs with your linked GitHub workflow), **or**
   - Use a local clone of [Theme Raed](https://github.com/SallaApp/theme-raed) (this repo may include `theme-raed-baseline/` for convenience; see [.gitignore](../.gitignore)), then connect/push to **your** new GitHub repo when ready.

6. **Baseline theme folder (Theme Raed)** — If `theme-raed-baseline/` is not present (it is gitignored), clone once:

   ```bash
   git clone --depth 1 https://github.com/SallaApp/theme-raed.git theme-raed-baseline
   ```

7. **Install theme dependencies** (Theme Raed uses **pnpm**, not npm)

   ```bash
   cd theme-raed-baseline
   pnpm install
   ```

8. **Preview**

   From Jawliner root (uses local CLI + baseline folder):

   ```bash
   npm run theme:baseline:preview
   ```

   Or from `theme-raed-baseline/`:

   ```bash
   npx --prefix .. salla theme preview
   ```

   Useful options (see [Preview doc](https://docs.salla.dev/422776m0)): `--store=`, `--browser=`, `--with-editor`.

**Exit criteria:** Browser opens (or URL shown); demo store renders with **starter** Twig. Jawliner visuals are **not** required in this phase.

---

## Common issues

- Run commands from the **theme root** (directory containing `twilight.json`).
- **PAT** missing scopes → auth or sync failures.
- **Node:** use current LTS; Raed uses a theme build (Webpack, etc.).
- **Rate limits / ETIMEDOUT:** reduce aggressive IDE auto-save during preview sync ([SALLA-CLI-AND-STATIC-TO-THEME.md](./SALLA-CLI-AND-STATIC-TO-THEME.md)).

---

## Phase later (deferred)

Jawliner HTML → Twig, `twilight.json`, assets, locales, JS: [TWILIGHT-MIGRATION-EXECUTION-PLAN.md](./TWILIGHT-MIGRATION-EXECUTION-PLAN.md), [TWILIGHT-MIGRATION-REQUIREMENTS.md](./TWILIGHT-MIGRATION-REQUIREMENTS.md).
