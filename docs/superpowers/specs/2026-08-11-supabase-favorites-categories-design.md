# Supabase Favorites and Categories Design

## Goal

Make Supabase the authoritative source for dashboard categories and favorite state while retaining Local Storage only as a synchronized cache and one-time legacy migration source.

## Scope

- The Categories stat card displays the number of category records returned for the authenticated owner.
- The Favorites stat card displays the number of tools whose authoritative `favorite` value is `true`.
- The Favorites detail panel renders those same favorite tools.
- Search palette stars read and update that same favorite state.
- Existing Favorites surfaces outside the dashboard continue to use the shared workspace state.
- No new database tables or columns are required.

## Source of Truth

Supabase is authoritative after workspace synchronization succeeds. Local Storage may:

- provide the existing one-time migration payload;
- provide a temporary startup cache before the server response arrives;
- mirror the latest optimistic or confirmed workspace snapshot.

Local Storage must not overwrite a successfully fetched Supabase favorite value.

## Data Flow

### Initial load

1. Render the cached workspace as a temporary startup state.
2. Run the existing owner-protected workspace synchronization.
3. Replace category and favorite state with the Supabase response.
4. Rewrite the Local Storage mirror from that authoritative response.

### Favorite mutation

1. All favorite buttons call the shared `setToolFavorite(toolId, nextValue)` mutation.
2. Apply the change optimistically to the shared workspace state and Local Storage mirror.
3. Persist through the authenticated `/api/tools/[id]` route and owner-scoped repository.
4. On success, reconcile state and Local Storage with the persisted response.
5. On failure, roll back the affected tool's favorite field in both shared state and Local Storage. A concurrent successful favorite mutation must not be rolled back.

### Category and favorite statistics

- Category count is `workspace.categories.length`; it counts all category rows returned for the owner, including categories with no current tool relationship.
- Favorite count is `workspace.tools.filter(tool => tool.favorite).length`.
- The Favorites panel uses the same filtered collection; no hard-coded defaults or separate Local Storage overrides participate after server synchronization.

## Shared Client State

Dashboard consumers must observe one shared workspace snapshot. The implementation should use the smallest change compatible with the existing `useCustomTools` architecture and must not introduce parallel favorite state in `useFavorites` or page-local override maps.

The following consumers must stay synchronized:

- Categories stat card;
- Favorites stat card;
- Favorites detail panel;
- global search palette;
- other existing favorite buttons using `useFavorites`.

## Error Handling

- Authentication, authorization, validation, and upstream failures continue to be mapped by the existing API layer.
- A failed favorite mutation restores the previous favorite value and cache entry.
- A failed initial synchronization may show the startup cache with the existing sync error/retry behavior, but it must not be described as confirmed database state.
- No secret or service-role key is exposed to the browser.

## Acceptance Criteria

1. With eight owner category rows in Supabase, the Categories stat card shows `8` after synchronization.
2. The Favorites stat count, Favorites panel list, and search palette stars all match the same Supabase tool rows.
3. Toggling a search result star persists `tools.is_favorite`, updates every visible favorite surface, and updates the Local Storage mirror.
4. Reloading restores the Supabase value even if the pre-existing Local Storage favorite value conflicts.
5. A failed favorite write restores the previous UI and Local Storage value without undoing another successful concurrent mutation.
6. Existing add-tool, pin, recent, category, icon, and legacy migration behavior remains intact.

## Verification

- Unit tests for authoritative-server-over-cache hydration and rollback-safe cache mirroring.
- Integration tests proving all dashboard favorite/category consumers use workspace state rather than independent overrides.
- API/repository regression tests for owner-scoped favorite persistence.
- Focused ESLint and TypeScript checks.
- Production build.
- Read-only Supabase verification of category count and favorite rows before and after a reversible favorite mutation.
