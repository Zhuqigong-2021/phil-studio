"use client";

import { useEffect, useRef } from "react";

import {
  createAudioReactivityState,
  stepAudioReactivity,
} from "@/lib/dashboard/audio-reactivity";
import { writeDecodedAudioSpectrum } from "@/lib/dashboard/decoded-audio-spectrum";

export const AUDIO_BAND_COUNT = 18;

type DecodedTrack = {
  channels: Float32Array[];
  sampleRate: number;
};

const decodedTrackCache = new Map<string, Promise<DecodedTrack>>();

async function decodeTrack(source: string): Promise<DecodedTrack> {
  const cached = decodedTrackCache.get(source);
  if (cached) return cached;

  const pending = (async () => {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`Unable to decode audio: ${response.status}`);
    const encoded = await response.arrayBuffer();
    const context = new OfflineAudioContext(1, 1, 44_100);
    const buffer = await context.decodeAudioData(encoded);
    const channels = Array.from({ length: buffer.numberOfChannels }, (_, index) =>
      buffer.getChannelData(index),
    );
    return { channels, sampleRate: buffer.sampleRate };
  })();
  decodedTrackCache.set(source, pending);
  try {
    return await pending;
  } catch (error) {
    decodedTrackCache.delete(source);
    throw error;
  }
}

export function useAudioAnalyser(
  audioRef: React.RefObject<HTMLAudioElement | null>,
  isPlaying: boolean,
) {
  const bassRef = useRef(0);
  const midRef = useRef(0);
  const trebleRef = useRef(0);
  const energyRef = useRef(0);
  const loudnessRef = useRef(0);
  const beatPulseRef = useRef(0);
  const audioLevelRef = energyRef;
  const bandsRef = useRef(new Float32Array(AUDIO_BAND_COUNT));
  const decodedRef = useRef<DecodedTrack | null>(null);
  const reactivityStateRef = useRef(createAudioReactivityState());

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let requestSerial = 0;

    const loadDecodedTrack = () => {
      const source = audio.currentSrc || audio.src;
      if (!source) return;
      const serial = ++requestSerial;
      decodedRef.current = null;
      bandsRef.current.fill(0);
      void decodeTrack(source)
        .then((decoded) => {
          if (serial === requestSerial) decodedRef.current = decoded;
        })
        .catch(() => {
          if (serial === requestSerial) decodedRef.current = null;
        });
    };

    audio.addEventListener("loadstart", loadDecodedTrack);
    loadDecodedTrack();
    return () => {
      requestSerial++;
      audio.removeEventListener("loadstart", loadDecodedTrack);
    };
  }, [audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let frameId = 0;
    let lastFrameTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const dtMs = Math.min(100, Math.max(0, now - lastFrameTime));
      lastFrameTime = now;
      const decoded = decodedRef.current;
      const rawBands = new Float32Array(AUDIO_BAND_COUNT);
      const frame = decoded
        ? writeDecodedAudioSpectrum(
            decoded.channels,
            decoded.sampleRate,
            audio.currentTime * decoded.sampleRate,
            rawBands,
          )
        : { rms: 0, bass: 0, mid: 0, treble: 0, energy: 0 };

      const follow = (current: number, value: number, attack: number, release: number) =>
        current + (value - current) * (value > current ? attack : release);
      bassRef.current = follow(bassRef.current, frame.bass, 0.45, 0.1);
      midRef.current = follow(midRef.current, frame.mid, 0.5, 0.14);
      trebleRef.current = follow(trebleRef.current, frame.treble, 0.6, 0.2);
      energyRef.current = follow(energyRef.current, frame.energy, 0.4, 0.12);

      reactivityStateRef.current = stepAudioReactivity(
        reactivityStateRef.current,
        { rawRms: frame.rms, rawBass: frame.bass, dtMs, playing: isPlaying },
      );
      loudnessRef.current = reactivityStateRef.current.loudness;
      beatPulseRef.current = reactivityStateRef.current.beatPulse;

      const bands = bandsRef.current;
      for (let index = 0; index < bands.length; index++) {
        const level = rawBands[index] ?? 0;
        bands[index] += (level - bands[index]) * (level > bands[index] ? 0.5 : 0.12);
      }

      const settled = !isPlaying &&
        energyRef.current < 0.002 &&
        loudnessRef.current < 0.002 &&
        bands.every((band) => band < 0.002);
      if (!settled) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [audioRef, isPlaying]);

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
