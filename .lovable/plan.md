## Black-only journey section with map-pin heading + dashed route

Edit only the "Where you are in the journey" section on `src/routes/index.tsx`.

### 1. Heading goes all-black, with a location pin

- Replace the gradient on `in` so the entire `<h2>` reads as one solid black phrase: `Where you are in the journey.` in `var(--brand-ink)`, no `text-accent-grad`.
- Prepend a `MapPin` icon (lucide-react) inline before the heading, also in `var(--brand-ink)` — sized ~28px on desktop, vertically centered with the heading baseline.
- Drop the gold `<Squiggle />` underline so the heading area stays monochrome.
- Eyebrow (`The six phases`) → `var(--brand-ink)` (no longer magenta) so it doesn't fight the new monochrome treatment.

### 2. Cards go all-black

Strip every per-phase color from the 6 cards in this section only:
- Big corner numeral → `var(--brand-ink)` at ~10–15% opacity (was `var(--phase-N-deep)` at 55%).
- Eyebrow + phase name `<h3>` → `var(--brand-ink)`.
- "Open phase →" CTA → `var(--brand-ink)` (was magenta).
- Hover border stays gold so there's still a hover signal; card background stays cream.

Phase tints stay everywhere else on the site (sidebar dots, phase pages, foundation hero).

### 3. Dashed map-style connector route

Add an absolutely-positioned SVG overlay inside the grid wrapper, behind the cards (`pointer-events-none absolute inset-0 -z-0`; cards get `relative z-10`). The path snakes through all six cards in reading order with gentle curved turns at row ends:

```text
[1] - - - [2] - - - [3]
                     |
[6] - - - [5] - - - [4]
```

Stroke spec: `stroke="var(--brand-ink)"`, `stroke-width="1.5"`, `stroke-dasharray="6 6"`, `stroke-linecap="round"`, opacity ~0.35. Small filled ink-colored dot at each card anchor as a "pin". Hidden on mobile single-column (`hidden lg:block`) where the route doesn't make sense; cards just stack.

### Files touched
- `src/routes/index.tsx` — recolor heading + 6 cards in the journey section, add `MapPin` import, wrap grid in a `relative` container, drop in the inline SVG overlay.

No changes to phase tokens, other sections, or other pages.