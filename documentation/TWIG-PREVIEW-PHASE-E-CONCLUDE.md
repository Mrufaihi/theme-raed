# Conclude: Phase E Twig experiment vs preview (reverted)

**Status:** The **minimal Jawliner Twig / `twilight.json` / locale / SCSS** experiment described in the Phase E plan was **removed from the codebase** (reverted by the maintainer). **Twig is parked until further notice** — it was **not** the lever that fixed preview visibility or “stuck loading.”

**Indexed from:** [THEME-DOCS-INDEX.md](./THEME-DOCS-INDEX.md) · Related: [SALLA-PREVIEW-DEBUG.md](./SALLA-PREVIEW-DEBUG.md), [SALLA-PREVIEW-THEME-VS-DEMO-AND-EXPECTATIONS-CONCLUDE.md](./SALLA-PREVIEW-THEME-VS-DEMO-AND-EXPECTATIONS-CONCLUDE.md)

---

## 1. Summary of findings

- **Official / repo narrative (already in [SALLA-PREVIEW-DEBUG.md](./SALLA-PREVIEW-DEBUG.md)):** Custom Twig is **not** required for **`public/app.js`** / **`public/app.css`** to apply to the stock Raed storefront DOM. Preview wires **hosted HTML** to **local assets** via **`assets_url=http://localhost:<port>`** (and related query shapes). Branding and layout parity still **eventually** need Twig (or components) vs `prototype/`, but that is a **product** goal, not a proof that “no Twig ⇒ preview broken.”
- **Phase E implementation (now reverted)** briefly added: optional promo bar + shell classes in `header.twig`, spacing/typography on `featured-products-style1.twig`, hook class on `slider-products-with-header.twig`, **`jawliner_promo_*`** entries in `twilight.json`, **`blocks.jawliner.promo_default`** in `en.json`/`ar.json`, and scoped rules in `product.scss` / `header.scss` for the special-products block.
- **Outcome:** The maintainer **did not** see the expected preview delta (including **Network** not showing useful **`localhost`** theme traffic in the failing scenario). **Hypothesis rejected for this incident:** “Missing Twig confuses Twilight / preview” → **Twig was not the solution** to the preview problems being chased.
- **`pnpm run theme:preview` vs `pnpm exec salla theme preview`:** The user reported **`pnpm run theme:preview`** misbehaving (e.g. stuck loading) while **`pnpm exec salla theme preview`** worked at least once. A short-lived idea to force **`pnpm exec salla`** inside npm `scripts` was **rejected**; **`package.json` scripts remain the original `salla …` form** (user preference: “old command was fine” before the Twig experiment).

---

## 2. Bugs we faced

- **Preview UI stuck on “loading”** with no clear terminal error.
- **Browser CSP:** `script-src` with nonce — **inline script blocked** on the **hosted** Salla preview/editor shell (`s.salla.sa` / bundled app). Not fixable from theme source; may contribute to a broken shell in some builds/browsers.
- **`net::ERR_BLOCKED_BY_CLIENT`** on PostHog (and similar) — **ad blocker / privacy extension**; noise for theme debugging (already noted in [SALLA-PREVIEW-DEBUG.md](./SALLA-PREVIEW-DEBUG.md)).
- **`installHook.js` / `600010`** — treat as tooling/React DevTools noise unless tied to a reproducible theme error.
- **No visible theme changes + weak Network signal** for `localhost` **`app.js`/`app.css`** in the bad path — aligns with “assets never wired” or “wrong tab / CLI died / port empty,” not “Twig missing.”

---

## 3. Solutions we tried

| Approach | Result |
| -------- | ------ |
| Phase E minimal Twig + `twilight.json` settings + locales + scoped SCSS | **Reverted** — did not deliver the preview outcome the user needed; explicitly **not** continuing as the fix strategy. |
| Earlier repo fixes (still valid context): align **`@salla.sa/twilight*`** with CLI (`-store_id` watcher issue), **`webpack` `clean: isProduction`** | Documented in [SALLA-PREVIEW-DEBUG.md](./SALLA-PREVIEW-DEBUG.md) / [SALLA-PREVIEW-ROOT-CAUSE-CONCLUDE.md](./SALLA-PREVIEW-ROOT-CAUSE-CONCLUDE.md); separate from “Twig fixes preview.” |
| Clarifying CSP vs Posthog vs real `localhost` asset requests | Helped interpretation; **did not** by itself restore preview. |
| Suggestion to use **`pnpm exec salla`** in npm scripts | **Rejected** — user preferred restoring **`salla`** in scripts as before the Twig work. |

---

## 4. What we failed to fix (this thread)

- **A single, reproducible “run preview → always see Jawliner assets + DOM” recipe** under the failing conditions (stuck shell, no Network visibility).
- **Hosted CSP / editor loader** — outside this repository.

---

## 5. Possible future solutions

- **Stay on the asset pipeline checklist:** CLI-printed Preview URL, same machine, **`pnpm run development`** before preview, filter Network for **`localhost:<AssetsPort>`** and **`/app.js`**, **`/app.css`** (see [SALLA-PREVIEW-DEBUG.md](./SALLA-PREVIEW-DEBUG.md)).
- **Partners + GitHub install** path if live preview stays flaky ([SALLA-PREVIEW-DEBUG.md](./SALLA-PREVIEW-DEBUG.md) optional section).
- **Reintroduce Twig later** only for **real storefront markup / merchant settings**, not as a hypothesis for preview transport.
- **Salla support / CLI issues** if CSP-blocked inline scripts correlate with widespread editor breakage (bring CSP text + URL shape, redact secrets).

---

## 6. Frustrations with the assistant’s approach (user-voiced)

- Strong pushback on changing **`pnpm run theme:preview`** / scripts: user stated the **old command was fine** before the Twig work and did not want the script “fix.”
- **“Nah fuck that”** — frustration with chasing script/Twig tangents instead of resolving visible preview results.
- **Twig wasn’t the solution** — user explicitly parked Twig until further notice after revert.

---

*Last updated: 2026-05-03 (Phase E Twig experiment reverted; conclude recorded for future chats).*
