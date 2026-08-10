export type SolidBarGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function computeAttachedBounceLift(
  age: number,
  duration: number,
  strength: number,
): number {
  if (age <= 0 || duration <= 0 || age >= duration) return 0;
  return Math.sin(Math.PI * (age / duration)) *
    (0.006 + clamp01(strength) * 0.008);
}

export function computeParticleReleaseDelay(
  index: number,
  count: number,
): number {
  if (count <= 1) return 0.04;
  const rank = Math.min(count - 1, Math.max(0, index)) / (count - 1);
  return (40 + rank * 40) / 1000;
}

export function computeDropletTier(index: number, count: number): 0 | 1 | 2 {
  const boundedCount = Math.max(1, Math.floor(count));
  const boundedIndex = Math.min(boundedCount - 1, Math.max(0, Math.floor(index)));
  const lowCount = Math.round(boundedCount * 0.6);
  const highCount = Math.ceil(boundedCount * 0.1);
  if (boundedIndex < lowCount) return 0;
  if (boundedIndex < boundedCount - highCount) return 1;
  return 2;
}

export function computeDropletTierImpulse(
  tier: 0 | 1 | 2,
  strength: number,
): number {
  const energy = clamp01(strength);
  return [0.32 + energy * 0.2, 0.58 + energy * 0.3, 0.86 + energy * 0.48][tier];
}

export function computeDropletSpread(
  tier: 0 | 1 | 2,
  strength: number,
  seed: number,
): number {
  const direction = clamp01(seed) * 2 - 1;
  const energy = 0.55 + clamp01(strength) * 0.45;
  return direction * [0.035, 0.075, 0.13][tier] * energy;
}

export function computeDropletTrailLag(index: number, count: number): number {
  const boundedIndex = Math.max(0, Math.min(Math.max(0, count - 1), index));
  return 0.011 * Math.pow(boundedIndex + 1, 1.45);
}

export function computeParticleReleaseImpulse(
  index: number,
  count: number,
  strength: number,
): number {
  const rank = count <= 1
    ? 0
    : Math.min(count - 1, Math.max(0, index)) / (count - 1);
  const energy = clamp01(strength);
  const early = 0.75 + energy * 0.65;
  const late = 0.35 + energy * 0.35;
  return early + (late - early) * rank;
}

export function computeNaturalClusterBudget(primaryBudget: number): number {
  const wholeBudget = Math.max(0, Math.floor(primaryBudget));
  return wholeBudget === 0 ? 0 : Math.min(14, 8 + wholeBudget * 2);
}

export function computeLowDebrisBudget(clusterBudget: number): number {
  return Math.max(0, Math.round(Math.floor(clusterBudget) * 0.6));
}

export function computeLowDebrisArc(
  age: number,
  lifetime: number,
  seed: number,
): number {
  if (age <= 0 || lifetime <= 0 || age >= lifetime) return 0;
  return Math.sin(Math.PI * (age / lifetime)) *
    (0.014 + clamp01(seed) * 0.01);
}

export function computeTrailGrainBudget(strength: number): number {
  return 2 + Math.round(clamp01(strength) * 2);
}

function trailRank(index: number, count: number): number {
  if (count <= 1) return 0;
  return Math.min(count - 1, Math.max(0, index)) / (count - 1);
}

export function computeTrailScale(index: number, count: number): number {
  return 0.62 - trailRank(index, count) * 0.37;
}

export function computeTrailBrightness(
  parentBrightness: number,
  index: number,
  count: number,
): number {
  return Math.max(0, parentBrightness) *
    (0.55 - trailRank(index, count) * 0.37);
}

export function writeSolidBarGeometry(
  column: number,
  columnCount: number,
  height: number,
  target: SolidBarGeometry,
  gapRatio = 0.16,
): SolidBarGeometry {
  const columnWidth = 1 / columnCount;
  const boundedHeight = Math.max(0, height);
  target.x = (column + 0.5) * columnWidth;
  target.y = boundedHeight / 2;
  target.width = columnWidth * (1 - clamp01(gapRatio));
  target.height = boundedHeight;
  return target;
}

export function computeSurfaceGrainBudget(airborneBudget: number): number {
  const wholeBudget = Math.max(0, Math.floor(airborneBudget));
  return wholeBudget === 0 ? 0 : Math.min(8, Math.max(2, wholeBudget * 2));
}

export function computeRestrainedEmissionBudget(budget: number): number {
  const wholeBudget = Math.max(0, Math.floor(budget));
  return wholeBudget === 0 ? 0 : Math.max(1, Math.ceil(wholeBudget * 0.4));
}

export function computeStrongPrimaryBudget(emissionBudget: number): number {
  const wholeBudget = Math.max(0, Math.floor(emissionBudget));
  if (wholeBudget === 0) return 0;
  return Math.min(12, 8 + Math.round((Math.min(12, wholeBudget) - 1) * 4 / 11));
}

export function computeStrongRootBudget(primaryBudget: number): number {
  const wholeBudget = Math.max(0, Math.floor(primaryBudget));
  if (wholeBudget === 0) return 0;
  const boundedBudget = Math.min(12, Math.max(8, wholeBudget));
  return 16 + Math.round((boundedBudget - 8) * 6 / 4);
}

export function computeHighAccentBudget(primaryBurst: number): number {
  const strength = clamp01(primaryBurst);
  if (strength <= 0.45) return 0;
  return 2 + Math.round(clamp01((strength - 0.46) / 0.54) * 2);
}

export function computeTransitionClusterBudget(airborneBudget: number): number {
  const wholeBudget = Math.max(0, Math.floor(airborneBudget));
  return wholeBudget === 0 ? 0 : Math.min(18, 2 + wholeBudget * 4);
}

export function computeTransitionClusterLifetime(seed: number): number {
  return 0.1 + clamp01(seed) * 0.08;
}

export function computeTransitionClusterOffset(
  age: number,
  lifetime: number,
  seed: number,
): number {
  return computeSurfaceGrainScale(age, lifetime) *
    Math.pow(clamp01(seed), 2) * 0.028;
}

export function computeErosionNotchDepth(
  age: number,
  barHeight: number,
): number {
  if (age <= 0 || age >= 0.12 || barHeight <= 0) return 0;
  return Math.min(0.012, barHeight) * Math.sin(Math.PI * (age / 0.12));
}

export function computeErosionGrainDelay(
  index: number,
  count: number,
): number {
  if (count <= 1) return 0;
  return (Math.min(count - 1, Math.max(0, index)) / (count - 1)) * 0.06;
}

export function computeErosionTrailOffset(
  age: number,
  lifetime: number,
  seed: number,
): number {
  if (age <= 0 || lifetime <= 0) return 0;
  const progress = Math.min(1, age / lifetime);
  return Math.pow(progress, 0.82) * (0.012 + clamp01(seed) * 0.02);
}

export function computeSurfaceGrainScale(
  age: number,
  lifetime: number,
): number {
  if (lifetime <= 0 || age <= 0 || age >= lifetime) return 0;
  return Math.sin(Math.PI * (age / lifetime));
}

export function computeSurfaceGrainOffset(
  age: number,
  lifetime: number,
  seed: number,
): number {
  return computeSurfaceGrainScale(age, lifetime) *
    (0.006 + clamp01(seed) * 0.014);
}
