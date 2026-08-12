# Category Progress Motion Design

## Goal

Give the Categories panel a light, polished data-reveal animation whenever the user switches into it.

## Motion

- Each bar grows from zero to its computed percentage over about 850ms using a smooth ease-out curve.
- Percentage text counts from zero to the same target during the bar animation.
- Rows begin about 45ms apart to create restrained depth without making the panel feel slow.
- The filled bar retains its category color and ends with a short, slightly lighter same-color highlight.
- The highlight is part of the static fill gradient after arrival; it does not loop or shimmer continuously.
- Re-entering Categories replays the reveal because the panel remounts on card selection.
- Reduced-motion users see final values immediately.

## Login icon refinement

- Keep the existing sign-in brand-mark container sizes.
- Increase and explicitly size the internal star to 18px on desktop and 16px on mobile.
- Use line-height and transform-independent flex centering so the glyph remains optically centered.

## Verification

- Unit-test motion duration, easing, stagger, reduced-motion behavior, and highlight generation.
- Source-contract test the animated bar/count integration and login icon sizing.
- Browser-check Categories entry and both desktop/mobile sign-in icon proportions.
- TypeScript, ESLint, and production build pass.
