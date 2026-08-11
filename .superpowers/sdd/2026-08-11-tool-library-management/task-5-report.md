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
