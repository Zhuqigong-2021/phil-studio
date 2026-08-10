export type AudioReactivityState = {
  loudness: number;
  fastBass: number;
  slowBass: number;
  beatPulse: number;
  cooldownMs: number;
};

export type AudioReactivityInput = {
  rawRms: number;
  rawBass: number;
  dtMs: number;
  playing: boolean;
};

export type ColumnMotionTargets = {
  baseHeights: Float32Array;
  beatImpulses: Float32Array;
};

const BEAT_THRESHOLD = 0.06;
const BEAT_RANGE = 0.28;
const BEAT_COOLDOWN_MS = 180;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const follow = (
  current: number,
  target: number,
  ratePerSecond: number,
  dtMs: number,
) => {
  const alpha = 1 - Math.exp((-ratePerSecond * dtMs) / 1000);
  return current + (target - current) * alpha;
};

export function createAudioReactivityState(): AudioReactivityState {
  return {
    loudness: 0,
    fastBass: 0,
    slowBass: 0,
    beatPulse: 0,
    cooldownMs: 0,
  };
}

export function stepAudioReactivity(
  state: AudioReactivityState,
  input: AudioReactivityInput,
): AudioReactivityState {
  const dtMs = Math.min(100, Math.max(0, input.dtMs));
  const cooldownMs = Math.max(0, state.cooldownMs - dtMs);

  if (!input.playing) {
    return {
      loudness: follow(state.loudness, 0, 6, dtMs),
      fastBass: follow(state.fastBass, 0, 8, dtMs),
      slowBass: follow(state.slowBass, 0, 3, dtMs),
      beatPulse: 0,
      cooldownMs,
    };
  }

  const normalizedLoudness = clamp01((input.rawRms - 0.01) / 0.24);
  const loudnessRate =
    normalizedLoudness > state.loudness ? 12 : 4.5;
  const loudness = follow(
    state.loudness,
    normalizedLoudness,
    loudnessRate,
    dtMs,
  );
  const fastBass = follow(state.fastBass, clamp01(input.rawBass), 24, dtMs);
  const slowBass = follow(state.slowBass, clamp01(input.rawBass), 2, dtMs);
  const transient = fastBass - slowBass;
  const beatStrength = clamp01(
    (transient - BEAT_THRESHOLD) / BEAT_RANGE,
  );
  const decayedPulse = state.beatPulse * Math.exp((-10 * dtMs) / 1000);
  const triggered = cooldownMs === 0 && beatStrength > 0;

  return {
    loudness,
    fastBass,
    slowBass,
    beatPulse: triggered ? Math.max(decayedPulse, beatStrength) : decayedPulse,
    cooldownMs: triggered ? BEAT_COOLDOWN_MS : cooldownMs,
  };
}

export function computeColumnMotionTargets(
  bands: Float32Array,
  loudness: number,
  beatPulse: number,
): ColumnMotionTargets {
  const baseHeights = new Float32Array(bands.length);
  const beatImpulses = new Float32Array(bands.length);
  if (bands.length === 0) return { baseHeights, beatImpulses };

  let minBand = Number.POSITIVE_INFINITY;
  let maxBand = Number.NEGATIVE_INFINITY;
  for (const band of bands) {
    minBand = Math.min(minBand, band);
    maxBand = Math.max(maxBand, band);
  }
  const bandRange = maxBand - minBand;
  const normalizedLoudness = clamp01(loudness);
  const normalizedBeat = clamp01(beatPulse);

  for (let i = 0; i < bands.length; i++) {
    const fallbackContour = 1 - i / Math.max(1, bands.length - 1);
    const relativeBand =
      bandRange > 0.015
        ? (bands[i] - minBand) / bandRange
        : 0.35 + fallbackContour * 0.45;
    const shape = Math.pow(clamp01(relativeBand), 1.85);

    baseHeights[i] = Math.min(
      0.34,
      0.012 + normalizedLoudness * (0.012 + shape * 0.32),
    );
    beatImpulses[i] = Math.min(
      0.62,
      normalizedBeat * (0.035 + shape * 0.58),
    );
  }

  return { baseHeights, beatImpulses };
}
