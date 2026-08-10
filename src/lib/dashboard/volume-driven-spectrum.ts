const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function writeVolumeDrivenSpectrum(
  timeMs: number,
  volume: number,
  playing: boolean,
  target: Float32Array,
): Float32Array {
  const strength = playing ? clamp01(volume) : 0;
  if (strength === 0) {
    target.fill(0);
    return target;
  }

  const time = timeMs / 1000;
  for (let index = 0; index < target.length; index++) {
    const position = target.length <= 1 ? 0 : index / (target.length - 1);
    const broadPulse = 0.5 + 0.5 * Math.sin(time * 5.2 - position * 5.6);
    const finePulse = 0.5 + 0.5 * Math.sin(time * 8.7 + index * 1.73);
    const centerLift = 1 - Math.abs(position - 0.5) * 0.38;
    target[index] = clamp01(
      strength * centerLift * (0.28 + broadPulse * 0.5 + finePulse * 0.22),
    );
  }
  return target;
}
