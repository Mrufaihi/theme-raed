# Salla-CLI #120 — reframe / close comment (draft)

**Issue:** [SallaApp/Salla-CLI#120](https://github.com/SallaApp/Salla-CLI/issues/120)  
**Theme:** Theme Raed `1507984290` · demo store `jawliner saudi` · repo `Mrufaihi/theme-raed`  
**Status:** Ready to post — Path 1 hybrid preview confirmed; issue premise was incorrect.

Indexed from: [THEME-DOCS-INDEX(main).md](./THEME-DOCS-INDEX(main).md)

---

## Suggested GitHub comment (copy-paste)

```markdown
## Update — closing / reframing

After more testing and reading the Salla docs, we believe this is **not a CLI bug**. Our original report assumed `salla theme preview` publishes theme assets to the Salla CDN. That is not how preview works.

### What we expected

Running `salla theme preview` would build and upload bundles so that:

`https://cdn.assets.salla.network/themes/1507984290/{version}/app.css` → **200**

### What actually happens

**Preview is hybrid:** Salla serves store HTML while CSS/JS load from the **local dev server** via `assets_url=http://localhost:PORT` (and matching `ws_port`) in the Preview URL printed by the CLI.

CDN paths under `themes/1507984290/` are created only after **theme installation on a store** (Partners → Theme Installation / private install flow), not from the preview command alone.

References:
- [Theme Preview](https://docs.salla.dev/422776m0)
- [Setup a theme §8–9](https://docs.salla.dev/421879m0)

### Current status (2026-06-19)

| Check | Result |
|-------|--------|
| `salla theme preview --store="jawliner saudi" --without-editor` | Prints Preview URL; no tag/auth error |
| Preview URL with matching `assets_url` + `ws_port` | Local assets load correctly (dev loop works) |
| `cdn.../themes/1507984290/*` | **404** — expected until theme is **installed** on a store |
| Bare demostore / editor without `assets_url` | Still serves stock Raed `1247874246` — expected until install |

### Conclusion

The 404 on CDN theme `1507984290` was a **misunderstanding of the preview vs install pipeline**, not a failure of the CLI to publish preview assets.

We are **closing this as not a bug** (or reframing as documentation/clarity if the team prefers). Our next step is **Path 2**: install theme `1507984290` on the target store via Partners private-theme flow, then verify CDN after install.

Thanks for any doc pointers on when CDN bundles are first created — a clearer callout that preview ≠ CDN publish would help future theme developers.
```

---

## Why reframe (internal notes)

1. Section 11 of [SALLA-THEME-RAED-CONNECT-CONCLUDE-2026-06-19.md](./SALLA-THEME-RAED-CONNECT-CONCLUDE-2026-06-19.md) confirms: CDN 404 after preview alone is expected.
2. Path 1 hybrid dev loop works — magenta smoke test visible via editor URL with matching port.
3. True hosted assets (no localhost) require store install — see [JAWLINER-THEME-INSTALL-WITH-MERCHANT.md](./JAWLINER-THEME-INSTALL-WITH-MERCHANT.md).

---

## After posting

- [ ] Paste comment on GitHub issue #120
- [ ] Close issue as *not planned* / *invalid* / *duplicate of docs gap* (pick label Salla maintainers prefer)
- [ ] Remove “Escalation: #120” wording from conclude doc once closed (optional cleanup)
