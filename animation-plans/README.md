# Dashboard animation plans

| Plan | Title | Severity | Status |
| --- | --- | --- | --- |
| 001 | Dashboard interaction motion system | HIGH | IMPLEMENTED; browser feel-check pending |
| 002 | Cache lighthouse edge geometry and DOM references | HIGH | IMPLEMENTED; automated verification passed |
| 003 | Isolate transient music progress updates | HIGH | IMPLEMENTED; automated verification passed |
| 004 | Defer heavy visual runtimes until needed | HIGH | IMPLEMENTED; automated verification passed |

## Recommended execution order

1. Plan 002 removes the largest steady-state main-thread hotspot without changing visual constants.
2. Plan 003 prevents audio progress from invalidating the full dashboard.
3. Plan 004 reduces startup cost after steady-state behavior is locked.

Plans 002 and 003 are independent. Plan 004 follows both so production profiling measures the combined improvement.
