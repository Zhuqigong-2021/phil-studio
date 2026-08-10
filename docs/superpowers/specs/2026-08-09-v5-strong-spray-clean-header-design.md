# V5 Strong Spray and Clean Header Design

## Goal

Remove the redundant top-right playback indicator and make V5's lower-left music-driven particle launch visibly energetic, continuously connected to the solid bars, and clearly responsive to real rhythm and loudness.

## Version Boundary

- This specification supersedes the approved-but-rejected top-right breathing-dot design.
- V5 remains the current 24-solid-bar implementation.
- V4 archives and restoration semantics remain untouched.

## Clean Header

- Remove the complete top-right playback-status node, helper, test, and dedicated CSS.
- Leave the top-right area empty. Do not replace it with another icon, badge, dot, text label, or reserved spacer.
- Preserve card dimensions, title, artist, artwork, progress bar, controls, and highlight geometry.

## Strong Music-Driven Spray

Each measured onset or beat creates one connected three-layer launch at the currently active frequency region:

1. **Dense root layer:** `10-14` short-lived grains stay close to the emitting bar tops, producing a continuous transition instead of isolated dots.
2. **Primary spray layer:** `4-7` grains rise through visibly varied arcs, reaching roughly `25-45px` above their captured bar surfaces at the current player size.
3. **High accent layer:** only a strong measured beat launches `1-2` grains toward roughly `55-70px`, followed by gravity-driven descent.

The source follows the strongest measured onset/beat region and may include nearby bars for a connected plume. It is never permanently concentrated on the left.

## Audio Mapping

- Onset strength controls whether the root and primary layers launch.
- Strong beat strength enables the high accent layer.
- Loudness increases launch height, horizontal spread, and brightness within bounded limits.
- Quiet passages retain the solid-bar contour without autonomous particle boiling.
- No random timer, unrelated procedural burst, or constant emission is allowed.

## Motion and Appearance

- Preserve the current attached bulge and staged release so grains visibly emerge from bar tops.
- Keep low, medium, and high arcs irregular enough to avoid one smooth descending wedge.
- Primary and high grains may retain shrinking parent-driven trail droplets, but root grains remain a dense local bridge.
- Use normal alpha compositing, bounded brightness, transparent feathered edges, fixed pools, and deterministic seeds.
- Do not introduce additive white blending, canvas recreation, DOM allocation per frame, or any full-region opacity flash.

## Preserved Behavior

- Preserve 24 solid bars, current detrended height contrast, current cyan-to-violet palette, music-driven bar brightness, volume interaction, playback controls, lyrics animation, pause behavior, and reduced-motion behavior.
- Reduced motion keeps the three-layer hierarchy but lowers airborne count and height as the existing implementation already does.

## Acceptance Criteria

1. The top-right area contains no playback-status visual or empty reserved node.
2. A real ordinary onset creates a visibly dense bar-top bridge plus `4-7` primary grains.
3. A strong beat adds only `1-2` clearly higher accent grains.
4. The plume originates from the active frequency region and is not fixed to the left.
5. Grains visibly connect to the solid bars, rise with varied height, and free-fall naturally.
6. Silence and steady non-onset audio do not create autonomous spray.
7. No local or full-card white flash occurs.
8. Automated physics/component regressions, targeted ESLint, and production build pass; authenticated visual playback remains a separate user acceptance check.
