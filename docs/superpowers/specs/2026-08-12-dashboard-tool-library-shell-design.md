# Dashboard Tool Library Shell Design

## Goal

Render `/manage` as the expanded state of the existing Dashboard All Tools card, preserving the Montréal background, original Sidebar, original Topbar, glass treatment, and database-backed management behavior.

## Approved Structure

- `/dashboard` keeps Hero, Stats, and BottomRow unchanged.
- `/manage` renders the same Dashboard root, background, Sidebar, Topbar, responsive drawer, toast viewport, and workspace provider.
- Only the Dashboard content stack is replaced by `ManageContent`.
- The Sidebar marks Manage active on `/manage` and Dashboard active on `/dashboard`.
- The existing GSAP source-card expansion remains the navigation handoff; the destination content enters inside the same visual shell.

## Table Layout

- Desktop must show Icon, Color, Name, Description, Category, Link, Pin, Favorite, Alias, and Operation without a whole-table horizontal scrollbar.
- Columns use compact responsive widths; long text fields truncate visually while remaining editable.
- Pagination remains below the table and does not scroll horizontally with rows.
- Narrow screens may use controlled horizontal scrolling.

## Preserved Behavior

Add, Update, Delete confirmation, Favorite, Pin, aliases, category selection, color picker, database spinners, Toasts, pagination, dirty drafts, and authoritative refresh remain unchanged.

## Acceptance Criteria

1. `/manage` has the same Montréal background, Sidebar, and Topbar as `/dashboard`.
2. At desktop width, Operation is visible without horizontal page or table scrolling.
3. Dashboard View All transitions to `/manage`; Manage Sidebar navigation lands on the same content.
4. Existing mutation and state tests remain green, with new shell/layout regression tests preventing the old SecondaryPageShell implementation.
