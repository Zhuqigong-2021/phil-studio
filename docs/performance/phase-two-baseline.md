# Phase Two Performance Baseline

Date: 2026-08-14
Branch baseline: `main` at `19398c0` plus the approved Phase 2 design commits.

## Protected behavior

- Dashboard and Manage layouts at desktop, tablet, and mobile breakpoints.
- Dashboard entrance and direct Manage entrance.
- View All shared-surface transition.
- Lighthouse beam, card-edge contact illumination, and All Tools marquee.
- Workspace create, update, delete, pin, favorite, alias, category, loaders, and toasts without page reload.
- Persistent music, lyrics visibility, track changes, playlist controls, and cross-route playback.

## Existing automated baseline

- TypeScript: `npx tsc --noEmit`
- Lint: `npm run lint`
- Production build: `npm run build`
- Focused tests use Node's TypeScript stripping support because this repository does not define an npm test script.
- Existing visual references remain the root-level `dashboard1-wide-clean-final-1768x890.png` and `view-all-000.png`, `view-all-280.png`, `view-all-540.png`, `view-all-750.png`, and `view-all-1000.png` files. They are user artifacts and remain untracked.

## Current data and render path

- Dashboard creates one `useCustomTools()` instance but exposes the entire changing hook value through one broad context, plus one smaller actions context.
- Workspace snapshot loading performs tools and categories reads followed by a relationship read.
- Equivalent focus/mount/manual reads do not yet share one in-flight promise.
- `patch_workspace_tool` already updates a tool and its category relationships atomically.
- Tool creation still inserts the tool, inserts relationships, and compensates with delete after a relationship failure.

## Browser baseline checkpoint

Authenticated browser request counts, console output, and stable responsive screenshots will be recorded immediately before the Batch 1 acceptance comparison. This avoids treating time/weather text and live workspace contents as deterministic pixels while retaining the current checked-in and untracked visual references as the appearance baseline.
