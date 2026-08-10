# Dashboard Dark Theme Route Migration

## Goal

Make the current `/darktheme` experience the sole implementation of `/dashboard`, while preserving old `/darktheme` links through a permanent redirect to `/dashboard`.

## Scope

- Replace `src/app/dashboard/page.tsx` and its route-local CSS with the current `/darktheme` implementation.
- Move the dark-theme route-local SVG paths, lyrics progress helper, and helper test into `src/app/dashboard/`.
- Update tests that read the old `/darktheme` source paths so they read the migrated `/dashboard` files.
- Remove the `src/app/darktheme/` route directory after migration.
- Add a permanent `/darktheme` to `/dashboard` redirect in `next.config.ts`.

## Non-goals

- No visual, copy, interaction, data, music-player, or responsive behavior changes.
- No refactoring of the large page component or shared dashboard modules.
- No cleanup of unrelated existing worktree changes.

## Implementation Design

`/dashboard` will own the migrated page and every route-local dependency. Relative imports remain route-local after the files move together. The default component name may be changed from `DarkThemePage` to `DashboardPage`; this is internal and must not alter rendered behavior.

The old route will not retain a `page.tsx`. Next.js configuration will return a permanent redirect from `/darktheme` to `/dashboard`, so old bookmarks continue to work without maintaining duplicate page code.

## Verification

1. A route-structure test fails before migration and passes afterward, proving `/dashboard` owns the dark-theme implementation, the `/darktheme` page is gone, and the redirect exists.
2. Existing route-source tests are updated to the new location and pass.
3. Relevant unit tests, ESLint, and the production build pass.
4. A runtime request to `/dashboard` returns the migrated page, and `/darktheme` returns a redirect whose location is `/dashboard`.

## Risks

- Tests currently contain hard-coded `/darktheme` file paths; missing one would leave a broken test.
- Route-local imports must move together or TypeScript/build resolution will fail.
- The worktree is already dirty, so the change set must remain limited to the files listed above.
