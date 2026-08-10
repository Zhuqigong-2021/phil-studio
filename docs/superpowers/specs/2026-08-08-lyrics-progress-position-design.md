# Lyrics Progress Position Design

## Goal

Move the playback progress bar and its elapsed/total time labels 15px upward while lyrics are hidden, while preserving their current position when lyrics are shown.

## Scope

- Change only the progress/time container inside `MusicPlayerPanel`.
- Keep the title, volume control, transport controls, song-list layout, and player dimensions unchanged.
- Preserve the current lyrics-button behavior and active color.

## Design

Use the existing `showLyrics` state to select the progress/time container's vertical transform:

- Lyrics hidden: `translateY(-5px)`
- Lyrics shown: `translateY(10px)`

The current `10px` position remains the expanded-lyrics reference position, preserving the approved `15px` difference. Animate only this transform with `transition: transform 400ms ease-in-out`; playback progress, seeking, lyrics content, controls, and card layout remain unchanged. When the operating system requests reduced motion, disable the transition while preserving both final positions. No new state, component, animation library, or CSS abstraction is needed.

## Verification

- A source-level regression check verifies both conditional transform values, the `400ms ease-in-out` transition, and the reduced-motion override.
- ESLint verifies the edited source.
- The production build verifies the Next.js application compiles.
- A browser screenshot comparison verifies the two visual states if the local page is available.
