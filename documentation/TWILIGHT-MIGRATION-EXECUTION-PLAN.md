# Twilight migration — execution plan (do later)

This file is the **persistent** plan you can open in any editor or git history. It does **not** replace Salla’s official docs; it orders **how** you will execute when you are ready to build.

**Current decision:** No implementation yet—only planning and documentation.

**Status (theme shell):** The Jawliner repository root is now a Theme Raed–compatible Twilight tree (`twilight.json`, `src/views`, webpack). Run Phases 3–5 below when you are ready for merchant `twilight.json`, Twig port, and JS hardening.

---

## Goal (unchanged)

Turn the Jawliner storefront design into a **real Salla Twilight theme** that:

- Works on Salla (preview + production).
- Lets the **store owner** change what they should change (text, images, toggles, home sections) via **`twilight.json`** settings, **theme features**, and **custom components**—not by editing code.
- Stays **as simple as possible** for an MVP (home + product experience first; other pages inherit defaults until you choose otherwise).

---

## Phase 0 — Accounts and repo reality check

1. **Salla Partners** access and a **demo store** for preview.
2. **GitHub** account linked as Salla expects for theme sync.
3. **Salla CLI** installed; confirm `salla theme preview` runs against the **official starter** before you port Jawliner (proves your machine and permissions).

**Exit criteria:** You can preview a stock theme on a demo store with file changes visible after save/push.

---

## Phase 1 — Bootstrap the theme shell (do not start from blank HTML)

1. Start from **[Theme Raed](https://github.com/SallaApp/theme-raed)** (fork or new repo), not from `index.html` alone—so Webpack/Tailwind/`src/views` paths match what Salla tooling expects.
2. Connect the repo to **Partners Portal** / theme record so `twilight.json` and sync match your project.
3. Document in git: theme name, support email, repo URL (author block in `twilight.json`).

**Exit criteria:** Clean preview; empty or default home still renders; no Jawliner UI yet.

---

## Phase 2 — Asset and design system port

1. Merge **Tailwind** config and **global styles** from Jawliner (`tailwind.config.js`, `src/input.css`) into the starter’s build pipeline.
2. Decide **font strategy** (self-hosted vs CDN) and align with Salla performance and CSP realities—see project notes like `the-font-issue.md` if applicable.
3. Move static images/SVGs into theme `src/assets` (or equivalent per starter).

**Exit criteria:** Starter pages visually “on brand” at least for header/footer/globals.

---

## Phase 3 — `twilight.json` design (merchant-editable contract)

Define **before** cutting lots of Twig:

1. **`settings`** — global toggles and values (example categories: colors, promo bar text, section visibility, placeholder image paths). Access pattern in Twig per Salla docs: `theme.settings.get("id")`.
2. **`features`** — which **predefined** home components you support (sliders, testimonials, featured products, etc.). Prefer these where they match merchant needs to reduce custom code.
3. **`components`** — **custom** home components for Jawliner-specific sections (hero, zigzag, comparison, etc.) with **`fields`** merchants edit (text, textarea, image, collections).

**Exit criteria:** A written table (see `TWILIGHT-MIGRATION-REQUIREMENTS.md`) listing each setting/component id, type, and who edits it.

---

## Phase 4 — Twig migration (structure first, data second)

1. Replace static **strings** with **locale keys** (`src/locales/ar.json`, `en.json`) where the string is theme UI—not product copy coming from the catalog.
2. Split Jawliner **HTML** into Twig partials: header, footer, reusable sections.
3. Implement **home** using a **hybrid**: features where possible + custom components for unique layout.
4. Implement **product single** using **Salla product objects** (no hardcoded price/stock/images in Twig for real catalog data).

**Exit criteria:** Home and product pages render correctly on demo store with real products.

---

## Phase 5 — JavaScript behaviors (re-bind to real DOM)

Re-implement open items from the main requirements doc (carousel, footer accordion, scroll animations) **against the final Twig markup** and bundled theme JS (starter convention).

**Exit criteria:** Behaviors match `REQUIREMENTS.md` acceptance criteria on preview.

---

## Phase 6 — Hardening and scope decision

1. **Private theme for one store** vs **Theme Store listing**—second path implies stricter QA, screenshots, support expectations, and broader merchant scenarios.
2. Cross-browser and **RTL** pass.
3. Performance: image lazy loading, JS size, critical CSS if needed.

**Exit criteria:** Definition of done matches the scope you chose in phase 6.1.

---

## Dependency order (summary)

```text
Phase 0 (tooling) → Phase 1 (shell) → Phase 2 (CSS/assets)
    → Phase 3 (twilight.json contract) → Phase 4 (Twig + data)
    → Phase 5 (JS) → Phase 6 (scope + QA)
```

---

## Related files in this repo

- [TWIG-TWILIGHT-BACKGROUND.md](./TWIG-TWILIGHT-BACKGROUND.md) — concepts and alternatives
- [TWILIGHT-MIGRATION-REQUIREMENTS.md](./TWILIGHT-MIGRATION-REQUIREMENTS.md) — requirements checklist
- [REQUIREMENTS.md](../REQUIREMENTS.md) — product/UI requirements (Jawliner)
- [CONTEXT.md](../CONTEXT.md) — business and project context (update if anything contradicts Twig)

_Last updated: 2026-03-25._
