# Jawliner theme install — you + merchant checklist

**Goal:** Get theme **1507984290** onto **[jawlinerksa.com](https://jawlinerksa.com/)** for hosted testing **without** going live until the merchant **activates**.

**Agent handles:** code, docs, CDN diagnostics, smoke-test revert, #120 reframe.  
**You + merchant handle:** everything in Partners UI and merchant dashboard below.

Indexed from: [THEME-DOCS-INDEX(main).md](./THEME-DOCS-INDEX(main).md)

---

## Two portals (do not mix)

| Portal | Who | URL |
|--------|-----|-----|
| **Salla Partners** | You (developer) | [salla.partners](https://salla.partners/) |
| **Merchant dashboard** | Jawliner store owner | [s.salla.sa](https://s.salla.sa/) |

Partners demo store **`jawliner saudi`** ≠ production **`jawlinerksa.com`**.

---

## Dev loop (already working — Path 1)

```bash
salla theme preview --store="jawliner saudi" --without-editor
```

Open **only** the **Preview URL** printed that run (`assets_url=localhost:PORT` + matching `ws_port`). Keep CLI running on same machine.

---

## Your jobs (Partners — developer)

Do in order:

### 1. Private theme setup
- [ ] Partners → **My Themes** → Theme Raed `1507984290`
- [ ] **Theme Installation** → tick **Private theme**
- [ ] Set private theme price if required (1000–5000 SAR per [Private Themes blog](https://salla.dev/blog/all-about-private-themes/))
- [ ] Add **`jawlinerksa.com`** to **Allowed Installation** list

### 2. Theme approval (if install link 404s)
- [ ] Check if theme status is **approved for private install** (may need submit/review even if not marketplace public)
- [ ] Wait for Salla approval if pending

### 3. Send preview/install request (Flow A)
- [ ] Theme Details → **Theme Preview in Live Store**
- [ ] Enter `https://jawlinerksa.com/`
- [ ] Click **Request to Install**

### 4. Private install link (Flow B — after allowed list + approval)
- [ ] Copy **installation link** from Theme Installation section
- [ ] Send link to merchant (they must be logged into jawlinerksa.com dashboard when opening)

### 5. Optional: demo CDN test first
- [ ] Install on demo store **`jawliner saudi`** before production
- [ ] Confirm `curl -sI https://cdn.assets.salla.network/themes/1507984290/{version}/app.css` → **200**

### 6. Tell merchant (copy message below)

---

## Merchant jobs (jawlinerksa.com owner)

### Before accepting
- [ ] Log in at [s.salla.sa](https://s.salla.sa/) as **jawlinerksa.com** store owner (not Partners)
- [ ] **تصميم المتجر** (Store Design) → **Theme Development Requests**
- [ ] Enable **Accept theme preview requests during development** → Save

### Accept developer request (Flow A)
- [ ] Same section → **طلبات تطوير الثيمات** (Theme development requests)
- [ ] Accept request (⋮ menu) → **Preview**

### Or use install link (Flow B)
- [ ] While logged into store dashboard, open link developer sent
- [ ] Preview / purchase private theme per Salla flow

### After install — test safely
- [ ] **Store Design** → find installed theme copy (trial / not active)
- [ ] Customize + preview there
- [ ] **Do NOT activate** until theme is finished

### Go-live (final — only when ready)
- [ ] **Store Design** → explicitly **activate** new theme
- [ ] This is what [jawlinerksa.com](https://jawlinerksa.com/) customers see

**Install ≠ live.** Customers keep current theme until activation.

---

## Message template for merchant

> We sent a theme install/preview request for Jawliner’s new Salla theme.
>
> **Where to look (your store dashboard, not Partners):**
> 1. Log in at [s.salla.sa](https://s.salla.sa/) as the **jawlinerksa.com** store owner
> 2. Go to **تصميم المتجر** (Store Design)
> 3. Open **طلبات تطوير الثيمات** (Theme development requests)
> 4. If empty: enable **Accept theme preview requests during development** first
> 5. Accept our request → Preview the theme
>
> **Important:** Previewing/installing does **not** change what customers see until you **activate** the new theme.

---

## Install link 404 — check in order

1. `jawlinerksa.com` not on **Allowed Installation** list
2. Theme not **approved** yet
3. Merchant not **logged in** when opening link
4. Confused Flow A (request) with Flow B (link)
5. Private theme price not set

---

## Why install link 404 vs preview request

| | Flow A — Request | Flow B — Install link |
|--|------------------|----------------------|
| **You do** | Partners §8 → Request to Install | Partners §9 → Allowed list + copy link |
| **Merchant does** | Accept in Theme Development Requests | Open link while logged in |
| **Goes live?** | No | No (until activate) |

---

## Docs

- [Setup a theme §8–9](https://docs.salla.dev/421879m0)
- [Private Themes flow](https://salla.dev/blog/all-about-private-themes/)
- [Theme store FAQs](https://help.salla.sa/en/article/theme-store-faqs/memexqc5l38884bnaj6lxl87)
- [Theme version management](https://help.salla.sa/article/332527199)
- Session handoff: [SALLA-THEME-RAED-CONNECT-CONCLUDE-2026-06-19.md](./SALLA-THEME-RAED-CONNECT-CONCLUDE-2026-06-19.md)
