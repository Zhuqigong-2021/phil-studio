# Dashboard Cinematic Background Motion Design

## Goal

Give the existing Old Port background subtle depth and life without changing dashboard layout, reducing text readability, or competing with interactive content.

## Approved Direction

Use a restrained cinematic combination:

1. The sharp photo performs a slow 20-second breathing push between scale `1.02` and `1.045`.
2. The existing blurred photo layer drifts slightly in the opposite direction to create depth.
3. Pointer movement adds at most 5px of parallax and settles smoothly back to center.
4. A low-opacity masked highlight moves only across the lower water area every 10 seconds.
5. The initial page entrance resolves from slight blur and scale to its resting state in about 1.2 seconds.
6. When a modal or drawer is open, the background becomes slightly darker and softer to reinforce depth.

## Implementation Boundaries

- Keep the existing background asset and its current crop.
- Do not change dashboard layout, spacing, stacking, or card dimensions.
- Background layers remain non-interactive and behind all dashboard content.
- Use CSS keyframes for continuous breathing, drift, and water shimmer.
- Use GSAP `quickTo` for pointer parallax without React state updates on every pointer event.
- Pause or remove continuous movement when the page is hidden.
- Disable parallax and continuous movement for `prefers-reduced-motion: reduce`.
- Avoid particles, large pans, hue rotation, flashes, and movement above 8px.

## Components

- `DashboardBackground`: isolated visual layer containing blurred image, sharp image, tint, existing light treatment, and water shimmer.
- Background motion helper: supplies bounded parallax values and reduced-motion behavior.
- Dashboard overlay state: exposes whether a modal or drawer is open so the background can dim without affecting layout.

## Acceptance Criteria

1. Moving the pointer across the viewport creates subtle depth with no visible content displacement or interaction blocking.
2. At rest, the background remains gently animated but all text and glass cards stay readable.
3. Opening a dashboard modal or drawer visibly pushes the background back while the foreground remains unchanged.
4. Reduced-motion mode shows a stable background with no continuous movement or pointer parallax.
5. Dashboard motion tests, lint checks, and a visual desktop check pass without introducing layout changes.

## Risks and Controls

- Overscan prevents image edges from entering the viewport during scale and parallax.
- Transform-only animation avoids layout and paint-heavy property changes where possible.
- The water highlight uses low opacity and a clipped lower-region mask so it cannot wash over dashboard text.
- Parallax is disabled on touch-oriented pointers.
