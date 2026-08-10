# Lyrics Progress Position Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the music progress/time group 15px upward while lyrics are hidden and preserve its existing position while lyrics are shown.

**Architecture:** Reuse the existing `showLyrics` component state as the single source of truth for a conditional inline `top` offset on the existing progress/time wrapper. Do not add state, components, dependencies, or unrelated layout changes.

**Tech Stack:** Next.js 16.2.10, React 19.2.4, TypeScript, Tailwind CSS, inline React styles.

## Global Constraints

- Lyrics hidden uses `top: -5`.
- Lyrics shown uses `top: 10`.
- The title, volume, transport controls, song list, and card dimensions remain unchanged.
- Existing user changes in the dirty working tree must be preserved.

---

### Task 1: Make progress position follow lyrics state

**Files:**
- Modify: `src/app/darktheme/page.tsx:4271`
- Verify: real `/darktheme` page in the browser

**Interfaces:**
- Consumes: existing `showLyrics: boolean` state in `MusicPlayerPanel`
- Produces: progress/time wrapper offset of `-5px` when hidden and `10px` when shown

- [ ] **Step 1: Record the failing browser assertion**

Open `/darktheme`, locate the `Show lyrics` button and the progress/time wrapper, record its top position, click the lyrics button, and compare the new top position.

Expected before implementation: FAIL because the difference is `0px`, not `15px`.

- [ ] **Step 2: Implement the minimal conditional offset**

```tsx
style={{ position: "relative", top: showLyrics ? 10 : -5 }}
```

- [ ] **Step 3: Re-run the browser assertion**

Expected: PASS because the shown-lyrics position is exactly `15px` lower than the hidden-lyrics position; the control row position is unchanged.

- [ ] **Step 4: Run static and production checks**

Run:

```powershell
npm run lint
npm run build
```

Expected: both commands exit with code 0.

- [ ] **Step 5: Review the surgical diff**

Run:

```powershell
git diff -- src/app/darktheme/page.tsx docs/superpowers/specs/2026-08-08-lyrics-progress-position-design.md docs/superpowers/plans/2026-08-08-lyrics-progress-position.md
```

Expected: one production expression change plus the two task documents; no unrelated user files are modified.
