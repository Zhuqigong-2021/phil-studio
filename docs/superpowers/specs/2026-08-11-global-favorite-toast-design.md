# Global favorite toast design

## Goal

Give an explicit result for every favorite or unfavorite action across the app. A success notice appears only after Supabase confirms the mutation. A failure notice appears when the optimistic state is rolled back.

## Scope

- Cover favorite controls on Dashboard, Search, Favorites, All Tools, and Manage surfaces.
- Reuse the existing `setToolFavorite` mutation path so database state remains authoritative.
- Add no third-party toast dependency.
- Do not change the database schema or favorite API contract.

## Behavior

| Result | Toast message | Tone |
| --- | --- | --- |
| Favorite confirmed | `Favorited: {tool name}` | Success, cyan/green |
| Unfavorite confirmed | `Removed from favorites: {tool name}` | Informational, indigo |
| Favorite rejected | `Could not favorite {tool name}. Previous state restored.` | Error, red |
| Unfavorite rejected | `Could not remove {tool name} from favorites. Previous state restored.` | Error, red |

- Toasts appear at the top center and dismiss automatically after about three seconds.
- A new toast replaces the current toast; no queue is required for this personal workspace.
- The toast uses `role="status"` for success and `role="alert"` for failure.
- Reduced-motion users receive no entrance or exit animation.

## Architecture

Add one global favorite-notification provider/host at the shared app boundary. Favorite actions call a single notification-aware mutation wrapper with the tool ID, tool name, current value, and desired value. The wrapper awaits `setToolFavorite`:

1. Existing optimistic state is applied immediately.
2. On Supabase success, show the matching success toast.
3. On rejection, existing rollback completes and show the matching failure toast.

All favorite surfaces use this wrapper instead of silently swallowing the returned promise. The host owns one current toast and its dismissal timer.

## Visual treatment

- Match the dashboard glass material and indigo theme.
- Use a compact panel with a restrained 10px corner radius and a small success/info/error icon.
- Keep adequate contrast and maintain safe spacing from the top viewport edge on narrow screens.

## Verification

- Test favorite and unfavorite success messages after resolved mutations.
- Test favorite and unfavorite error messages after rejected mutations.
- Test replacement and automatic dismissal behavior.
- Test that all favorite surfaces use the shared notification-aware mutation path.
- Run focused tests, scoped ESLint, production build, and a browser smoke test against the authenticated Supabase-backed app.
