# Salla Theme Raed — connect, preview, hosted sync (conclude 2026-06-19)

**For next chat:** Read this **before any preview/hosted work**.  
**Goal:** Local dev changes must appear on the **hosted Salla demo store** (`jawliner saudi`), with repo ↔ Partners ↔ demo store linked correctly.

**Indexed from:** [THEME-DOCS-INDEX(main).md](./THEME-DOCS-INDEX(main).md)

---

## 0. Goal (simple)

> Make local dev changes appear on the **hosted** Salla demo store preview — not only on `localhost`.

That requires **two separate pipes** to work:


| Pipe                                                | Status (end of session)                                      |
| --------------------------------------------------- | ------------------------------------------------------------ |
| **A — Local preview** (`assets_url=localhost`)      | **Works in Chrome** (§15) — CLI running + Chrome. Arc blocked localhost. No push needed. |
| **B — Hosted preview** (CDN / demostore / Partners) | **Works after git push** (§15) — reads synced repo. Use Chrome.            |


**Do not confuse them.** Terminal preview = live disk (no push). Site/demo preview = needs push. **Both need Chrome** — see §15.

---

## 1. Summary of findings

### Linkage (correct — do not change)


| Item                           | Value                                                              |
| ------------------------------ | ------------------------------------------------------------------ |
| Partners theme                 | **Theme Raed** `1507984290` (development)                          |
| GitHub                         | `**Mrufaihi/theme-raed`**                                          |
| `git remote origin`            | `Mrufaihi/theme-raed`                                              |
| `twilight.json` → `repository` | `Mrufaihi/theme-raed`                                              |
| Demo store                     | `**jawliner saudi**` (`--store="jawliner saudi"`)                  |
| CLI                            | `@salla.sa/cli@3.2.30`, user **yaser ahmed** / GitHub **Mrufaihi** |


**Do not** repoint to `Jawliner-Salla-Theme` or Jawliner theme IDs (`383753470`, `799616680`).

### Three asset sources (mental model)

```
1. localhost:8000/app.css     ← your disk (Pipe A — local preview)
2. cdn.../themes/1507984290/… ← YOUR theme on Salla CDN (Pipe B — goal; currently 404)
3. cdn.../themes/1247874246/… ← STOCK Raed on demo store (what browser actually loads today)
```

- **Unpublished (غير منشور)** = not on marketplace for merchants. **Demo dev preview still works** — it is not the blocker.
- **Demo store URL** (`demostore.salla.sa/dev-…`) always uses **CDN**, never localhost.
- **Editor URL** with `?assets_url=http://localhost:8000` = **hybrid**: Salla HTML + your local CSS/JS — **only if** Network shows `localhost:8000/app.css` (200).

### What we proved (successes)

1. **Repo ↔ Partners ↔ GitHub** aligned; `salla theme list` shows Theme Raed `1507984290`.
2. **Local live-update works:** edit `src/assets/styles/04-components/header.scss` → webpack rebuild → `localhost:8000/app.css` contains `#ff00ff` → editor preview shows **magenta header** after reload.
3. **Push reached GitHub:** `be3e9358` — magenta smoke test in repo; `raw.githubusercontent.com/.../app.css` contains `#ff00ff`.
4. **User confirmed** local preview “worked wow” when wired correctly.
5. **Diagnosis:** DevTools showed browser loading `cdn.assets.salla.network/themes/1247874246/1.350.0/app.css` (last-modified Jun 17, no magenta) — **not** localhost and **not** theme `1507984290`.

### What failed (hosted goal not met)

1. **Git push alone** did not update demo store appearance.
2. **CDN for our theme** `1507984290` → **404** (never built/uploaded to Salla CDN).
3. **Demo store serves CDN theme `1247874246`** (stock Raed install) — different ID from our Partners theme.
4. `**salla theme preview` sync step fails:**
  ```
   WARN  Tag 1.343.11 already exists
   WARN  Authorization Error:
   ERROR The CLI failed to request preview for the Theme.
  ```
   Localhost servers may start (`Assets URL : http://localhost:8000`) but **no new Preview URL** is printed; **hosted upload/sync is blocked**.
5. **Port confusion:** stale `localhost:8002` from old runs while CLI uses `8000` — URL port must match terminal output.
6. **Multiple preview stacks** caused duplicate ports and stale bookmarks.

### Salla hosted flow (how it is supposed to work)

Per [Theme Preview](https://docs.salla.dev/422776m0) and [Setup a theme](https://docs.salla.dev/421879m0):

```
Edit src/ → webpack → public/
       ↓
git commit + git push (GitHub)
       ↓
salla theme preview  →  CLI sync/upload to Salla API
       ↓
Salla builds CDN bundle: cdn.assets.salla.network/themes/{themeId}/{version}/app.css
       ↓
Partners “Preview Theme” on demo store OR demostore signed URL reads that CDN bundle
```

**Pipe B is stuck at the sync/upload step** (tag error). Until that succeeds, demo store keeps serving `**1247874246`**.

---

## 2. Bugs we faced


| Bug                                                     | Notes                                                                       |
| ------------------------------------------------------- | --------------------------------------------------------------------------- |
| `ERR_PNPM_NO_SCRIPT` for `theme:preview`                | Script missing in stock `package.json` — use `salla theme preview` directly |
| Wrong repo (Jawliner-Salla-Theme)                       | Tag conflicts on old themes — use Theme Raed only                           |
| Assumed push = live store update                        | Push = GitHub only; CDN needs CLI sync                                      |
| Browser loads CDN when URL has `assets_url=localhost`   | Override failed or DevTools on wrong frame; check iframe Network            |
| CDN `1247874246` vs Partners `1507984290`               | Demo store not serving our theme bundle                                     |
| `**Tag 1.343.11 already exists**` + Authorization Error | **Current blocker** for hosted sync                                         |
| Expired preview tokens                                  | Old `auth/auto` URLs redirect to login                                      |
| Dirty tree commit prompt                                | Blocks non-interactive preview                                              |
| Multiple preview PIDs / port drift                      | 8000 vs 8002 mismatch                                                       |
| Editor iframe no hot reload                             | F5 required; webpack rebuild still OK                                       |


---

## 3. Solutions we tried


| Action                                                   | Result                                         |
| -------------------------------------------------------- | ---------------------------------------------- |
| Align `origin` + `twilight.json` → `Mrufaihi/theme-raed` | ✓ Theme ID checks pass                         |
| `salla theme preview --store="jawliner saudi"`           | ✓ Local servers; ✗ sync/tag error at end       |
| SCSS magenta smoke test + webpack                        | ✓ Local preview confirmed                      |
| `git push` magenta test (`be3e9358`)                     | ✓ On GitHub; ✗ not on Salla CDN                |
| Open demostore / editor without localhost wiring         | ✗ CDN `1247874246`, no magenta                 |
| Kill duplicate preview stacks                            | ✓ Reduced port confusion                       |
| `salla theme preview --only-link --without-editor`       | Worked earlier in session; later hit tag error |


---

## 4. How to fix `Tag 1.343.11 already exists` (next AI — read carefully)

**What it means:** During preview, the CLI registers a **theme version tag** with Salla’s API (not a local git tag). Salla rejects the upload because version `**1.343.11` already exists** for this theme (or auth failed mid-request). Same class of error as old Jawliner `**Tag 1.2.20 already exists`**.

**Symptoms:**

- Terminal shows `Assets URL : http://localhost:8000` (local server OK)
- Then `Tag 1.343.11 already exists` + `Authorization Error`
- `The CLI failed to request preview for the Theme`
- **No Preview URL printed** → hosted CDN never updates

### Fix steps (non-destructive — in order)

1. **Re-auth (do this first)**
  ```bash
   salla login
  ```
   Re-link Partners + GitHub PAT with **repo** scope. The `Authorization Error` may be the root cause, with tag error as a side effect.
2. **Single preview only**
  - Stop all other `salla theme preview` terminals (no duplicate ports).
  - Run once: `salla theme preview --store="jawliner saudi"`
3. **Partners portal (manual bypass)**
  - [Salla Partners](https://salla.partners/) → **My Themes** → **Theme Raed** (`1507984290`)
  - Click **Preview Theme** on demo store `jawliner saudi`
  - Check if hosted preview updates without CLI sync
4. **Verify sync target after any successful preview**
  - DevTools → `app.css` should eventually come from CDN path containing `**1507984290`**, not `1247874246`
  - Or `curl -sI https://cdn.assets.salla.network/themes/1507984290/…/app.css` → **200** (currently **404**)
5. **Escalate to Salla (if steps 1–3 fail)**
  - [Salla-CLI issues](https://github.com/SallaApp/Salla-CLI/issues) — include theme ID `1507984290`, store `jawliner saudi`, full error: `Tag 1.343.11 already exists` + `Authorization Error`
  - Partners support — ask to clear stuck version tag or fix upload auth for Theme Raed

### Do NOT do without explicit user approval

- `**rm -rf node_modules/.salla-cli`** — user warned against destructive cache deletes; only suggest if user explicitly agrees (cache holds `theme_id`, `draft_id`, `store_id`, `upload_url`)
- `**git push --force**`, `**git reset --hard**`, deleting tags on GitHub without understanding Salla’s version scheme
- Repointing `twilight.json` / `origin` to Jawliner repos

---

## 5. Mistakes to not repeat (for next AI)

1. **Do not say “push and check the store URL”** — push ≠ CDN update; sync must succeed first.
2. **Do not assume unpublished = broken** — demo dev preview is fine unpublished.
3. **Do not use stale preview URLs** — draft IDs and ports change; use **fresh CLI output** only.
4. **Do not mix ports** — if terminal says `8000`, URL must say `assets_url=http://localhost:8000` (not 8002).
5. **Do not recommend `pnpm run theme:preview`** — script missing; use `salla theme preview`.
6. **Do not repoint repo to Jawliner** — user wants Theme Raed `1507984290` only.
7. **Do not run destructive cache/git commands** without user consent.
8. **Check Network tab in preview iframe** — if `app.css` is CDN, local override is not active regardless of URL query string.
9. **Do not conflate three IDs:** Partners theme `1507984290`, CDN install `1247874246`, draft ID in URL (e.g. `362730978`) — all different.

---

## 6. Next actions (ordered for next session)

**Primary goal:** Pipe B — hosted demo store shows our changes.

1. Fix `**Tag 1.343.11 already exists`** (section 4 above).
2. After sync succeeds, confirm CDN:
  - `https://cdn.assets.salla.network/themes/1507984290/…/app.css` → **200** + contains smoke-test rule or new `last-modified`.
3. Open **Partners → Preview Theme** on `jawliner saudi`; Network must show `**1507984290`** CDN path (not `1247874246`).
4. Verify magenta header on **hosted** demostore (no `assets_url=localhost`).
5. Revert smoke-test SCSS (`#ff00ff`) once hosted path confirmed.
6. Document final working hosted workflow in this file.

**Secondary (Pipe A — already working):**

```bash
salla theme preview --store="jawliner saudi"
# Open printed Preview URL; DevTools iframe → localhost:PORT/app.css (200)
# Edit src/assets/styles/*.scss; F5 if needed
```

---

## 7. Quick diagnostic cheatsheet


| Check                                               | Pass                  | Fail =                                     |
| --------------------------------------------------- | --------------------- | ------------------------------------------ |
| `curl localhost:8000/app.css | grep ff00ff`         | Local build OK        | Run `pnpm run development`                 |
| Network: `localhost:8000/app.css` in preview iframe | Pipe A OK             | Wrong port, CLI dead, or wrong frame       |
| Network: `cdn.../1247874246/.../app.css`            | Stock theme, not ours | Expected until sync fixes theme assignment |
| Network: `cdn.../1507984290/.../app.css`            | Pipe B OK             | Sync not done yet                          |
| `salla theme preview` prints Preview URL            | Sync OK               | Tag/auth error — fix section 4             |
| `salla theme list` shows `1507984290`               | Linkage OK            | Fix origin / Partners                      |


---

## 8. Frustrations with the assistant’s approach

- User corrected: **do not change `twilight.json` repository to Jawliner**.
- Docs were confusing; user needed clear separation of **local vs CDN vs push**.
- Assistant previously suggested `**rm -rf node_modules/.salla-cli`** — user does **not** want destructive actions without explicit approval.

---

## 9. Repo state at wrap-up

- **Branch:** `master`, pushed through `**be3e9358`** (magenta smoke test since reverted in header.scss).
- **Smoke test:** reverted — Path 1 hybrid preview confirmed; see §11.
- **Preview CLI:** failing at sync with **Tag 1.343.11**; localhost may start but hosted path blocked.
- **Stash:** `stash@{0}: temp: preview connect` (master.twig + app.css) — not restored.

---

## Quick reference

```bash
pnpm install
pnpm run development          # or prod before hosted sync
salla login                   # refresh on auth/tag errors
salla theme list              # Theme Raed = 1507984290
salla store list              # jawliner saudi
salla theme preview --store="jawliner saudi"
git push origin master        # GitHub only — CDN needs successful preview sync
```

**Official docs:** [Theme Preview](https://docs.salla.dev/422776m0) · [Setup a theme](https://docs.salla.dev/421879m0) · [Troubleshooting](https://docs.salla.dev/422765m0)

---

---

## 10. Update (2026-06-19 resumed session)

### Fixed: CLI tag/auth blocker (Pipe A + sync step)

- **Root cause of `Tag 1.343.11`:** CLI uses **git tags** (`git describe`), not `package.json`. Stuck Salla-side tag cleared by pushing `**1.343.12`** (+ twig touch commit `1556af76`).
- `**salla theme preview --store="jawliner saudi" --without-editor**` now prints **Preview URL** with no tag error.
- **Local CSS verified:** `localhost:800x/app.css` contains `#ff00ff`.

### Still blocked: Pipe B (hosted CDN)


| Check                                                  | Result                                                                 |
| ------------------------------------------------------ | ---------------------------------------------------------------------- |
| `cdn.../themes/1507984290/{1.343.11–1.343.15}/app.css` | **404** (all versions)                                                 |
| Partners Preview Theme → draft `2091709388`            | Opens editor ✓ but Network still `**1247874246/1.350.0/app.css`**      |
| Bare demostore `dev-avlhkpcoenpgyf3q`                  | Still `**1247874246**`                                                 |
| Partners portal version                                | Still shows `**1.343.11**` despite GitHub tags `1.343.12+` on `master` |
| Hosted magenta (no localhost)                          | **Not confirmed**                                                      |


**User actions taken:** Partners → GitHub branch `**master`** → Save Changes → **Preview Theme** on Jawliner Saudi.

**#120 reframe:** [SALLA-CLI-120-REFRAME-COMMENT.md](./SALLA-CLI-120-REFRAME-COMMENT.md) — CDN 404 after preview alone is expected; close issue as wrong premise.

---

---

## 11. Update (2026-06-19 — next session: Salla bug vs oversight)

### Verdict: **mostly our oversight, not a Salla CDN-build bug**


| Question                                                                     | Answer                                                                                                                                |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Is Salla broken because `cdn.../1507984290/`* is 404?                        | **No** — that path only exists after **theme installation / publish**, not after `theme preview`.                                     |
| Did `salla theme preview` sync succeed?                                      | **Yes** — prints Preview URL; local `localhost:8006/app.css` contains `#ff00ff`.                                                      |
| Why does bare demostore / watch HTML still show `1247874246`?                | Demo store has **stock Raed installed** (`1247874246` → 200). Preview is **hybrid**: Salla HTML + **local** assets via `assets_url=`. |
| Is [Salla-CLI #120](https://github.com/SallaApp/Salla-CLI/issues/120) valid? | **Wrong premise** — filed expecting CDN publish from preview. Reframe or close once Path 1 confirmed.                                 |


### Path 1 (hybrid dev loop) — evidence this session

- Active preview: **port 8006** / ws **8007** (`draft-1888704288`).
- Editor URL correctly includes `assets_url=http://localhost:8006`.
- Iframe `store_preview` src includes same `assets_url` + `ws_port`.
- `curl localhost:8006/app.css` → **200** + `#ff00ff`.
- **Not yet confirmed:** magenta header visible in storefront iframe (preview pane was blank; watch HTML has `"maintenance":true` — demo store may be in maintenance overlay).

### Path 2 (true hosted, no localhost)

Install theme **1507984290** on `jawliner saudi` via Partners **Theme Installation** ([Setup a theme](https://docs.salla.dev/421879m0)). Only then does CDN `1507984290/{version}/app.css` get built. Changes are static until re-synced.

### Mistakes we made (confirmed)

1. Used **CDN 1507984290 200** as preview success metric — wrong artifact.
2. Opened bare demostore / Partners editor **without** matching `assets_url` port → always saw `1247874246`.
3. Hand-pushed tags `1.343.12`–`1.343.22` — CLI auto-increments; created junk tags on same commit.
4. Filed #120 before reading that preview never publishes CDN bundles.

### Path 1 confirmed (user)

Hybrid editor URL with matching `assets_url` + `ws_port` shows magenta. Dev loop works.

### You + merchant (not agent)

Full install checklist: **[JAWLINER-THEME-INSTALL-WITH-MERCHANT.md](./JAWLINER-THEME-INSTALL-WITH-MERCHANT.md)** — Partners private setup, send request, merchant accept, test without activate, go-live.

### Agent work completed (2026-06-19 plan)

1. **#120 reframe** — draft ready: [SALLA-CLI-120-REFRAME-COMMENT.md](./SALLA-CLI-120-REFRAME-COMMENT.md) (paste on GitHub, then close)
2. **Install-link 404 + curl checks** — synced to [JAWLINER-THEME-INSTALL-WITH-MERCHANT.md](./JAWLINER-THEME-INSTALL-WITH-MERCHANT.md) § verification commands
3. **Smoke test reverted** — user later asked to **keep** `#ff00ff` in header.scss until hosted path confirmed
4. **Tag cleanup** — deferred; see §12 below (needs explicit user OK before delete)

---

## 12. Install-link 404 diagnosis + verification (agent reference)

**Install link 404 (browser)** — Partners / merchant checklist in [JAWLINER-THEME-INSTALL-WITH-MERCHANT.md](./JAWLINER-THEME-INSTALL-WITH-MERCHANT.md):

1. `jawlinerksa.com` missing from Allowed Installation
2. Theme not approved for private install
3. Merchant not logged into store dashboard when opening link
4. Flow A (request) vs Flow B (install link) mixed up
5. Private theme price not set

**CDN 404 for `1507984290` (curl)** — **not** an install-link bug; expected until theme is **installed** on a store (Path 2). Do not file CLI issues for this after preview alone.

```bash
# Path 1 — local (CLI must be running; use printed PORT)
curl -sI "http://localhost:8006/app.css"

# Path 2 — our theme CDN (404 until install)
curl -sI "https://cdn.assets.salla.network/themes/1507984290/1.343.22/app.css"

# Stock theme on demo store today
curl -sI "https://cdn.assets.salla.network/themes/1247874246/1.350.0/app.css"
```

---

## 13. Junk git tags `1.343.12`–`1.343.22` (done)

Deleted locally + on GitHub (user approved). Tags `1.343.27`–`1.343.30` exist on newer commits.

**Tag error still blocks preview sync** — `Tag 1.343.11 already exists` + `Authorization Error` is a **Salla-side** stuck version, not a running process. Fix: `salla login`, then new commit so CLI bumps past stuck tag, or Partners support to clear `1.343.11` on theme `1507984290`.

---

## 14. Update (2026-06-19 evening) — reordered priorities

### Situation (correct order)


| #   | What                                       | Status                                                                                        |
| --- | ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| 1   | **Private theme publish + Salla approval** | **Blocker** for merchant install — must complete theme info, images, price, submit for review |
| 2   | **Merchant install** (jawlinerksa.com)     | Blocked until #1 approved + private allowed list                                              |
| 3   | **Local hybrid preview** (Path 1)          | **RESOLVED in §15** — was Arc browser, works in Chrome                                         |
| 4   | **Migrate Jawliner UI from V2**            | Dev work while #1 in review                                                                   |

> **NOTE (see §15):** This §14 ordering is partly superseded. Local dev fully works via terminal preview in Chrome — merchant install/publish only needed for go-live, not development.


### OAuth vs theme (Partners FAQ clarified)

- **OAuth 2.0** = **Apps** only (API tokens). **Not needed for themes.**
- **Themes** = `salla login` + GitHub link (already ✓).
- **“Publish your App”** message = wrong product — ignore for theme work. Use **My Themes**, not **My Apps**.
- **“jawliner testing 2 (Connected)”** = App on demo store — unrelated to Theme Raed `1507984290`.

### Private publish — does Salla need a “full” theme?

**Yes, minimum package for approval** (lighter than public marketplace):

- Theme name, description, screenshots, icon/cover images
- Price (private: 1000–5000 SAR range)
- Demo store selected for preview listing
- Basic components/settings filled — does **not** need every page perfect; needs to look intentional, not empty shell

**Merchant 404 on notification** = theme not approved yet, wrong portal (App vs Theme), or merchant not in **تصميم المتجر → طلبات تطوير الثيمات** (not “Theme development requests” in English UI — Arabic path above).

### Demo store mess (`jawliner saudi`)

Repeated install/preview requests may have left demo store in a confused state (stock Raed `1247874246` still serving CDN).

**Options:**

- **A.** Create fresh demo store in Partners → **Create Demo Store** → use for preview + publish screenshots
- **B.** Keep `jawliner saudi` for hybrid preview only; pick clean store for publish listing
- **C.** Use `jawliner saudi twig testing 3` (no App installed) as alternate preview target

### CLI tag error (not a kill issue)

Ports can be clear but preview still fails — error is **API-side** when CLI registers version. Kill command for local servers only:

```bash
pkill -f 'salla theme serve'; pkill -f 'salla theme preview'
```

### Recommended path (parallel tracks)

```
Track A (you, Partners)          Track B (dev, local)
─────────────────────────          ────────────────────
Fill theme images + metadata     Migrate V2 diffs → theme-raed (Twig/SCSS)
Submit private publish           Hybrid preview when tag/auth fixed
Pick clean demo store            Keep #ff00ff smoke test until hosted confirmed
Wait Salla approval              Don't block on merchant install yet
Then → merchant install flow     (JAWLINER-THEME-INSTALL-WITH-MERCHANT.md)
```

### V2 → theme-raed migration (next dev work)

Source: [Jawliner-Saudi-V2/](../Jawliner-Saudi-V2/) (old repo `Mrufaihi/jawliner-saudi-v2`)

**Only 4 `src/` files differ from current theme-raed** — start here:


| File                                          | What to port                                 |
| --------------------------------------------- | -------------------------------------------- |
| `src/assets/styles/01-settings/global.scss`   | Colors, fonts, tokens                        |
| `src/assets/styles/04-components/header.scss` | Header styling (merge with smoke test block) |
| `src/views/components/header/header.twig`     | Header markup / nav                          |
| `src/views/layouts/master.twig`               | Layout shell, meta, scripts                  |


**Order:** global.scss → header (twig + scss) → master.twig → verify in hybrid preview.

**Do not:** repoint `twilight.json`/`origin` to V2 repo or Jawliner theme IDs.

### Smoke test

User wants `**#ff00ff` kept** in header.scss until hosted path confirmed.

### Open blockers

1. `Tag 1.343.11 already exists` — run `salla login`; may need Salla to clear stuck version on Partners
2. Theme not submitted for private publish yet
3. Merchant install untested until approval

---

## 15. BREAKTHROUGH (2026-06-19 night) — it was the BROWSER, not the pipeline

### Root cause: Arc blocked localhost injection. Chrome works.

Switched preview browser Arc → **Chrome** and changes appeared immediately. Magenta header + Jawliner branding render correctly. **No merchant install, no CDN publish needed to develop.**

### Two confirmed working preview paths

| Path | Command | Needs git push? | Assets from |
|------|---------|-----------------|-------------|
| **Terminal hybrid** | `salla theme preview --without-editor` (open in Chrome) | **No** | `localhost:8000` (live, hot reload) |
| **Salla site demo preview** | Partners/editor "Preview" in **Chrome** | **Yes** | pushed repo |

- **Terminal preview = fastest loop** — edit `src/` → webpack → refresh, no commit.
- **Site preview = needs push** because it reads the synced repo, not your disk.

### What was actually wrong all along

- Not the tag error, not CDN 404, not unpublished theme — **Arc** silently fell back to CDN `1247874246` instead of loading `localhost:8000`.
- Same URL behaved differently per browser: Chrome honored `assets_url=localhost`, Arc blocked it.
- **Lesson:** Salla CLI defaults to Chrome for a reason. Always preview in Chrome.

### Do we need merchant install to develop? **NO.**

Local development works fully via terminal hybrid preview in Chrome. Merchant install / private publish is only for **going live on jawlinerksa.com** — not for dev iteration.

### Revised priorities (supersedes §14)

| # | What | Status |
|---|------|--------|
| 1 | **Local dev loop** (terminal preview + Chrome) | **WORKS** — primary workflow |
| 2 | **Migrate Jawliner UI from V2** (4 files) | Active dev work |
| 3 | Private publish + merchant install | **Deferred** — only when ready to go live |

§14 "publish-first" reasoning is **downgraded**: publish is for go-live, not development.

---

*Last updated: 2026-06-19 night — BROWSER was the culprit (Arc vs Chrome). Local dev unblocked; merchant install deferred to go-live.*