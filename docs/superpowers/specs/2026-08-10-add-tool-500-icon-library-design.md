# Add Tool 500 Icon Library Design

## Status

- Approved direction: 500 curated Lucide icons, 20 categories, dynamically loaded.
- Existing picker layout: Option C, category sidebar plus icon grid.
- Existing stored values remain `icon_key` and `accent`.

## Goal

Expand the Add Tool icon library from 100 to exactly 500 useful, consistently styled Lucide icons without loading all 500 icon components in the initial Add Tool bundle.

## Scope

This feature includes:

- Exactly 500 unique curated Lucide icon keys.
- Twenty owner-oriented categories.
- Search across all 500 icons.
- Dynamic icon component loading.
- Loading, error, and fallback states.
- The shared Add Tool modal and the active Dashboard `AddToolModalDark` consumer.
- Desktop and narrow-screen responsive behavior.

This feature excludes:

- Brand logos.
- Uploaded SVG or image icons.
- Supabase persistence or database migrations.
- Changes to Add Tool fields unrelated to icon selection.

## Categories

1. Popular
2. Work & Business
3. Productivity
4. Design
5. Development
6. AI & Automation
7. Data & Analytics
8. Communication
9. Files & Documents
10. Media
11. Education
12. Finance & Commerce
13. Security
14. Cloud & Network
15. Devices & Hardware
16. Travel & Location
17. Health & Lifestyle
18. Nature & Weather
19. Buildings & Places
20. Actions & Status

Category counts may vary according to usefulness, but their sum must be exactly 500. Every icon belongs to exactly one primary category.

## Picker Experience

The approved category-sidebar layout remains. The category list scrolls independently so twenty categories do not increase the modal height. The icon grid scrolls within its own bounded region.

Search ignores the active category and queries all 500 metadata records. Clearing search returns to the previously active category. Search matches stable key, English label, category name, English keywords, and selected Chinese keywords.

The picker renders only the current category or filtered search results. It does not mount all 500 icons simultaneously. Icon buttons remain at least 44 by 44 CSS pixels.

On viewports at or below 560px, the category sidebar becomes a horizontally scrollable category row and the icon grid keeps four or five columns according to available width.

## Dynamic Loading Architecture

The metadata registry contains serializable information only:

```ts
interface ToolIconMetadata {
  key: ToolIconKey;
  label: string;
  category: ToolIconCategory;
  keywords: readonly string[];
}
```

Icon components are resolved separately through Lucide's installed dynamic import map. Only allowlisted keys from the 500-item registry can be requested. User-provided or database strings never become unrestricted import paths.

The selected icon preview and visible grid cells load their components asynchronously. A small neutral placeholder preserves button dimensions while an icon loads. A failed or unknown icon resolves to `app-window` without crashing the form.

The implementation must verify the installed `lucide-react 1.28.0` dynamic import API rather than relying on an assumed current API.

## Data Compatibility

The data model does not change:

```text
icon_key text not null default 'app-window'
accent   text not null default 'blue'
```

The original 100 keys remain included within the new 500-key allowlist, so existing selections continue to render. Default values remain `app-window` and `blue`.

## Component Boundaries

### Metadata registry

Owns the 500 allowlisted keys, labels, categories, keywords, uniqueness checks, category counts, search, and fallback metadata.

### Dynamic icon renderer

Accepts an allowlisted icon key plus ordinary Lucide SVG props. It owns lazy loading, the fixed-size loading placeholder, and fallback to `app-window`.

### Tool Icon Picker

Owns open state, search query, active category, the two independently scrollable regions, and selection callbacks. It consumes metadata and the dynamic renderer but does not own Add Tool persistence.

### Add Tool consumers

Both `src/components/dashboard/AddToolModal.tsx` and the active Dashboard `AddToolModalDark` in `src/app/dashboard/page.tsx` continue to own `iconKey` and `accent`. Both use the same picker component.

## Performance Rules

- Do not statically import 500 Lucide components into the registry.
- Do not render all 500 buttons unless a search genuinely returns all 500.
- Cap the visible grid region and scroll within it.
- Preserve layout while icon chunks load.
- Production build output must be reviewed for accidental inclusion of the complete Lucide component bundle in the initial route chunk.

## Error Handling

- Unknown or stale key: render `app-window`.
- Dynamic import failure: render `app-window` and keep the picker interactive.
- Empty search: show `No icons found` and retain the editable search box.
- Slow load: retain fixed-size placeholder without shifting the grid.
- Category with no entries is a validation failure and must not ship.

## Verification

Automated tests verify:

- Exactly 500 unique keys.
- All twenty categories are present and non-empty.
- All original 100 keys remain available.
- Every key exists in the installed Lucide dynamic import map.
- Search covers key, label, category, and bilingual keywords.
- Unknown keys and failed loads fall back safely.
- The shared and active Dashboard Add Tool consumers both use the picker.
- Narrow-screen CSS retains horizontal categories and 44px targets.

Manual browser acceptance verifies category scrolling, representative icons from all twenty categories, search, selection, color changes, loading stability, no-result recovery, and narrow-screen behavior.

## Acceptance Criteria

1. The picker exposes exactly 500 unique, colorable Lucide icons across twenty non-empty categories.
2. The original 100 stable keys continue to work.
3. Search operates across all metadata while normal browsing renders only the active category.
4. Icons are dynamically loaded through an allowlisted resolver with loading and fallback states.
5. Both real Add Tool entry paths display the expanded picker.
6. Focused tests, TypeScript for changed files, ESLint, a network-enabled production build, and browser interaction checks pass or any unrelated pre-existing failures are reported separately.
