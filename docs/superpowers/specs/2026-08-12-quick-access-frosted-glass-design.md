# Quick Access Frosted Glass Design

## Goal

Convert every Quick Access tile to transparent neutral frosted glass while preserving each app icon's own accent color and the existing layout, scrolling, and motion.

## Visual system

- The tile surface is neutral transparent glass; app color does not fill the tile.
- The icon remains the app accent color. Add Tool remains indigo/violet.
- No obvious outline or neon glow.
- Frosting uses translucent fill, restrained saturation, fine grain, and soft internal reflection.
- Directional lighting treats the dashboard clock tower as the scene light source. Highlight position and shadow direction vary subtly by horizontal tile index.
- Shadows remain soft and low contrast so the Quick Access panel stays visually tidy.

## Constraints

- Preserve tile dimensions, gaps, labels, four-visible-slot rule, horizontal overflow, destinations, pin ordering, and entrance motion.
- Preserve reduced-motion behavior.
- Do not change the Quick Access panel itself or other dashboard cards.
- Desktop and responsive layouts use the same material rules.

## Acceptance

1. Every Quick Access tile has a transparent frosted-glass surface without an app-colored background.
2. Each app icon retains its own accent color; Add Tool remains violet.
3. Tile highlights and shadows differ subtly by position and remain consistent with the tower light direction.
4. Existing Quick Access behavior and tests remain intact.
