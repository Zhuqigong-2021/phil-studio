# Sidebar Triangle Toggle Design

## Goal

Add a discreet triangular control to the desktop dashboard sidebar so it can be explicitly collapsed or pinned open while preserving the existing hover-to-expand behavior.

## Interaction

- The control sits on the sidebar's right edge, below the brand area and clear of navigation rows.
- When the sidebar is pinned open, the triangle points left. Activating it collapses the sidebar to its existing 64px icon rail.
- When a collapsed sidebar is temporarily expanded by hover, the triangle points right. Activating it pins the sidebar open.
- Moving the pointer into a collapsed sidebar temporarily expands it. Moving the pointer out returns it to the collapsed state unless it was pinned open.
- The control is keyboard accessible and exposes an action-specific accessible label.
- The desktop collapse preference persists locally across reloads. Existing responsive auto-collapse remains the default when no preference has been saved.
- The mobile navigation drawer is unchanged and does not render this control.

## Visual Design

- The visible control is a small glass-like triangular tab protruding from the sidebar edge.
- Its resting contrast is deliberately low; hover and keyboard focus add a restrained indigo-violet glow.
- A larger transparent button hit area surrounds the triangle so the control remains easy to operate.
- The width transition uses the dashboard's existing easing and respects reduced-motion preferences.

## Implementation Boundary

- Extend the existing desktop `Sidebar` state and styles in `src/app/dashboard/page.tsx`.
- Do not change the mobile drawer, navigation destinations, or unrelated Task Completion work already present in the working tree.
- Add focused source/behavior regression tests for toggle wiring, hover expansion, persistence, accessibility, and mobile exclusion.

## Acceptance Criteria

1. A desktop user can collapse the expanded sidebar with the triangular edge control.
2. Hovering a collapsed sidebar temporarily expands it, and leaving collapses it again.
3. Clicking the right-pointing control during temporary expansion pins the sidebar open.
4. The chosen pinned/collapsed state survives a reload, while first-time narrow desktop users still receive the current responsive default.
5. The control is operable by keyboard, has a meaningful label, and is absent from the mobile drawer.
