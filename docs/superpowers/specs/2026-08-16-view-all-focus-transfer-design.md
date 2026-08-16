# View All Focus-Transfer Transition Design

Date: 2026-08-16
Status: Approved

## Goal

Make the Dashboard `View All` to `/manage` transition feel more deliberate and premium without changing the approved geometry, page layout, styling, background assets, Tool Library content, routing behavior, or accessibility behavior.

The transition remains a shared-element transition: the existing All Tools surface keeps its identity, expands into the Manage Tool Library bounds, changes its internal content, and then hands control to the real Manage page.

## Motion sequence

The normal-motion timeline lasts 1.08 seconds.

| Time | Event |
| --- | --- |
| 0.00s | The All Tools shared surface is cloned above the Dashboard. Sidebar and Navbar stay fixed. |
| 0.05s | Expansion begins using the existing destination geometry and easing direction. |
| 0.46s | The original All Tools content begins a soft blur-and-fade exit. |
| 0.56s | The compact Tool Library preview begins fading in, producing an intentional crossfade rather than an abrupt replacement. |
| 0.78s | The Dashboard image-to-Manage blurred-background veil begins its transition, after the surface is visually close to its destination. |
| 0.84s | Route navigation begins. The shared surface remains visible during mounting. |
| 0.84s to 1.08s | The real Manage surface and the shared overlay overlap while the destination takes ownership. |
| 1.08s | The overlay and veil are removed. The Manage page is fully interactive. |

The source and preview overlap for approximately 0.18 seconds. This is a crossfade, not a morph of individual table cells.

## Visual behavior

- Preserve the existing All Tools start rectangle and Manage destination rectangle.
- Preserve the current fixed Sidebar and Navbar behavior.
- Preserve the approved rounded corners, gradients, blurred Manage background, table preview, and final Manage page.
- Do not stretch or independently scale text. The cloned surface continues to use the existing width/height layout animation.
- The Dashboard cards beneath the growing surface remain visible long enough to be naturally covered, then soften through the existing surroundings treatment.
- The background image remains unchanged during the first expansion phase. Its transition starts only after the shared surface is near the final position.
- Use the existing GSAP timeline, handoff marker, overlay registry, and reduced-motion path. Do not introduce the browser View Transition API.

## Easing and performance

- Expansion uses the current destination plan with an asymmetric ease-out curve so it responds immediately and settles slowly.
- Source-content fading uses an ease-in-out curve.
- Preview appearance and destination takeover use ease-out curves.
- Animate compositor-friendly transforms and opacity wherever possible.
- Existing blur is retained only for the content/background handoff; no new continuous filter animation is added to the table rows.
- Existing `will-change` hints remain scoped to transition overlays and are not applied permanently to normal Dashboard content.

## Reduced motion

When `prefers-reduced-motion: reduce` is active:

- Do not perform spatial expansion.
- Use the existing short opacity handoff.
- Preserve correct route navigation, marker cleanup, focus availability, and overlay removal.

## Functional boundaries

This change must not alter:

- Dashboard or Manage layout and responsive breakpoints.
- Tool data, filtering, pagination, CRUD actions, pending states, Toasts, or database/API behavior.
- Direct Sidebar navigation to Manage and its separate entrance animation.
- Add Tool, Search, stat-card, lighthouse, music, or background visual behavior outside the View All transition.

## Verification

1. Unit tests lock the 1.08-second orchestration and every phase boundary.
2. Existing geometry, locking, marker, cleanup, and reduced-motion tests remain green.
3. Desktop browser checks capture start, expansion, crossfade, route handoff, and final frames.
4. Confirm Sidebar and Navbar bounds remain unchanged throughout.
5. Confirm the final overlay bounds match the mounted Manage surface and no flash, duplicate interaction, or stale overlay remains.
6. Confirm direct Manage navigation still uses its existing entrance and is unaffected.
7. Run TypeScript, targeted lint, the relevant transition tests, and a production build.

## Success criteria

- The expansion has an observable middle phase rather than appearing as an immediate page replacement.
- Background takeover begins after the shared surface is near its final bounds.
- The shared preview and real Manage surface overlap cleanly with no visible snap.
- Existing functionality, layout, colors, and animation effects remain unchanged outside this transition.
