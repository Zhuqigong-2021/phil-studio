# Dashboard Stat Card Selection Design

## Goal

Replace the five stat cards' bright double Indigo outline with a restrained glass selection treatment that remains clearly identifiable without looking like a form focus ring.

## Approved Direction

- Keep the existing shared `layoutId="dashboard-active-stat"` indicator so selection moves continuously between cards.
- Replace the current strong outline and broad purple glow with one subtle inner Indigo hairline.
- Lift the selected card's glass brightness slightly with a low-opacity Indigo-to-cyan gradient.
- Add a small top specular highlight and a soft, low-opacity exterior shadow rather than a uniform neon halo.
- Do not scale or move the selected card; switching cards must not disturb layout.
- Keep the existing short shared-layout transition, capped below 300ms with minimal bounce.

## Visual Tokens

- Inner border: `rgba(139, 122, 246, 0.48)`.
- Top highlight: `inset 0 1px 0 rgba(255, 255, 255, 0.12)`.
- Exterior depth: `0 0 0 1px rgba(129, 107, 255, 0.12), 0 8px 24px rgba(79, 55, 180, 0.16)`.
- Selected fill: approximately 6% brighter than the resting card, using a very low-opacity Indigo-to-cyan gradient.
- Transition: approximately 180–240ms with a strong ease-out or the existing restrained shared-layout spring.

## Interaction and Accessibility

- Mouse/touch selection uses the glass treatment above, not a browser-style focus outline.
- Keyboard `:focus-visible` remains a separate, clearly visible accessibility ring and must not be removed.
- Reduced-motion mode keeps the final selected appearance but removes spatial interpolation.

## Scope

- Modify only the shared active indicator inside `StatCard` and any directly related dashboard-scoped CSS/test coverage.
- Preserve card dimensions, spacing, icons, values, labels, hover behavior, and panel switching behavior.

## Acceptance Criteria

1. Exactly one of the five cards has the selected glass treatment.
2. The selected state uses a single restrained inner edge, subtle surface lift, and soft depth shadow with no bright double outline.
3. Switching cards causes no size or position jump.
4. Keyboard focus remains visibly distinct from selection.
5. Existing stat-card motion, reduced-motion, and panel-switching tests continue to pass.
