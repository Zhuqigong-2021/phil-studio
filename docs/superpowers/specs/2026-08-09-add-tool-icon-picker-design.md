# Add Tool Icon Picker Design

## Status

- Approved direction: Option C, sidebar category browser.
- Scope: Add a searchable library of 100 colorable Lucide icons to the existing Add Tool form.
- Out of scope: Supabase persistence, uploading custom images, favicons, brand-logo libraries, and changes to other dashboard behavior.

## Goal

Let the owner choose both an icon and an accent color while creating a tool. The chosen icon must be stable, searchable, safe to render, and able to inherit any supported accent color.

## User Experience

The Add Tool form displays the currently selected icon and its color. Clicking the icon opens an icon picker with:

- Search across all 100 icons.
- A persistent category list: Popular, Work, Design, Code, Media, Files, and Objects.
- An icon grid for the active category.
- The existing seven-color accent selector.
- Immediate preview updates when either the icon or color changes.

On narrow screens, the vertical category list becomes a horizontal, scrollable category row so the icon grid retains usable width.

The form defaults to:

- `iconKey: "app-window"`
- `accent: "blue"`

The icon and color always have defaults, so they do not introduce a new validation failure when saving.

## Icon Library

Use exactly 100 verified exports from the installed `lucide-react` package. Store icon metadata in a focused module rather than embedding the registry in the form component.

Each icon definition contains:

- `key`: stable kebab-case value used for persistence.
- `label`: user-facing English name.
- `category`: one of the seven supported categories.
- `keywords`: English and Chinese search terms where useful.
- `Icon`: the statically imported Lucide component.

The library contains:

| Category | Count |
|---|---:|
| Popular | 16 |
| Work | 14 |
| Design | 14 |
| Code | 14 |
| Media | 14 |
| Files | 14 |
| Objects | 14 |
| Total | 100 |

All registry components are statically mapped. Arbitrary database or user strings must never be resolved as dynamic imports. Unknown keys fall back to `app-window`.

## Component Boundaries

### Icon registry

A new dashboard library module owns the 100-icon registry, category definitions, search normalization, and safe lookup with fallback.

### Icon picker

A new focused client component owns:

- Open/closed presentation state supplied by the parent.
- Active category.
- Search query.
- Icon selection callbacks.
- Responsive category and grid presentation.

It does not save tools or own unrelated Add Tool fields.

### Add Tool form

`AddToolModal` continues to own form state. Its form state gains `iconKey`. It passes the current `iconKey` and `accent` into the picker and receives changes through callbacks.

The existing name-derived monogram preview is replaced by the selected Lucide icon. Name suggestion, tags, aliases, source, pin, and current mock save behavior remain unchanged.

## Data Model

The future Supabase `tools` table will store:

```text
icon_key text not null default 'app-window'
accent   text not null default 'blue'
```

This feature does not implement Supabase or schema migrations. It prepares the form model so the selected values can later be included in the real create-tool payload.

No image, SVG markup, component name, or color hex value is stored. `icon_key` selects a known component and `accent` selects a known application token.

## Data Flow

1. Add Tool opens with `app-window` and `blue`.
2. The owner opens the icon picker.
3. Search and category filtering operate entirely in memory over the fixed registry.
4. Selecting an icon updates `form.iconKey` and the preview.
5. Selecting a color updates `form.accent`; the selected SVG inherits the new color immediately.
6. A future persistence implementation will submit both stable values with the rest of the tool data.

## Error Handling

- Empty search results show a concise no-results state and keep the search field usable.
- Unknown or stale icon keys render the `app-window` fallback.
- The icon picker must not crash the Add Tool form if a key is invalid.
- Icon buttons include accessible names and selected state.
- Opening, selecting, and closing the picker must work with mouse and keyboard.

## Verification

Automated tests will verify:

- The registry contains exactly 100 unique keys.
- Every category has the expected number of icons.
- Lookup returns the requested icon and falls back for unknown keys.
- Search matches labels, keys, categories, and configured keywords.
- Add Tool includes `iconKey` and defaults to `app-window`.
- The picker renders category, search, icon, and color controls.

Project validation will run the focused tests, lint, TypeScript checking, and the production build when the environment permits it. A manual browser check will cover desktop and narrow responsive layouts plus icon/color interaction.

## Acceptance Criteria

1. Add Tool exposes 100 unique Lucide icons organized under the seven approved categories.
2. The owner can search, select an icon, select one of the existing accent colors, and see the preview update immediately.
3. The chosen state is represented by stable `iconKey` and `accent` values suitable for the future three-table Supabase model.
4. Existing Add Tool fields and behavior continue to work, except that the generated monogram is intentionally replaced by the chosen icon.
