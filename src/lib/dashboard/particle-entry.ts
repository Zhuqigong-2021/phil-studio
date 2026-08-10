import type { ParticleEntryPattern } from "./lyric-version.ts";

type ParticleEntryInput = {
  pattern: ParticleEntryPattern;
  targetX: number;
  targetY: number;
  width: number;
  scatter: number;
  seed: number;
  depth: number;
};

export function getParticleEntryPosition({
  pattern,
  targetX,
  targetY,
  width,
  scatter,
  seed,
  depth,
}: ParticleEntryInput): { x: number; y: number } {
  if (pattern === "bilateral") {
    const center = width / 2;
    const side = targetX === center ? (seed < 0.5 ? -1 : 1) : targetX < center ? -1 : 1;
    const horizontalDistance = scatter * (0.72 + depth * 0.48);
    const verticalJitter =
      (seed - 0.5) * scatter * 0.22 +
      Math.sin(seed * Math.PI * 2) * scatter * 0.06;

    return {
      x: targetX + side * horizontalDistance,
      y: targetY + verticalJitter,
    };
  }

  const angle = seed * Math.PI * 2;
  const distance = scatter * (0.35 + depth * 0.75);

  return {
    x: targetX + Math.cos(angle) * distance + (seed - 0.5) * scatter * 0.45,
    y: targetY + Math.sin(angle) * distance + (depth - 0.9) * scatter * 0.45,
  };
}
