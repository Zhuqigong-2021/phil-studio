export type FountainTriggerState = {
  initialized: boolean;
  bandEnvelopes: Float32Array;
  onsetStrengths: Float32Array;
  onsetActive: Uint8Array;
  lastBeatPulse: number;
  primaryBurst: number;
  emissionBudget: number;
};

export type FountainTriggerInput = {
  bands: Float32Array;
  loudness: number;
  beatPulse: number;
  playing: boolean;
};

export type FountainParticle = {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  age: number;
  lifetime: number;
};

export type AdaptiveSpectrumState = {
  initialized: boolean;
  averages: Float32Array;
  peaks: Float32Array;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function createAdaptiveSpectrumState(
  bandCount: number,
): AdaptiveSpectrumState {
  return {
    initialized: false,
    averages: new Float32Array(bandCount),
    peaks: new Float32Array(bandCount),
  };
}

export function writeAdaptiveSpectrum(
  state: AdaptiveSpectrumState,
  bands: Float32Array,
  dtSec: number,
  target: Float32Array,
): Float32Array {
  const count = Math.min(bands.length, target.length, state.averages.length);
  const averageRate = 1 - Math.exp(-Math.max(0, dtSec) / 1.5);
  const peakRate = 1 - Math.exp(-Math.max(0, dtSec) / 1.1);

  for (let index = 0; index < count; index++) {
    const band = clamp01(bands[index] ?? 0);
    if (!state.initialized) {
      state.averages[index] = band;
      state.peaks[index] = Math.min(1, band + 0.08);
    }
    const average = state.averages[index];
    const peak = state.peaks[index];
    const delta = band - average;
    const positiveRange = Math.max(0.08, peak - average);
    const relative = delta >= 0
      ? 0.35 + (delta / positiveRange) * 0.65
      : 0.35 + (delta / 0.2) * 0.25;
    const frequencyPosition = count <= 1 ? 0 : index / (count - 1);
    const compensation = 0.88 + frequencyPosition * 0.3;
    target[index] = clamp01(relative * compensation);

    state.averages[index] = average + delta * averageRate;
    state.peaks[index] = Math.max(
      band,
      peak + (state.averages[index] - peak) * peakRate,
    );
  }
  state.initialized = true;
  return target;
}

export function writeNeighborContrast(
  source: Float32Array,
  target: Float32Array,
  amount = 0.16,
): Float32Array {
  const count = Math.min(source.length, target.length);
  for (let index = 0; index < count; index++) {
    const center = source[index] ?? 0;
    const left = source[Math.max(0, index - 1)] ?? center;
    const right = source[Math.min(count - 1, index + 1)] ?? center;
    const neighborAverage = (left + right) * 0.5;
    target[index] = clamp01(center + (center - neighborAverage) * amount);
  }
  return target;
}

function logCompressBand(value: number): number {
  return Math.log1p(clamp01(value) * 8) / Math.log(9);
}

export function writeLogCompressedSpectrum(
  bands: Float32Array,
  target: Float32Array,
): Float32Array {
  const count = Math.min(bands.length, target.length);
  for (let index = 0; index < count; index++) {
    target[index] = logCompressBand(bands[index] ?? 0);
  }
  return target;
}

export function writeDetrendedSpectrum(
  bands: Float32Array,
  target: Float32Array,
): Float32Array {
  const count = Math.min(bands.length, target.length);
  for (let index = 0; index < count; index++) {
    const center = logCompressBand(bands[index] ?? 0);
    let trend = 0;
    let samples = 0;
    for (let offset = -2; offset <= 2; offset++) {
      const sourceIndex = Math.min(count - 1, Math.max(0, index + offset));
      trend += logCompressBand(bands[sourceIndex] ?? 0);
      samples++;
    }
    const residual = center - trend / samples;
    target[index] = clamp01(0.5 + residual * 3.2);
  }
  return target;
}

export function writeDetrendedBedTargets(
  detail: Float32Array,
  compressedRaw: Float32Array,
  onsets: Float32Array,
  loudness: number,
  target: Float32Array,
): Float32Array {
  const count = Math.min(
    detail.length,
    compressedRaw.length,
    onsets.length,
    target.length,
  );
  const volume = clamp01(loudness);
  if (count === 0) return target;

  let detailMean = 0;
  let rawMean = 0;
  for (let index = 0; index < count; index++) {
    detailMean += clamp01(detail[index] ?? 0);
    rawMean += clamp01(compressedRaw[index] ?? 0);
  }
  detailMean /= count;
  rawMean /= count;

  let squaredResiduals = 0;
  let maxExcursion = 0;
  for (let index = 0; index < count; index++) {
    const residual = clamp01(detail[index] ?? 0) - detailMean;
    squaredResiduals += residual * residual;
    maxExcursion = Math.max(maxExcursion, Math.abs(residual));
  }
  const rms = Math.sqrt(squaredResiduals / count);
  const varianceProgress = clamp01((rms - 0.015) / (0.08 - 0.015));
  const varianceGate = varianceProgress * varianceProgress *
    (3 - 2 * varianceProgress);
  const contourAmplitude = (0.052 + volume * 0.075) * varianceGate;
  const baseline = 0.05 + volume * (0.12 + rawMean * 0.02);

  for (let index = 0; index < count; index++) {
    const detailResidual = clamp01(detail[index] ?? 0) - detailMean;
    const normalizedContour = maxExcursion > 0.0001
      ? detailResidual / maxExcursion
      : 0;
    const rawResidual = clamp01(compressedRaw[index] ?? 0) - rawMean;
    const onsetLift = clamp01(onsets[index] ?? 0) *
      (0.025 + volume * 0.035);
    target[index] = Math.min(
      0.38,
      Math.max(
        0.04,
        baseline +
          normalizedContour * contourAmplitude +
          rawResidual * 0.035 +
          onsetLift,
      ),
    );
  }
  return target;
}

export function computeFountainBedTargets(
  bands: Float32Array,
  loudness: number,
): Float32Array {
  const targets = new Float32Array(bands.length);
  if (bands.length === 0) return targets;

  let minBand = Number.POSITIVE_INFINITY;
  let maxBand = Number.NEGATIVE_INFINITY;
  for (const band of bands) {
    minBand = Math.min(minBand, band);
    maxBand = Math.max(maxBand, band);
  }
  const range = Math.max(0.001, maxBand - minBand);
  const normalizedLoudness = clamp01(loudness);

  for (let i = 0; i < bands.length; i += 1) {
    const left = bands[Math.max(0, i - 1)] ?? bands[i];
    const center = bands[i] ?? 0;
    const right = bands[Math.min(bands.length - 1, i + 1)] ?? bands[i];
    const smoothedBand = left * 0.15 + center * 0.7 + right * 0.15;
    const relative = clamp01((smoothedBand - minBand) / range);
    const shape = Math.pow(relative, 1.4);
    targets[i] = Math.min(
      0.38,
      0.06 + normalizedLoudness * (0.02 + shape * 0.48),
    );
  }

  return targets;
}

export function createFountainTriggerState(
  bandCount: number,
): FountainTriggerState {
  return {
    initialized: false,
    bandEnvelopes: new Float32Array(bandCount),
    onsetStrengths: new Float32Array(bandCount),
    onsetActive: new Uint8Array(bandCount),
    lastBeatPulse: 0,
    primaryBurst: 0,
    emissionBudget: 0,
  };
}

export function stepFountainTriggers(
  state: FountainTriggerState,
  input: FountainTriggerInput,
): FountainTriggerState {
  const bandCount = input.bands.length;
  const bandEnvelopes = new Float32Array(bandCount);
  const onsetStrengths = new Float32Array(bandCount);
  const onsetActive = new Uint8Array(bandCount);

  if (!input.playing) {
    bandEnvelopes.set(input.bands);
    return {
      initialized: true,
      bandEnvelopes,
      onsetStrengths,
      onsetActive,
      lastBeatPulse: 0,
      primaryBurst: 0,
      emissionBudget: 0,
    };
  }

  let onsetTotal = 0;
  for (let i = 0; i < bandCount; i += 1) {
    const band = clamp01(input.bands[i] ?? 0);
    const previous = state.initialized
      ? clamp01(state.bandEnvelopes[i] ?? band)
      : band;
    const positiveDelta = band - previous;
    const rawOnset = state.initialized
      ? clamp01((positiveDelta - 0.08) / 0.52)
      : 0;
    const onset = rawOnset > 0 && state.onsetActive[i] === 0 ? rawOnset : 0;
    onsetStrengths[i] = onset;
    onsetActive[i] = rawOnset > 0 ? 1 : 0;
    onsetTotal += onset;

    const followRate = band > previous ? 0.18 : 0.06;
    bandEnvelopes[i] = previous + (band - previous) * followRate;
  }

  const beat = clamp01(input.beatPulse);
  const primaryBurst =
    beat > 0.08 && beat > state.lastBeatPulse + 0.03 ? beat : 0;
  const loudness = clamp01(input.loudness);
  const emissionBudget = Math.round(
    primaryBurst * (8 + loudness * 12) +
      onsetTotal * (2 + loudness * 4),
  );

  return {
    initialized: true,
    bandEnvelopes,
    onsetStrengths,
    onsetActive,
    lastBeatPulse: beat,
    primaryBurst,
    emissionBudget,
  };
}

export function integrateFountainParticle(
  particle: FountainParticle,
  dtSec: number,
): FountainParticle {
  if (!particle.active || dtSec <= 0) return particle;

  particle.age += dtSec;
  particle.vy -= particle.gravity * dtSec;
  particle.vx *= Math.exp(-0.7 * dtSec);
  particle.x = clamp01(particle.x + particle.vx * dtSec);
  particle.y += particle.vy * dtSec;
  particle.active =
    particle.age < particle.lifetime &&
    !(particle.y <= 0 && particle.vy <= 0);
  particle.y = particle.active ? Math.max(0, particle.y) : 0;
  return particle;
}
