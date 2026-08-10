# V5 Stronger Spray and Original Equalizer Design

## Goal

Restore the original top-right five-bar playback equalizer and make V5's lower-left music-driven particle launch substantially stronger, wider, and more energetic while retaining clear musical causality and flash-safe rendering.

## Version Boundary

- This specification supersedes both the breathing-dot design and the later clean-header proposal.
- V5 remains the current 24-solid-bar implementation.
- V4 archives and restoration semantics remain untouched.

## Original Top-Right Equalizer

- Remove the breathing-dot node, helper, test, and dedicated CSS.
- Restore the original five `3px` rounded bars in their exact previous anchor and `16px` reserved height.
- Restore the cyan-to-violet color sequence, white-tipped bars `1`, `3`, and `5`, per-bar durations, staggered delays, and stepped `music-bar-jump` animation while playing.
- Paused playback keeps all five bars at their short resting height with no animation.
- This indicator communicates playback state only; it is not driven by audio amplitude.

## Stronger Music-Driven Spray

Each real onset or beat creates one connected three-layer plume at the active frequency region:

1. **Dense root layer:** `24-32` short-lived grains remain close to the emitting bar tops, forming a thick continuous bridge.
2. **Primary spray layer:** `18-26` grains rise through irregular arcs reaching roughly `35-55px` above captured bar surfaces at the current player size.
3. **High accent layer:** a strong measured beat launches `5-8` additional grains toward roughly `70-90px`, followed by gravity-driven descent.

The plume may expand across nearby active bars and remains about `35%` wider than the earlier restrained V5 design. One measured event releases its particles in deterministic stages across `100-140ms`, creating one continuous fountain rather than one instantaneous sparse point. It follows measured frequency energy and is never permanently concentrated on the left.

## Audio Mapping

- Onset strength enables and scales the root and primary layers.
- Strong measured beat strength enables the high accent layer.
- Loudness increases height, horizontal spread, and brightness within fixed limits.
- Strong-beat launch brightness may rise by up to `15%`, then follows the existing airborne decay.
- Silence, steady non-onset audio, and paused playback create no new spray.
- No random timer, autonomous boiling, or unrelated procedural burst is allowed.

## Motion and Rendering

- Preserve the attached bar-top bulge, then extend deterministic staged release across `100-140ms` so the denser plume emerges continuously.
- Retain varied low, medium, and high trajectories, nonlinear trail spacing, light horizontal drag, gravity, and free fall.
- Use fixed particle pools, deterministic seeds, normal alpha compositing, bounded brightness, and feathered particle edges.
- Do not introduce additive white blending, renderer/canvas recreation, per-frame DOM allocation, or full-region opacity changes.

## Preserved Behavior

- Preserve 24 solid bars, detrended height contrast, cyan-to-violet palette, music-driven bar brightness, volume interaction, playback controls, lyrics animation, pause behavior, and reduced-motion behavior.
- Reduced motion retains the same hierarchy at lower airborne count and height.

## Acceptance Criteria

1. The original five-bar top-right equalizer is visually and behaviorally restored.
2. An ordinary measured onset creates a dense `24-32` grain root bridge and `18-26` visible primary grains.
3. A strong measured beat adds only `5-8` clearly higher accent grains.
4. The plume releases across `100-140ms`, is about `35%` wider than restrained V5, has visibly varied heights, and reaches the specified ranges at the current player size.
5. Spray follows the active music region, not a fixed left origin or random timer.
6. Grains remain connected to the solid bars and return through natural free fall.
7. No local or full-card white flash occurs.
8. Automated physics/component regressions, targeted ESLint, and production build pass; authenticated playback remains a separate visual acceptance check.
