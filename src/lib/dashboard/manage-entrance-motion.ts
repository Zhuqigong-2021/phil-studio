type MotionState = Record<string, number | string>;

type MotionStep = {
  from: MotionState;
  to: MotionState;
};

function step(
  reducedMotion: boolean,
  offset: MotionState,
  duration: number,
  ease: string,
  extra: MotionState = {},
): MotionStep {
  return {
    from: reducedMotion ? { autoAlpha: 0 } : { autoAlpha: 0, ...offset },
    to: {
      autoAlpha: 1,
      x: 0,
      y: 0,
      duration,
      ease,
      ...extra,
    },
  };
}

export function getManageDirectEntrancePlan(reducedMotion: boolean) {
  const duration = reducedMotion ? 0.16 : 1.4;
  const ease = reducedMotion ? "power2.out" : "power3.inOut";

  return {
    duration,
    sidebar: step(reducedMotion, { x: -44 }, duration, ease),
    navbar: step(reducedMotion, { y: -32 }, duration, ease),
    header: step(reducedMotion, { y: -20 }, duration, ease),
    table: step(reducedMotion, { x: 46 }, duration, ease),
    pagination: step(reducedMotion, { y: 26 }, duration, ease),
    rows: step(
      reducedMotion,
      { y: 8 },
      reducedMotion ? 0.16 : 0.42,
      "power2.out",
      { stagger: reducedMotion ? 0 : 0.04 },
    ),
  };
}
