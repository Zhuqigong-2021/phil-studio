# Neon Music Player Card Design

## Goal

Restyle the existing dashboard music player to match the supplied blue-purple neon reference while preserving its grid position and playback behavior. The player may be moderately wider than the other right-column cards to give the transport controls appropriate breathing room.

## Confirmed scope

- Set the desktop player width to `w-[min(460px,40vw)]`; keep its outer radius and dashboard placement unchanged.
- Redesign all internal layout, colors, cover-art sizing, icon sizing, spacing, and visual effects.
- Preserve the existing play/pause, previous, next, play-mode, progress, animated cover, equalizer, and song-list interactions.
- Do not add lyrics, volume controls, backend behavior, or new routes.

## Layout

The closed player uses three vertically stacked regions:

1. A now-playing header with an 88–92 px circular cover, blue-purple double glow ring, title and artist metadata, and a compact equalizer at the upper right.
2. A cyan-to-blue-to-purple progress rail with a white glowing thumb and elapsed/total timestamps.
3. A transport row that uses the available width for even separation between play mode, previous, primary play/pause, next, lyrics, and song list controls. The volume control remains visually independent on the left.

The primary play/pause control remains the visual anchor at approximately 60–64 px. The open song list continues to replace the progress and transport content below the header and adopts the same navy, cyan, and violet visual language.

## Visual direction

- Deep navy translucent interior with restrained cyan, blue, and violet ambient light.
- White title with a subtle glow; muted blue-gray artist and timestamp text.
- Cover art gains a layered neon ring and continues rotating only while playing.
- The progress fill is cyan-to-violet, with a bright white thumb and layered bloom.
- Controls use one consistent filled music-player icon family. Secondary controls remain quiet; the central control uses a translucent violet circular surface with a luminous border.
- Existing card-border animation may remain while playing, but it must not overpower the internal hierarchy.

## Responsive and accessibility behavior

- Preserve the current full-width responsive behavior below 950 px so the wider desktop width never introduces horizontal scrolling.
- Keep semantic buttons and current accessible labels.
- Maintain keyboard operation for the song list.
- Respect reduced-motion preferences for nonessential glow and rotation effects.

## Verification

- Confirm the desktop card resolves to at most 460 px wide and the controls have visibly even spacing without crowding.
- Exercise play/pause, previous, next, play-mode cycling, progress updates, and list open/close.
- Compare a rendered screenshot with the supplied reference for hierarchy, spacing, cover scale, color, and glow.
- Run the relevant lint/type checks and record any environment-related blockers separately from code failures.
