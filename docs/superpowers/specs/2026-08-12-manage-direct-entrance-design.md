# Manage Direct Entrance Design

## Goal

Give the Manage page the same polished directional entrance language as the Dashboard when the user enters through the Sidebar Manage link or loads `/manage` directly, while preserving the existing Dashboard View All shared-card transition unchanged.

## Entry Modes

The existing tool-library handoff marker remains the authoritative entry-mode signal.

### View All handoff

When `beginToolLibraryHandoffEntrance()` reports `handoff: true`:

- Keep the current All Tools expansion, background transition, route handoff, and Tool Library content reveal.
- Do not run the new directional Manage entrance timeline.
- Do not animate the Sidebar or Navbar again.
- Do not change the current handoff timing, geometry, or background behavior.

### Direct Manage entrance

When `beginToolLibraryHandoffEntrance()` reports `handoff: false`, including Sidebar Manage navigation, direct URL entry, and browser refresh:

- Sidebar enters from the left with a simultaneous opacity reveal.
- Navbar enters from above with a simultaneous opacity reveal.
- Tool Library heading, supporting copy, and Add button enter gently from above.
- The table viewport enters from the right with an opacity reveal.
- Pagination enters from below with an opacity reveal.
- Visible table rows use a restrained opacity stagger after the table viewport begins moving. Rows do not alternate directions and input controls do not scale or bounce.

## Timing and Easing

- The master directional sequence lasts approximately 1.35–1.5 seconds.
- Sidebar and Navbar begin together at time zero.
- Header begins shortly after the shell starts.
- Table viewport begins after the header is legible.
- Pagination begins last but finishes close to the table.
- Visible rows use a short stagger of approximately 30–45 milliseconds.
- Entrances animate transforms and opacity only, using the same smooth asymmetric GSAP easing vocabulary as the Dashboard.

## Playback Rules

- Run once per direct Manage page mount.
- Do not replay after workspace data loads, update, delete, pagination, page-size changes, or modal interactions.
- Do not run on the View All handoff path.
- Manage interactions and database feedback behavior remain unchanged.

## Responsive Behavior

- On desktop, Sidebar and Navbar use the specified directions.
- On mobile, the persistent Sidebar does not exist and therefore has no entrance.
- The mobile Navbar enters from above.
- Header, table viewport, and pagination retain their semantic directions without creating horizontal page overflow.
- The table's existing internal horizontal scrolling remains unchanged.

## Reduced Motion

When `prefers-reduced-motion: reduce` is enabled:

- Remove all directional translations and row stagger.
- Reveal the applicable direct-entry regions with a short opacity transition.
- Preserve the existing reduced-motion View All handoff behavior.

## Implementation Boundaries

- Keep the entry-mode branch in `src/app/manage/page.tsx`, where the handoff state is already resolved.
- Reuse the Dashboard semantic shell hooks for Sidebar and Navbar rather than duplicating shell components.
- Add semantic hooks to the Tool Library header, table viewport, visible rows, and pagination only where required.
- Store direct Manage entrance values in a small pure motion-plan helper so directions and reduced-motion behavior are testable.
- Do not modify the database layer, Tool Library state, View All transition module, background transition, or form controls.

## Verification

Automated checks must prove:

- Direct-entry directions and timing values.
- Reduced-motion uses opacity only.
- Handoff and direct-entry branches are mutually exclusive.
- The existing View All handoff branch does not invoke the direct timeline.
- Data-driven rerenders do not restart the direct entrance.

Browser acceptance must confirm:

- Sidebar Manage navigation produces the directional entrance.
- Direct `/manage` load and refresh produce the same directional entrance.
- Dashboard View All retains its current shared-card transition with no extra Sidebar, Navbar, table, or pagination entrance layered on top.
- No hydration error, Next.js error overlay, or horizontal page overflow appears at desktop and mobile widths.
