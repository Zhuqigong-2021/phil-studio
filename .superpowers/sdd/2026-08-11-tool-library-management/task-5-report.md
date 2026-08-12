# Task 5 Report: Shared Add Tool and Database Pending Feedback

## Implemented

- Made `src/components/dashboard/AddToolModal.tsx` the canonical Add Tool experience. It now carries the active Dashboard purple glass presentation, motion, controlled icon/accent picker, category creation, aliases, source, pin, and Dashboard CSS contract.
- Removed the duplicated `AddToolModalDark` implementation from the Dashboard. Dashboard keeps the modal portaled outside the transformed hero and passes its existing workspace actions; secondary surfaces render the same shared component with the same `useCustomTools` action contract.
- Added a testable Add Tool submission guard. Save cannot double-submit, stays pending for the database promise, renders a Reduced Motion-safe `LoaderCircle` with `Saving…`, and publishes success only after persistence resolves.
- Add Tool failures retain the mounted form, keep an inline error available, and publish the matching error Toast. Useful `400` validation copy is preserved; authentication, permission, availability, network, and generic failures reuse the Task 3 database error mapper.
- Mounted `DatabaseToastViewport` on the Dashboard so Add Tool result events are visible there as well as in secondary shells.
- Connected Dashboard Favorite controls to `favoritePendingIds`. Only the clicked Command Palette or Favorites-panel star is disabled and replaced by a small Reduced Motion-safe Spinner. Duplicate activation is ignored by both the UI guard and Task 3 pending tracker.
- Kept a pending unfavorite row visible until the mutation settles, so its Spinner remains at the interaction point. Existing optimistic rollback and Favorite Toast logic continues to restore prior state and report failure.
- No dashboard music/player logic was changed.

## TDD evidence

- Initial Task 5 RED run: 15 passed and 5 failed. The new submission test failed with `ERR_MODULE_NOT_FOUND` for `add-tool-submission.ts`; UI contract tests failed because Dashboard still owned `AddToolModalDark` and did not consume `favoritePendingIds`.
- A focused RED test then proved the Dashboard lacked a database Toast viewport for Add Tool results.
- A final appearance RED test proved the shared component did not yet load the active Dashboard CSS contract on Manage.
- After implementation, the focused Task 5 and Toast regression command passed 31 tests, 0 failed.

## Fresh verification

- `node --test --experimental-strip-types` over Add Tool submission/integration, Dashboard database state and overlay layering, shared icon picker, `useCustomTools`, Favorite Toast host/helper, and database Toast helper: 31 passed, 0 failed.
- Targeted ESLint over every Task 5 production/test file: exit 0 with 0 errors. It reports six pre-existing warnings in the large Dashboard page (`no-img-element` and the existing audio-effect dependency warning).
- `git diff --check`: exit 0; Git reported only the repository's CRLF conversion notices.
- Dashboard duplicate-modal search: zero `AddToolModalDark`, `<ToolIconPicker`, or `<CategorySelector` matches remain in `page.tsx`.

## Known baseline limits

- `npx tsc --noEmit` still exits 1 only on the documented untouched baseline errors: missing `RouteContext`, strict test fixture typing, Favorite Toast test inference, optional lyric timing, and ES2018 regular-expression target mismatches. No Task 5 path appears in the error list.
- The documented source-string baseline command for `custom-tool-search.test.ts` and `workspace-surfaces.test.ts` remains red (2 passed, 3 failed) because those tests still expect pre-context Dashboard hook/source text. Task 5 did not rewrite those unrelated stale expectations.
- Live authenticated browser/database acceptance is not claimed in this task; it remains part of the later end-to-end verification work.

## Review fix round 1

### Implemented

- Moved the submission guard to the stable `AddToolModal` boundary. Backdrop, X, and Cancel now share its guarded close request; X and Cancel are also disabled while saving. A pending submission therefore keeps the modal mounted and blocks duplicate POST activation across every attempted close path.
- Added form-session generations. If a later form session is opened by external state while an older request is still pending, the older completion can report its result but cannot close the newer form.
- Changed Add Tool persistence to `POST -> fetch authoritative workspace snapshot -> apply snapshot`. Success Toast and close remain downstream of the entire `addTool` promise, so a failed refresh retains the form and produces the existing error feedback instead of a false success.
- Made the canonical component use the exported Add Tool form reducer. The rejection test now populates URL, name, description, tags, alias draft, aliases, source, icon, accent, and pin through that reducer and verifies those values after persistence rejects.
- The deferred Manage exit-motion Minor was not changed.

### RED evidence

Command:

`node --test --experimental-strip-types src/lib/dashboard/add-tool-submission.test.ts src/hooks/useCustomTools.test.ts`

Output: exit 1; 0 passed, 2 test files failed to load. The failures named the intentionally missing `addToolFormReducer` and `addWorkspaceToolAndRefresh` exports.

The first complete regression run after implementation also surfaced one exact source-contract failure: 52 passed, 1 failed because the icon-default assertion still looked for local `DEFAULT_TOOL_ICON_KEY` state after the real form owner moved to the shared reducer. The assertion was updated to verify the reducer-owned `app-window` and `blue` defaults.

### GREEN evidence

Focused behavior command:

`node --test --experimental-strip-types src/lib/dashboard/add-tool-submission.test.ts src/hooks/useCustomTools.test.ts`

Output: exit 0; 15 passed, 0 failed.

Final Task 5 regression command:

`node --test --experimental-strip-types src/app/dashboard/add-tool-icon-picker-integration.test.ts src/app/dashboard/add-tool-local-save.test.ts src/app/dashboard/database-dashboard-state.test.ts src/app/dashboard/overlay-layering.test.ts src/components/dashboard/AddToolModal.icon-picker.test.ts src/components/dashboard/FavoriteToastHost.test.ts src/hooks/useCustomTools.supabase.test.ts src/hooks/useCustomTools.test.ts src/lib/dashboard/add-tool-submission.test.ts src/lib/dashboard/favorite-toast.test.ts src/lib/dashboard/tool-mutations.test.ts`

Output: exit 0; 53 passed, 0 failed, duration 535.5289 ms.

Targeted lint command:

`npx eslint src/components/dashboard/AddToolModal.tsx src/hooks/useCustomTools.ts src/hooks/useCustomTools.test.ts src/lib/dashboard/add-tool-submission.ts src/lib/dashboard/add-tool-submission.test.ts src/app/dashboard/add-tool-local-save.test.ts src/app/dashboard/add-tool-icon-picker-integration.test.ts src/components/dashboard/AddToolModal.icon-picker.test.ts`

Output: exit 0; 0 errors, 0 warnings.

`git diff --check`: exit 0; only the repository CRLF conversion notices were printed.

`npx tsc --noEmit`: exit 1 on the same documented baseline errors (`RouteContext`, strict pre-existing test fixtures, Favorite Toast inference, lyric optional timing, and ES2018 regex target). No changed Task 5 production or review-test path appeared.

## Review fix round 2

### Implemented

- Split Add Tool persistence into two truthful outcomes. A failed `postTool` still rejects, retains the populated form, and uses the existing Add failure Toast. Once `postTool` succeeds, creation is treated as successful even if the following workspace fetch fails.
- On post-success refresh failure, `addWorkspaceToolAndRefresh` merges the server-returned tool into the latest local workspace with `mergeCreatedTool`, including its requested pin, and returns `workspaceRefreshFailed: true` instead of rejecting.
- Because the existing database Toast viewport replaces its current Toast, the modal publishes one combined non-error result: `<Tool> added successfully. Workspace refresh failed and will retry later.` It closes/reset-unmounts the successful form and does not invite another create attempt.
- A successful authoritative refresh still applies the database snapshot before the normal added-success Toast and records the workspace as authoritative.

### RED evidence

Command:

`node --test --experimental-strip-types src/hooks/useCustomTools.test.ts src/lib/dashboard/add-tool-submission.test.ts`

Output: exit 1; 14 passed, 3 failed. The failures showed the old raw-Tool success result, the refresh error still rejecting after a successful POST, and the missing combined refresh-warning success copy.

### GREEN evidence

Focused command:

`node --test --experimental-strip-types src/hooks/useCustomTools.test.ts src/lib/dashboard/add-tool-submission.test.ts`

Output: exit 0; 17 passed, 0 failed, duration 302.9368 ms. Coverage distinguishes pre-POST failure from post-success refresh failure, verifies local merge/pin fallback, close-as-success behavior, and absence of duplicate-retry wording.

Complete Task 5 regression command:

`node --test --experimental-strip-types src/app/dashboard/add-tool-icon-picker-integration.test.ts src/app/dashboard/add-tool-local-save.test.ts src/app/dashboard/database-dashboard-state.test.ts src/app/dashboard/overlay-layering.test.ts src/components/dashboard/AddToolModal.icon-picker.test.ts src/components/dashboard/FavoriteToastHost.test.ts src/hooks/useCustomTools.supabase.test.ts src/hooks/useCustomTools.test.ts src/lib/dashboard/add-tool-submission.test.ts src/lib/dashboard/favorite-toast.test.ts src/lib/dashboard/tool-mutations.test.ts`

Output: exit 0; 55 passed, 0 failed, duration 878.2137 ms.

Targeted lint command:

`npx eslint src/components/dashboard/AddToolModal.tsx src/hooks/useCustomTools.ts src/hooks/useCustomTools.test.ts src/lib/dashboard/add-tool-submission.ts src/lib/dashboard/add-tool-submission.test.ts`

Output: exit 0; 0 errors, 0 warnings.

`npx tsc --noEmit`: exit 1 on only the same documented baseline errors. No round-2 path appears in the output.
