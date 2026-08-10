export function fitParticleTextFontSize(
  requestedSize: number,
  measuredWidth: number,
  maxTextWidth: number,
  minimumSize: number,
): number {
  if (measuredWidth <= maxTextWidth) return requestedSize;

  return Math.max(
    minimumSize,
    requestedSize * (maxTextWidth / measuredWidth),
  );
}
