## Direction

Editorial rebuild aligned to your **Brand Elevation Studio** system (Cormorant Garamond + Fraunces + Inter + Caveat, cream/navy/gold, magenta as accent, halo gradients, soft shadows). Premium hardcover-companion feel — not field-manual.

## Brand system (ported verbatim from Brand Elevation Studio)

- **Type**: Cormorant Garamond (display), Fraunces italic (editorial), Inter (UI/body), Caveat (script accents)
- **Palette**: cream `#FAF6EE`, ink `#14111A`, navy `#00106F`, violet-deep `#1B0739`, magenta `#F10085` (accent only), gold `#C9A24E`, plus phase colors (muted gold/dusty blue/sage/rose/terracotta/burgundy)
- **Surfaces**: halo radial gradients, `shadow-elegant`/`shadow-frame`, 1rem radius, hairline borders at 8% opacity, optional `bg-noise` paper grain

## Architecture

```text
/                    Hub landing
/playbook            Cover + foundation chapters
/playbook/foundation Welcome · Reality Check · How to Use · Phases & Rounds
/playbook/strategy   Phase Map · 5-Round Strategy · Account Router
/playbook/phase/$id  Phase 1–6 detail (steps + letter cards inline)
/playbook/letter/$id Letter detail (preview + Open in Docs)
/letters             Library: all 19 grouped by phase
/resources           External tools + parent Drive folder
```

Each phase route uses its phase-color hero wash. Each letter has its own SEO meta. Deep links work (`/playbook/phase/validate#L02`).

## Every letter wired to its Google Doc

Single source of truth: `src/data/letters.ts` — all 19 records typed and complete with your provided URLs:

```ts
{ id: "L01", phase: 2, title: "Initial Debt Validation Request",
  copyUrl: ".../document/d/1Oo5tc.../copy",
  viewUrl: ".../document/d/1Oo5tc.../edit" }
// L02–L19 same shape, all phase-tagged (P2: L01–L04, P3: L05–L10,
// P4: L11–L14, P5: L15A/B/C, L16–L19), plus parent Drive folder URL
```

A single `<LetterCard>` and `<LetterChip>` component reads from this file. They appear:
- Inline within their phase route (full card with eyebrow / Cormorant title / Fraunces lede / two CTAs)
- On `/letters` index, grouped by phase, filterable
- As inline chips wherever the body copy references a letter (e.g. the "USE L01 TEMPLATE" pill in your screenshot becomes `<LetterChip id="L01" />`)
- On the `/playbook/letter/$id` detail page (full letter preview text + "Use template" + "Open preview")

Two CTA buttons per letter, every time:
- **Use template →** opens `/copy` URL (forces user to make their own copy in their Drive)
- **Preview** opens `/edit` URL

All open in new tab with `target="_blank" rel="noopener noreferrer"`. URLs are typed — TypeScript fails the build if any letter is missing a link.

## Every link in the kit is clickable & interactive

Three classes of links, all live and validated:

**1. External resources** (rendered as resource tiles + sidebar quick-access + inline body links):
- AnnualCreditReport.com
- IdentityTheft.gov
- SmartCredit
- CFPB complaint portal
- FTC complaint portal
- State AG directory
- Your parent Google Drive folder (all 19 letters)
- Join Credit Academy
- Download Printable PDF

Stored in `src/data/resources.ts` so they're edited in one place and used everywhere.

**2. Letter references in body copy** — every mention of L01–L19 anywhere in the playbook content (phase intros, step instructions, strategy pages, round explanations) is rendered through `<LetterChip id="L0x" />`, never plain text. Hover reveals title + phase; click opens the doc.

**3. Internal cross-references** — every "see Phase 2", "Round 3", "Account Router", "Round Tracker" reference becomes a TanStack `<Link>` to the matching route + anchor. Implemented as `<Ref to="phase-2" />`, `<Ref to="round-3" />`, `<Ref to="account-router" />` helpers reading from a routes registry so renames don't break links.

**Build-time link audit**: a `scripts/check-links.ts` step parses `letters.ts` + `resources.ts` + the routes registry and fails the build if any URL is malformed, any letter id is referenced but missing, or any internal `<Ref>` target doesn't resolve. No dead links can ship.

## Navigation (3 layers)

1. **Persistent left rail** (≥1024px) — Shadcn Sidebar, `collapsible="icon"`. Two groups: *Quick Access* (resources from `resources.ts`) and *Contents* (Phases tree → Steps → Letters, expanded to current route). Active route highlighted with magenta hairline.
2. **Top bar** — `SidebarTrigger` + breadcrumb + "Letter index" button → `/letters`.
3. **Mobile** — sidebar becomes off-canvas Sheet; floating "Contents" pill bottom-center; quick-access in a bottom Drawer.

## Visual translation of existing pages

| Original | Elevated version |
|---|---|
| Bebas "THE DISPUTE PLAYBOOK" cover on hard navy | Cormorant display, Fraunces italic subtitle, halo wash on cream, gold "EDITION 2026", embossed pink seal |
| Solid navy "01 NOT ALL ACCOUNTS ARE EQUAL" pills | Editorial cards: large gold Cormorant numeral, Inter eyebrow, Fraunces italic lede, hairline divider |
| Hard yellow/green PHASES & ROUNDS callouts | Soft peach + sage tinted halo cards, 200pt ghost numerals |
| Navy "PHASE 2 · LETTER 1" header bar | Editorial header: tracked eyebrow, Cormorant title, ghost L01 numeral, magenta "Use L01 template" pill (live link) |
| Bright red `[Your Name]` form fields in letter previews | Subtle gold dotted underline placeholders |
| Magenta "30 / 5-7 / 6-12" stat blocks | Cream cards, gold Cormorant numerals, hairline rule, Inter caption |

## Motion (restrained, editorial)

- 200ms cream fade + 8px lift on page enter
- Slow halo gradient drift on heroes
- Letter-card gold hairline frame draws on hover
- Sidebar group expand: ease-out 180ms
- No parallax, scroll-jacking, or fade-in spam

## Mobile/tablet

- Sidebar → off-canvas Sheet at <1024px
- Letter cards: 1 col <640px, 2 col 640–1024
- Phase sub-nav becomes horizontal scroll chips
- 44px tap targets minimum
- QA at 375 / 768 / 1024 / 1440

## Technical

- TanStack Start file routes per the structure above
- All letters/resources/routes in typed `src/data/` files
- Phase content broken into focused React components, one per "page" of the original monolith
- Each route: own `head()` with title, description, og:title, og:description, canonical
- Build-time link audit script in CI
- No backend in v1 (pure static + external links)

## Out of scope (v1)

- Buyer auth / gating
- Interactive Round Tracker (kept static)
- PDF generation
- Analytics / progress saving

## Open questions

1. **v1 scope**: full port of all 159 pages now, or ship Hub + letter library + phase overviews first, then port phase deep-content in pass 2?
2. **Gating**: public site, or buyer login required? (Determines if we enable Lovable Cloud now.)
3. **Domain**: `shondamartin.com/repairplaybook/` subpath, own subdomain, or fresh Lovable URL?
4. **Round Tracker**: keep as static print-style page, or fillable interactive form (would need Lovable Cloud)?

Answer those and I'll start building.