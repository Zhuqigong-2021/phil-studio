# Synced Neon Lyrics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Display Ring Ring Ring's timestamped lyrics only after the lyrics control is opened.

**Architecture:** Parse the text timeline with pure tested helpers, expose it through a slug-restricted Next.js Route Handler, and let the client player fetch and render a three-line lyric window. Keep the existing progress-motion helper as the single source for the progress bar movement.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Node test runner, CSS.

## Global Constraints

- Lyrics stay hidden until the existing lyrics button is clicked.
- Use `music/ringringring/ringringring.txt` as the only initial timeline.
- Current-line motion is `320ms ease-in-out`; progress motion remains `400ms ease-in-out`.
- Do not expose arbitrary filesystem paths.
- Do not modify the user-provided lyric text.

---

### Task 1: Timeline parser and selection

**Files:**
- Create: `src/lib/dashboard/lyrics.test.ts`
- Create: `src/lib/dashboard/lyrics.ts`

**Interfaces:**
- Produces: `LyricLine`, `parseLyricsTimeline(source)`, `findActiveLyricIndex(lines, currentTime)`, and `getLyricWindow(lines, currentTime, fallback)`.

- [ ] Write tests covering compact timestamps, blank/malformed lines, pre-roll fallback, and previous/current/next selection.
- [ ] Run `node --experimental-strip-types src/lib/dashboard/lyrics.test.ts` and verify it fails because the module is absent.
- [ ] Implement the minimum pure helpers.
- [ ] Run the same command and verify it passes.

### Task 2: Restricted lyric endpoint

**Files:**
- Create: `src/app/api/lyrics/[slug]/route.ts`
- Create: `src/app/api/lyrics/[slug]/route.test.ts`

**Interfaces:**
- Consumes: `parseLyricsTimeline(source)`.
- Produces: `GET(request, { params })`, returning `{ lines: LyricLine[] }`.

- [ ] Write integration tests for a rejected unsafe slug and the real Ring Ring Ring timeline.
- [ ] Run the route test and verify it fails because the handler is absent.
- [ ] Implement slug validation, UTF-8 file loading, `404` handling, and JSON output.
- [ ] Run the route test and verify it passes.

### Task 3: Player lyric stage

**Files:**
- Modify: `src/lib/dashboard/music.ts`
- Create: `src/hooks/useLyricsTimeline.ts`
- Create: `src/components/dashboard/SyncedLyrics.tsx`
- Modify: `src/app/darktheme/page.tsx`
- Modify: `src/app/darktheme/darktheme.css`

**Interfaces:**
- `Track.lyricsSlug?: string` identifies supported tracks.
- `useLyricsTimeline(slug, enabled)` fetches only while the lyric view is open.
- `SyncedLyrics` consumes `lines`, `currentTime`, and `fallback`.

- [ ] Assign `lyricsSlug: "ringringring"` only to Ring Ring Ring.
- [ ] Fetch the timeline only when `showLyrics` is true and cancel stale requests.
- [ ] Render the stage only when opened and populated, between artist and progress bar.
- [ ] Add three-line neon styling, `320ms ease-in-out` line motion, and reduced-motion handling.
- [ ] Run the full TypeScript tests, targeted lint, and production build.

### Task 4: Visual acceptance

**Files:** None.

- [ ] Play Ring Ring Ring and confirm the default layout contains no lyrics.
- [ ] Click the lyric icon, confirm the progress bar lowers, and inspect line timing/glow/blur.
- [ ] Treat the user's visual review as the final acceptance gate for spacing and glow intensity.
