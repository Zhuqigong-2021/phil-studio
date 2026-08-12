# Sign-in Theme Design

## Goal

Make the current sign-in experience dark by default while preserving the existing light visual treatment for a future application-wide light theme.

## Theme boundary

- The sign-in page owns a `dark` and a `light` visual theme.
- `dark` is the current default.
- `light` preserves the existing split-screen white/indigo design without changing its authentication behavior.
- No user-facing theme switch is introduced in this iteration.
- Google authentication, error handling, copy, and responsive structure remain shared.

## Dark appearance

- Keep the existing desktop split layout and mobile single-column layout.
- Use the Dashboard palette: deep navy foundations with restrained indigo, violet, and cyan ambient gradients.
- Render the right-side authentication content on a dark translucent glass surface with high-contrast text.
- Keep the Google logo in its official colors; render the button as a dark interactive surface with a subtle indigo border and focus ring.
- Render authorization errors on a dark red surface without changing layout dimensions unexpectedly.

## Light preservation

- Move visual decisions into theme-specific CSS variables/classes rather than deleting the existing values.
- The preserved light theme must retain the current white form column and bright indigo/cyan visual column.
- Authentication markup and server action are not duplicated.

## Responsive and accessibility

- At 860px and below, hide the visual column as today and center the form surface against the dark ambient background.
- Maintain readable contrast, keyboard focus visibility, semantic alert behavior, and a 48px Google button target.
- Avoid hydration-sensitive browser-only theme detection; the server renders the explicit default dark theme.

## Verification

- Source contract confirms both theme definitions exist and dark is default.
- Desktop browser check confirms the split dark layout, no white page surface, and no error overlay.
- Mobile browser check confirms centered form, no horizontal overflow, and visible focus treatment.
- TypeScript, ESLint, and production build must pass.
