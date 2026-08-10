export const PARTICLE_HANDOFF_DURATION_MS = 820;
export const BLUR_REVEAL_DELAY_MS = 560;
export const BLUR_REVEAL_DURATION_MS = 300;

export function getParticleHandoffStyle(): { animation: string } {
  return {
    animation: `lyric-particle-handoff ${PARTICLE_HANDOFF_DURATION_MS}ms ease-out both`,
  };
}

export function getBlurHandoffStyle(
  blurExitDelayMs?: number,
  blurExitDurationMs = 360,
): { animation: string } {
  const reverseAnimation =
    blurExitDelayMs === undefined
      ? ""
      : `, lyric-blur-reverse-out ${blurExitDurationMs}ms ease-in ${Math.max(0, blurExitDelayMs)}ms forwards`;

  return {
    animation: `lyric-blur-handoff ${BLUR_REVEAL_DURATION_MS}ms ease-out ${BLUR_REVEAL_DELAY_MS}ms both${reverseAnimation}`,
  };
}
