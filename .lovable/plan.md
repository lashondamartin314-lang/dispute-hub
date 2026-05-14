## Re-tune phase palette

Two phase tokens swap in `src/styles.css` so adjacent phases are clearly distinct and the lineup gets a true blue + an orange:

```text
Phase 1 Prepare              marigold     #F5B82E   (unchanged)
Phase 2 Validate             turquoise    #2BB8B0   (unchanged — sits next to blue P3)
Phase 3 Clean Identity       cobalt blue  #2563EB   soft #D2DEFB   deep #1B3FA8   (was emerald)
Phase 4 Dispute Bureaus      magenta-pink #E9408C   (unchanged)
Phase 5 Challenge Furnishers violet       #7C3AED   (unchanged)
Phase 6 Escalate             orange       #F26B1A   soft #FBD9C2   deep #8A3508   (was crimson)
```

Result around the trouble spot: P2 turquoise → P3 cobalt — clearly different hues, no green/teal blur. End of the arc shifts from crimson to orange, keeping a warm "alert" tone at escalation while reading distinctly from the magenta P4.

### File touched
- `src/styles.css` — swap `--phase-3` (and `-soft` / `-deep`) to cobalt blue, `--phase-6` to orange. All other tokens, sidebar dots, hero washes, journey cards, etc. read these vars and update automatically.