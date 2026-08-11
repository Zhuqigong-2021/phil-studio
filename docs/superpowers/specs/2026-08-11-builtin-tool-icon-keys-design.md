# Built-in Tool Icon Keys Design

## Goal

Assign a valid icon-library key to each of the nine built-in tools so the current UI can render semantic icons and future icon standardization can update one stable field.

## Mapping

| Tool ID | Tool | `icon_key` |
|---|---|---|
| `ap` | Arts Portfolio | `palette` |
| `cv` | Online CV | `contact` |
| `ps` | Online PS | `image` |
| `pdf` | Online PDF Editor | `file-text` |
| `am` | Animation Maker | `clapperboard` |
| `mm` | Mindmap | `chart-network` |
| `sm` | StudyMate | `graduation-cap` |
| `no` | Notion | `book-open-text` |
| `ai` | AI Agent Learning Notes | `brain-circuit` |

Every key must exist in the current 500-icon catalog before deployment.

## Data and Code Changes

- Add `iconKey` and `iconType: "matching"` to all nine records in `TOOLS_RAW`.
- Add a timestamped Supabase data migration that updates only the nine exact built-in IDs.
- Set both `icon_key` and `icon_type = 'matching'`; preserve each tool's current `icon_color` and all unrelated fields.
- Do not add a table, column, trigger, policy, or public permission.

## Safety and Verification

- Add a regression test proving every built-in tool has a catalog-valid icon key and matching icon type.
- Verify the migration changes exactly nine rows and leaves custom tools untouched.
- Query the live database after deployment to confirm the mapping.
- Run focused tests, ESLint, production build, and `git diff --check`.

## Rollback

If required, a scoped data update can restore `icon_key = null` and `icon_type = 'monogram'` for only these nine IDs. Existing colors remain unchanged in either direction.
