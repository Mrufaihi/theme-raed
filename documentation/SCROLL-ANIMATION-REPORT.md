# Scroll Animation Report – Zigzag Fix & Plan for Other Components

## 1. Zigzag Animation – Problem & Fix

### Problem
- Zigzag section was **hidden** even though elements were in the DOM (console showed them).
- On refresh, animation showed **slide/fade out** instead of **slide/fade in** – elements were animating to the hidden state instead of the visible state.

### Root Cause
**CSS specificity.** The hide rule `.zigzag-animate-ready .zigzag-left` (specificity `0,2,0`) was stronger than the show rule `.zigzag-animate` (specificity `0,1,0`). When JS added `.zigzag-animate` on scroll, the hide rule still won, so elements stayed invisible.

### Fix
Used equal specificity for the visible state so order in the stylesheet decides who wins:

```css
/* Override when visible - same specificity so order matters (must come after) */
.zigzag-left.zigzag-animate,
.zigzag-right.zigzag-animate {
  opacity: 1;
  transform: translateX(0);
}
```

`.zigzag-left.zigzag-animate` has specificity `0,2,0` (same as `.zigzag-animate-ready .zigzag-left`). Because it comes later in the CSS, winning rules when both apply.

### How It Works
1. **Initial state:** Section has `.zigzag-animate-ready` → children start off-screen (opacity: 0, translateX).
2. **JS:** IntersectionObserver watches `.zigzag-left` and `.zigzag-right`.
3. **On scroll-in:** When an element enters the viewport, add `.zigzag-animate`.
4. **CSS:** `.zigzag-animate` overrides the hidden state → elements animate in with transition.

---

## 2. Plan to Apply to Other Components

| Section | Selector / ID | Suggested animation | Notes |
|--------|----------------|---------------------|-------|
| Hero | `#hero` | Fade in on load | Already has `animate-fade-in-delayed` |
| Logo bar | `.logo-slider` parent | Slide in from left | Logo marquee |
| Products | `#products` | Fade/slide up | Use IntersectionObserver |
| Comparison (before/after) | `#divider` container | Fade in | Content-heavy |
| Gum section | `.flex.flex-col.justify-center` (gum) | Fade in | Short section |
| Video carousel | Section with `#video-container` | Fade up | Testimonial area |
| FAQ | `.s-block--faq` | Staggered fade | Each FAQ item |

### Implementation Pattern
1. **CSS:** Add `.scroll-animate-ready` and `.scroll-animate` classes like zigzag:
   - `.scroll-animate-ready .your-cell` → hidden (opacity: 0, transform)
   - `.your-cell.scroll-animate` → visible (opacity: 1, transform: none)
2. **JS:** Use IntersectionObserver (same pattern as zigzag):
   - Add `.scroll-animate-ready` to the section container
   - Observe child elements
   - Add `.scroll-animate` when `entry.isIntersecting`
3. **Avoid:** Don’t use a generic `.scroll-animate` that hides by default if the observer runs late – elements can stay hidden. Use a section-specific class (e.g. `.products-animate-ready`) so only intended sections start hidden.

### References
- **Context7 (MDN):** IntersectionObserver, threshold, rootMargin
- **Existing pattern:** `src/app.js` zigzag block, `src/input.css` zigzag styles

---

## 3. MCP Tools Used

| Tool | Use |
|------|-----|
| **Context7** | MDN on IntersectionObserver, threshold, callback pattern |
| **Firecrawl** | Stack Overflow for scroll reveal and module/CORS issues |
