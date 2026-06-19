# Twilight migration — requirements (persistent)

These requirements are **additive** to [REQUIREMENTS.md](../REQUIREMENTS.md). That file stays the source for **page design and UX** (hero, product section, zigzag, etc.). This file tracks **platform migration and merchant customization** so work is not trapped inside Cursor-only plans.

**Status:** Planning only — no implementation required to satisfy this document until execution starts.

---

## TR-001: Persistent documentation

**Priority:** High  
**Status:** done (this file set)

**Description:**  
Project plans, rationale, and migration requirements must live in **versioned Markdown** under the repo (e.g. `docs/`), not only in ephemeral IDE plan UI.

**Acceptance criteria:**

- [x] Execution plan exists: [TWILIGHT-MIGRATION-EXECUTION-PLAN.md](./TWILIGHT-MIGRATION-EXECUTION-PLAN.md)
- [x] Concept / why doc exists: [TWIG-TWILIGHT-BACKGROUND.md](./TWIG-TWILIGHT-BACKGROUND.md)
- [x] Migration requirements exist: this file
- [x] Index lists all theme-related docs: [THEME-DOCS-INDEX.md](./THEME-DOCS-INDEX.md)

---

## TR-002: Theme shell and preview

**Priority:** High  
**Status:** pending

**Description:**  
The deliverable must be a valid **Salla Twilight theme** previewable with **Salla CLI** on a **demo store**, starting from the official **Theme Raed** baseline unless Salla documents a newer recommended starter.

**Acceptance criteria:**

- [ ] Repository contains root `twilight.json` and expected `src/` layout per [Salla directory structure](https://docs.salla.dev/doc-421918) / [theme-raed](https://github.com/SallaApp/theme-raed)
- [ ] `salla theme preview` runs successfully
- [ ] Theme linked/synced per Partners Portal workflow

---

## TR-003: Merchant-editable configuration

**Priority:** High  
**Status:** pending

**Description:**  
Store owners must be able to adjust the theme **without editing Twig or JS** for routine branding and content. Use:

1. **`settings`** in `twilight.json` for global options (toggles, key strings where appropriate).
2. **`features`** for Salla predefined home components the merchant can add/reorder (where used).
3. **`components`** with **`fields`** for Jawliner-specific sections (images, titles, body copy, optional visibility).

**Acceptance criteria:**

- [ ] Documented list of all `settings` ids, types, labels (AR/EN as needed)
- [ ] Documented list of all custom `components` and their `fields`
- [ ] Twig reads settings via documented Salla accessors (e.g. `theme.settings.get(...)` per [Twilight.json](https://docs.salla.dev/421921m0))

---

## TR-004: Data correctness (no static fake catalog in production paths)

**Priority:** High  
**Status:** pending

**Description:**  
Product prices, images, options, cart, and checkout must come from **Salla context** in Twig/templates and platform behaviors—not from hardcoded arrays meant for the static `index.html` prototype.

**Acceptance criteria:**

- [ ] Product single page uses real product data from the platform
- [ ] Cart and checkout flows use default Salla theme behavior unless explicitly scoped otherwise
- [ ] Any remaining static content is clearly intentional (e.g. legal boilerplate) and documented

---

## TR-005: Internationalization and RTL

**Priority:** High  
**Status:** pending

**Description:**  
Arabic primary and English secondary, RTL-capable layout, aligned with [REQUIREMENTS.md](../REQUIREMENTS.md) general notes.

**Acceptance criteria:**

- [ ] Theme UI strings live in `src/locales` (or equivalent) where appropriate
- [ ] RTL/LTR behavior verified on home and product pages
- [ ] No duplicate HTML solely for language where locale keys suffice

---

## TR-006: Open product requirements (carry from REQUIREMENTS.md)

**Priority:** Medium  
**Status:** pending

**Description:**  
The following existing reqs must be re-validated after Twig/JS DOM stabilizes:

- REQ-007: Testimonial carousel
- REQ-008: Footer dropdown
- REQ-009: Scroll animations

**Acceptance criteria:**

- [ ] Same acceptance criteria as in [REQUIREMENTS.md](../REQUIREMENTS.md), met on the Twilight preview store

---

## TR-007: Scope — private store vs Theme Store

**Priority:** Medium  
**Status:** pending (decision)

**Description:**  
Choose whether this theme is **for Jawliner only** or **marketplace distribution**. Marketplace implies broader testing, documentation, and support burden.

**Acceptance criteria:**

- [ ] Decision recorded in [CONTEXT.md](../CONTEXT.md) or this file under “Decisions”
- [ ] Execution plan tailors QA to chosen scope

---

## Decisions log

| Date       | Decision | Notes |
| ---------- | -------- | ----- |
| 2026-03-25 | Docs live in `docs/*.md` | Avoid reliance on IDE-only plans |

---

## Change log

| Date       | Change                    |
| ---------- | ------------------------- |
| 2026-03-25 | Initial migration reqs    |
