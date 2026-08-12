# Dashboard Entrance Orchestration Design

## Goal

Replace the Dashboard's generic shared entrance animation with a coordinated, directional page-load sequence that follows the visual hierarchy of the existing layout. Preserve the existing number tickers and make the greeting sequence the final focal moment.

## Scope

This change applies only to the `/dashboard` page-load experience. It does not change Manage transitions, data-loading behavior, hover animations, card interactions, or the visual layout.

## Entrance Choreography

The harbour background establishes the master duration. Its existing blurred-to-sharp transition remains the visual anchor and completes in approximately 1.6 seconds.

During that same interval:

- The desktop Sidebar enters from the left with opacity from 0 to 1.
- The Navbar enters from above with opacity from 0 to 1.
- Weather and Quick Access enter together from the right with opacity from 0 to 1.
- The five statistic cards enter from below as one row with a subtle item stagger and opacity from 0 to 1.
- All Tools and Recent Activity enter from below with opacity from 0 to 1.
- The prior generic animation attached to every `data-dashboard-enter` surface is removed.
- The statistic cards retain their existing numeric count-up behavior; no separate card-scale or glow entrance is added.

All directional entrances use transform and opacity only. Their timing is coordinated through one GSAP timeline and uses a polished non-spring easing curve. Although the requested feel was described as ease-in, the implementation uses an asymmetric smooth curve that starts gently and settles softly, avoiding a fast, abrupt arrival at the endpoint.

## Greeting Sequence

The greeting region is excluded from the generic directional entrances and follows its own sequence:

1. The full greeting region fades in softly.
2. `Bonjour, Phil !` types from left to right exactly once.
3. The waving hand remains visible and stationary; it is not typed and is not colorized.
4. After typing completes, the existing violet/indigo/cyan Dia Text Reveal highlight sweeps across the completed title exactly once.
5. After the title highlight, the complete Montréal location row performs a decaying vertical bounce: one visibly larger bounce followed by progressively smaller bounces until it rests.

The welcome subtitle fades with the greeting region but does not type or bounce.

## Playback Rules

- The sequence runs once per actual Dashboard mount/page entry.
- Database responses, number updates, favorites, Quick Access changes, and component rerenders must not restart it.
- Navigating away and later entering Dashboard again may play the page-load sequence again.
- The animation must not run on the Manage route.

## Responsive Behavior

- Desktop uses the directional choreography above.
- On mobile, the persistent desktop Sidebar is absent, so no Sidebar entrance runs.
- The mobile Navbar enters from above.
- Right-side hero cards and lower sections retain their semantic entrance directions after wrapping into the mobile layout.
- No animation may create horizontal page overflow.

## Reduced Motion

When `prefers-reduced-motion: reduce` is enabled:

- Directional translations, typewriter, color sweep, and location bounce are skipped.
- Dashboard sections use only a short opacity reveal.
- The full final title and numeric values remain immediately understandable.

## Implementation Boundaries

- Keep the entrance timing definitions in the Dashboard motion system rather than scattering timing constants through JSX.
- Add explicit semantic entrance hooks for Navbar, Sidebar, hero greeting, hero utilities, statistics, and bottom panels.
- Extend the title component to support a controlled start after typewriter completion rather than using independent page timing.
- Use a dedicated one-shot typewriter component or helper so database rerenders cannot reset typed progress.
- Do not modify database, API, Quick Access sorting, Manage layout, background artwork, or card styling.

## Verification

Automated checks must cover:

- Correct directional motion definitions and approximate shared duration.
- Removal of the old generic entrance wiring.
- Greeting order: fade, typewriter, color sweep, location bounce.
- One-shot behavior across rerenders.
- Reduced-motion static fallback.

Browser acceptance must confirm:

- No hydration error or Next.js error overlay.
- Each desktop region enters from its specified direction.
- The background focus and main section entrances feel synchronized.
- Title characters appear once, the color sweep starts only after typing, and the Montréal row settles after decreasing bounce amplitudes.
- No layout shift or horizontal overflow at desktop and mobile widths.
