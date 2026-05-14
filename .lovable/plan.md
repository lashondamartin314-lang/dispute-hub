## Refinement plan: fonts, sidebar hues, P1–P6 grid, hero + colorways

### 1. Fonts — closest free substitutes (swap-ready)

Replace the current display stack with substitutes that match Ethic Serif and Editor's Note in feel, kept behind two CSS variables so I can swap to your licensed files later by changing one line.

- `--font-display` → **Cormorant Garamond** (Italic + Regular) as the Ethic Serif stand-in for headlines and italic keywords.
- `--font-body` → **Plus Jakarta Sans** 400/500 as the body pair (already loaded).
- Retire `--font-editorial` (Fraunces) and `--font-script` (Caveat) so the type system collapses to display + body only.
- Update `h1–h4`, hero headline gradient `<em>` keywords, accordion titles, and any `.font-editorial`/`.font-script` usages to the unified pair.
- Add a one-line comment in `styles.css` explaining how to swap to Ethic Serif / Editor's Note when font files arrive.

### 2. Sidebar hue scope — restrict to P1–P6 chip + row icon

- Keep the colored P-number chip and the phase row's lucide icon tinted with `var(--phase-N)`.
- Strip the brand-color tints from every Companion-tools icon (Foundation, Strategy, Letter library, Tracker, Decoder, Resources, Progress, Ask) — they all render in the indigo sidebar foreground.
- Strip color from the Quick-access footer icons too (currently inherit gold/blue).
- Result: the only hues visible in the sidebar are P1–P6.

### 3. Square P1–P6 grid — reusable component, three placements

Build a single `<PhaseGrid />` component and drop it in three places.

```text
┌─────┬─────┬─────┐
│ P1  │ P2  │ P3  │   each tile: square aspect, phase-color background,
├─────┼─────┼─────┤   large P-number, phase name, hover lifts + saturates
│ P4  │ P5  │ P6  │
└─────┴─────┴─────┘
```

- **Sidebar**: replaces the stacked phase rows with a 2-column grid of compact square tiles. Letters still expand under the active phase below the grid.
- **Cover (`/`)**: lives in the hero as the primary navigator (3×2 on desktop, 2×3 on tablet, 1-col stack on mobile).
- **/playbook**: same component at full size as the page's main content.

Each tile: rounded-2xl, phase color background at low saturation, deep variant on hover, P-number in display serif, small phase name label, magenta dot when active.

### 4. Full-bleed hero with parallax (cover route)

- Convert `src/routes/index.tsx` hero to full-viewport (`min-h-[100svh]`) with three parallax layers driven by Lenis scroll position:
  1. Background halo (slowest, ~0.2× scroll)
  2. Editorial headline (medium, ~0.5× scroll)
  3. PhaseGrid + CTAs (foreground, 1× scroll)
- Use Framer Motion `useScroll` + `useTransform` for layer translation — respects prefers-reduced-motion.
- Keep current copy and CTAs; only the layout and motion change.

### 5. Hover-reactive colorways

- On the cover PhaseGrid: hovering a tile fades the surrounding hero background to that phase's `-soft` color via a 400ms ease, returning to base on leave.
- On the `/playbook` PhaseGrid: same behavior, scoped to the section background only (not the whole page).
- On each phase page (`/playbook/phase/$id`): the page already knows its phase color — apply it as a subtle ambient wash at the top, no hover needed.

### Out of scope this pass (acknowledged, not built yet)

- Curtain-reveal CTA section
- Full motion choreography (number tickers, scroll reveals beyond hero parallax, scale-on-press across all CTAs)
- Engineering/components-by-numbers section
- Licensed font swap (waiting on files)

I'll list these in the closing message so we can sequence them next.

---

### Technical notes

- New file: `src/components/phase-grid.tsx` (variant prop: `"sidebar" | "cover" | "page"`).
- Edit: `src/styles.css` (font tokens, drop Fraunces/Caveat imports), `src/components/app-sidebar.tsx` (icon colors stripped, phase rail swapped for `<PhaseGrid variant="sidebar" />`), `src/routes/index.tsx` (hero rebuild + grid), `src/routes/playbook.index.tsx` (insert grid).
- Parallax: add `useLenisScroll` hook that exposes a normalized scroll value to Framer Motion `motion.div` style transforms; falls back to static positions when `prefers-reduced-motion`.
- Hover colorway: CSS custom property `--hero-tint` set on the section element via `onMouseEnter` per tile, transitioned with `transition: background-color 400ms ease`.
- Keep all existing routes, data files, and Supabase wiring untouched.