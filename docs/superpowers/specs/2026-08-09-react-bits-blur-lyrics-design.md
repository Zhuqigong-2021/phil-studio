# React Bits Blur Lyrics Design

## Approved result

- Remove both SVG lightning decorations and their styles.
- Keep one current lyric centred over the playback progress bar.
- Use the official React Bits BlurText motion model with `motion/react`.
- Split Chinese lyrics by characters.
- Stagger characters by `35ms`.
- Animate each character for about `420ms` through `blur(8px) / opacity 0 / y 8`, `blur(3px) / opacity 0.55 / y 2`, and `blur(0) / opacity 1 / y 0`.
- Preserve a crisp white glyph core with restrained Cyan near-light and purple ambient light.
- Re-run the effect whenever the active lyric changes.
- Respect reduced-motion preferences by showing the completed state immediately.

## Acceptance criteria

1. No lightning SVG or lightbar remains in the lyric component.
2. Each new current lyric reveals character by character with blur-to-focus motion.
3. The final lyric is sharp and remains horizontally centred over the progress bar.
