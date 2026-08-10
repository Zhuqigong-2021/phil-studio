# Synced Neon Lyrics Design

## Goal

Add timestamp-synchronised lyrics to the music player, starting with `Ring Ring Ring`, without showing lyrics during the default player state.

## Interaction

- Lyrics are hidden by default.
- Clicking the existing lyrics button opens the lyric view and moves the progress group downward using its existing `400ms ease-in-out` motion.
- Only after that click may the lyric stage appear between the artist name and the progress bar.
- Clicking the lyrics button again hides the lyric stage and returns the progress group to its original position.
- Tracks without a configured lyric timeline keep the current layout and never show an empty lyric stage.

## Timeline data

- The source for Ring Ring Ring is `music/ringringring/ringringring.txt`.
- Each non-empty line uses `minutes:seconds lyric text`.
- The server reads only validated song slugs from `music/<slug>/<slug>.txt`; arbitrary filesystem paths are rejected.

## Visual treatment

- Show a three-line window: previous, current, and next.
- The current line is centred, semibold, and uses a cyan-violet neon edge glow.
- Previous and next lines remain faintly visible with lower opacity and a light blur.
- A new current line rises into place over `320ms ease-in-out`.
- Before the first timed line, the centre line displays `Ring Ring Ring` at restrained brightness.
- Reduced-motion users receive the state change without positional animation.

## Acceptance criteria

1. No lyrics are visible before the lyrics button is clicked.
2. With Ring Ring Ring selected, opening lyrics loads the provided timeline and selects the latest line whose timestamp is not later than playback time.
3. Opening and closing lyrics keeps the existing progress-bar down/up motion and renders no empty stage for unsupported tracks.
