export interface LyricLine {
  time: number;
  text: string;
}

const TIMED_LINE = /^(\d+):(\d{1,2})(?:\.(\d{1,3}))?\s*(.+)$/;

export function parseLyricsTimeline(source: string): LyricLine[] {
  return source
    .split(/\r?\n/)
    .map((rawLine) => rawLine.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const normalizedLine = line.replace(
        /^\[(\d+:\d{1,2}(?:\.\d{1,3})?)\]/,
        "$1 ",
      );
      const match = TIMED_LINE.exec(normalizedLine);
      if (!match) return [];

      const minutes = Number(match[1]);
      const seconds = Number(match[2]);
      const fraction = match[3] ? Number(`0.${match[3]}`) : 0;
      const text = match[4].trim();
      if (seconds >= 60 || !text) return [];

      return [{ time: minutes * 60 + seconds + fraction, text }];
    })
    .sort((a, b) => a.time - b.time);
}

export function parseLoopingLyricText(source: string): string | undefined {
  if (parseLyricsTimeline(source).length > 0) return undefined;

  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);
}

export function buildLoopingLyricsTimeline(
  text: string,
  durationSeconds: number,
  intervalSeconds = 4,
): LyricLine[] {
  if (!text.trim() || durationSeconds <= 0 || intervalSeconds <= 0) return [];

  const lines: LyricLine[] = [];
  for (let time = 0; time < durationSeconds; time += intervalSeconds) {
    lines.push({ time, text });
  }
  return lines;
}

export function findActiveLyricIndex(
  lines: readonly LyricLine[],
  currentTime: number,
): number {
  let low = 0;
  let high = lines.length - 1;
  let activeIndex = -1;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (lines[middle].time <= currentTime) {
      activeIndex = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return activeIndex;
}

export function shouldShowLyricsAtTime(
  currentTime: number,
  endTime: number | undefined,
): boolean {
  return endTime === undefined || currentTime < endTime;
}
