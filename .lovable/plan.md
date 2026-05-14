# Plan: Animated Navigation & Discovery Pass

Four connected features, all powered by Framer Motion. I'll install `framer-motion` first (one dependency), then ship in this order so each step is reviewable on its own.

## 1. Mobile sidebar → Framer Motion drawer

The shadcn `Sidebar` already swaps to a `Sheet` on mobile, but the touch UX is thin (tap-only, no edge swipe, narrow tap targets, no spring). Replace the mobile branch only — desktop sidebar stays exactly as-is so tooltips, collapsible groups, and the gold/emerald theme are untouched.

- New `MobileNavDrawer` component using `motion.aside` + `AnimatePresence`.
- Spring slide-in from left, dim backdrop with fade.
- Drag-to-close gesture (`drag="x"`, `dragConstraints`, snap to closed at >40% threshold or velocity).
- 44px min-height tap targets on every nav row, larger phase chips, sticky close button.
- Hamburger trigger lives in the existing top bar; uses `SidebarProvider`'s `openMobile` state so nothing else changes.

## 2. "Dispute Hub" quick-access menu

A new compact launcher pinned in the top header (visible on every page, both desktop and mobile). Animated dropdown grouping the user's most-used jumps in one place.

```text
┌─ Dispute Hub ▾ ─────────────────┐
│ JUMP TO                          │
│  • Foundation                    │
│  • Strategy overview             │
│  • Letter library                │
│  • Dispute tracker               │
│ PHASES                           │
│  • Phase 1 … Phase 6             │
│ KIT RESOURCES (external ↗)       │
│  • State AG complaint            │
│  • CFPB report                   │
│  • FTC IdentityTheft.gov         │
└──────────────────────────────────┘
```

- Built with Radix `Popover` for a11y + `motion.div` for the panel (scale + fade in, staggered children).
- External rows reuse the existing "opens in new tab — leaves the Playbook" sr-only label and gold folder icon already used in the sidebar footer.
- Internal rows use TanStack `Link` with active styling.

## 3. Click-and-reveal phase pages

On `/playbook/phase/$id`, the relevant **resources checklist** and **letters list** currently render statically. Wrap each in a collapsible `motion.section`:

- Header row with title + count badge + chevron, click toggles open/closed.
- `AnimatePresence` with `height: auto` + opacity transition (spring).
- Letters and checklist items stagger in (0.04s delay each) on first reveal.
- Default state: checklist open, letters closed (so the page lands cleanly and reveals on intent).
- Reduced-motion users get an instant toggle (respect `useReducedMotion`).

## 4. Framer Motion table of contents with scroll-spy

A right-rail TOC on long routes (`/playbook/foundation`, `/playbook/strategy`, `/playbook/phase/$id`, `/letters`).

- `useTableOfContents()` hook reads `h2`/`h3` headings on mount, builds a tree.
- `IntersectionObserver` tracks which section is in view; active id stored in state.
- Each TOC item is a `motion.a`; the active one scales slightly and gets a gold left bar (`layoutId="toc-active"` for a smooth bar slide between items).
- Expand/collapse per `h2` parent with `AnimatePresence` for nested `h3` children.
- Hidden under `lg` to keep mobile clean; the Dispute Hub already covers cross-page jumps on small screens.

## Technical details

**New dependency**
- `framer-motion` (single install, ~50KB gzipped, fully tree-shakable).

**New files**
- `src/components/mobile-nav-drawer.tsx` — drawer for mobile only.
- `src/components/dispute-hub.tsx` — header popover menu.
- `src/components/phase-reveal.tsx` — collapsible motion section used by phase route.
- `src/components/toc.tsx` + `src/hooks/use-toc.ts` — scroll-spy table of contents.

**Edited files**
- `src/components/app-sidebar.tsx` — render `MobileNavDrawer` when `isMobile`, keep desktop branch.
- `src/routes/__root.tsx` — mount `<DisputeHub />` in the top header.
- `src/routes/playbook.phase.$id.tsx` — wrap resources + letters in `<PhaseReveal>`.
- `src/routes/playbook.foundation.tsx`, `playbook.strategy.tsx`, `letters.tsx` — mount `<TableOfContents />` in the right rail on `lg+`.

**Accessibility**
- `prefers-reduced-motion` honored everywhere (drawer fades instead of slides, reveals are instant, TOC bar jumps).
- Drawer traps focus and closes on `Esc`.
- Dispute Hub announces "opens in a new tab — leaves the Playbook" on every external row, matching existing convention.

## Out of scope (ask if you want these)

- Replacing the desktop sidebar entirely (current one already works well; risks regressing tooltips + collapsibles).
- Persisting Dispute Hub recents to the database.
- Animating route transitions globally — separate, larger pass.

Approve this and I'll start with step 1 (install + mobile drawer), then move through 2 → 3 → 4 in sequence so you can sanity-check each.
