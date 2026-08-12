# Dashboard Tool Library Shell Design

## Goal

Render `/manage` as the visual continuation of the existing Dashboard All Tools card, preserving the design language and database-backed management behavior without exposing a route-remount jump.

## Approved Structure

- `/dashboard` keeps Hero, Stats, and BottomRow unchanged.
- `/manage` uses the same Dashboard component language but replaces the Montréal photograph with a low-contrast navy/violet gradient for legibility.
- Only the Dashboard content stack is replaced by `ManageContent`.
- The Sidebar marks Manage active on `/manage` and Dashboard active on `/dashboard`.
- The All Tools card is deep-cloned and remains above both routes throughout the handoff.
- Dashboard siblings blur and fade while the clone expands to the management content bounds.
- Route navigation occurs behind the retained transition layer; the destination table crossfades in before the layer is removed.
- Reduced Motion uses a short crossfade without scale or blur movement.

## Integrated Surface

- Tool Library has no outer border, outline, panel shadow, or whole-surface hover glow.
- The management content reads as part of the page rather than a card placed on top.
- Only row separators, editable controls, and operation buttons retain necessary boundaries.

## Table Layout

- Desktop must show Icon, Color, Name, Description, Category, Link, Pin, Favorite, Alias, and Operation without a whole-table horizontal scrollbar.
- Columns use compact responsive widths; long text fields truncate visually while remaining editable.
- Pagination remains below the table and does not scroll horizontally with rows.
- Narrow screens may use controlled horizontal scrolling.

## Preserved Behavior

Add, Update, Delete confirmation, Favorite, Pin, aliases, category selection, color picker, database spinners, Toasts, pagination, dirty drafts, and authoritative refresh remain unchanged.

## Acceptance Criteria

1. `/manage` uses the Dashboard style but does not show the Montréal photograph.
2. At desktop width, Operation is visible without horizontal page or table scrolling.
3. Dashboard View All expands continuously to `/manage` while surrounding content blurs/fades and no Sidebar remount is visible.
4. Existing mutation and state tests remain green, with new shell/layout regression tests preventing the old SecondaryPageShell implementation.
