# Phase Two Performance and RPC Design

## Objective

Reduce Dashboard startup work, repeated workspace reads, database round trips, and long-running client overhead without changing product behavior, layout, copy, visual styling, animation timing, or interaction semantics.

Implementation is divided into two risk-gated batches. Batch 2 may begin only after Batch 1 passes its complete automated and browser acceptance gate.

## Non-negotiable constraints

- Preserve the current Dashboard, Manage, View All transition, lighthouse beam, edge illumination, music, lyrics, Quick Access, category, favorite, pin, CRUD, toast, loader, and mobile-navigation behavior.
- Preserve current DOM hooks, CSS classes, data attributes, GSAP selectors, animation constants, responsive breakpoints, image crop, and visual parameters unless a test proves an internal-only replacement is equivalent.
- Never cancel or deduplicate database writes. Only idempotent workspace reads may be shared or superseded.
- Keep optimistic UI updates immediate. Database acknowledgement must reconcile state without a page reload.
- Do not expose the Supabase service-role key to the browser.
- Database functions remain `SECURITY INVOKER`, use an empty `search_path`, validate `owner_email`, revoke execution from `public`, `anon`, and `authenticated`, and grant execution only to `service_role`.
- Existing untracked screenshots, logs, music files, and user artifacts are out of scope and must not be staged.

## Batch 1: low-risk optimizations

### Workspace subscriptions

Split broad workspace consumers into purpose-specific selectors for tools, categories, pinned tools, favorites, pending mutations, and stable actions. A component must rerender only when the state it displays changes.

### Read request sharing

Use one in-flight promise for equivalent workspace GET requests triggered by initial load, focus restoration, Dashboard/Manage mounting, or manual refresh. A newer read supersedes an older response; writes remain independent and authoritative.

### Stale-response protection

Associate each workspace read with a monotonically increasing request generation. Only the latest eligible GET response may replace the shared snapshot. A stale success or failure must not overwrite newer state or emit an obsolete error toast.

### Audio loading

Keep the current song fully available, preload metadata for the next song, and do not preload later tracks. Preserve playback continuity, lyrics state, playlist order, controls, local persistence, and cross-route behavior.

### Existing update RPC validation

Retain the existing `patch_workspace_tool` RPC. Add contract coverage proving that tool fields and category relationships update atomically, invalid category ownership rolls back the whole transaction, and the function remains restricted to `service_role`.

## Batch 1 acceptance gate

Batch 1 must pass all of the following before Batch 2 begins:

1. Focused unit and integration tests for selectors, request sharing, stale-response protection, audio preload, and update RPC contracts.
2. Full TypeScript check, lint with zero new errors, production build, and the relevant existing test suite.
3. Authenticated browser CRUD checks for create, update, delete, pin, favorite, alias, category, toast, loader, and immediate no-reload reconciliation.
4. Desktop, tablet, and mobile checks for Dashboard and Manage layout.
5. Dashboard entrance, View All to Manage shared-surface transition, direct Manage entrance, lighthouse sweep/contact edge, All Tools marquee, and reduced-motion checks.
6. Music playback, lyrics visibility, track switching, and route switching checks.
7. Browser console inspection and network-count comparison against the pre-change baseline.

Any functional, layout, visual, or motion regression stops the phase. Fix or revert the responsible Batch 1 change before proceeding.

## Batch 2: low-medium and medium optimizations

### Read-only workspace snapshot RPC

Add `get_workspace_snapshot(p_owner_email text)` returning one JSON object containing owned tools, owned categories, and their relationships. It replaces the current tools/categories/relationships multi-query snapshot path with one database round trip.

The RPC must:

- return the same ordering and data shape currently consumed by `snapshotFromRows`;
- include only rows owned by `p_owner_email`;
- preserve pinned and recent ordering fields;
- return empty arrays rather than null collections;
- remain `SECURITY INVOKER` and callable only by `service_role`.

The repository keeps a tested fallback to the existing three-query reader during local tests and controlled rollout. The API response contract does not change.

### Atomic create RPC

Add `create_workspace_tool(p_owner_email text, p_tool jsonb, p_category_ids uuid[])` to insert the tool and its category relationships in one transaction and return the created tool.

The RPC must validate the owner, permitted tool fields, category ownership, and duplicate category IDs before inserting anything. Invalid input or any relationship failure rolls back the entire operation. Existing application validation remains the first line of defense.

### Existing mutation boundaries

- Update plus category replacement continues through `patch_workspace_tool`.
- Delete continues through the existing delete path and foreign-key cascade; no delete RPC is added.
- Adding a category remains one normal insert; no category RPC is added.

### Dashboard decomposition

Extract internal responsibilities from the large Dashboard module only where doing so reduces render or initialization cost. Preserve rendered structure, class names, data attributes, refs, selectors, and animation constants. Candidate boundaries are background/lighthouse runtime, music panel composition, workspace cards, and transition orchestration; extraction is rejected if DOM equivalence cannot be demonstrated.

### Deferred visual runtimes

Initialize Splash Cursor, Side Rays, Magic Rings, and music visualizer only when their surfaces become relevant. Pause and release work while the document or surface is not visible, then resume without resetting visible state. Do not change shaders, colors, density, size, timing, or motion paths.

### Asset scheduling and animation lifecycle

Adjust loading priority, decoding, and caching of the existing background assets without replacing or recropping them. Centralize visibility and reduced-motion pause/resume behavior for RAF, GSAP, and WebGL runtimes while preserving their current visible result.

## Batch 2 acceptance gate

Repeat the complete Batch 1 gate and add:

1. RPC integration tests for success, wrong owner, invalid category, duplicate category, rollback, empty workspace, ordering, and permission restrictions.
2. Database advisor review and query-plan/round-trip evidence for the snapshot path.
3. DOM-structure and GSAP-selector contract tests around any extracted Dashboard units.
4. Before/after screenshots at stable animation checkpoints for Dashboard, Manage, View All transition, and responsive layouts.
5. Lighthouse trajectory/contact-edge and WebGL lifecycle verification after backgrounding and restoring the tab.
6. Network evidence showing a single snapshot RPC call where the prior path required multiple database calls.

## Data flow

1. The client requests `/api/workspace` through the existing shared workspace state layer.
2. Equivalent reads share one in-flight request; only the newest eligible generation may reconcile state.
3. The server validates the authenticated owner and calls the repository.
4. In Batch 1 the repository keeps the current snapshot reader. In Batch 2 it calls `get_workspace_snapshot` and maps the returned JSON into the unchanged application snapshot.
5. Mutations update the client optimistically, wait for the database result, then reconcile the returned authoritative entity without reloading the page.
6. Create and update use atomic RPCs; delete and category creation retain their existing safe single-operation paths.

## Error and rollback behavior

- Read failures preserve the last good snapshot and show at most one current error toast.
- Stale read failures are ignored.
- Mutation failures restore the affected optimistic state and use the existing failure toast behavior.
- A database mutation that commits but whose follow-up read fails is reported as partial success rather than false failure.
- RPC validation errors map to existing 400-class API responses; unavailable database/service errors retain retryable 503 behavior.
- No optimization may introduce automatic write retries.

## Rollout and rollback

- Each optimization is implemented with a focused red-green test cycle and a small commit.
- Batch 1 is independently shippable and reversible.
- New RPC migrations are additive. Application code switches to them only after database verification.
- If browser or database acceptance fails, revert the smallest responsible commit; do not compensate by changing visual constants or weakening tests.
- Production deployment and live Supabase migration require a separate explicit confirmation after both local gates pass.

## Definition of done

Phase 2 is complete only when both gates pass, database round trips are demonstrably reduced, no page reload is required after workspace mutations, and browser evidence shows no functional, layout, visual, or animation regression.
