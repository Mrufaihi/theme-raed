# Jawliner repo structure (for LLM context)

Paste the **“Quick preamble”** block into a new chat when you want the model to align on layout without re-scanning the tree.

---

## Quick preamble (copy into new conversations)

```
Workspace: Jawliner — JAWLINER e-commerce for Salla (Twilight). Two tracks live in one repo:

1) ROOT = static HTML prototype (Tailwind v3, vanilla JS). Primary pages: index.html, product.html. CSS: src/input.css → dist/output.css (Tailwind CLI). Behavior: src/app.js (plain script, works on file://), src/main.js (ES module: Twilight web components loader), src/lang-switch.js, src/lazy-videos.js, src/components.js (site config / colors).

2) theme-raed-baseline/ = vendored Salla “Theme Raed” baseline (Twig views, SCSS, webpack). Official Salla theme structure; use for migration to real Salla theme. Has its own package.json (pnpm enforced in upstream), webpack, twilight.json, src/views/**/*.twig, src/assets/js|styles, public/ build output. Parent npm script: npm run theme:baseline:preview.

Product requirements: REQUIREMENTS.md. Business/platform context: CONTEXT.md. Migration/how-to docs: docs/THEME-DOCS-INDEX.md.

Do not treat theme-raed-baseline/.git as the main repo — the git root is the Jawliner folder.
```

---

## What this repository is

| Layer                    | Role                                                                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Root**                 | Mobile-first, RTL-first static storefront mock aligned with REQ/CUSTOMIZATION_GUIDE; uses `@salla.sa/twilight-components` and `@salla.sa/twilight-tailwind-theme` from root `package.json`. |
| **theme-raed-baseline/** | Reference implementation of a full Salla theme (Twig + SCSS + webpack). Target for porting static markup, assets, and behavior into production theme structure.                             |
| **docs/**                | Persistent planning: Salla CLI, Twilight migration, Twig background, checklists, issue notes.                                                                                               |
| **assets/**              | Brand media: logos (SVG/JPG/AVIF), product imagery, video, design references — not compiled by default; referenced from HTML/CSS.                                                           |

---

## Root layout (main Jawliner project)

```
Jawliner/
├── package.json              # salla-twilight-project; tailwind CLI, prettier, @salla.sa/cli
├── package-lock.json
├── tailwind.config.js
├── postcss.config.js
├── .prettierrc, .prettierignore
├── index.html                # Main storefront page (large); links dist/output.css + src/*.js
├── product.html              # Secondary product-focused page
├── README.md                 # Template quick start (may predate Jawliner-specific naming)
├── REQUIREMENTS.md           # REQ-xxx product/UI requirements (authoritative for features)
├── CONTEXT.md                # Business + Salla/Twilight overview
├── CUSTOMIZATION_GUIDE.md    # Static template customization
├── DESIGN_SYSTEM.md
├── CSS-To-Tailwind_Migration.md
├── the-font-issue.md, previous-fail-attempt-js.md, issues.note  # Working notes
├── src/
│   ├── input.css             # @tailwind directives + custom layers
│   ├── main.js               # ES module: twilight-components loader + components.js imports
│   ├── app.js                # Plain script: carousel, FAQ, smooth scroll, etc. (runs without bundler)
│   ├── components.js         # siteConfig, colorScheme, featuredProducts, helpers
│   ├── lang-switch.js        # AR/EN toggle behavior
│   └── lazy-videos.js        # Lazy-loading for video elements
├── dist/
│   └── output.css            # Generated Tailwind (git may track or ignore per .gitignore)
├── assets/                   # Images, logos, videos, design-references/
├── image/                    # Screenshots / exports used in docs or pages
├── docs/                     # *.md — migration, Salla, reports (see THEME-DOCS-INDEX.md)
├── .cursor/plans/            # Cursor plan files (optional context)
├── .vscode/settings.json
└── theme-raed-baseline/      # Nested theme (see below)
```

### npm scripts (root)

| Script                            | Purpose                                                         |
| --------------------------------- | --------------------------------------------------------------- |
| `npm run build` / `build:css`     | Tailwind watch: `src/input.css` → `dist/output.css`             |
| `npm run build:css:once`          | One-off Tailwind build                                          |
| `npm run build:css:prod`          | Minified production CSS                                         |
| `npm run format` / `format:check` | Prettier                                                        |
| `npm run salla`                   | Salla CLI (`@salla.sa/cli`)                                     |
| `npm run theme:baseline:preview`  | `cd theme-raed-baseline && npx --prefix .. salla theme preview` |

### How `index.html` loads JS (order matters)

1. `src/app.js` — non-module, primary interactions.
2. `src/main.js` — `type="module"`; Twilight custom elements (may fail on `file://` bare imports).
3. `src/lazy-videos.js`, `src/lang-switch.js`.

---

## theme-raed-baseline/ (Salla Theme Raed)

Upstream-style Salla theme. **pnpm** is enforced via `preinstall` in its `package.json`; webpack builds JS/CSS into `public/`.

```
theme-raed-baseline/
├── package.json, package-lock.json, pnpm-lock.yaml
├── webpack.config.js, postcss.config.js, tailwind.config.js
├── twilight.json             # Salla Twilight theme config
├── src/
│   ├── views/
│   │   ├── layouts/          # master.twig, customer.twig
│   │   ├── components/       # header, footer, home blocks
│   │   └── pages/            # index, product, cart, blog, brands, customer/*, etc.
│   ├── assets/
│   │   ├── js/               # app.js, page bundles, partials/
│   │   ├── styles/           # ITCSS-style SCSS (01-settings … 05-utilities), app.scss
│   │   └── images/
│   └── locales/              # ar.json, en.json
├── public/                   # Webpack output (app.js, app.css, page chunks, images)
├── README.md, CHANGELOG.md
├── .github/                  # templates, dependabot
└── .git/                     # Nested git metadata (shallow clone of theme-raed); main repo root is still Jawliner/
```

**Typical commands** (from `theme-raed-baseline/`): `pnpm install`, `pnpm run development` / `watch` / `production`.

---

## Documentation map (human + LLM)

| File                                                                           | Use when                                  |
| ------------------------------------------------------------------------------ | ----------------------------------------- |
| [THEME-DOCS-INDEX.md](./THEME-DOCS-INDEX.md)                                   | Entry point to all `docs/*.md`            |
| [../REQUIREMENTS.md](../REQUIREMENTS.md)                                       | What to build (REQ-xxx)                   |
| [../CONTEXT.md](../CONTEXT.md)                                                 | Brand, market, Salla/Twilight explanation |
| [../CUSTOMIZATION_GUIDE.md](../CUSTOMIZATION_GUIDE.md)                         | Editing the static template               |
| [SALLA-CLI-AND-STATIC-TO-THEME.md](./SALLA-CLI-AND-STATIC-TO-THEME.md)         | CLI and static → theme steps              |
| [SALLA-PREVIEW-DEBUG.md](./SALLA-PREVIEW-DEBUG.md)                             | `theme preview` Axios timeout / tunnel debug |
| [TWILIGHT-MIGRATION-EXECUTION-PLAN.md](./TWILIGHT-MIGRATION-EXECUTION-PLAN.md) | Phased migration                          |
| [TWILIGHT-MIGRATION-REQUIREMENTS.md](./TWILIGHT-MIGRATION-REQUIREMENTS.md)     | TR-xxx migration requirements             |

---

## Conventions for assistants

1. **Prefer the correct tree**: UI experiments and copy often live in root `index.html` / `src/`; production-shaped templates live under `theme-raed-baseline/src/views/`.
2. **Respect dual package managers**: root uses **npm** (see `package-lock.json`); baseline theme expects **pnpm** upstream.
3. **Large binary paths**: `assets/` and `theme-raed-baseline/public/` hold media and build artifacts — avoid reading entire directories into context; grep or open specific files.
4. **RTL and locale**: Root HTML uses `lang="ar"` and `dir="rtl"` with `data-en` / `data-ar` patterns in places; align changes with REQUIREMENTS.

---

_Last generated for LLM handoff: 2026-04-02._
