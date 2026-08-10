# Neon Music Player Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the existing dashboard music player as a compact blue-purple neon player without changing its outer footprint or playback behavior.

**Architecture:** Keep `useMusicPlayer`, `MusicPlayerPanel` props, track data, and the shared `GlassPanel` contract unchanged. Replace only the panel's internal JSX hierarchy and add narrowly scoped music-player CSS for visual states, responsive behavior, and reduced motion.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind utility classes, project CSS, existing icon package, Playwright/browser screenshot verification.

## Global Constraints

- Keep the `GlassPanel` footprint, responsive width, outer radius, and dashboard placement unchanged.
- Preserve play/pause, previous, next, play-mode, progress, animated cover, equalizer, and song-list interactions.
- Do not add lyrics, volume controls, backend behavior, dependencies, or routes.
- Keep semantic buttons, current accessible labels, keyboard list operation, and reduced-motion support.
- Read `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` and `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` before editing code.
- Do not stage or modify unrelated dirty-worktree files.

---

### Task 1: Recompose the closed neon player

**Files:**
- Modify: `src/app/darktheme/page.tsx:2456-2775`
- Modify: `src/app/darktheme/darktheme.css:179-212`

**Interfaces:**
- Consumes: Existing `MusicPlayerPanel` props and `Track` fields (`title`, `artist`, `cover`, `color`).
- Produces: The same `MusicPlayerPanel` React component and callbacks; no consumer changes.

- [ ] **Step 1: Record the current outer footprint and interaction baseline**

Run the existing app, open the dark-theme dashboard at the viewport used for the supplied current-state screenshot, and record the music card bounding box plus screenshots for closed-paused and closed-playing states. Exercise play/pause, previous, next, and play-mode once each; do not modify code if a baseline interaction is already broken.

- [ ] **Step 2: Read the installed Next.js guidance and inspect the icon exports**

Read `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` and `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`. Confirm the currently imported music-control icons in `src/app/darktheme/page.tsx` can supply the required filled transport appearance; reuse them unless the already-installed icon package exposes a closer matching control.

- [ ] **Step 3: Replace the now-playing header layout**

Keep the outer `GlassPanel` class string unchanged. Inside it, restructure the closed player so the header contains an 88–92 px circular cover shell, metadata column, and upper-right equalizer. Add component-scoped class names such as `neon-player`, `neon-player__cover-shell`, `neon-player__meta`, and `neon-player__equalizer`; retain `coverRef`, the existing rotation effect, title, artist, and equalizer state binding.

- [ ] **Step 4: Restyle the progress region**

Preserve `progressPct`, elapsed time, and duration bindings. Render a muted navy rail, cyan-to-blue-to-violet fill, and white luminous thumb. Keep the timestamp row directly below the rail and ensure `left: ${progressPct}%` remains clamped by the existing calculation.

- [ ] **Step 5: Recompose the five-control transport row**

Keep the existing callback wiring and accessible labels in this exact order: play mode, previous, play/pause, next, list. Render the primary control as a 60–64 px translucent violet circle with a luminous border and restrained bloom; give secondary controls consistent sizing and muted/active colors without adding handlers or state.

- [ ] **Step 6: Add narrowly scoped visual CSS**

In `darktheme.css`, add only `.neon-player...` rules and keyframes needed for the deep navy interior ambience, cover rings, title glow, progress bloom, control hover/focus states, and equalizer. Add a `@media (prefers-reduced-motion: reduce)` rule that disables cover/equalizer animation and nonessential transitions while leaving controls usable.

- [ ] **Step 7: Run static checks**

Run `npm run lint` and `npx tsc --noEmit`. Expected: no new lint or type errors in `src/app/darktheme/page.tsx` or `darktheme.css`. If a broader pre-existing error appears, run `npx eslint src/app/darktheme/page.tsx` and report the unrelated blocker separately.

- [ ] **Step 8: Commit the closed-player redesign**

```powershell
git add -- src/app/darktheme/page.tsx src/app/darktheme/darktheme.css
git commit -m "Restyle music player with neon layout"
```

---

### Task 2: Align the song list and complete visual regression QA

**Files:**
- Modify: `src/app/darktheme/page.tsx:2606-2775`
- Modify: `src/app/darktheme/darktheme.css`
- Create or update: `design-qa.md`

**Interfaces:**
- Consumes: Task 1's `.neon-player...` visual language and unchanged `showList`, `TRACKS`, `currentIndex`, `onPlayAt` behavior.
- Produces: A visually aligned open-list state and a passing `design-qa.md` report.

- [ ] **Step 1: Apply the neon language to the open song list**

Keep the list in the existing below-header region and retain click, Enter, and Space activation. Restyle active, hover, focus-visible, cover/icon tile, title, artist, and scrollbar behavior using the same navy/cyan/violet palette; do not alter track ordering or selection logic.

- [ ] **Step 2: Verify all player interactions in the rendered page**

At the baseline viewport, test play/pause, previous, next, all play modes, list open/close, mouse track selection, keyboard track selection, and live progress updates. Expected: every existing interaction works and no browser-console error is introduced.

- [ ] **Step 3: Verify footprint and responsive behavior**

Compare the post-change card bounding box with the Step 1 baseline at the dashboard viewport; width and height must be unchanged. Repeat at a viewport below 950 px and confirm the existing full-width layout remains intact with no clipped controls, title overflow, or inaccessible list content.

- [ ] **Step 4: Run screenshot comparison and design QA**

Capture closed-playing and open-list screenshots. Compare the closed-playing state against the supplied neon reference for hierarchy, spacing, cover scale, navy background, cyan-violet progress, icon consistency, and primary-control glow. Write findings to `design-qa.md` with severities P0–P3 and `final result: passed` only after fixing every P0, P1, and P2 issue; remaining P3 polish may be listed as follow-up.

- [ ] **Step 5: Re-run static checks**

Run `npm run lint` and `npx tsc --noEmit`. Expected: checks pass with no new errors; if the full lint command has unrelated failures, run `npx eslint src/app/darktheme/page.tsx` and record the distinction.

- [ ] **Step 6: Commit the list alignment and QA evidence**

```powershell
git add -- src/app/darktheme/page.tsx src/app/darktheme/darktheme.css design-qa.md
git commit -m "Verify neon music player card"
```
