# Salla preview: theme vs demo store, URLs, and “generic UI” — session conclude

**When:** 2026-05-03  
**Scope:** Mental model for **`salla theme preview`**, Partners **themes** vs **demo stores**, **`localhost` asset URLs** vs **`s.salla.sa` editor**, why preview can look “placeholder,” **`--store` optional**, **primary suspect when preview feels disconnected: `app.js` / `app.css` not loading from the CLI’s localhost port** (vs “wrong path on Salla’s demo”), README / [SALLA-PREVIEW-DEBUG.md](./SALLA-PREVIEW-DEBUG.md) updates, git **`switch`** vs **`checkout`**.

**Related (earlier arc):** [SALLA-PREVIEW-TIMEOUT-AND-ASSETS-CONCLUDE.md](./SALLA-PREVIEW-TIMEOUT-AND-ASSETS-CONCLUDE.md) (upload timeout, large `public/`, gitignore bundles).

---

## 1. Summary of findings

- **Theme (Partners / `salla theme list`)** = one **product** record (repo, theme ID, `twilight.json`). **Demo store (`salla store list`)** = a **sandbox merchant** used as the **runtime** for preview. Official flow always pairs them: [Theme Preview](https://docs.salla.dev/422776m0), [Develop a theme](https://docs.salla.dev/421878m0). You do not pick “theme **or** demo”; preview = **your theme code on one chosen sandbox**.
- **`http://localhost:PORT`** from the CLI = **asset server** for `public/` (e.g. `app.js`, `app.css`). It is **not** a full standalone “my marketing site” URL. **`https://s.salla.sa/themes/editor/draft-…?assets_url=http://localhost:…`** with **`--with-editor`** is the **expected** hosted shell that **pulls** those assets.
- **`pnpm run theme:preview`** remains correct to use the repo-pinned **`@salla.sa/cli`**. **`--store=`** is **optional** — the CLI can prompt (arrow keys); flags are for skipping prompts / scripts; use **`pnpm exec salla theme preview …`** when passing flags (pnpm `run … --` breaks the CLI parser).
- **Local `git remote origin`** matched **`twilight.json` `repository`** (`Mrufaihi/Jawliner-Salla-Theme`); no repo edit required for alignment.
- **Why UI still looks generic:** Twig/layout is still **Theme Raed** (`master.twig`, `header.twig`, etc.); Jawliner work is largely **SCSS/JS** (`app.scss` → `jawliner`). Demo **products/branding** come from the sandbox **store**, not from `prototype/`. Until Twig + merchant branding diverge, preview reads as “default Salla + demo catalog” even when bundles attach.
- **Auth:** `pnpm exec salla store list` succeeded in-session when already logged in; **do not** share passwords/tokens in chat — re-run **`pnpm exec salla login`** on auth errors per [Troubleshooting](https://docs.salla.dev/422765m0).
- **When preview looks like “not my code” (most important):** The browser that loads **`s.salla.sa`…`assets_url=http://localhost:PORT`** must successfully fetch **`app.js`** and **`app.css`** (and related chunks) **from that same `localhost:PORT`** while the CLI is still running. If those requests **fail, are blocked, or you use a different machine/tab**, Salla still renders the store but **without your bundle** → generic Raed / placeholder feel. Official hint: [Troubleshooting — Preview Error / localhost assets](https://docs.salla.dev/422765m0). This is **not** the same as “the demo store theme files are on the wrong path on Salla’s servers.”
- **Tooling hygiene (secondary):** Use **`pnpm exec salla`** from the **theme root** (`twilight.json` present) so the repo’s **`@salla.sa/cli`** runs; avoid a **global** `salla` with a different version. Wrong **cwd** can still break which `public/` gets served locally.

---

## 2. Bugs / issues we faced (product + perception, not necessarily code defects)

- **Perception:** “Preview is not connected to my code” / “only placeholder” — most actionable check first: **DevTools → Network** → **`app.js` / `app.css`** from the **Assets URL** port printed by the CLI (expect **200**). Then consider **Twig still Raed**, **demo catalog** copy, and **wrong preview tab** (must use session that wires localhost).
- **pnpm / flags:** **`pnpm run theme:preview -- --with-editor`** (extra `--`) → Salla **`too many arguments`** / broken parsing — use **`pnpm exec salla theme preview …`** ([SALLA-PREVIEW-DEBUG.md](./SALLA-PREVIEW-DEBUG.md)).
- **Confusion:** Count of **themes** (e.g. four cards) vs **demo stores** (e.g. three) — **not a mismatch**; different resources. User deleted duplicate themes to reduce noise.
- **`localhost:8000` “bugged” when opened alone** — expected to be weak as a **human homepage**; it exists for the **preview page** to fetch bundles, not to replace `s.salla.sa`.
- **Salla docs / UX:** sparse feedback when **localhost assets** fail; Network tab is the practical diagnosis.

---

## 3. Solutions we tried / shipped

- **Docs:** Reordered [README.md](../README.md) quick start (**login** + **`store list`** before build where helpful), expanded **Theme Preview** section, added [SALLA-PREVIEW-DEBUG.md](./SALLA-PREVIEW-DEBUG.md) **§ Step-by-step**, **§ What the URLs mean (localhost + `s.salla.sa`)**, **§ Preview vs demo catalog**, clarified **`--store`** optional, linked official docs throughout.
- **Local verification:** `pnpm run development` to emit **`public/app.js` / `public/app.css`** (gitignored); confirmed files on disk.
- **Research:** Firecrawl on Salla docs (Theme Preview, Develop a theme, Setup a theme, Troubleshooting); GitHub issue search on `SallaApp/salla-cli` (preview/auth/theme id themes).
- **Git (user question):** Explained **`git switch`** (branches only) vs **`git checkout`** (branch + other duties); merge **`main`** vs update **`origin/main`** via **`fetch` + `checkout main` + `pull`**.

---

## 4. Possible future solutions / next chat hooks

- **Prove asset injection:** temporary obvious CSS in `jawliner.scss` → rebuild → confirm in preview **Network** (200 from localhost).
- **Twig migration:** port layout/header/home from prototype into **`src/views`** so structure matches Jawliner (see [TWILIGHT-MIGRATION-EXECUTION-PLAN.md](./TWILIGHT-MIGRATION-EXECUTION-PLAN.md)).
- **Optional:** commit **`public/app.*`** if team wants clone-without-build (tradeoff: large diffs); or **CI** `pnpm run prod` on push.
- **Demo store cleanup:** manage/delete sandboxes in **logged-in** Partners portal / help center if UI allows; not the same as deleting themes.
- **If preview still “disconnected”:** (1) **Network:** confirm **`app.js`** / **`app.css`** → **200** from the CLI’s **Assets URL** host:port in the **same** preview browser session, CLI still running, same machine as the browser. (2) Rebuild: **`pnpm run development`** so `public/` exists. (3) Then, if still broken: **`pnpm exec salla --version`** vs `package.json`, run from **theme root**, IPv4 / GitHub reconnect ([SALLA-PREVIEW-DEBUG.md](./SALLA-PREVIEW-DEBUG.md), [422765m0](https://docs.salla.dev/422765m0)), [Salla-CLI issues](https://github.com/SallaApp/salla-cli/issues).

---

## 5. Frustrations (session tone — not necessarily the assistant)

- Strong frustration that **demo store** felt mandatory vs **“theme development”** — resolved by separating **theme list row** (product) from **sandbox store** (engine host) and aligning with official preview wording.
- Impatience with **placeholder** UI — acknowledged; mitigated by explaining **Twig/Raed baseline** + **demo catalog** vs broken wiring.
- Earlier note (from prior messages in thread): wanted **step-by-step including login** spelled out; addressed in README + SALLA-PREVIEW-DEBUG.

---

## 6. Indexed from

- [THEME-DOCS-INDEX.md](./THEME-DOCS-INDEX.md)
- [CHAT-CONCLUDE-AND-WRAPUP.md](./CHAT-CONCLUDE-AND-WRAPUP.md) (template + examples)

_Last updated: 2026-05-03._
