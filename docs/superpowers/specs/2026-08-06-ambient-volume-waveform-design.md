# Ambient Volume Waveform Design

## Goal

Add a fluid, ambient waveform immediately above the music player's existing volume slider without changing volume behavior or the rest of the player layout.

## Visual design

- Render the waveform with a dedicated Canvas sized to the existing volume-slider width.
- Anchor the waveform baseline to the slider track so the two read as one composition.
- Use 5–7 smoothly interpolated control points with unequal peak heights, slopes, phase offsets, and cycle durations.
- Blend cyan, electric blue, deep blue, and violet with localized highlights, shadows, and soft bloom.
- Keep the silhouette airy and asymmetrical; avoid synchronized bouncing, equal peaks, sharp corners, or a visibly repeating short loop.
- Keep the mute button, slider track, thumb, and pointer interaction above the Canvas and fully usable.

## Motion behavior

- Animate only while the track is playing.
- Use morphing, float, interpolation, asymmetric easing, and coordinated color/brightness drift rather than audio-frequency analysis.
- On pause, settle over approximately 400 ms into a low static waveform instead of freezing abruptly.
- Under `prefers-reduced-motion`, render the low static waveform and do not run an animation loop.

## Engineering boundaries

- Create one focused waveform component in the existing dark-theme page module or a colocated component if extraction is required for readability.
- Consume only `isPlaying`; do not modify the audio element, Web Audio graph, volume state, or playback callbacks.
- Use `requestAnimationFrame` and device-pixel-ratio-aware Canvas sizing.
- Cancel animation frames and observers on unmount.
- Do not add dependencies, routes, persistence, or real audio analysis.

## Verification

- Verify the waveform appears only above the volume slider and does not intercept pointer input.
- Verify play animates, pause settles, reduced motion stays static, and resizing remains sharp.
- Check that the waveform does not clip the card, overlap the album, or move the volume control.
- Run ESLint, TypeScript, browser-console, and rendered screenshot checks.
