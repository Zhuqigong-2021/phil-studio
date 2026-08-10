export type DecodedSpectrumFrame = {
  rms: number;
  bass: number;
  mid: number;
  treble: number;
  energy: number;
};

const WINDOW_SIZE = 1024;
const MIN_FREQUENCY = 40;
const MAX_FREQUENCY = 12_000;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function writeDecodedAudioSpectrum(
  channels: readonly Float32Array[],
  sampleRate: number,
  centerSample: number,
  target: Float32Array,
): DecodedSpectrumFrame {
  if (channels.length === 0 || target.length === 0 || sampleRate <= 0) {
    target.fill(0);
    return { rms: 0, bass: 0, mid: 0, treble: 0, energy: 0 };
  }

  const start = Math.max(0, Math.round(centerSample - WINDOW_SIZE / 2));
  const mono = new Float32Array(WINDOW_SIZE);
  let squareSum = 0;
  for (let offset = 0; offset < WINDOW_SIZE; offset++) {
    let sample = 0;
    for (const channel of channels) sample += channel[start + offset] ?? 0;
    sample /= channels.length;
    const windowed = sample * (0.5 - 0.5 * Math.cos((2 * Math.PI * offset) / (WINDOW_SIZE - 1)));
    mono[offset] = windowed;
    squareSum += sample * sample;
  }

  let bass = 0;
  let bassCount = 0;
  let mid = 0;
  let midCount = 0;
  let treble = 0;
  let trebleCount = 0;
  let energy = 0;
  const maxFrequency = Math.min(MAX_FREQUENCY, sampleRate / 2 - 1);

  for (let band = 0; band < target.length; band++) {
    const frequency = MIN_FREQUENCY * Math.pow(
      maxFrequency / MIN_FREQUENCY,
      (band + 0.5) / target.length,
    );
    const coefficient = 2 * Math.cos((2 * Math.PI * frequency) / sampleRate);
    let previous = 0;
    let previousTwo = 0;
    for (let index = 0; index < mono.length; index++) {
      const current = mono[index] + coefficient * previous - previousTwo;
      previousTwo = previous;
      previous = current;
    }
    const power = previousTwo * previousTwo + previous * previous - coefficient * previous * previousTwo;
    const magnitude = clamp01((Math.sqrt(Math.max(0, power)) / (WINDOW_SIZE * 0.25)) * 1.8);
    target[band] = magnitude;
    energy += magnitude;
    if (frequency < 250) {
      bass += magnitude;
      bassCount++;
    } else if (frequency < 2000) {
      mid += magnitude;
      midCount++;
    } else {
      treble += magnitude;
      trebleCount++;
    }
  }

  return {
    rms: Math.sqrt(squareSum / WINDOW_SIZE),
    bass: bass / Math.max(1, bassCount),
    mid: mid / Math.max(1, midCount),
    treble: treble / Math.max(1, trebleCount),
    energy: energy / target.length,
  };
}
