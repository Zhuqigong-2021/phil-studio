# Tool Library Management Design

Date: 2026-08-11
Status: Approved design, pending implementation plan

## Objective

Turn the Dashboard All Tools card into the entry point for a database-backed Tool Library management page. The page must support inline editing, creation, deletion, pagination, and consistent database request feedback without changing the established Dashboard visual language.

## Scope

This work includes:

- A GSAP transition from the Dashboard All Tools card to `/manage`.
- Renaming the Sidebar `Favorites` link to `Manage` and routing it to `/manage`.
- An inline editable Tool Library table backed by the existing workspace database.
- Shared Add Tool UI between Dashboard and Manage.
- Database-backed update, delete, favorite, and create feedback with localized loading indicators and result Toasts.
- Client-side pagination after the authenticated workspace dataset loads.

The Dashboard Favorites statistic and Favorites content remain available. The existing `/favs` route is not deleted, but it is no longer linked from the Sidebar.

## Page Transition

Clicking `View All` on the Dashboard uses a GSAP visual handoff:

1. Measure the rendered All Tools card and the destination content bounds.
2. Render a fixed-position visual shell matching the source card.
3. Animate that shell from the source rectangle to the destination rectangle over approximately 420 ms with `power3.inOut`.
4. Prevent repeat activation while the transition is running.
5. Navigate to `/manage` and reveal the Tool Library content with a short stagger after the shell reaches its destination.

The handoff animates transform, opacity, and border radius rather than layout dimensions wherever practical. Entering `/manage` from the Sidebar does not imitate an All Tools expansion and instead uses the normal page entrance.

When `prefers-reduced-motion` is enabled, spatial movement is replaced by an approximately 160 ms opacity transition.

## Navigation

- Dashboard `View All` routes to `/manage` through the GSAP handoff.
- Sidebar `Favorites` becomes `Manage` and routes directly to `/manage`.
- The Dashboard Favorites statistic and Favorites panel keep their existing meaning and behavior.
- Existing direct `/favs` links continue to resolve.

## Tool Library Layout

The management surface is titled `Tool Library`. Its heading and Add button use a space-between layout. The Add button is a compact plus icon and opens the same Add Tool modal used on the Dashboard.

The table columns are:

1. Icon
2. Color
3. Name
4. Description
5. Category
6. Link
7. Pin
8. Favorite
9. Alias
10. Operation

Each row is edited inline. Long text uses constrained fields that can receive focus for full editing. Desktop prioritizes a single readable row; narrow viewports retain the table structure with horizontal scrolling.

## Field Behavior

### Icon

Use the existing tool icon picker and persist the selected icon key through the current tool patch model.

### Color

The table displays the actual color as a swatch rather than displaying a Hex string. Clicking the swatch opens a palette of established brand colors plus a custom-color entry that invokes a color picker. A custom color is normalized and persisted internally, but its encoded value is not shown as the primary table content.

### Name, Description, and Link

These are editable row fields. Link validation accepts only supported HTTP or HTTPS destinations and reports the specific validation problem before or after submission as appropriate.

### Category

Category is a searchable multi-select List Collector populated from database Categories. Selected categories are stored as the tool's category relationship set. Creating new categories remains governed by the existing Add Tool/category behavior rather than being added implicitly from arbitrary table text.

### Pin

Pin uses the existing theme-style switch appearance. In the management table it changes the row draft only. The database value changes when the row Update action succeeds.

### Favorite

Favorite uses a filled or outlined star. In the management table it changes the row draft only. The database value changes when the row Update action succeeds. Dashboard favorite actions remain immediate database mutations.

### Alias

Aliases can be entered with comma or Enter separators. Before submission they are trimmed, empty values are removed, and case-insensitive duplicates are rejected. Existing alias count and length limits remain enforced by shared validation.

## Draft and Update Model

Every visible row owns an independent draft initialized from the latest loaded database record. Editing a field does not mutate shared workspace state or the database.

Clicking the green bordered Update icon:

1. Validates the complete row draft.
2. Replaces the Update icon with a row-scoped Spinner and disables only that row's submitting actions.
3. Sends the mutable row fields through the authenticated `PATCH /api/tools/[id]` endpoint.
4. On success, refreshes workspace data from the database and resets the row draft from the returned source of truth.
5. On failure, preserves the user's draft for correction while leaving the committed application state unchanged.

The post-success workspace refresh keeps Manage, Search, Quick Access, Favorites, and Dashboard counts consistent.

## Delete Model

The Delete operation is a red bordered trash button. Clicking it opens a centered confirmation modal naming the tool and explaining that deletion is irreversible.

- Cancel closes the modal and sends no database request.
- Confirm replaces the confirmation content with a Spinner and `Deleting…`, disables repeat confirmation and cancellation during the request, and calls the authenticated `DELETE /api/tools/[id]` endpoint.
- Success removes the tool through the database repository and refreshes workspace data.
- Failure closes or restores the actionable confirmation state without removing the visible row.
- When the last item on a page is deleted, pagination moves to the nearest remaining valid page.

The repository delete must be owner-scoped so one authenticated owner cannot delete another owner's record. Related category associations must be removed by the established database relationship behavior or explicitly within the owner-scoped deletion operation.

## Add Tool Reuse

The current Dashboard Add Tool modal is extracted into a shared component without changing its established fields or appearance. Both the Dashboard Add Tool tile and the Tool Library plus button open that exact component.

Save Tool behavior:

- While awaiting the database, the button displays a Spinner and `Saving…` and cannot be submitted again.
- Success refreshes workspace data, closes the modal, and displays a success Toast.
- Failure keeps the form data available and displays a specific validation, authorization, service, or retryable error Toast.

## Dashboard Favorite Feedback

Dashboard Favorite buttons remain immediate database operations rather than Tool Library drafts.

- The clicked star is replaced by a small Spinner while its request is pending.
- Only that tool's Favorite control is disabled.
- Success updates the database-backed workspace state and emits the matching added/removed Toast.
- Failure restores the prior favorite state and emits an error Toast.

## Loading and Toast Rules

Every button that waits for a database mutation provides feedback at the point of interaction:

| Action | Pending state | Success | Failure |
| --- | --- | --- | --- |
| Update row | Update icon becomes Spinner; row submit actions disabled | `<Tool> updated successfully` | `Could not update <Tool>. Please try again.` |
| Confirm delete | Spinner and `Deleting…`; modal actions disabled | `<Tool> deleted successfully` | `Could not delete <Tool>. Nothing was removed.` |
| Dashboard Favorite | Star becomes Spinner; that control disabled | Added/removed message | Previous state restored message |
| Save Tool | Spinner and `Saving…`; repeat submit disabled | `<Tool> added successfully` | Validation or retry message |

Success Toasts appear only after a successful database response. Failure Toasts reflect the response category:

- `401`: authentication is required.
- `403`: the current user is not allowed to perform the action.
- `400`: show the useful field or validation message.
- `503` or network failure: the service is temporarily unavailable and the action can be retried.
- Other server failures: show a concise generic failure without claiming that data changed.

Toasts reuse the existing application Toast presentation and motion. Success is green, error is red, and neutral information uses the established purple/blue treatment. Reduced Motion replaces rotating Spinners with a non-spatial pending indicator.

## Pagination

Pagination is client-side after the authenticated workspace tools have loaded. This avoids introducing a second server pagination contract for the current personal-size dataset while keeping all dashboard surfaces sourced from the same snapshot.

- Default page size: 10.
- Available page sizes: 10, 20, and 50.
- Left status: `Showing <start>–<end> of <total> tools`.
- Right controls: Rows per page selector, `Page X of Y`, first, previous, next, and last buttons.
- Boundary buttons are visibly disabled and non-interactive.
- Changing page size returns to page 1.
- A data refresh clamps the active page to the new valid page count.
- No row selection checkbox or selected-count label is included because no bulk operation is in scope.

## Component Boundaries

Implementation should follow existing project patterns and keep responsibilities narrow:

- Dashboard transition trigger: measures the All Tools card and starts the GSAP handoff.
- Transition overlay: owns only the source-to-destination animation and reduced-motion fallback.
- Manage page state: loads workspace data, owns pagination, and coordinates row drafts and mutation results.
- Tool Library table: renders headings and the current page.
- Editable tool row: owns inputs, local draft state, row validation, and row-scoped pending state.
- Color picker: palette plus custom color selection.
- Category collector: searchable multi-select over database Categories.
- Pagination controls: page size and boundary-safe navigation.
- Delete confirmation modal: focus-managed confirmation and pending state.
- Shared Add Tool modal: common Dashboard and Manage creation workflow.
- Workspace API/repository: authenticated patch, create, favorite, and owner-scoped delete behavior.

The existing read-only Manage edit side panel is replaced by inline editing. Files or exports made unused by this change may be removed only when they are direct orphans of this implementation.

## Accessibility

- All icon-only controls have descriptive accessible names containing the affected tool name.
- The delete confirmation traps focus, initially focuses the least destructive sensible control, supports Escape before submission, and returns focus to the originating Delete button when cancelled.
- Spinner states expose an accessible busy label and do not rely on color alone.
- Disabled paging controls use native disabled semantics.
- Table fields and collectors remain keyboard operable.
- Hover treatments are limited to devices that support hover.
- Reduced Motion removes spatial handoff movement and rotating progress motion while preserving understandable state changes.

## Verification

### Automated checks

- Tool patch validation for every editable field, including aliases and custom color normalization.
- Authenticated owner-scoped DELETE handler: success, unauthenticated, forbidden, missing record, and repository failure.
- Repository deletion and category relationship cleanup behavior.
- Row mutation state: duplicate-submit prevention, success refresh, failure preservation, and Toast mapping.
- Dashboard Favorite and Add Tool pending states and database-result Toasts.
- Pagination calculations, page-size reset, disabled boundaries, and page clamping after deletion.
- Reduced-motion transition selection.
- Existing alias search and database-pinned Quick Access regressions.

Run the relevant unit tests, TypeScript checks, lint, and production build.

### Browser acceptance on `http://localhost:3000`

1. Click Dashboard View All and confirm the All Tools surface expands into `/manage` without a visible jump.
2. Enter Manage from the Sidebar and confirm it opens directly.
3. Compare rendered rows with the database-backed workspace response.
4. Edit every supported field, submit Update, observe the scoped Spinner, and verify the database and dependent Dashboard surfaces refresh.
5. Force or simulate an update failure and verify the draft remains available with an error Toast.
6. Cancel a deletion and verify no request or Toast occurs.
7. Confirm a deletion, verify pending feedback, database removal, success Toast, and page clamping.
8. Exercise deletion failure and verify the record remains.
9. Add a tool from both Dashboard and Manage and confirm both invoke the same modal and feedback behavior.
10. Toggle a Dashboard Favorite and verify the per-button Spinner and database-result Toast.
11. Test page sizes and all four paging controls.
12. Repeat keyboard, narrow viewport, and Reduced Motion checks.

## Risks and Constraints

- The current Dashboard page contains a locally defined Add Tool modal. Extracting it must be mechanical and verified carefully so its visual behavior does not regress.
- A truly continuous cross-route DOM morph would require a broader shared-layout refactor. The approved fixed overlay handoff provides the intended continuity without that architectural expansion.
- Custom colors expand beyond the current named accent set. Validation, persistence, and decoration helpers must accept normalized custom values without breaking existing named accents.
- Client pagination is appropriate for the current personal workspace. Server pagination is intentionally deferred until dataset size or measured performance requires it.
