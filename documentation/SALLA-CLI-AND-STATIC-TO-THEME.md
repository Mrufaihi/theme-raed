# Salla CLI and integrating a static site into Salla

Personal reference for **what the CLI is**, **what tech it uses**, and the **exact integration path** from a static HTML/CSS/JS site (like this repo’s `index.html`) into a real Salla store theme. Official sources win if anything here drifts: [Salla CLI theme overview](https://docs.salla.dev/422774m0), [Theme preview](https://docs.salla.dev/422776m0), [Twilight docs](https://docs.salla.dev/?nav=01HNFTD5Y5ESFQS3P9MJ0721VM), [npm `@salla.sa/cli`](https://www.npmjs.com/package/@salla.sa/cli).

---

## Part A — What is Salla CLI?

**Salla CLI** is Salla’s **official command-line tool**, distributed as the npm package **`@salla.sa/cli`**. After a global install you run the **`salla`** command in your terminal.

**What it is for (two big buckets):**

1. **Salla Apps** — scaffolding and linking “apps” that integrate with [Salla APIs](https://docs.salla.dev/) (Partners Portal, webhooks, `salla app create`, `salla app serve`, etc.). The npm readme mentions **PHP / Composer** alongside Node because some app templates are **Laravel-oriented**; that stack is about **generated app projects**, not about you “running PHP” to preview Twig in the browser yourself.
2. **Salla Themes (Twilight)** — creating, listing, previewing, deleting, and publishing themes. This is what matters for turning your static storefront into a Salla theme.

**Theme-related commands** (from Salla docs):

| Action  | Command              | Alias |
| ------- | -------------------- | ----- |
| Create  | `salla theme create` | `c`   |
| Preview | `salla theme preview`| `p`   |
| List    | `salla theme list`   | `l`   |
| Delete  | `salla theme delete` | `d`   |
| Publish | `salla theme publish`| `s`   |

You also use **`salla login`** to authenticate with your Partners account (and theme flows expect **GitHub** access via a **Personal Access Token** as documented).

---

## Part B — What language / “backend” is involved?

**On your machine**

- The **CLI itself** is a **Node.js** program (install with npm, run `salla`).
- The **npm package readme** lists **Node.js LTS** (≥ 16.13.1 in the published readme) and **npm**; it also lists **PHP ≥ 7.4** and **Composer** as prerequisites for the **broader CLI** usage (especially **Salla Apps** workflows). For **theme development**, your day-to-day is still **Node + your theme’s build** (e.g. Theme Raed uses **Webpack** + **Tailwind** in the theme repo).
- **You do not host** the Salla storefront PHP backend in this repo. The **store runs on Salla**; your repo is the **theme package** (Twig + assets + `twilight.json`).

**On Salla’s side (conceptual)**

- Store pages are rendered with **Twig** templates and **Salla’s data** (products, cart, customer, etc.). That rendering is **their platform**, not a server you deploy from this static prototype.

**Summary sentence:** **CLI = Node on your laptop. Store = Salla’s backend + Twig. Your job = ship a valid Twilight theme folder structure and assets.**

---

## Part C — Steps to integrate *this* static website into Salla (and why each step matters)

“Integrate” here means: **merchants see your design inside a real Salla store**, with **real products and cart**, not opening `index.html` from disk.

### Step 1 — Partners account and a demo store

**Do:** Create/access [Salla Partners Portal](https://salla.partners/) and have (or create) a **demo store** to preview the theme.

**Why it matters:** Theme preview and publishing are tied to **your partner identity** and a **real store context**. Without a demo store you cannot validate cart, product pages, RTL, or Arabic content the way customers will see them.

---

### Step 2 — GitHub account and Personal Access Token (PAT)

**Do:** Connect GitHub to your Partners workflow and create a **GitHub PAT** with appropriate **repo** scope, as described in [Salla’s theme CLI overview](https://docs.salla.dev/422774m0).

**Why it matters:** Salla’s theme workflow **syncs theme files through GitHub**. The CLI and preview flow expect that link; the PAT is how the CLI authenticates to GitHub **without** putting your password in scripts.

---

### Step 3 — Install Salla CLI and log in

**Do:** Install globally, then authenticate:

```bash
npm install @salla.sa/cli -g
salla login
```

**Why it matters:** **`salla login`** is the gate for **`salla theme`** commands. If login is wrong, preview/create/publish will fail no matter how good your HTML is.

---

### Step 4 — Create or import a **Twilight theme** (get a real theme repo)

**Do:** Use **`salla theme create`** or import a repo that already contains a valid **`twilight.json`** and **`src/views`** Twig layout (official baseline: [Theme Raed](https://github.com/SallaApp/theme-raed)).

**Why it matters:** A static **`index.html`** is **not** a Salla theme. Salla expects **Twig templates**, **`twilight.json`**, **locales**, and **assets** in the documented structure. Starting from Theme Raed (or an equivalent valid theme) avoids inventing folder conventions that preview will reject.

---

### Step 5 — Clone the theme repo locally and install theme dependencies

**Do:** `git clone` your synced repo, `cd` into it, run **`npm install`** (and use the theme’s documented scripts).

**Why it matters:** Theme Raed-style themes **build** CSS/JS (Webpack/Tailwind). Preview and production both assume **built assets** and correct paths under `src/`.

---

### Step 6 — Run theme preview

**Do:** From the **theme root** folder:

```bash
salla theme preview
# or: salla theme p
```

Optional flags (see [Preview doc](https://docs.salla.dev/422776m0)): `--store=`, `--with-editor`, `--browser=`.

**Why it matters:** Preview runs a **local dev server**, **watches files**, and **hot-reloads** so you see your theme on a **selected demo store**. That is the fastest feedback loop; “it looks fine in `file://`” is **not** equivalent.

**Practical note from Salla docs:** Very aggressive IDE auto-save can spam sync and trigger rate limits (`ETIMEDOUT`); if that happens, tone down auto-save and check network.

---

### Step 7 — Port the static site into **Twig + assets** (the real integration work)

**Do:**

- Move global styles into the theme build pipeline; keep Tailwind if you want, aligned with the starter’s **Webpack/PostCSS** setup.
- Split **`index.html`** into **layouts/partials/components** as `.twig` files under `src/views`.
- Replace fake product data with **Salla template variables** on **product** and **listing** pages.
- Move translatable UI strings into **`src/locales`** (`ar.json`, `en.json`) where appropriate.

**Why it matters:** Until HTML becomes **Twig wired to Salla data**, you still have a **brochure**, not a **store**. This step is where integration actually happens.

---

### Step 8 — Define **`twilight.json`** for merchant editing

**Do:** Add **`settings`**, enable relevant **`features`**, and/or define **`components`** with **`fields`** so the store owner can change text, images, toggles, and home sections without editing code (see [Twilight.json](https://docs.salla.dev/421921m0)).

**Why it matters:** Your stated goal is **owner-editable** theming. Without `twilight.json`, only developers can change content safely.

---

### Step 9 — Commit and push; confirm sync with Partners / preview again

**Do:** Commit changes; push to GitHub. Re-run preview if needed; fix until home + product flows work on the demo store.

**Why it matters:** Preview may prompt you to **push** so the remote theme state matches local; drifting copies cause “works here, not there” confusion.

---

### Step 10 — (Optional) Publish to the theme marketplace

**Do:** When the theme is ready for **other merchants**, use **`salla theme publish`** ([publishing guide](https://docs.salla.dev/doc-422968)) and meet marketplace expectations (support, QA breadth, screenshots).

**Why it matters:** **Jawliner-only** vs **Theme Store** are different **obligation levels**. Skip this step if the theme is private to one store.

---

## Short “if you only remember one thing”

**Salla CLI** is your **local Node tool** to **authenticate**, **preview**, and **manage** themes tied to **GitHub** and the **Partners Portal**. **Integrating** your static site means **re-homing** it into a **Twilight theme** (Twig + `twilight.json` + assets), then proving it with **`salla theme preview`** on a **demo store**—not uploading `index.html` alone.

---

## Related docs in this repo

- [TWILIGHT-MIGRATION-EXECUTION-PLAN.md](./TWILIGHT-MIGRATION-EXECUTION-PLAN.md) — phased execution plan
- [TWIG-TWILIGHT-BACKGROUND.md](./TWIG-TWILIGHT-BACKGROUND.md) — Twig vs Twilight concepts
- [THEME-DOCS-INDEX.md](./THEME-DOCS-INDEX.md) — full index

_Last updated: 2026-03-25._
