# Issue: "See the difference" Section – Image Sizing

**Section:** Before/After comparison slider (lines ~552–657 in `index.html`)  
**Problem:** Image is too small on md/lg screens. Layout used to work but no longer does.

---

## What We Tried

| Attempt | Change | Result |
|---------|--------|--------|
| 1 | Removed `scale-125`, added `max-w-2xl mx-auto`, `px-4 sm:px-6` | Image constrained but still too small on md/lg |
| 2 | Responsive max-width: `max-w-2xl md:max-w-4xl lg:max-w-5xl` | No noticeable change |
| 3 | Same pattern as gum image: add `min-w-0` + `md:max-w-[840px] lg:max-w-[840px]` | No change |
| 4 | Grid: `lg:grid-cols-2` → `lg:grid-cols-[1fr_2fr]` for 2/3 image column | No change |

---

## Current Structure

```
section (bg-black, py-20 md:py-32)
└── div.container
    └── div.grid (grid-cols-1 lg:grid-cols-[1fr_2fr])
        ├── div (lg:order-1) – Text column
        └── div (lg:order-2) – Image column
            └── div (max-w-2xl, min-w-0, md:max-w-[840px]...)
                └── img × 2 (absolute, object-contain, clip-path)
```

---

## Possible Causes

1. **Flex + `justify-center`** on the image column may prevent the child from taking full width.
2. **`max-w-*` on the inner div** keeps the image small even when the grid gives it more space.
3. **Watch mode** – Tailwind output may not be rebuilt; `build:css` or `build:css:once` may need to run.
4. **Other CSS** – Overrides from `input.css` or other styles might affect layout.

---

## Recommended Next Steps

1. Inspect computed styles in DevTools for the image container at md/lg.
2. Temporarily remove `max-w-*` on the inner div and see if the image expands.
3. Run `npm run build:css` and verify `dist/output.css` has the expected classes.
4. If needed, make the image column `w-full` and drop max-width constraints at lg; rely on the grid for sizing.
