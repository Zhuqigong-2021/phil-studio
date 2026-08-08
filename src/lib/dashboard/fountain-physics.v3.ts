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

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

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
  particle.x = clamp01(particle.x + particle.vx * dtSec);
  particle.y += particle.vy * dtSec;
  particle.active =
    particle.age < particle.lifetime &&
    !(particle.y <= 0 && particle.vy <= 0);
  particle.y = particle.active ? Math.max(0, particle.y) : 0;
  return particle;
}
