# Phase One Performance Baseline

- Date: 2026-08-13
- Commit: 5e678ba
- Production URL: https://phil-studio-beta.vercel.app/dashboard
- Viewport: 1768 x 890
- Browser: Chromium through Playwright
- Measurement: warm production request after deployment, waitUntil networkidle plus 3.5 seconds

## Navigation

| Metric | Baseline |
| --- | ---: |
| DOMContentLoaded | 1057 ms |
| Load event | 1219 ms |
| Resource requests | 44 |
| JavaScript requests | 25 |
| Navigation transfer | 13,086 bytes |

Transfer-size values for cached chunk resources are not reliable in this warm run, so local production chunk sizes are retained as the bundle comparison gate. The largest generated client chunks were 517.2 KB, 225.0 KB, 222.0 KB, 188.7 KB, and 188.7 KB before compression.

## Source and runtime hotspots

- Dashboard client module: 5,515 lines / 215,250 bytes.
- Splash Cursor runtime: 990 lines / 37,052 bytes, deferred with next/dynamic and paused while hidden.
- Lighthouse edge geometry and SVG path lengths are cached, but CSS transform and beacon bounds are read every animation frame.
- Workspace mutations apply authoritative API responses immediately, then still schedule a delayed full snapshot request.

## Media

| Asset | Baseline size |
| --- | ---: |
| public/music/七里香.mp3 | 35.40 MB |
| public/music/黑色毛衣.mp3 | 26.99 MB |

## Database

- tools: 13 rows
- categories: 9 rows
- tool_categories: 24 rows
- Supabase Performance Advisor: no findings.
- Existing owner/sort, owner/recent, category name, and relationship indexes cover current access patterns.

## Acceptance gates

- No CSS visual constants, DOM class names, animation durations, colors, or layout values change.
- Dashboard focused interaction and animation tests stay green.
- Both normalized tracks decode in Chromium, advance currentTime, and retain lyric API responses.
- Confirmed mutations remain immediately visible without a page reload.
- Production build, TypeScript, and lint pass.
