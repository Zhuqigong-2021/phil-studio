# Ambient Volume Waveform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fluid Canvas waveform above the existing volume slider that animates during playback and settles when paused.

**Architecture:** Add one focused `AmbientVolumeWaveform` client-side React component near `MusicPlayerPanel` in the existing dark-theme page module. It owns Canvas sizing, deterministic ambient morphing, pause settling, reduced-motion behavior, and cleanup; the player only passes `isPlaying` and keeps the native range input above the noninteractive Canvas.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Canvas 2D, `requestAnimationFrame`, `ResizeObserver`, existing CSS/Tailwind utilities.

## Global Constraints

- Do not modify the audio graph, volume state, playback callbacks, routes, dependencies, or persistence.
- Keep the mute button and native range input fully interactive and visually above the Canvas.
- Animate only while playing; settle over approximately 400 ms when paused.
- Respect `prefers-reduced-motion` with a static low waveform.
- Cancel animation frames, media-query listeners, and observers on unmount.
- Do not change the album, title, progress, or transport layout.

---

### Task 1: Build and verify the ambient Canvas waveform

**Files:**
- Modify: `src/app/darktheme/page.tsx:3319-3640`
- Modify: `src/app/darktheme/darktheme.css:245-308`

**Interfaces:**
- Consumes: `isPlaying: boolean` from `MusicPlayerPanel`.
- Produces: `AmbientVolumeWaveform({ isPlaying }: { isPlaying: boolean }): React.ReactElement`.

- [ ] **Step 1: Record the current volume-control baseline**

At the current desktop viewport, capture the music card with `Super Star` selected. Record the volume input bounding box and confirm mute click plus range dragging work before editing.

- [ ] **Step 2: Add the Canvas component**

Add `AmbientVolumeWaveform` above `MusicPlayerPanel`. Use a canvas ref, DPR-aware backing dimensions, `ResizeObserver`, and `requestAnimationFrame`. Generate 5–7 deterministic control points from fixed phase offsets; interpolate their heights with distinct sine periods and amplitudes, then draw a smooth filled silhouette plus a bright baseline using Canvas gradients and layered alpha. Set `canvas.style.pointerEvents = "none"` and expose it as decorative with `aria-hidden="true"`.

- [ ] **Step 3: Implement playback, pause, and reduced-motion states**

While `isPlaying`, advance morph, float, brightness, and hue phases. When playback stops, interpolate each amplitude toward a low resting target over 400 ms before cancelling the frame loop. When `matchMedia("(prefers-reduced-motion: reduce)")` matches, render one static low waveform and do not schedule continuous frames.

- [ ] **Step 4: Place the waveform above the volume slider**

Wrap only the existing range input in a relative waveform stack. Position the Canvas immediately above and baseline-align it with the slider track, while keeping the input at a higher stacking level. Do not move the mute button or change `onVolumeChange`, `value`, `min`, `max`, `step`, `aria-label`, or `--volume-pct`.

- [ ] **Step 5: Add scoped layout CSS**

Add `.volume-waveform-stack` and `.volume-waveform-canvas` rules beside `.volume-slider`. Constrain the Canvas to the slider width, provide the required vertical drawing space without changing pointer hit-testing, and add a reduced-motion rule that disables unnecessary transitions.

- [ ] **Step 6: Run static verification**

Run `npx eslint src/app/darktheme/page.tsx` and `npx tsc --noEmit`. Expected: zero errors; existing unrelated `<img>` warnings may remain.

- [ ] **Step 7: Run rendered interaction and visual verification**

In the browser, select `Super Star`, confirm the Canvas fits above the slider without clipping or overlapping the album, verify mute and range dragging still work, verify play starts motion, pause settles, and check the console has zero errors. Capture playing and paused screenshots and confirm the waveform contains unequal peaks, asymmetrical slopes, cyan/blue/violet color drift, and continuous brightness transitions.

- [ ] **Step 8: Commit the focused implementation**

```powershell
git add -- src/app/darktheme/page.tsx src/app/darktheme/darktheme.css
git commit -m "Add ambient volume waveform"
```

