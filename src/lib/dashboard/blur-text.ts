export const LYRIC_BLUR_KEYFRAMES = {
  filter: ["blur(6px)", "blur(2px)", "blur(0px)"],
  opacity: [0, 0.55, 1],
  y: [6, 1, 0],
} as const;

export function splitBlurText(text: string): string[] {
  return Array.from(text, (character) =>
    character === " " ? "\u00a0" : character,
  );
}

const LYRIC_NEON_STOPS = [
  [99, 102, 241],
  [56, 189, 248],
  [34, 211, 238],
  [129, 140, 248],
  [192, 132, 252],
] as const;

export function getLyricNeonColor(index: number, total: number): string {
  if (total <= 1) return "rgb(34 211 238)";

  const position = (Math.max(0, Math.min(index, total - 1)) / (total - 1)) *
    (LYRIC_NEON_STOPS.length - 1);
  const leftIndex = Math.floor(position);
  const rightIndex = Math.min(leftIndex + 1, LYRIC_NEON_STOPS.length - 1);
  const mix = position - leftIndex;
  const color = LYRIC_NEON_STOPS[leftIndex].map((channel, channelIndex) =>
    Math.round(channel + (LYRIC_NEON_STOPS[rightIndex][channelIndex] - channel) * mix),
  );

  return `rgb(${color.join(" ")})`;
}
