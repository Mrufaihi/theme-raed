# Theme preview — official steps, then repo notes

Use this when **`salla theme preview`** runs local asset/WebSocket servers but fails with **`The CLI failed to request preview for the Theme`** and/or **`AxiosError: timeout of 20000ms exceeded`**.

---

## Step-by-step: run theme preview

Run everything from the **theme repository root** (where `twilight.json` lives).

**Before you start (Salla’s requirements — do not skip):**

1. [Salla Partners](https://salla.partners/) account and a **demo store** ([Setup a theme](https://docs.salla.dev/421879m0)).
2. Theme linked to **GitHub** in Partners; for CLI theme commands you need a **GitHub Personal Access Token** with appropriate **repo** access, as in [Theme commands overview](https://docs.salla.dev/422774m0) and [Authorization (`salla login`)](https://docs.salla.dev/422762m0).

**Commands (first time or after `pnpm install`):**

```bash
# 1) Dependencies (installs repo-pinned @salla.sa/cli)
pnpm install

# 2) Log in to Salla Partners + GitHub (interactive — browser / prompts).
#    Run again whenever you see auth / token / "theme id" style errors.
pnpm exec salla login
# equivalent: pnpm run salla -- login

# 3) Confirm the CLI is authenticated (should list your demo stores)
pnpm exec salla store list

# 4) Build JS/CSS bundles into public/ (required in this repo — app.* are gitignored)
pnpm run development
# production bundle instead: pnpm run prod

# 5) Preview — pick the demo store in the prompt (arrow keys), or skip the list with --store
pnpm run theme:preview

# Optional: skip the store prompt and open the editor — use pnpm exec when passing flags
# (do not use `pnpm run theme:preview -- --with-editor …`; see repo notes below).
pnpm exec salla theme preview --with-editor --store="YOUR_STORE_FROM_LIST"
```

Use **`--store=`** only if you want a **non-interactive** run (scripts, same store every time). The name or ID can match a row from **`pnpm exec salla store list`** or the interactive list ([Theme Preview](https://docs.salla.dev/422776m0)).

**After preview opens:** use the **browser window the CLI starts** so theme assets rewrite to **localhost** ([Troubleshooting — Preview Error](https://docs.salla.dev/422765m0)). Salla’s [Theme Preview](https://docs.salla.dev/422776m0) states that with **uncommitted changes**, the CLI **asks to commit** (equivalent to pushing to the linked GitHub repo) and recommends **accepting** for a smooth preview; answer in an **interactive** terminal (embedded runners that cannot see the prompt look “stuck”).

**Extra flags (CLI only):** `--without-editor` (`-E`) and `--only-link` (`-o`) appear in **`pnpm exec salla theme preview --help`** but are **not** listed on the public Theme Preview article; treat **`--help`** as authoritative for those.

### What the URLs mean (localhost + `s.salla.sa`)

When preview succeeds, the CLI prints something like **`Assets URL : http://localhost:8000`** and **`Live reload URL : ws://localhost:8001`**. Those are **not** a standalone copy of your whole “local marketing site” in the browser:

- **`http://localhost:8000`** — Local server for theme **static files** under `public/` (bundles, images). The real storefront **HTML still comes from Salla** (Twig on their side); the preview page is told to load **your** `app.css` / `app.js` from this host via query params.
- **`ws://localhost:8001`** — WebSocket for **hot reload** when you change assets or views.
- **`https://s.salla.sa/themes/editor/draft-…?assets_url=http://localhost:8000&…`** — With **`--with-editor`**, this is the **expected** URL: Salla’s **hosted** theme editor / preview shell, wired to your **local** asset port. You are not on the “wrong” product; this is how [Theme Preview](https://docs.salla.dev/422776m0) combines cloud + local.

**If `localhost:8000` “does not work” in the browser:** the tab that loads `s.salla.sa` must run on the **same machine** as the CLI (same `localhost`). Remote SSH-only workflows, a phone, or closing the terminal (stopping the CLI) break that link. In DevTools **Network**, confirm `app.css` / `app.js` load from `localhost:8000` (or whatever port the CLI printed). If those requests fail, the store looks like generic Salla even though preview “succeeded.”

**`/themes/editor/draft-…?assets_url=http://localhost:8000&…` still wrong?** (1) Do **not** rely on an old bookmark — only open the **Preview URL printed in the terminal** for this run. (2) **`node_modules/.salla-cli`** can keep a **stale `store_id`** that no longer matches `salla store list`; run **`pnpm run theme:preview:saudi:editor:fresh`** once (deletes `.salla-cli` then preview) so the CLI rebuilds cache. (3) With preview running, open **`http://127.0.0.1:8000/app.js`** in the **same** browser; if it does not load, the CLI is not serving that port on your machine. (4) **Console**: look for **mixed content blocked** (HTTPS `s.salla.sa` loading **HTTP** `localhost`) or extensions — try a **clean Chrome** profile. (5) **Jawliner CSS on Raed DOM** can look subtle; confirm **Network → `app.css`** is **200** from your asset port, not only `app.system.js` from Salla.

**“Placeholder demo” vs “my site”:** Salla does **not** embed your `prototype/index.html` as the entire store. You get **demo store data** (sample products) plus **your theme** (Twig + local assets). Strong Jawliner branding requires **Twig + SCSS/JS** in this repo, not expecting the hosted URL to become a static clone of `prototype/`. See [Preview vs demo catalog (expectations)](#preview-vs-demo-catalog-expectations) below.

**Auth / “CLI failed” quick fixes:** [Troubleshooting](https://docs.salla.dev/422765m0) — **`pnpm exec salla login`** again; reconnect **GitHub** in Partners and grant authorizations; confirm PAT scopes for **repo**. Theme overview: [422774m0](https://docs.salla.dev/422774m0).

If preview fails *after* local servers start, use the links in **Official docs** below (timeouts, ETIMEDOUT, 404, websocket).

---

## DevTools: no `localhost` / `app.system.js` vs theme bundles

**Symptom:** Network never shows **`localhost`** (or your CLI **Assets** port), or you see **`app.system.js` 200** but not theme files.

1. **Use the URL the CLI actually opened (or copy `Preview URL` from the terminal).** The hosted page must embed **`assets_url=http://localhost:<PORT>`** (same port as **Assets URL** in the CLI output). If you opened a bare **`s.salla.sa`** tab without that query chain, the browser will **not** request your machine.
2. **Preview URL shape varies.** Besides **`/themes/editor/`**, the CLI may hand off via **`https://s.salla.sa/auth/auto?…`** whose **`url=`** parameter points to **`s.salla.sa/design/draft-…`** with **`assets_url=`** and **`ws_port=`** inside it. Always follow the **printed** link — do not assume a single path pattern.
3. **Keep the CLI running.** When the process exits, **`http://localhost:<PORT>/app.js`** stops responding — DevTools will show **no** localhost traffic.
4. **Sanity check:** With preview running, open **`http://localhost:<PORT>/app.js`** in a **new tab** (same machine). **Connection refused** → asset server not up or wrong port. **JS loads** → server is fine; the problem is **which store tab** you are inspecting, **mixed content** blocks (see Console on HTTPS `s.salla.sa` loading **HTTP** `localhost`), or the page HTML not including asset injection for that session.
5. **Filter Network by `localhost` or the port (e.g. `8000`)**, not only the string **`app`**. Hashed scripts like **`app.35b8ceb2.js`** on **`s.salla.sa`** with initiator **`system.js`** / **`frame.…`** are usually **Salla’s editor / shell**, not your theme. Theme files from the asset server are requests whose **full URL** starts with **`http://127.0.0.1:<PORT>`** or **`http://localhost:<PORT>`**. This repo’s webpack main entry is named **`app.js`** (see [`webpack.config.js`](../webpack.config.js)); **async chunks** use **`[name].[contenthash].js`**.
6. **Same machine as the CLI** — a phone, remote desktop client, or SSH **forwarding** that is not the laptop running `salla` cannot use your **`localhost`**.

### “I only see `app.system.js` on `cdn.assets.salla.network` — is the URL wrong?”

**No.** A row like **`…/ui-merchant-onboarding-package/…/app.system.js`** is **Salla’s hosted shell** (`onboarding` / editor UI). It loads on **everyone’s** dashboard. Your theme is a **second set** of requests whose **host is your machine**: **`http://127.0.0.1:<PORT>/app.js`** and **`…/app.css`** (and chunked JS from the same host). If those never appear, fixing the **shape** of **`/themes/editor/draft-…?assets_url=`** is not the missing step — the **editor is not pulling local assets** into that session.

**Do this in order:**

1. **Confirm the asset server:** In a terminal, **`curl -I "http://127.0.0.1:<CLI Assets port>/app.js"`** must be **200** while preview runs. No 200 → **`theme serve`** is down or the port is wrong.
2. **Open the full CLI link, not only the draft bookmark:** Prefer the entire **`https://s.salla.sa/auth/auto?…&url=…`** line the CLI prints first. It sets the **session + redirect** Salla expects before you land on **`/design/`** or **`/themes/editor/`**. If you only paste **`/themes/editor/draft-*?…`**, behavior can differ (cached app shell, missing handoff).
3. **DevTools scope — top frame vs iframe:** The preview **storefront** often lives in an **iframe**. In Chrome DevTools **top bar** (or **Elements** → select iframe), switch the **context** from **“top”** to the **frame** that shows the storefront (name varies). Re-check **Network** in that context; **`localhost`** / **`127.0.0.1`** requests are easy to miss when the panel is still on the **parent** document (which only loads **`app.system.js`** and other Salla CDN scripts).
4. **Filter Network aggressively:** Use filter **`8000`** or **`127.0.0.1`** or **`localhost`**, enable **Preserve log**, then **hard reload** (**Cmd+Shift+R**). Searching for the string **`app`** is not enough — your file is literally **`app.js`** from **`localhost`**, not **`app.system.js`** on **`s.salla.sa`** / CDN.
5. **Changing `8000` → `8002` in the address bar “does nothing”:** The SPA may **already be mounted** using config from **first load** or a **stored draft state**. A manual query edit often **does not** re-trigger asset injection unless you do a **full reload** **after** **`theme serve`** is listening on the **new** port and the URL matches — or you restart from the **fresh CLI Preview URL**.
6. **Console (not Network alone):** Search for **`blocked`**, **`mixed content`**, **`CSP`**, **`Refused`**, **`net::ERR_`**. A blocked **`http://localhost/...`** script on **`https://s.salla.sa`** will keep the page “working” (shell only) exactly like yours.
7. **Same browser profile as sanity tab:** Opening **`localhost:8000/app.js`** in a tab proves the **server**. The **dashboard** tab must run on the **same Mac** **while** **`salla theme preview`** is running; remote browser / GitHub Codespaces breaks **`localhost`** semantics.

The **“correct” URL** for you is whatever **`Preview URL`** the CLI prints **this run**, including **`assets_url=http://localhost:<that run’s Assets port>`**. There is no secret alternate hostname — the issue is **`localhost`** requests **inside** **`s.salla.sa`** (iframe + filters + CSP + server up), not a different path on **`s.salla.sa`**.

**Repo discovery (agent run, 2026-05-03):** From the theme root, **`pnpm exec salla --version`** matched **`@salla.sa/cli` 3.2.30**; **`pnpm exec salla store list`** succeeded; **`public/app.js`** and **`public/app.css`** were present after build. A **`salla theme preview --only-link --store=…`** run printed **`Assets URL : http://localhost:8000`** and a **Preview URL** whose encoded `url=` contained **`/design/draft-…`** and **`assets_url=http://localhost:8000`**. If preview still fails in your environment, see **Theme sync / watcher** below and [Salla-CLI issues](https://github.com/SallaApp/Salla-CLI/issues).

**Theme sync / watcher (if preview errors after servers start):** Webpack watch calls the CLI’s **`theme sync`** command. In **`@salla.sa/cli@3.2.30`**, valid options are **`-i` / `--theme_id`**, **`--store_id`**, **`--draft_id`**, **`--upload_url`** (see **`pnpm exec salla theme sync --help`** — `sync` is a **hidden** subcommand, not described on the public Theme Preview page). Twilight’s **`watcher.js`** historically invoked **`salla`** with **`unknown option '-store_id'`** (and **`-id`** instead of **`-i`**), which can kill watch and the asset port. **This repo** fixes that via **`pnpm.patchedDependencies`** → [`patches/@salla.sa__twilight@2.14.421.patch`](../patches/@salla.sa__twilight@2.14.421.patch) (upgrading **`@salla.sa/twilight`** alone did **not** remove those bad flags in our check of **2.14.421**). On **macOS**, **`EMFILE`** with huge **`public/`** trees is separate — see [SALLA-PREVIEW-TIMEOUT-AND-ASSETS-CONCLUDE.md](./SALLA-PREVIEW-TIMEOUT-AND-ASSETS-CONCLUDE.md).

### Glossary: “stale” preview URL vs port drift

- **Stale preview URL** — Any **hosted** editor/preview URL (bookmark, pasted link, dashboard tab you left open) that still says **`assets_url=http://localhost:8002`** (or **`8004`**, etc.) **from an older CLI run**. The CLI **does not rewrite your browser tabs** each time ports change.
- **Port drift** — If **8000** and **8001** are already taken, the CLI correctly picks the next free pair (**8002 / 8003**, then **8004 / 8005**, …). Each printed **Preview URL** embeds **`assets_url=`** and **`ws_port=`** for **that same run**.
- **Is the CLI “wrong”?** For a given run it is consistent: **`Assets URL`** and the **`assets_url`** inside **`Preview URL`** match. Problems appear when (a) the tab uses a **different** **`assets_url`** than the servers that are actually listening today, or (b) **`theme serve` was killed** but you still opened a preview link that expects a live port.
- **Proof (agent, 2026-05-10):** While **`localhost:8000`** served **`app.js`** (**200**), **`fetch`** to **`127.0.0.1:8002`** from a browser failed (**nothing listening** on **8002** in that snapshot). Earlier terminal logs for **another** run had shown **`Assets URL … :8002`** — mixing those two runs explains “no **`localhost`** in Network” or failed script rows without any Salla doc violation.

---

## Browser tooling: Chrome DevTools MCP; Browser Tools; Cursor agent

Symptoms in the agent chat: Chrome MCP reported **“browser is already running for … chrome-profile”** (`list_pages` fails); Browser Tools MCP said **“Failed to discover browser connector server.”**

These are **not** Salla bugs.

1. **Chrome DevTools MCP (singleton profile)** — The MCP server launches or attaches to Chromium with a **fixed user data dir** under **`~/.cache/chrome-devtools-mcp/`**. You do **not** need to quit your everyday Chrome browsing session; that usually uses **`~/Library/Application Support/Google/Chrome`**. Instead, resolve **duplicate MCP instances** competing for **one** DevTools MCP profile — e.g. only one MCP connection, Cursor restart, **isolated profile** (`--userDataDir` / `--isolated` per MCP docs), or close the orphaned Chromium launched by MCP.
2. **Browser Tools MCP** — Needs the **Browser Tools connector** installed and running in the IDE/browser your team chose for that MCP. Until the connector is up, **`getConsoleErrors` / Network** calls will fail regardless of **`salla`**.
3. **Verification (Chrome MCP, 2026-05-10):** Navigate to **`http://127.0.0.1:<AssetsPort>/app.js`** while **`theme serve`** runs — Network shows **GET `…/app.js` → 200**; Console noise was only **`GET …/favicon.ico` → 404** (harmless unless you rely on favicon diagnostics).

For **merchant-side** **`s.salla.sa`** diagnostics, an **automation** profile also **won’t carry your merchant login**. Use your normal signed-in Chrome for Network/Console, or paste **redacted** HAR/filter rows.

---

## Multiple `theme preview` processes (“I closed Cursor — why still running?”`)

**`node`** processes **`salla theme preview`** stay alive if they were started in a shell that became **detached** (Cursor **agent** runs, **`nohup`**, **`&`**, a terminal session that exited without stopping the foreground child, or **`--only-link`** waits that survived). **Closing the Cursor window does not reliably send `SIGTERM` to every child `node`** on all platforms/schedulers.

Observed pattern (same machine, 2026-05-10): **four** **`node … theme preview`** processes (**three** **`--without-editor --only-link`**, one **`--with-editor`**) alongside one **`theme serve`** listener — user thought only one preview was active.

---

## `pnpm run theme:preview:kill` — what it does and what it skips

[`scripts/kill-salla-preview-local.sh`](../scripts/kill-salla-preview-local.sh) stops **`LISTEN`** PIDs on **8000–8010** (typically **`theme serve`**). It **does not** stop the parent **`theme preview`** **`node`** process if nothing is listening anymore. After **`theme:preview:kill`**, run **`pgrep -lf 'salla.js theme preview'`** — if rows remain, **`kill <pid>`** them (duplicate **`--only-link`** runs included), then **`pgrep -lf 'salla.js theme serve'`** — should show nothing before you start preview again.

**Agent / embedded terminals:** Redirecting preview output to **`/tmp/…`** can fail with **Permission denied** in some Cursor sandbox runs, so **`nohup … > /tmp/salla.log`** may never start the real preview; use a **workspace** path such as **`salla-agent-preview.log`** (already ignored via **`*.log`**) instead.

---

**Official docs (read these first):**

| Topic | URL |
| --- | --- |
| Setup a theme (Partners “Preview Theme”, demo stores, CLI pointer) | [docs.salla.dev/421879m0](https://docs.salla.dev/421879m0) |
| **Theme Preview** — command, `--store`, `--with-editor`, `--browser`, `ETIMEDOUT` | [docs.salla.dev/422776m0](https://docs.salla.dev/422776m0) |
| **Troubleshooting** — “CLI Request Failure”, preview assets, 404, theme ID, websocket | [docs.salla.dev/422765m0](https://docs.salla.dev/422765m0) |
| Theme commands overview — `salla login`, GitHub PAT before theme commands | [docs.salla.dev/422774m0](https://docs.salla.dev/422774m0) |
| Authorization — `salla login` | [docs.salla.dev/422762m0](https://docs.salla.dev/422762m0) |
| Salla CLI welcome / prerequisites | [docs.salla.dev/429774m0](https://docs.salla.dev/429774m0) |

---

## What Salla documents

- Run preview from the **theme root**. Use **`salla theme preview`** (alias **`salla theme p`**). You must be logged into the **Partners** account and linked to **GitHub** with a **PAT** (see overview + authorization pages above).
- **Flags (official table):** `--store=<store>` (demo store **name or ID** from **`salla store list`**), `--with-editor`, `--browser=<browser-name>` (default **Chrome**). Example from Salla: `salla theme preview --store=sweet_store --with-editor --browser=chrome` ([Theme Preview](https://docs.salla.dev/422776m0)). The CLI also accepts **`-s`** as shorthand for **`--store`** (`salla theme preview --help`).
- **Commit before preview:** [Theme Preview](https://docs.salla.dev/422776m0) documents that the flow **may ask you to commit** recent changes (GitHub sync); **best practice is to accept** for a smooth preview.
- **`connect ETIMEDOUT`:** Salla attributes this to **IP / rate limits** — turn off IDE **auto-save**, check the network, reboot the router for a new IP ([Theme Preview](https://docs.salla.dev/422776m0)).
- **“CLI Request Failure” / failed to request preview:** reconnect **GitHub** in Partners and grant **authorizations** ([Troubleshooting](https://docs.salla.dev/422765m0)).
- Other rows on the same page cover wrong localhost assets (use the preview browser), **404** (try another demo store), missing theme ID (**`salla login`**), websocket (**support**), PAT issues.

---

## Preview vs demo catalog (expectations)

- **Placeholder products** (for example a generic retail or clothing demo) are **normal demo-store data**. Preview still applies **your** theme’s Twig and assets on top of that store; you are not “on the wrong site” because the catalog looks generic. Official context: [Setup a theme](https://docs.salla.dev/421879m0) (demo store + Preview Theme), [Theme Preview](https://docs.salla.dev/422776m0) (pick a demo store, local servers, hot reload).
- **Vanilla JS/CSS without custom Twig:** Theme Raed already ships Twig templates; **`pnpm run development`** output (`public/app.js`, `public/app.css`) runs against **that** storefront DOM when localhost assets load. Not writing Twig yet does **not** prevent styles/scripts from applying — but it **does** mean you will not see your **[`prototype/`](../prototype/)** HTML as the full page until you migrate markup into [`src/views/`](../src/views/).
- **Your Jawliner layout** comes from [`src/views/`](../src/views/) and built files under `public/` — not from [`prototype/`](../prototype/) or any standalone HTML; those are outside the Salla preview pipeline.
- **`git remote origin`**, **`twilight.json`** `repository`, and the repo linked in [Partners](https://salla.partners/) should all point at the **same** GitHub theme repo, or you risk theme ID / sync confusion (see [Salla-CLI issues](https://github.com/SallaApp/salla-cli/issues)).
- **Styling looks default?** Use the **preview browser** the CLI opens so theme asset URLs rewrite to **localhost** (see the “Preview Error” / localhost row in [Troubleshooting](https://docs.salla.dev/422765m0)).
- **`public/app.js` / `public/app.css`:** These bundles are **gitignored** in this repo. Run **`pnpm run development`** or **`pnpm run prod`** before **`salla theme preview`** so the asset server has files to serve.

---

## ROOT CAUSE investigation: preview opens but custom assets seem absent

**Diagnosed 2026-05-03.** Preview tab opens; CLI URL can include **`assets_url=http://localhost:8000`** (see Console note above — tracker **`ERR_BLOCKED_BY_CLIENT`** is unrelated). Issues explored:

### Bug 1 — ThemeWatcher passes invalid `theme sync` argv (primary)

`@salla.sa/twilight` **`watcher.js`** builds a **`salla theme sync`** command using **`-store_id`** and **`-id`**. **`@salla.sa/cli@3.2.30`** rejects **`unknown option '-store_id'`**; theme id must be **`-i` / `--theme_id`**, store id **`--store_id`** (per **`pnpm exec salla theme sync --help`**). The watcher then throws; **watch / preview can exit** and **`localhost:<port>/app.js`** stops serving.

The watcher only **needs** this when **`.twig` / `.json`** files change, but a bad first run still tears down the session.

**Fix in this repo:** **`pnpm` patch** on **`@salla.sa/twilight@2.14.421`** — see [`patches/@salla.sa__twilight@2.14.421.patch`](../patches/@salla.sa__twilight@2.14.421.patch) and **`pnpm.patchedDependencies`** in [`package.json`](../package.json). **`pnpm update @salla.sa/twilight*`** to **2.14.421** **alone** did **not** fix the argv in our verification; the patch is required until upstream changes **`watcher.js`**.

### Bug 2 — `clean: true` wipes `public/` before webpack finishes (secondary, fixed)

`output.clean: true` was set unconditionally in [`webpack.config.js`](../webpack.config.js). In watch mode, webpack wipes `public/` at the start of each session before emitting. The CLI opens the browser tab immediately, so the first page load hits an empty `public/` — `app.js` / `app.css` 404.

**Fix already applied in this repo:** `clean` is now `isProduction` (only runs on `NODE_ENV=production` / `pnpm run prod`). Watch mode no longer wipes the output directory.

### Status after attempted fixes (2026-05-03; doc cross-check 2026-05-10)

- **`pnpm patch`** for **`watcher.js`** argv + **`clean: isProduction`** in [`webpack.config.js`](../webpack.config.js). **`pnpm update`** Twilight did **not** remove bad **`theme sync`** flags in **2.14.421**.
- Cross-checked against Salla: [Theme Preview](https://docs.salla.dev/422776m0) (**`--store`**, **`--with-editor`**, **commit** prompt), [Troubleshooting](https://docs.salla.dev/422765m0) (use **CLI-opened** preview for **localhost** assets), [Theme commands](https://docs.salla.dev/422774m0) (**login** + **PAT** before theme commands). **`theme sync`** flag shapes come from **CLI `--help`**, not the public prose pages.
- **Still verify locally:** DevTools **Network** → **`app.js`** / **`app.css`** from the **Assets URL** port → **200** while the CLI is running.
- **Console:** Hotjar / Posthog **`ERR_BLOCKED_BY_CLIENT`** = extension blocking analytics — **ignore for theme debugging**.
- **URL:** `/themes/editor/draft-…?assets_url=…&legacy=0&with_editor=…` matches expected preview shape.
- **Still to verify:** With **`pnpm run theme:preview`** running and webpack compiled, open **`http://localhost:<AssetsPort>/app.js`** in a new tab — if **200**, asset server is OK; then inspect **Network** on the preview tab for failed **`localhost`** requests (not Console tracker noise).

### Twig / Phase E experiment — **not** the preview fix (reverted)

A **minimal Jawliner Twig + `twilight.json` + SCSS** pass was tried as a hypothesis for preview/editor confusion. It **did not** resolve the stuck / no-visibility preview behavior the team cared about. **Twig was not the solution** for that incident; the work was **reverted** and Twig is **parked until further notice**.

- **Console noise:** **`ERR_BLOCKED_BY_CLIENT`** (e.g. PostHog) = extensions — ignore for theme. **CSP `script-src` / inline script blocked** on **`s.salla.sa`** = **hosted shell**, not something you fix inside this theme repo; if the editor stays on “loading,” try another browser profile, fewer extensions, or escalate to Salla with a screenshot.
- **`pnpm run theme:preview` vs `pnpm exec salla theme preview`:** If behavior differs, prefer the invocation that works on your machine; keep using the **CLI-printed Preview URL** with **`assets_url=`** (see above). Long-form conclude: [TWIG-PREVIEW-PHASE-E-CONCLUDE.md](./TWIG-PREVIEW-PHASE-E-CONCLUDE.md).

---

## Repo / toolchain notes (not duplicated in Salla docs)

- **20s axios:** After local servers start, the CLI still does a **remote HTTP** call to Salla; the client timeout is **20s**. Persistent failures are usually network, tunnel, or account/GitHub binding — align with official **ETIMEDOUT** + **CLI Request Failure** steps first.
- **`cloudflared` + pnpm:** The CLI depends on a tunnel binary shipped via npm. **pnpm** may skip install scripts unless allowed — this repo lists **`cloudflared`** under **`pnpm.onlyBuiltDependencies`** in [`package.json`](../package.json). After **`pnpm install`**, confirm **`cloudflared`** installed (not “Ignored build scripts”).
- **IPv4:** If connections stall, try **`pnpm run theme:preview:ipv4`** — same as preview but **`NODE_OPTIONS=--dns-result-order=ipv4first`** ([Node DNS order](https://nodejs.org/api/cli.html)); optional editor variant **`theme:preview:editor:ipv4`**.
- **pnpm and `--`:** Do not use **`pnpm run theme:preview -- --with-editor`** — pnpm can inject an extra **`--`**, and the CLI may error (**too many arguments**). Use **`pnpm exec salla theme preview --with-editor --store=…`** when passing flags.
- **CLI version:** Prefer **`pnpm exec salla`**, **`./node_modules/.bin/salla`**, or scripts that call them — Salla docs assume **`salla`** on your PATH, but a **global** install can be **older** than **`package.json`** (e.g. missing **`--without-editor`**). **`pnpm exec salla --version`** should match the pinned **`@salla.sa/cli`**. Convenience: **`pnpm run theme:preview:saudi`** uses [`scripts/salla-preview-jawliner-saudi.sh`](../scripts/salla-preview-jawliner-saudi.sh) (**`--store`** with the demo name + local binary). Override the demo store without editing the script: **`SALLA_PREVIEW_STORE='jawliner saudi'`** or **`SALLA_PREVIEW_STORE=<id-from-store-list>`**. If **`Assets URL`** is printed but nothing listens on that port afterward, stop other **`salla theme preview`** terminals (duplicate runs fight for tunnels / confuse ports), then retry.
- **Working directory:** Run **`salla theme preview`** only from the **theme root** (folder containing **`twilight.json`**). Running from a parent path can make checks, sync, or asset roots wrong with little obvious error text.

---

## Optional

- [Salla-CLI issues](https://github.com/SallaApp/Salla-CLI/issues) (e.g. timeout / preview discussions).
- If preview API stays broken, validate the theme via **Partners + GitHub** install instead of live preview.

*Last updated: 2026-05-10 — **`app.system.js` vs theme `localhost`**, iframe DevTools, **`auth/auto` first hop**, SPA query edit caveat. Session wrap-up: [SALLA-PREVIEW-SESSION-2026-05-10-CONCLUDE.md](./SALLA-PREVIEW-SESSION-2026-05-10-CONCLUDE.md).*
