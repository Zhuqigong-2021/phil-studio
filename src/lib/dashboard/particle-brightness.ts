const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function computeRestingBrightness(
  loudness: number,
  bandEnergy: number,
): number {
  const globalEnergy = clamp01(loudness);
  const localEnergy = clamp01(bandEnergy);
  return Math.min(
    0.85,
    0.18 + 0.67 * globalEnergy * (0.35 + 0.65 * localEnergy),
  );
}

export function computeLaunchBrightness(
  restingBrightness: number,
  beatStrength: number,
): number {
  const emphasis = 1.15 + clamp01(beatStrength) * 0.05;
  return Math.min(0.85, clamp01(restingBrightness) * emphasis);
}

export function computeAirborneBrightness(
  launchBrightness: number,
  age: number,
  lifetime: number,
): number {
  const progress = clamp01(age / Math.max(0.001, lifetime));
  const easedProgress = progress * progress * (3 - 2 * progress);
  return clamp01(launchBrightness) * (1 - easedProgress * 0.3);
}

export function smoothBrightness(
  current: number,
  target: number,
  dtSec: number,
): number {
  const rate = target > current ? 13 : 5;
  const blend = 1 - Math.exp(-rate * Math.max(0, dtSec));
  return current + (target - current) * blend;
}
