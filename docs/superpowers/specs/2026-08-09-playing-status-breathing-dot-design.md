# Playing Status Breathing Dot Design

## Goal

Replace the music player's top-right five-bar equalizer with one restrained status indicator that clearly communicates playback without duplicating the lower-left audio-reactive visualization.

## Scope

- Change only the top-right status indicator inside `MusicPlayerPanel`.
- Preserve its current anchor, reserved area, card layout, title, artwork, progress bar, controls, and lower-left V5 visualizer.
- Remove the five equalizer bars, their color/duration constants, and their stepped animation use when those become unused.

## Visual Design

- Use one `9px` cyan core dot centered inside two thin concentric blue-to-violet rings.
- Keep the total visible footprint near the current equalizer footprint so the title and card highlight do not move.
- Use bounded cyan and violet shadows; the indicator must not contain white, bloom over the title, or create a rectangular patch.
- The lower-left V5 visualizer remains the only visualization that represents musical rhythm and volume.

## States and Motion

### Playing

- Keep the cyan core continuously visible.
- Animate both rings with staggered `1.8s ease-in-out` breathing cycles.
- Use only bounded scale and opacity changes. The indicator does not follow audio amplitude and never jumps randomly.

### Paused

- Stop all breathing animation.
- Dim the core and collapse the two animated rings into one subdued static outline.
- Transition between playing and paused presentation over `240ms ease-out` without remounting the indicator.

### Reduced Motion

- When `prefers-reduced-motion: reduce` is active, show the bright playing core and both rings as a static status symbol.
- Disable ring animation while preserving the difference between playing and paused color/opacity.

## Accessibility and Stability

- Treat the indicator as decorative because the existing play/pause button exposes the actionable playback state.
- Keep it out of keyboard focus and the accessibility tree.
- Reuse the existing `isPlaying` boolean; add no state, timer, animation library, canvas, or audio-analysis dependency.
- Avoid additive blending, filters with unbounded spread, and layout-affecting animation.

## Verification

- A focused behavior test verifies the playing and paused class/state mapping.
- A source regression test verifies the old equalizer constants and five-bar rendering are absent only if no behavioral harness can observe that removal directly.
- ESLint verifies the touched TypeScript/JSX and test files.
- The production build verifies the Next.js application compiles.
- Browser comparison verifies the indicator remains anchored correctly and does not compete with the title or V5 visualizer; this visual acceptance remains separate from automated checks.
