# Tool Library Scene Transition and Quick Access Ordering

## Goal

Make Dashboard → Manage feel like one continuous product scene: the Montréal harbor photograph dissolves into a theme-matched indigo/violet environment while All Tools becomes Tool Library without stretched content. Quick Access must place the most recently updated pinned tool first.

## Approved Direction

Use a two-layer dissolve. Sidebar and Navbar stay fixed and clear. The Dashboard content fades and blurs while the photograph loses opacity and contrast. At the same time, a non-photo gradient layer grows from transparent to fully visible. `/manage` renders that exact same final gradient, so routing cannot introduce a color jump or a pure dark-blue intermediate frame.

The final background composition is:

- deep indigo at the lower-left and page edges;
- blue-violet through the center/horizon region;
- a softer violet bloom in the upper-right;
- a restrained cyan/blue reflection near the lower center;
- no flat black or uniform navy fill.

## Shared Tool Surface

- All Tools crossfades into a compact Tool Library preview at the source position.
- The overlay animates its `left`, `top`, `width`, and `height`; its children are never transformed with unequal X/Y scale.
- Preview typography, row height, spacing, and visible row count respond to the growing container using CSS container queries or equivalent responsive rules.
- More rows are revealed as height becomes available, preventing a tiny six-row table above a large empty surface.
- The preview remains opaque enough to prevent the mounted destination table showing through.
- In the final portion of the motion, the preview and real Manage table crossfade once. There must be no double-table ghosting.
- Reduced Motion uses a short background/content crossfade without geometry animation or blur.

## Quick Access Ordering

- Quick Access includes only tools whose authoritative database state is pinned.
- Pinned tools sort by database `updated_at` descending; newest timestamp is first.
- Equal or missing timestamps use a deterministic fallback based on the existing tool order and then ID.
- A successful create/update that sets Pin relies on the authoritative response/refetch, then immediately appears in the correct position.
- Unpinning removes the tool after the successful database response; failures preserve or restore the previous authoritative order.
- The client Tool model and workspace mapping must retain the database update timestamp rather than deriving ordering from the old pinned-ID array.

## Scope

Preserve the existing Manage CRUD behavior, loaders, Toasts, delete confirmation, pagination, Sidebar/Navbar structure, and the special 10-row vertical alignment. Do not alter music, recent activity, favorites semantics, or unrelated Dashboard panels.

## Verification

1. Mid-transition measurements show Sidebar and Navbar unchanged while the photo opacity decreases and the theme gradient opacity increases.
2. No transition frame uses unequal content scale, displays stretched text/icons, or shows two readable Tool Library tables simultaneously.
3. The final `/manage` background contains visible indigo and violet regions and no Montréal image element.
4. With pinned tools timestamped old/new/newest, Quick Access renders newest, new, old regardless of source array or pinned-ID order.
5. Pin, unpin, create-with-pin, failed mutation, reduced-motion, TypeScript, lint, tests, and production build remain green.
