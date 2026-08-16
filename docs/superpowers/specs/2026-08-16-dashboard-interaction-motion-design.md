# Dashboard Interaction Motion Design

## Goal

Improve three Dashboard interactions without changing their layout, visual styling, content, or behavior:

1. Switching among the five stat cards and replacing the bottom-right content panel.
2. Opening and closing the Search Bar command palette.
3. Opening and closing the Add Tool modal.

The motion should follow the supplied `Screen Recording 2026-08-16 171307.mp4`: restrained depth, progressive focus, coordinated background treatment, and no abrupt DOM replacement.

## Motion language

The shared language is **focus transfer** rather than directional page movement.

- The outgoing surface yields through a small scale reduction, a short blur, and opacity loss.
- The incoming surface starts slightly smaller and lower, then becomes sharp while reaching its final position.
- Blur and opacity settle before the final transform micro-settling finishes.
- Enter motion is slightly slower than exit motion.
- Motion remains interruptible: a new selection or close action must not wait for a previous animation to finish.
- Reduced-motion mode uses opacity only.

No colors, gradients, borders, shadows, card sizes, spacing, or responsive layouts are redesigned.

## Stat-card panel transition

### Current problem

The active panel is replaced immediately because the active key remounts the host. The replacement then enters with a 14px horizontal slide. There is no coordinated exit, so the interaction reads as a content swap rather than a continuous focus transfer.

### Proposed behavior

- Keep outgoing and incoming panels in the same layout slot during the handoff.
- Outgoing panel: opacity `1 -> 0`, scale `1 -> 0.985`, blur `0 -> 5px`, and a subtle downward displacement.
- Incoming panel: opacity `0 -> 1`, scale `0.975 -> 1`, blur `7px -> 0`, and `y: 10px -> 0`.
- Remove the horizontal direction-based slide.
- Use asymmetric ease-out timing with a short overlap so the slot never appears empty.
- All Tools remains stationary and unaffected.
- Rapid stat changes cancel or redirect the current transition cleanly.

## Search command palette

### Current problem

The palette is rendered as plain elements, so it appears without the same depth and focus language used elsewhere.

### Proposed behavior

- Treat the desktop Search Bar as the visual origin.
- Backdrop opacity and blur ramp in progressively.
- Palette enters from slightly above its final position with a subtle scale increase and blur-to-sharp reveal.
- Results follow the surface by a very short internal delay, avoiding simultaneous visual noise.
- Exit reverses the focus transfer faster than entry.
- Mobile keeps the same final geometry and uses the nearest safe top-origin behavior.

## Add Tool modal

### Current problem

The modal uses the shared generic overlay spring. Its small translation and low-scale delta do not reproduce the reference's composed backdrop-to-surface handoff.

### Proposed behavior

- Backdrop darkening and blur begin first.
- Modal enters from `scale: 0.94`, a small positive Y offset, and low blur.
- The surface becomes sharp and reaches scale 1 without a visible bounce.
- Header and form content become fully visible just after the shell starts moving, but remain part of one short interaction.
- Exit is faster and slightly contracts the surface.
- Save/loading/close guards and all form state behavior remain unchanged.

## Shared implementation boundary

- Add focused motion definitions to the existing Dashboard motion system.
- Use one overlay choreography for Search and Add Tool, with separate origin/size parameters.
- Use an explicit presence handoff for the stat panel so exit and enter can overlap safely.
- Do not refactor unrelated Dashboard components.

## Accessibility and performance

- Respect `prefers-reduced-motion` with opacity-only transitions.
- Animate only transform, opacity, and a short-lived filter.
- Remove `will-change` after settlement where practical.
- Preserve focus placement in Search and Add Tool.
- Preserve Escape, backdrop click, keyboard activation, and rapid repeated selection behavior.

## Verification

Automated checks must cover:

1. Stat panels define both exit and enter states and no longer use horizontal directional movement.
2. Search and Add Tool use the new focus-transfer overlay variants.
3. Reduced-motion variants contain no scale, translation, or blur.
4. Existing overlay layering, modal lifecycle, Add Tool submission, keyboard behavior, and stat selection tests remain green.

Browser checks must cover desktop and mobile:

- Switch across all five stat cards, including rapid repeated clicks.
- Open and close Search by click, keyboard shortcut, Escape, and backdrop.
- Open and close Add Tool; confirm form interaction and close guards still work.
- Confirm no layout shift, clipping, stale panel, focus loss, console error, or altered final styling.

## Acceptance criteria

- The outgoing bottom-right panel visibly yields before disappearing and the incoming panel settles naturally in the same location.
- Search and Add Tool reproduce the reference's backdrop-first, blur-to-sharp, restrained scale entrance.
- Final UI, responsive layout, product behavior, data flow, and existing ambient animations are unchanged.
