# Dynamic Tool Categories and Alias Search Design

## Goal

Make Add Tool functional for this personal workspace without introducing Supabase yet. A user can create reusable categories, assign multiple categories to a tool, save a new tool locally, and find that tool through its name, aliases, or categories.

## Scope

This change includes:

- treating the existing Tags as multi-select Categories;
- creating reusable categories from inside Add Tool;
- persisting custom categories in browser `localStorage`;
- persisting newly created tools in browser `localStorage`;
- saving each tool's aliases with the tool;
- searching tools by name, aliases, and categories;
- including locally created tools in existing dashboard tool surfaces and category statistics.

This change does not include Supabase integration, category deletion or renaming, per-category colors, tool editing, or cross-device synchronization.

## Terminology and Data Model

The current `tags` property remains the stored property for compatibility, but the UI calls these values Categories. A tool can have zero or more categories, and a category can belong to multiple tools.

A locally saved tool uses the existing `Tool` shape and includes:

- generated stable `id`;
- `name` and `url`;
- optional `description`;
- `iconKey` and `accent`;
- `tags` containing selected category names;
- `aliases` containing zero to ten search aliases;
- `sourceType`;
- `favorite`, initially `false`.

The form's Pin to Quick Access value is not duplicated inside the tool record. The current dashboard has no persistent pin collection, so this feature introduces `phil-studio:pinned-tools:v1`, containing only pinned tool IDs. After the tool is saved, its generated ID is added to that collection when Pin is enabled.

Aliases belong to the tool. They do not form a separate collection or table. In a future Supabase migration they map directly to `tools.aliases text[]`.

## Local Storage

Use these versioned keys:

- `phil-studio:custom-categories:v1` for user-created category names;
- `phil-studio:custom-tools:v1` for tools created through Add Tool.

Quick Access pin membership uses a third versioned key, `phil-studio:pinned-tools:v1`, containing tool IDs only.

Default categories remain defined in source code. The category list shown in the UI is the case-insensitive, de-duplicated union of defaults and custom categories.

Storage reads must validate the JSON shape and fall back safely to an empty collection when data is missing or malformed. Storage writes occur only in the browser.

## Add Tool Interaction

Rename the Tags section to Categories and preserve multi-selection chips.

Add a `+ New category` control below the category chips. Activating it reveals a compact input with Add and Cancel controls that follow the current indigo visual system.

Creating a category:

1. trims surrounding whitespace;
2. rejects an empty value;
3. limits the name to 24 characters;
4. prevents case-insensitive duplicates such as `AI` and `ai`;
5. persists the category immediately;
6. automatically selects it for the current tool.

Because category creation is an explicit global action, closing Add Tool does not remove a category that was already added.

Alias validation remains a maximum of ten aliases and 32 characters per alias. Duplicate detection becomes case-insensitive.

Saving a tool validates a non-empty name and a valid HTTP or HTTPS URL. On success it persists the complete tool, updates dashboard data without a reload, and closes the modal. Validation or storage failures keep the modal open and display a concise inline error.

## Dashboard Integration

All dashboard tool consumers use a merged collection of built-in tools and locally saved tools. Existing built-in tools remain unchanged.

The Categories panel derives its list and percentage share from the merged category list and merged tool collection. A new category with no saved tools displays zero percent. Once its tool is saved, its share updates immediately.

The global Searchbar matches a normalized query against:

- tool name;
- every alias;
- every category name.

Search remains case-insensitive. A match through an alias still renders the real tool name and opens the real tool URL.

## Component Boundaries

- A small client-side storage module owns category and custom-tool parsing, validation, reading, writing, and change notifications.
- A reusable category selector owns category display, creation input, validation messages, and multi-selection behavior.
- Add Tool owns form validation and constructs the saved tool.
- Dashboard state owns the merged tool collection so cards, search, category statistics, favorites, recent tools, and Quick Access see the same data.

The active dashboard Add Tool implementation is the acceptance target. The shared Add Tool component must use the same category selector and storage contract so the two implementations do not drift.

## Error Handling

- Malformed local data is ignored instead of breaking the dashboard.
- Duplicate category or alias input shows a local validation message.
- An invalid name or URL prevents Save.
- A local storage write failure keeps the modal open and reports that the item could not be saved.
- Unknown or unavailable icon keys continue to use the existing icon fallback.

## Verification

Automated tests must prove:

- default and custom categories merge case-insensitively;
- malformed storage data falls back safely;
- category creation validation and immediate persistence work;
- Add Tool saves categories and aliases with a local tool;
- search finds a tool by name, alias, and category;
- category statistics include custom tools;
- the existing 500-icon picker remains integrated;
- all existing project tests, lint checks, and the production build still pass.

Browser verification must prove:

- a category can be created and selected in Add Tool;
- a tool with an alias can be saved;
- the saved tool appears without a page reload;
- searching by its alias returns the tool;
- refreshing the page preserves both tool and category;
- no browser console errors or framework error overlay appear.

## Future Supabase Migration

The later database migration will move locally saved tools into `tools`, keep `aliases` as a `text[]` field, move categories into a category table, and represent tool-category membership with a join table. That migration is outside this implementation and must not be partially introduced now.
