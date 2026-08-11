# Supabase Tool Data Sync Design

## Goal

Move persistent personal-workspace data from browser-only localStorage to the existing Supabase project `uvicpezvhxmqcnlxjeoz`, while preserving the current Google + NextAuth owner-only login and all existing dashboard behavior.

Todo and focus-session data remain browser-local and continue to reset independently. This design covers only tools, categories, favorites, Quick Access pins, aliases, and recent-use metadata.

## Confirmed Architecture

The browser does not access Supabase directly. Client components call owner-protected Next.js route handlers. Each route handler validates the existing NextAuth session and verifies that the session email matches `AUTH_OWNER_EMAIL`. A dedicated server-only Supabase client then uses `SUPABASE_URL` and `SUPABASE_SECRET_KEY`.

The secret key must never use a `NEXT_PUBLIC_` prefix and must never be returned to the browser. The existing NextAuth implementation remains the only login system; Supabase Auth is not introduced.

Supabase is the durable source of truth after migration. localStorage remains a recoverable client cache and the source for a one-time upload of existing browser data.

## Database Schema

The application uses exactly three business tables in the `public` schema. Supabase-managed tables such as `auth.users` are not part of this count.

### `tools` (22 columns)

| Column | Type | Rules |
|---|---|---|
| `id` | `text` | Primary key; preserves existing IDs such as `ap` and UUID custom IDs |
| `owner_email` | `text` | Required; normalized lowercase owner identity |
| `name` | `text` | Required; 1-60 characters |
| `url` | `text` | Nullable; HTTP/HTTPS validation remains in the application |
| `description` | `text` | Required, default empty string; maximum 160 characters |
| `mono` | `text` | Required; current monogram fallback |
| `icon_key` | `text` | Nullable; stable key into the 500-icon frontend catalog |
| `icon_type` | `text` | Required; `official`, `matching`, or `monogram` |
| `icon_color` | `text` | Required; `violet`, `blue`, `pink`, `orange`, `cyan`, `teal`, or `slate` |
| `aliases` | `text[]` | Required, default empty array; at most 10 aliases enforced by the API |
| `source_type` | `text` | Required; `internal` or `external` |
| `is_favorite` | `boolean` | Required, default `false` |
| `is_pinned` | `boolean` | Required, default `false` |
| `last_used_at` | `timestamptz` | Nullable; drives Recent ordering |
| `use_count` | `integer` | Required, default `0`, non-negative |
| `check_status` | `text` | Required, default `Unknown` |
| `check_color` | `text` | Required, default `#7C8698` |
| `last_checked_at` | `timestamptz` | Nullable |
| `visible` | `boolean` | Required, default `true` |
| `sort_order` | `integer` | Required, default `0` |
| `created_at` | `timestamptz` | Required, default `now()` |
| `updated_at` | `timestamptz` | Required, default `now()`; application updates it on mutations |

Indexes support `(owner_email, sort_order)`, `(owner_email, last_used_at desc)`, and alias lookup where useful. Because this is a single-owner application, existing globally unique tool IDs remain the primary key.

### `categories` (6 columns)

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `owner_email` | `text` | Required; normalized lowercase owner identity |
| `name` | `text` | Required; 1-24 characters |
| `sort_order` | `integer` | Required, default `0` |
| `created_at` | `timestamptz` | Required, default `now()` |
| `updated_at` | `timestamptz` | Required, default `now()` |

A unique index on `(owner_email, lower(name))` prevents case-insensitive duplicates.

### `tool_categories` (3 columns)

| Column | Type | Rules |
|---|---|---|
| `tool_id` | `text` | Foreign key to `tools.id`, cascade delete |
| `category_id` | `uuid` | Foreign key to `categories.id`, cascade delete |
| `created_at` | `timestamptz` | Required, default `now()` |

The composite primary key is `(tool_id, category_id)`. This table implements the many-to-many relationship and prevents duplicate assignments.

## Database Security

Row Level Security is enabled on all three public tables. No `anon` or `authenticated` policies are created because the application does not use Supabase Auth. Access is granted only to the server-side secret/service role used by the protected Next.js API.

Every API query also filters by the verified, normalized session email. Relationship writes first verify that both the tool and category belong to that email. This application-level owner check is required even though the server role bypasses RLS.

The migration includes explicit grants because new Supabase projects may not automatically expose new public tables through the Data API. No database function uses `SECURITY DEFINER`.

## Server API

### `GET /api/workspace-data`

Returns one snapshot containing `tools`, `categories`, and tool-category relationships for the verified owner. On the owner's first request, the server idempotently seeds the current nine built-in tools and eight default categories without overwriting mutable fields such as favorite, pin, or recent-use state.

### `POST /api/workspace-data/migrate`

Accepts the validated one-time localStorage snapshot. It upserts custom categories and custom tools, then writes their relationships, favorite state, pinned state, and recent timestamps. Repeating the same request is idempotent.

### `POST /api/tools`

Creates one custom tool and its selected category relationships. If a relationship write fails, the route removes the newly created tool before returning an error, preventing a partial tool record.

### `PATCH /api/tools/[id]`

Updates only allowlisted mutable fields. Initial scope includes favorite, pin, last-used time/use count, visibility, and tool-edit fields already represented by the `Tool` type. Opening a tool records recent use through this route but does not block navigation if the request fails.

### `POST /api/categories`

Creates one owner-scoped category after applying the same trim, length, and case-insensitive duplicate validation used by the current UI.

## Client Data Flow

`useCustomTools` becomes an asynchronous workspace-data hook while preserving its current return shape where practical. The hook:

1. Reads the current local cache immediately so the dashboard can render without waiting for the network.
2. Fetches the Supabase-backed workspace snapshot.
3. If `phil-studio:supabase-migrated:v1` is absent, sends existing custom tools, custom categories, pins, favorite overrides, and recent entries to the migration route.
4. Refetches the authoritative snapshot and writes it to the cache.
5. Sets the migration marker only after the server confirms success.

Add Tool and category creation become awaited mutations. The modal stays open and shows an inline error if persistence fails. Successful mutations update the local view immediately from the server response.

Favorite and pin changes use optimistic UI with rollback on failure. Recent-use recording remains fire-and-forget so opening a tool is never delayed.

## Mapping Between Database and UI

Database snake_case rows are mapped in one focused module to the existing camelCase `Tool` interface:

- `icon_color` -> `accent`
- `source_type` -> `sourceType`
- `is_favorite` -> `favorite`
- `check_status` -> `checkStatus`
- `check_color` -> `checkColor`
- `last_checked_at` -> `lastCheckedAt`
- `sort_order` -> `sortOrder`

Category names are attached to each tool through `tool_categories`; the UI continues to receive `tool.tags: string[]`.

## Failure and Recovery Behavior

- Missing or invalid NextAuth ownership returns `401` or `403` without querying Supabase.
- Missing server environment variables return a controlled `503` and never expose secret values.
- Invalid tool/category input returns `400` with an inline-safe message.
- Supabase failures return `502`; client mutations roll back or remain editable.
- A failed first migration does not set the migration marker and is retried later.
- Existing localStorage data is not deleted automatically after migration.
- Dashboard reads may use the last valid local cache during a temporary outage.

## Verification

Implementation is complete only after all of the following pass:

1. Database inspection confirms exactly the three expected tables, columns, keys, constraints, and foreign keys.
2. Security and performance advisors have no unresolved issue introduced by this schema.
3. A server-side test query can insert, read, update, and remove isolated verification records.
4. Unauthorized API requests cannot read or mutate workspace data.
5. Existing localStorage fixtures migrate once and remain idempotent on a second request.
6. Browser acceptance verifies Add Tool, dynamic multi-category selection, alias search, favorite, Quick Access pinning, recent use, reload persistence, and network-error feedback.
7. The complete Node test suite, targeted ESLint, TypeScript/Next.js production build, and `git diff --check` pass.

## External Setup Requirements

The target project is `uvicpezvhxmqcnlxjeoz`. Before applying schema changes, the Codex Supabase connector must be authenticated to the account or organization that owns this project; the currently connected account cannot access it.

The application also requires these server-only environment variables locally and in Vercel:

```text
SUPABASE_URL=https://uvicpezvhxmqcnlxjeoz.supabase.co
SUPABASE_SECRET_KEY=<server-only Supabase secret key>
```

The secret value must be supplied through secure environment configuration and must not be committed.
