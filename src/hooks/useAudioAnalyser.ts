"use client";

import { useRef } from "react";

export const AUDIO_BAND_COUNT = 18;

/**
 * Keeps the existing visualizer ref contract without attaching Web Audio to the
 * media element. Native <audio> playback is the only audio path, so browser audio
 * renderer failures cannot mute playback or stall the media clock.
 */
export function useAudioAnalyser(
  audioRef: React.RefObject<HTMLAudioElement | null>,
  isPlaying: boolean,
) {
  void audioRef;
  void isPlaying;
  const bassRef = useRef(0);
  const midRef = useRef(0);
  const trebleRef = useRef(0);
  const energyRef = useRef(0);
  const loudnessRef = useRef(0);
  const beatPulseRef = useRef(0);
  const audioLevelRef = energyRef;
  const bandsRef = useRef(new Float32Array(AUDIO_BAND_COUNT));

  return {
    bassRef,
    midRef,
    trebleRef,
    energyRef,
    loudnessRef,
    beatPulseRef,
    audioLevelRef,
    bandsRef,
  };
}
