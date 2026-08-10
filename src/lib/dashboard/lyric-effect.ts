export type LyricEffectMode = "hybrid" | "particle" | "blur";

// Change only this value to restore the approved Blur Text presentation.
export const LYRIC_EFFECT_MODE: LyricEffectMode = "hybrid";

export function usesParticleLyricLayer(mode: LyricEffectMode): boolean {
  return mode === "particle" || mode === "hybrid";
}

export function usesBlurLyricLayer(mode: LyricEffectMode): boolean {
  return mode === "blur" || mode === "hybrid";
}
