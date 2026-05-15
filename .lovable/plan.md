## Fix: Pink dot only on active tab

The magenta "you are here" dot is currently hard-coded next to **Cover** and **Ask Shonda**, so it appears regardless of which page is open. It should behave like an active-state indicator — visible only when that row is the current route.

### Changes (single file: `src/components/app-sidebar.tsx`)

1. **Cover row (line ~300)** — wrap the magenta dot `<span>` in `isActive("/") && (...)` so it only renders when Cover is the current route.

2. **Ask Shonda row (line ~405)** — wrap its magenta dot `<span>` in `isActive("/ask") && (...)` so it only renders when Ask Shonda is the current route.

3. No change to active styling (border glow + shadow) — that already marks the current tab. The dot now reinforces it instead of competing with it.

### Result
- On `/playbook/strategy` (current page in the screenshot): no dot on Cover, no dot on Ask Shonda. Strategy overview keeps its active pill styling.
- On `/`: dot returns next to Cover.
- On `/ask`: dot returns next to Ask Shonda.

No other rows, no styles, no routes touched.