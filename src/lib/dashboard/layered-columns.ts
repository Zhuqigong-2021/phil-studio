function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function resampleSpectrumInto(
  source: Float32Array,
  target: Float32Array,
): Float32Array {
  if (source.length === 0 || target.length === 0) return target;

  const sourcePerTarget = source.length / target.length;
  for (let targetIndex = 0; targetIndex < target.length; targetIndex++) {
    const targetStart = targetIndex * sourcePerTarget;
    const targetEnd = targetStart + sourcePerTarget;
    const firstSource = Math.floor(targetStart);
    const lastSource = Math.min(source.length - 1, Math.ceil(targetEnd) - 1);
    let weightedSum = 0;
    let totalWeight = 0;

    for (let sourceIndex = firstSource; sourceIndex <= lastSource; sourceIndex++) {
      const overlap = Math.max(
        0,
        Math.min(targetEnd, sourceIndex + 1) - Math.max(targetStart, sourceIndex),
      );
      weightedSum += source[sourceIndex] * overlap;
      totalWeight += overlap;
    }

    target[targetIndex] = totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  return target;
}

export function resamplePeakPreservingInto(
  source: Float32Array,
  target: Float32Array,
): Float32Array {
  resampleSpectrumInto(source, target);
  if (source.length === 0 || target.length === 0) return target;

  for (let targetIndex = 0; targetIndex < target.length; targetIndex++) {
    const sourcePosition = target.length <= 1
      ? 0
      : (targetIndex / (target.length - 1)) * (source.length - 1);
    const nearest = source[Math.round(sourcePosition)] ?? 0;
    target[targetIndex] = clamp01(target[targetIndex] * 0.58 + nearest * 0.42);
  }
  return target;
}

export function computeColumnParticleX(
  column: number,
  columnCount: number,
  jitter: number,
  gapRatio = 0.16,
): number {
  const columnWidth = 1 / columnCount;
  const center = (column + 0.5) * columnWidth;
  const boundedJitter = Math.min(0.5, Math.max(-0.5, jitter));
  return center + boundedJitter * columnWidth * (1 - clamp01(gapRatio));
}
