# 003 — Isolate transient music progress updates

- **Status**: TODO
- **Commit**: 0572489
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 3 files, about 160 lines

## Problem

`src/components/dashboard/PersistentMusicProvider.tsx:106-123` places `currentTime` and `duration` in the same context as stable playback controls. Every `timeupdate` creates a new provider value. `src/app/dashboard/page.tsx:5479` consumes it at the top-level dashboard, allowing transient progress to propagate through a very large tree.

## Target

Keep playback, modes, volume, lyrics, navigation persistence, progress, seeking, and animations identical. Split stable playback/control state from transient timing state, or expose timing through a narrowly scoped subscription consumed only by progress/lyrics. Memoize provider values and keep callback identities stable.

## Repo conventions to follow

- Preserve the persistent `<audio>` element and local-storage lyrics behavior.
- Preserve existing public control names.
- Use `useSyncExternalStore` if timing leaves React state; otherwise use a dedicated timing context consumed only inside the player.

## Steps

1. Add a failing render-count test proving a stable consumer does not rerender on `timeupdate`.
2. Split or externally subscribe to transient timing.
3. Memoize stable values and keep controls compatible.
4. Move timing consumption to the smallest player/lyrics boundary.
5. Run persistence, playlist, lyrics, and player tests.

## Boundaries

- Do NOT change audio events, track order, modes, volume, lyrics, timestamps, or seeking.
- Do NOT change player markup/CSS or provider route ownership.
- Do NOT add dependencies.

## Verification

- **Mechanical**: render-count regression, music tests, `npx tsc --noEmit`, targeted ESLint.
- **Feel check**: progress and lyrics remain synchronized; navigation preserves playback and lyric visibility.
- **Performance check**: React Profiler confines time updates to progress/lyrics consumers.
- **Done when**: unrelated dashboard consumers remain stable during time updates with zero behavior/visual change.

