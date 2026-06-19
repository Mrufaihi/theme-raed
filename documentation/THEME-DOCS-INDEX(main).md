# Theme & Twilight documentation index

Use this file to find **persistent** project docs. These live in git, not in Cursor’s temporary plan UI.

## **Repo layout:** The repository root is a Twilight theme (Theme Raed baseline). Run `pnpm install`, `pnpm run development`, then `pnpm run theme:preview` from the root after linking the theme in Partners. To pass `**--store`** / other flags, use `**pnpm exec salla theme preview …\*\*`(see [README](../README.md) — pnpm`run`+`--` breaks Salla’s parser).

```bash
# 1) Dependencies (installs repo-pinned @salla.sa/cli)
pnpm install

# 2) Log in to Salla Partners + GitHub (interactive — browser / prompts).
#    Run again whenever you see auth / token / "theme id" style errors.
pnpm exec salla login
# equivalent: pnpm run salla -- login

# 3) Build JS/CSS bundles into public/ (required in this repo — app.* are gitignored)
pnpm run development
# production bundle instead: pnpm run prod

# 4) Preview — pick the demo store in the prompt (arrow keys), or skip the list with --store
**
pnpm run theme:preview
**
# Optional: skip the store prompt and open the editor — use pnpm exec when passing flags
# (do not use `pnpm run theme:preview -- --with-editor …`; see repo notes below).
pnpm exec salla theme preview --with-editor --store="YOUR_STORE_FROM_LIST"

# Optional: Jawliner demo store + local CLI + clear stale `.salla-cli` (see SALLA-PREVIEW-SESSION-2026-05-10-CONCLUDE.md)
pnpm run theme:preview:saudi:editor:fresh
```

| Document                                                                                                               | Purpose                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [SALLA-THEME-RAED-CONNECT-CONCLUDE-2026-06-19.md](./SALLA-THEME-RAED-CONNECT-CONCLUDE-2026-06-19.md)                   | **START HERE (2026-06-19):** connect/preview session handoff; Path 1 hybrid confirmed                                                                                                                                                                                                     |
| [JAWLINER-THEME-INSTALL-WITH-MERCHANT.md](./JAWLINER-THEME-INSTALL-WITH-MERCHANT.md)                                   | **YOU + MERCHANT:** private install on jawlinerksa.com — Partners steps, merchant accept/activate, install-link 404 + curl checks                                                                                          |
| [SALLA-CLI-120-REFRAME-COMMENT.md](./SALLA-CLI-120-REFRAME-COMMENT.md)                                                 | **#120 close draft:** preview ≠ CDN publish; copy-paste GitHub comment to reframe/close issue                                                                                                                             |
| [CHAT-CONCLUDE-AND-WRAPUP.md](./CHAT-CONCLUDE-AND-WRAPUP.md)                                                           | End-of-session `**conclude**` template (findings, bugs, solutions, next steps, frustrations) + example wrap-up for Cursor/humans                                                                                                                                                          |
| [SALLA-PHASE-NOW-CHECKLIST.md](./SALLA-PHASE-NOW-CHECKLIST.md)                                                         | Phase-now checklist: Partners/GitHub (you run), local CLI via npm scripts, pnpm + Theme Raed baseline, `theme:baseline:preview`                                                                                                                                                           |
| [SALLA-CLI-AND-STATIC-TO-THEME.md](./SALLA-CLI-AND-STATIC-TO-THEME.md)                                                 | What Salla CLI is (Node), theme commands, PHP/Composer context, step-by-step static site → Salla theme and why each step matters                                                                                                                                                          |
| [SALLA-PREVIEW-DEBUG.md](./SALLA-PREVIEW-DEBUG.md)                                                                     | `**theme preview` failures:** Axios 20s timeout; **DevTools — no localhost / `app.system.js` vs theme bundles**; preview URL shapes (`/design/draft`, `assets_url`); watcher `**theme sync -store_id`\*\* vs CLI; bypass via Partners                                                     |
| [SALLA-PREVIEW-TIMEOUT-AND-ASSETS-CONCLUDE.md](./SALLA-PREVIEW-TIMEOUT-AND-ASSETS-CONCLUDE.md)                         | **End-to-end conclude:** preview timeout (large `public/` / MP4), webpack + Git fixes, `app.js`/`app.css` policy, git reset notes, frustrations                                                                                                                                           |
| [SALLA-PREVIEW-THEME-VS-DEMO-AND-EXPECTATIONS-CONCLUDE.md](./SALLA-PREVIEW-THEME-VS-DEMO-AND-EXPECTATIONS-CONCLUDE.md) | **Conclude for next chat:** theme vs demo store, `localhost` vs `s.salla.sa` editor, **diagnose “not my code” via `app.js`/`app.css` loading from CLI localhost**, not “Salla demo wrong path”; Twig vs SCSS/JS; `--store` optional; next steps                                           |
| [TWIG-PREVIEW-PHASE-E-CONCLUDE.md](./TWIG-PREVIEW-PHASE-E-CONCLUDE.md)                                                 | **Conclude (reverted work):** minimal Twig / `twilight.json` Phase E did **not** fix preview; Twig parked; CSP / Posthog noise; `pnpm run` vs `pnpm exec` notes; user reverted scripts preference                                                                                         |
| [TWIG-TWILIGHT-BACKGROUND.md](./TWIG-TWILIGHT-BACKGROUND.md)                                                           | What Twig and Twilight are, who made them, why platforms use template engines, alternatives                                                                                                                                                                                               |
| [TWILIGHT-MIGRATION-EXECUTION-PLAN.md](./TWILIGHT-MIGRATION-EXECUTION-PLAN.md)                                         | Phased plan to execute when you start building (preview → Raed → assets → twilight.json → Twig → JS → QA)                                                                                                                                                                                 |
| [TWILIGHT-MIGRATION-REQUIREMENTS.md](./TWILIGHT-MIGRATION-REQUIREMENTS.md)                                             | Migration requirements (TR-xxx), acceptance criteria, decisions log                                                                                                                                                                                                                       |
| [SALLA-PREVIEW-SESSION-2026-05-10-CONCLUDE.md](./SALLA-PREVIEW-SESSION-2026-05-10-CONCLUDE.md)                         | **Conclude for next chat (2026-05-10):** watcher `pnpm` patch + `sallaCli` trim; Salla doc cross-check; `theme:preview:saudi*` + **fresh** (clear `.salla-cli`); editor `/themes/editor/draft-*?assets_url=` checklist; stale cache; global vs local CLI; user still blocked — next steps |
| [SALLA-PREVIEW-LIVE-DEBUG-CONCLUDE-2026-05-10.md](./SALLA-PREVIEW-LIVE-DEBUG-CONCLUDE-2026-05-10.md)                   | `**conclude` (live debug):** agent-run preview OK (`app.js` 200, CORS `*`); **design→editor 302**; **port drift**; **browser MCP / Puppeteer limits\*\*; what failed vs next paths                                                                                                        |
| [SALLA-PREVIEW-ROOT-CAUSE-CONCLUDE.md](./SALLA-PREVIEW-ROOT-CAUSE-CONCLUDE.md)                                         | **Watcher / sync argv:** invalid `**-store_id`** / `**-id**` vs CLI **3.2.30**; `**pnpm`patch** +`**clean: isProduction`** — see [SALLA-PREVIEW-DEBUG.md](./SALLA-PREVIEW-DEBUG.md)                                                                                                       |
| [../REQUIREMENTS.md](../REQUIREMENTS.md)                                                                               | Product/UI requirements for the Jawliner template (REQ-xxx)                                                                                                                                                                                                                               |
| [../CONTEXT.md](../CONTEXT.md)                                                                                         | Business and technical context                                                                                                                                                                                                                                                            |
| [../CUSTOMIZATION_GUIDE.md](../CUSTOMIZATION_GUIDE.md)                                                                 | How to customize the current static template (pre-Twilight)                                                                                                                                                                                                                               |

**External (authoritative for platform behavior):**

- [Salla Docs](https://docs.salla.dev/)
- [Twig](https://twig.symfony.com/doc/)
- [Theme Raed](https://github.com/SallaApp/theme-raed)

_Last updated: 2026-06-19 — local preview vs push documented in [SALLA-THEME-RAED-CONNECT-CONCLUDE-2026-06-19.md](./SALLA-THEME-RAED-CONNECT-CONCLUDE-2026-06-19.md)._
