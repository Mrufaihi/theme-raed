# Salla preview — live agent debug conclude (2026-05-10)

**Indexed from:** [THEME-DOCS-INDEX(main).md](./THEME-DOCS-INDEX(main).md)  
**Trigger:** User **`conclude`** after exhaustive preview troubleshooting (placeholder UI, no `localhost` in Network, browser tooling).

---

## 1. Summary of findings

- **Local stack is healthy when the agent runs it:** From the theme root, `pnpm exec salla theme preview --store "jawliner saudi" --without-editor --only-link` reliably prints **Assets URL** + **Preview URL**, starts **webpack watch**, and serves **`GET /app.js` → HTTP 200** with **`Access-Control-Allow-Origin: *`**, **`Access-Control-Allow-Methods: OPTIONS, GET`**, **`Cache-Control: no-store`**. No backend error reproduced in these runs.
- **`/design/draft-…` vs `/themes/editor/draft-…`:** Unauthenticated **`GET /design/draft-…?…`** returns **302** to **`/themes/editor/draft-…?…`** with the same query string — the two paths converge server-side; arguing only “design vs editor” as the root cause was **overstated**.
- **Port drift is real:** If **`8000`/`8001`** are busy, the CLI binds **`8002`/`8003`** (etc.). Any bookmark, manual URL, or Network filter stuck on **`8000`** while the current run uses **`8002`** explains **zero `localhost` rows** in DevTools though preview “works.”
- **`node_modules/.salla-cli`** (cache) holds `theme_id`, `draft_id`, `store_id`, `upload_url`, `wsport`. The JSON may still contain **`"sallaCli":"salla "`** (trailing space) from the API — the repo’s **Twilight watcher patch** trims this at runtime; if the patch is removed, sync argv can break again.
- **Automation limits:** Cursor **Browser Tools MCP** never discovered a connector (“Failed to discover browser connector server”), so the agent **could not** read the user’s live **Console / Network** on `s.salla.sa`. **Puppeteer** navigation to the draft URL failed with a **detached Frame** error in this environment — not a substitute for a logged-in human tab.

---

## 2. Bugs we faced

- **User-visible:** Preview “runs” but storefront feels **placeholder / not wired**: most plausible classes are **(a)** **wrong asset port** in the URL vs CLI, **(b)** **browser blocked** subresources (**mixed content**, **CSP**, extensions), **(c)** **iframe / DevTools context** (requests attributed to child frame), **(d)** **expectation** (Raed + demo catalog vs `prototype/`).
- **Agent-visible:** **No authenticated HTML** for the editor shell was retrieved here — unauthenticated `curl -L` lands on the **merchant dashboard SPA**, not the draft document, so we **did not** empirically parse the final `<script src="http://localhost:…">` graph in production conditions.
- **Tooling:** Browser connector down; Puppeteer **unstable** for Salla’s multi-frame app without a maintained session.

---

## 3. Solutions we tried / shipped (this arc)

| Item | Outcome |
|------|--------|
| **`patches/@salla.sa/twilight`** — `theme sync` argv + `sallaCli.trim()` | **Shipped** — fixes watcher vs CLI **3.2.30** |
| **`webpack.config.js`** — `clean: isProduction` | **Shipped** — watch no longer wipes `public/` mid-preview |
| **`webpack.config.js`** — `devtool: cheap-module-source-map` in dev | **Shipped** — removes noisy eval banner when someone opens `app.js` as a tab |
| **`scripts/salla-preview-jawliner-saudi.sh`** | **Shipped** — one-shot webpack if `public/app.*` missing; upstream-ahead hint; `--store` Jawliner demo |
| **`scripts/kill-salla-preview-local.sh`** + **`pnpm run theme:preview:kill`** | **Shipped** — frees **8000–8010** LISTENers |
| **Agent-run `theme preview`** + **`curl` asset headers** | **Worked** — proved **200 + CORS** on asset server |
| **Firestore / GitHub issue reading** | **Partial** — community reports (blank preview, CORS, push fixes) — not reproduced locally |

---

## 4. Possible future solutions (not done or not proven here)

1. **On the broken machine:** In the **same** preview session, copy **`Assets URL`** port into the address bar’s **`assets_url=`**; DevTools Network search **`:PORT`** not only `localhost`; **Console** filter **blocked**, **mixed**, **CSP**; try **iframe** context dropdown.
2. **`pnpm run theme:preview:kill`** then **one** preview — avoid port drift and duplicate tunnels.
3. **Partners workflow:** Install theme from GitHub on demo store (bypasses local asset injection) when preview shell is suspected broken — use for Twig/markup validation; slower iteration.
4. **Vendor:** Open **Salla CLI / platform** support issue with **redacted** HAR if needed — agent cannot produce HAR without user browser capture.
5. **Hardening:** If `sallaCli` trailing space reappears in `.salla-cli`, consider **post-`salla login` sanitization** (optional script) — only if Salla doesn’t fix API output.

---

## 5. Frustrations (as stated in thread)

- **Repeated requests for the user to run commands** instead of the agent executing them in the workspace.
- **Impatience with security/token cautions** — user prefers speed over redaction in chat (project docs still avoid pasting live tokens in git for hygiene).

---

## 6. Bottom line

**Nothing in the repo or CLI output from these agent runs explains a healthy machine showing “no localhost”** except **client-side** issues (**port mismatch**, **wrong DevTools scope**, **blocking**, or **not logged into the tab that owns the session**). The **asset server itself responds correctly** when preview is up. **Next proof must come from the user’s browser Console/Network** or a **connected Browser Tools session** — the agent cannot see that without the connector.

---

*Last updated: 2026-05-10 (post–live preview curl + route + MCP limits).*
