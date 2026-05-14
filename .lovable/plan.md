## 1. Sidebar reorder

Reorder `src/components/app-sidebar.tsx` groups so the rail reads top → bottom:

1. **Companion** (Cover · Foundation · Strategy · Letter library · Resources)
2. **Phases** (P1–P6 with active-state expansion)
3. **Quick access** (external links — AnnualCreditReport, SmartCredit, CFPB, Drive folder, Academy)

Quick access moves out of the top slot down to the footer area so external destinations sit at the bottom, away from primary in-app nav. Each external link keeps its `ArrowUpRight` glyph.

## 2. Phase colors — locked, brighter, expanded palette

Two problems to fix at once:
- Phase tokens are shuffled in `src/data/phases.ts` (Prepare uses `--phase-3`, Validate `--phase-5`, etc.) so phase number ≠ phase color anywhere.
- Current phase swatches (sage, dusty blue, terracotta, burgundy) are dishwater-muted and visually blur together.

**Fix:** rebuild the 6 phase tokens in `src/styles.css` using the expanded palette (teal/turquoise + purple + yellow added), bumped saturation, and lock each phase number to its color sitewide.

```text
Phase 1 Prepare              → marigold yellow   #F5B82E   soft #FCE9B0   deep #8A5A0F
Phase 2 Validate             → turquoise / teal  #2BB8B0   soft #C4ECE9   deep #14706A
Phase 3 Clean Identity       → emerald green     #2E9E5C   soft #C9EAD6   deep #155F36
Phase 4 Dispute Bureaus      → magenta-pink      #E9408C   soft #F9D2E2   deep #93215B
Phase 5 Challenge Furnishers → violet purple     #7C3AED   soft #DDD0FA   deep #3F1A8A
Phase 6 Escalate             → crimson           #D7263D   soft #F6CBD0   deep #7C0F1E
```

All six are noticeably brighter and chromatically distinct from each other. Yellow → teal → green → pink → purple → red gives a clear escalation arc that mirrors the phase progression. They still pair cleanly with the cream paper ground and the existing magenta/gold/violet brand stack (purple Phase 5 echoes the violet-deep cover gradient).

Then re-key `src/data/phases.ts`:
```ts
Prepare         → '--phase-1'
Validate        → '--phase-2'
Clean Identity  → '--phase-3'
Dispute Bureaus → '--phase-4'
Furnishers      → '--phase-5'
Escalate        → '--phase-6'
```

Every consumer (sidebar dot, hero wash, letter card numeral, journey card, chip, TOC indicator) already reads `phase.colorVar`, so the swap propagates everywhere automatically.

## 3. Card design variants

Today every surface is the same cream-rounded-2xl shadow rectangle. I'll define **three** reusable archetypes and assign one per context so sections stop blending:

### Variant A — "Editorial" (workhorse)
Refined version of what we have: cream paper, hairline border, soft shadow, ghost numeral corner, magenta CTA. Stays for `LetterCard` and letter-detail surfaces.

### Variant B — "Tinted phase wash"
For phase / journey cards (e.g. "Where you are in the journey", phase index tiles, the box titles you flagged — Prepare, Validate, etc.). Background = `color-mix(in oklab, var(--phase-N-soft) 65%, var(--brand-paper))` so the card visibly takes its phase tint. Left edge gets a 4px colored rule in `var(--phase-N)`. Box titles render in `var(--phase-N-deep)` at weight 700 (thicker + higher contrast than body — directly addresses your earlier note). Big corner numeral jumps from 20% → 60% opacity at `var(--phase-N)` so it actually reads.

### Variant C — "Violet editorial frame" (hero / strategy / resource highlights)
Inverted: violet-deep ground (`#1B0739`, the cover-gradient terminus), cream type, gold hairline frame via `--gradient-frame`, optional squiggle accent. Used sparingly — strategy hero, Round Tracker callout, top resource tiles. Strong visual punctuation between cream sections.

### Variant D — "Ticket / index card" (compact references)
For light surfaces (resource tiles, inline letter chips in lists): smaller radius `rounded-md`, no shadow, dashed gold top border, mono label. Reads like a Rolodex card. Drop-in for `ResourceTile`.

Implementation: extend `LetterCard` with a `variant` prop driven by `class-variance-authority` so the styles share one component surface; add a small `PhaseCard` wrapper for Variant B; refactor `ResourceTile` to Variant D.

## Files touched

- `src/components/app-sidebar.tsx` — reorder groups
- `src/styles.css` — rebuild `--phase-1..6` tokens with brighter palette + teal/purple/yellow; add `card-tinted` / `card-frame` / `card-ticket` utilities; brighten numeral opacity
- `src/data/phases.ts` — lock `colorVar` to phase number
- `src/components/letter-card.tsx` — add `variant` prop (editorial | tinted | frame)
- `src/components/phase-card.tsx` *(new)* — Variant B tinted-wash card
- `src/components/resource-tile.tsx` — Variant D ticket look
- `src/routes/playbook.foundation.tsx`, `playbook.strategy.tsx`, `playbook.phase.$id.tsx`, `playbook.index.tsx` — swap the appropriate variant in per section