# React Bits Blur Lyrics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the lyric lightning treatment with a React Bits-style per-character BlurText reveal.

**Architecture:** A small pure helper owns character segmentation and the approved three animation snapshots. A client `BlurText` component uses `motion/react`, and `SyncedLyrics` supplies the current timestamp-selected lyric.

**Tech Stack:** React 19, TypeScript, Motion for React, CSS, Node test runner.

## Global Constraints

- No lightning SVG or previous/next lyric display.
- Character delay is `35ms`; animation duration is approximately `420ms`.
- Final glyphs stay sharp, white, and centred.

---

### Task 1: Blur animation model

**Files:**
- Create: `src/lib/dashboard/blur-text.test.ts`
- Create: `src/lib/dashboard/blur-text.ts`

**Interfaces:**
- Produces: `splitBlurText(text)` and `LYRIC_BLUR_KEYFRAMES`.

- [ ] Test that Chinese text splits into ordered Unicode characters and spaces remain non-breaking.
- [ ] Test the literal start, midpoint, and completed blur snapshots.
- [ ] Run the test and verify it fails before implementation.
- [ ] Implement the smallest helper and verify the test passes.

### Task 2: React Bits component integration

**Files:**
- Create: `src/components/dashboard/BlurText.tsx`
- Modify: `src/components/dashboard/SyncedLyrics.tsx`
- Modify: `src/app/darktheme/darktheme.css`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- `BlurText({ text, delay, className })` renders staggered `motion.span` characters.
- `SyncedLyrics` passes only the active lyric.

- [ ] Install `motion`.
- [ ] Implement keyed per-character animation using the tested snapshots.
- [ ] Replace the current text/lightning markup with `BlurText`.
- [ ] Remove obsolete SVG, lightbar, and old materialize styles.
- [ ] Run tests, targeted lint, and the production build.
