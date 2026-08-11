# Add Tool Indigo Controls Design

## Status

Approved direction: unify ordinary Add Tool controls with the existing indigo visual language before merging the 500-icon feature to `main`.

## Goal

Remove the slate-looking button treatment inside Add Tool while preserving clear primary, secondary, selected, and color-selection roles. Keep the icon library scrollable without showing scrollbars.

## Scope

This change covers the shared Add Tool modal, the active Dashboard `AddToolModalDark`, and `ToolIconPicker`. It does not change Dashboard controls outside Add Tool, data fields, saved icon keys, accent values, or the 500-icon catalog.

## Visual Rules

- Ordinary Add Tool action buttons use a translucent indigo surface, indigo border, and light foreground.
- Hover and selected states become brighter indigo; they do not fall back to slate gray.
- `Save tool` remains the strongest purple/indigo primary action.
- `Cancel` remains secondary but uses the same indigo family.
- Color swatches retain their real colors because they are data choices, not ordinary buttons.
- Disabled buttons keep the indigo treatment with reduced opacity.
- Icon buttons use an indigo-tinted resting surface and foreground; their selected border continues to inherit the chosen icon accent so icon-color feedback remains accurate.
- Tag and source choices use indigo for selected state and a subtle indigo tint for resting state.

## Scrollbar Rules

- The category list and icon-results region remain independently scrollable with mouse wheel, trackpad, touch, and keyboard.
- Native scrollbar tracks and thumbs are hidden in Chromium/WebKit and Firefox.
- On viewports at or below 560px, the horizontal category row also hides its scrollbar while retaining horizontal scrolling.
- No content is clipped solely to hide a scrollbar.

## Implementation Boundary

`ToolIconPicker.module.css` owns picker button and scrollbar styling. The two Add Tool consumers keep their existing structure and receive only surgical inline/class treatment updates for ordinary action, tag, source, cancel, and save controls. No shared modal refactor is included.

## Verification

- Source tests assert scrollbar hiding without removal of scroll overflow.
- Source tests assert indigo resting/selected control tokens and reject the old slate picker foreground.
- Existing 500-icon, loader, responsive, and Add Tool integration tests remain green.
- Production build passes.
- Browser comparison confirms hidden scrollbars, visible scrolling, indigo ordinary buttons, unchanged color swatches, selection behavior, and no console errors at desktop and 500px widths.

## Acceptance Criteria

1. Add Tool ordinary buttons read as one indigo family instead of mixed indigo/slate themes.
2. Save remains visually primary and color swatches remain truthful.
3. All picker scrolling still works while scrollbars are invisible.
4. The 500-icon catalog, twenty categories, search, selection, and color behavior remain unchanged.
5. The finished feature is merged locally into `main` only after automated and browser verification pass.
