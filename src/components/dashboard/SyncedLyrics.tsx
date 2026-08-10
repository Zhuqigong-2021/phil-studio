"use client";

import {
  findActiveLyricIndex,
  shouldShowLyricsAtTime,
  type LyricLine,
} from "@/lib/dashboard/lyrics";
import { getLyricsStageMotion } from "@/app/dashboard/lyrics-progress-motion";
import BlurText from "@/components/dashboard/BlurText";
import ParticleText from "@/components/ParticleText";
import {
  LYRIC_EFFECT_MODE,
  usesBlurLyricLayer,
  usesParticleLyricLayer,
} from "@/lib/dashboard/lyric-effect";
import {
  getBlurHandoffStyle,
  getParticleHandoffStyle,
} from "@/lib/dashboard/lyric-handoff";
import { getLyricLifecycle } from "@/lib/dashboard/lyric-lifecycle";
import {
  ACTIVE_LYRIC_VERSION,
  getLyricVersionConfig,
} from "@/lib/dashboard/lyric-version";

export default function SyncedLyrics({
  lines,
  currentTime,
  fallback,
  endTime,
}: {
  lines: readonly LyricLine[];
  currentTime: number;
  fallback: string;
  endTime?: number;
}) {
  if (!shouldShowLyricsAtTime(currentTime, endTime)) return null;

  const activeIndex = findActiveLyricIndex(lines, currentTime);
  const currentLyric = activeIndex < 0 ? fallback : lines[activeIndex].text;
  const isHybrid = LYRIC_EFFECT_MODE === "hybrid";
  const lineStart = activeIndex < 0 ? 0 : lines[activeIndex].time;
  const lineEnd =
    activeIndex < 0 ? lines[0]?.time : lines[activeIndex + 1]?.time ?? endTime;
  const lifecycle = getLyricLifecycle(lineStart, lineEnd);
  const versionConfig = getLyricVersionConfig(ACTIVE_LYRIC_VERSION);

  return (
    <div
      className="synced-lyrics-stage"
      style={getLyricsStageMotion()}
      role="status"
      aria-live="off"
      aria-label={`Current lyric: ${currentLyric}`}
    >
      <div key={activeIndex} className="synced-lyrics-window">
        <div className="synced-lyrics-line synced-lyrics-line--current">
          <div className="synced-lyrics-handoff" aria-hidden="true">
            {usesParticleLyricLayer(LYRIC_EFFECT_MODE) && (
              <div
                className="synced-lyrics-handoff-layer synced-lyrics-handoff-layer--particle"
                style={
                  isHybrid
                    ? getParticleHandoffStyle()
                    : undefined
                }
              >
                <ParticleText
                  text={currentLyric}
                  className="synced-lyrics-particle-text"
                  particleSize={1.35}
                  density={2}
                  color="#67e8f9"
                  highlightColor="#a855f7"
                  scatter={38}
                  gatherDuration={lifecycle.gatherDurationMs}
                  stagger={160}
                  entryPattern={versionConfig.particleEntryPattern}
                  pointerRepel={10}
                  repelRadius={38}
                  idleDrift={0.18}
                  trigger="mount"
                  fontSize="18px"
                  minFontSize={11}
                  fontWeight={700}
                  glow
                  style={{}}
                />
              </div>
            )}
            {usesBlurLyricLayer(LYRIC_EFFECT_MODE) && (
              <div
                className="synced-lyrics-handoff-layer synced-lyrics-handoff-layer--blur"
                style={
                  isHybrid
                    ? getBlurHandoffStyle(
                        lifecycle.blurExitDelayMs,
                        lifecycle.blurExitDurationMs,
                      )
                    : undefined
                }
              >
                <BlurText
                  text={currentLyric}
                  className="synced-lyrics-current-core"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
