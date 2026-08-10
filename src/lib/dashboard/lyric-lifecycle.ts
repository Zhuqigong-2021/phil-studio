export type LyricLifecycle = {
  gatherDurationMs: number;
  blurRevealDelayMs: number;
  blurExitDelayMs: number | undefined;
  blurExitDurationMs: number;
};

export function getLyricLifecycle(
  lineStartSeconds: number,
  lineEndSeconds: number | undefined,
): LyricLifecycle {
  if (lineEndSeconds === undefined) {
    return {
      gatherDurationMs: 620,
      blurRevealDelayMs: 560,
      blurExitDelayMs: undefined,
      blurExitDurationMs: 360,
    };
  }

  const durationMs = Math.max(
    1,
    Math.round((lineEndSeconds - lineStartSeconds) * 1000),
  );
  let gatherDurationMs = Math.min(
    620,
    Math.max(180, Math.round(durationMs * 0.35)),
  );
  let blurExitDurationMs = Math.min(
    360,
    Math.max(140, Math.round(durationMs * 0.22)),
  );

  const transitionBudget = Math.round(durationMs * 0.85);
  if (gatherDurationMs + blurExitDurationMs > transitionBudget) {
    const scale = transitionBudget / (gatherDurationMs + blurExitDurationMs);
    gatherDurationMs = Math.max(1, Math.round(gatherDurationMs * scale));
    blurExitDurationMs = Math.max(1, transitionBudget - gatherDurationMs);
  }

  const blurExitDelayMs = durationMs - blurExitDurationMs;

  return {
    gatherDurationMs,
    blurRevealDelayMs: Math.min(560, gatherDurationMs),
    blurExitDelayMs,
    blurExitDurationMs,
  };
}
