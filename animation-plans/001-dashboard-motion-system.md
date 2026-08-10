# 001 — Implement the dashboard interaction motion system

- **Status**: IMPLEMENTED — mechanical verification complete; browser feel-check pending
- **Commit**: 2b5269d
- **Severity**: HIGH
- **Category**: cohesion, feedback, spatial consistency, interruptibility
- **Estimated scope**: 6 files, focused edits to the dashboard route

## Problem

The dashboard already has strong decorative motion, but important UI state changes remain abrupt: stat-card content swaps, overlays mount without a spatial bridge, list items jump when added or removed, and press feedback is inconsistent. Adding more continuous decoration would compete with the music visualizer and lyric effects; the missing layer is interaction motion.

## Target

- CSS owns high-frequency press and hover feedback using `scale`, `transform`, and opacity only.
- GSAP owns the dashboard entrance sequence and stat-content panel entry, both under 300ms and scoped with `gsap.context()` cleanup.
- Motion owns conditional overlays and dynamic list layout because those interactions must reverse or retarget while React state changes.
- `prefers-reduced-motion` keeps short opacity feedback but removes translation, scale, stagger, and layout motion.
- Search/command palette, music visualizer, lyric animation, background, and continuous player effects receive no additional motion.

Exact tokens:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

## Steps

1. Add tested shared configuration in `src/lib/dashboard/motion-system.ts` for GSAP panel/entrance timing and Motion overlay/list variants.
2. Add the `gsap` dependency without adding `@gsap/react`; use React layout effects and `gsap.context()` directly.
3. Add motion tokens and scoped `.dashboard-motion-root` press/hover classes to `src/app/dashboard/dashboard.css`.
4. Add a GSAP-managed keyed wrapper around the active bottom panel and a once-per-mount entrance sequence for Hero, Stats, and BottomRow.
5. Convert modal backdrops/surfaces and the mobile drawer to Motion elements, with `AnimatePresence` at their conditional owners.
6. Add Motion layout/enter/exit behavior to Todo and Favorites rows only; do not animate dense tool grids or the command palette.
7. Verify reduced motion, rapid toggling, full tests, focused lint, production build, and desktop/mobile screenshots.

## Boundaries

- Do not change layout, copy, data, authentication, music playback, or visualizer behavior.
- Do not animate the command palette.
- Do not add motion to the existing background, lyrics, waveform, equalizer, or cover rotation.
- Do not refactor the 5300-line page beyond small motion wrappers and shared config imports.

## Verification

- Mechanical: Node tests, focused ESLint, `npm run build`.
- Feel: stat changes respond immediately and settle within 220ms; overlays enter from the correct origin and exit faster; list rows never jump; reduced motion removes positional movement.
- Done when no interaction blocks input, no layout shifts are introduced, and the dashboard preserves its current appearance at rest.
