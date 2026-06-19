# Twig, Twilight, and why Salla themes look like this

Personal reference: what the words mean, where they come from, and how they compare to other stacks. This is **not** official Salla copy; verify details that matter for production against [Salla Docs](https://docs.salla.dev/) and your partner agreement.

---

## Twig (the language)

**What it is:** A **template language** for generating HTML (and other text) by mixing markup with variables, logic (loops, conditions), includes, and inheritance. Templates are usually files like `page.twig`.

**Who made it:** **Twig** was created in the **PHP** ecosystem, primarily associated with **Fabien Potencier** and the **Symfony** project. It is open source and widely used outside Salla (Symfony apps, Drupal themes, many PHP CMSs).

**Why it exists:** Raw PHP inside HTML gets messy fast. Template engines separate **presentation** (how it looks) from **application code** (how data is loaded). Twig also **compiles** templates to PHP for better performance and catches many errors early.

**Mental model for you:** Think “HTML + `{{ variables }}` + `{% commands %}` + reusable blocks.” You do **not** run Twig in the browser; the **server** (here, Salla’s platform) renders Twig into HTML for each request.

**Official learning:** [Twig documentation](https://twig.symfony.com/doc/) (syntax, tags, filters, inheritance).

---

## Twilight (Salla’s theme engine)

**What it is:** **Twilight** is **Salla’s name** for their **store theme system** on top of Twig templates, assets, configuration, and merchant-facing customization. Your theme repo is a **Twilight theme** if it has the expected structure (for example `twilight.json`, `src/views` with `.twig` files, assets, locales).

**Who made it:** **Salla** (the company / platform). It is not a separate open-source product named “Twilight” in the same way Twig is; it is **Salla’s branded layer** around theming for Saudi/MENA ecommerce.

**Why platforms do this:** They need:

1. **Safe customization** — merchants edit settings and components without touching raw code.
2. **Consistent data** — product, cart, customer, and store objects are injected into templates by the platform.
3. **Updates** — hooks and components let Salla evolve the platform without every theme breaking.

So: **Twig = syntax/engine family. Twilight = Salla’s theme packaging + conventions + admin UX + `twilight.json`.**

---

## Alternatives (other ecosystems)

You are not choosing Twig in a vacuum; other platforms picked different stacks:

| Platform / context | Typical templating | Notes |
| ------------------ | ------------------ | ----- |
| **Salla (Twilight)** | **Twig** | Your target stack for this project. |
| **Shopify themes** | **Liquid** | Similar *role* to Twig; different syntax and objects. |
| **BigCommerce (Stencil)** | **Handlebars** | Different syntax; same idea (server-side merge). |
| **WordPress** | **PHP templates** | Often minimal “engine”; lots of `the_title()`-style calls. |
| **Magento** | **PHTML + layout XML** | PHP-heavy, different mental model. |
| **Generic PHP apps** | **Blade** (Laravel), **Twig** (Symfony), plain PHP | Blade and Twig are peers, not the same syntax. |

**Takeaway:** For **Salla**, the “alternative” is not “use Liquid instead”—you **use what the platform renders**. The real choice is **stay on Salla Twilight** vs **leave the platform** (different business decision, not a small tech swap).

---

## Common confusions (worth writing down)

1. **Twilight vs `@salla.sa/twilight-components` (npm)**  
   The npm package is **client-side web components** useful in prototypes or in themes that load them. The **store theme** you publish is still centered on **Twig views + theme assets** on Salla’s side. Do not assume “npm only” equals a full theme.

2. **`twilight.json`**  
   Declares theme metadata, **settings** merchants toggle, **features** (predefined home components), and **custom components** (your Twig + field schemas). This file is the bridge between **merchant editor** and **your templates**.

3. **Docs typo `scr` vs folder `src`**  
   Some Salla diagrams say `scr`; real repos like [theme-raed](https://github.com/SallaApp/theme-raed) use **`src/`**. Follow working repos, not stale diagrams.

4. **Liquid**  
   Salla’s server-side theme language in docs is **Twig**, not Liquid. If you see “Liquid” in old notes, treat it as wrong for Salla.

---

## Why this matters for Jawliner

- Your current repo is mostly **static HTML + Tailwind + JS**. A production Salla theme is **Twig + assets + `twilight.json`**, with **real store data** in templates.
- Learning **Twig syntax** is a **one-time** skill; learning **Twilight** is learning **Salla’s objects, hooks, and component model**—that part is platform-specific.

---

## Sources to keep bookmarked

- [Salla Developer Docs](https://docs.salla.dev/) (Twilight, hooks, `twilight.json`, CLI)
- [Twig documentation](https://twig.symfony.com/doc/)
- [Theme Raed (reference theme)](https://github.com/SallaApp/theme-raed)

_Last updated: 2026-03-25 (personal doc; verify platform details before shipping)._
