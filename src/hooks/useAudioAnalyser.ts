"use client";

import { useEffect, useRef } from "react";

import {
  createAudioReactivityState,
  stepAudioReactivity,
} from "@/lib/dashboard/audio-reactivity";

/** Number of spectrum bars exposed via `bandsRef` — a real bar/column visualizer reads
 * as distinct bars, so this needs to be a small, legible count, not hundreds of bins. */
export const AUDIO_BAND_COUNT = 18;

/**
 * Attaches a single Web Audio AnalyserNode to an existing <audio> element and exposes
 * live-smoothed audio levels as refs — not React state, since these update every
 * animation frame and driving that through state would re-render whatever's watching
 * them 60x/sec.
 *
 * - `bandsRef`: a Float32Array(AUDIO_BAND_COUNT) spectrum, log-spaced across ~40Hz-12kHz
 *   (how a real bar-style visualizer splits frequencies — bass gets narrow bins since
 *   most energy lives there, treble gets wide ones) — this is what a column/bar
 *   visualizer should read per-bar.
 * - `bassRef`/`midRef`/`trebleRef`/`energyRef`: coarser single-value summaries, kept for
 *   consumers that just want an overall feel rather than per-bar detail.
 *
 * Each value has VU-meter-style ballistics baked in (fast attack, slower release) so the
 * visual punches up on a hit and settles back down, rather than either snapping instantly
 * to raw FFT data or smoothly blurring into a wave — that's what actually reads as
 * "rhythm" rather than either jitter or a flowing blob.
 *
 * The media element keeps its native output path. Web Audio receives a captured stream
 * only for analysis, so a browser audio-renderer failure cannot take the actual music
 * output down with the visualizer.
 */
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
  // Kept as an alias of energyRef for existing consumers (AmbientVolumeWaveform, etc.)
  // built against the single-value API before this hook existed.
  const audioLevelRef = energyRef;
  const bandsRef = useRef(new Float32Array(AUDIO_BAND_COUNT));
  const reactivityStateRef = useRef(createAudioReactivityState());

  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const graphInitedRef = useRef(false);

  useEffect(() => {
    const initializeAudioGraph = () => {
      const audio = audioRef.current;
      if (!audio || graphInitedRef.current) return;
      graphInitedRef.current = true;
      window.removeEventListener("pointerdown", initializeAudioGraph);
      window.removeEventListener("keydown", initializeAudioGraph);

      try {
        type AudioCtorWindow = Window & {
          webkitAudioContext?: typeof AudioContext;
        };
        const AudioCtx =
          window.AudioContext ?? (window as AudioCtorWindow).webkitAudioContext;
        if (!AudioCtx) return;
        const audioWithCapture = audio as HTMLAudioElement & {
          captureStream?: () => MediaStream;
          mozCaptureStream?: () => MediaStream;
        };
        const mediaStream =
          audioWithCapture.captureStream?.() ??
          audioWithCapture.mozCaptureStream?.();
        if (!mediaStream) return;
        const ctx = new AudioCtx();
        const source = ctx.createMediaStreamSource(mediaStream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.4; // light native smoothing; ballistics applied again in JS below
        // The analyser intentionally has no connection to ctx.destination. Native
        // <audio> playback remains the only output path; this graph only reads levels.
        source.connect(analyser);
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        void ctx.resume().catch(() => {});
      } catch {
        // Web Audio unavailable (unsupported browser, blocked, etc.) — refs just stay at
        // 0 forever and reactive visuals fall back to their idle/ambient state.
      }
    };

    window.addEventListener("pointerdown", initializeAudioGraph);
    window.addEventListener("keydown", initializeAudioGraph);
    return () => {
      window.removeEventListener("pointerdown", initializeAudioGraph);
      window.removeEventListener("keydown", initializeAudioGraph);
    };
  }, [audioRef]);

  useEffect(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    if (!isPlaying) {
      // Decay smoothly toward 0 instead of snapping, so a "pause" visual can settle
      // rather than cut. Runs for a short window then stops (no point animating a
      // rAF loop forever once everything's already ~0).
      let frameId: number;
      const decay = () => {
        bassRef.current *= 0.9;
        midRef.current *= 0.9;
        trebleRef.current *= 0.9;
        energyRef.current *= 0.9;
        reactivityStateRef.current = stepAudioReactivity(
          reactivityStateRef.current,
          { rawRms: 0, rawBass: 0, dtMs: 16, playing: false },
        );
        loudnessRef.current = reactivityStateRef.current.loudness;
        beatPulseRef.current = reactivityStateRef.current.beatPulse;
        const bands = bandsRef.current;
        let settled =
          bassRef.current < 0.002 &&
          midRef.current < 0.002 &&
          trebleRef.current < 0.002 &&
          energyRef.current < 0.002 &&
          loudnessRef.current < 0.002;
        for (let i = 0; i < bands.length; i++) {
          bands[i] *= 0.9;
          if (bands[i] >= 0.002) settled = false;
        }
        if (!settled) frameId = requestAnimationFrame(decay);
      };
      frameId = requestAnimationFrame(decay);
      return () => cancelAnimationFrame(frameId);
    }

    void audioCtxRef.current?.resume();

    const data = new Uint8Array(analyser.frequencyBinCount);
    const timeData = new Uint8Array(analyser.fftSize);
    const sampleRate = audioCtxRef.current?.sampleRate ?? 44100;
    const binHz = sampleRate / 2 / analyser.frequencyBinCount;
    const bassEndBin = Math.max(1, Math.round(250 / binHz));
    const midEndBin = Math.max(bassEndBin + 1, Math.round(2000 / binHz));
    const trebleEndBin = Math.min(
      analyser.frequencyBinCount,
      Math.max(midEndBin + 1, Math.round(8000 / binHz)),
    );

    const bandAverage = (from: number, to: number) => {
      let sum = 0;
      for (let i = from; i < to; i++) sum += data[i];
      const count = Math.max(1, to - from);
      return sum / count / 255;
    };

    // Log-spaced bin edges for the AUDIO_BAND_COUNT spectrum bars, ~40Hz to ~12kHz —
    // the standard range/curve a bar-style visualizer uses so low bars aren't all
    // crammed into 2 bins while high bars are all noise-floor flicker.
    const specMinHz = 40;
    const specMaxHz = Math.min(12000, sampleRate / 2);
    const binEdges: number[] = [];
    for (let i = 0; i <= AUDIO_BAND_COUNT; i++) {
      const f =
        specMinHz * Math.pow(specMaxHz / specMinHz, i / AUDIO_BAND_COUNT);
      binEdges.push(
        Math.min(
          analyser.frequencyBinCount - 1,
          Math.max(0, Math.round(f / binHz)),
        ),
      );
    }

    let frameId: number;
    let lastFrameTime = performance.now();
    const tick = () => {
      analyser.getByteFrequencyData(data);
      analyser.getByteTimeDomainData(timeData);

      let squareSum = 0;
      for (let i = 0; i < timeData.length; i++) {
        const centered = (timeData[i] - 128) / 128;
        squareSum += centered * centered;
      }
      const rms = Math.sqrt(squareSum / timeData.length);
      const now = performance.now();
      const dtMs = Math.min(100, Math.max(0, now - lastFrameTime));
      lastFrameTime = now;

      const bass = bandAverage(0, bassEndBin);
      const mid = bandAverage(bassEndBin, midEndBin);
      const treble = bandAverage(midEndBin, trebleEndBin);
      const energy = bandAverage(0, analyser.frequencyBinCount);
      reactivityStateRef.current = stepAudioReactivity(
        reactivityStateRef.current,
        { rawRms: rms, rawBass: bass, dtMs, playing: true },
      );
      loudnessRef.current = reactivityStateRef.current.loudness;
      beatPulseRef.current = reactivityStateRef.current.beatPulse;

      // Fast attack / slow release ballistics — a hit punches the value up quickly,
      // then it eases back down, instead of either snapping to raw FFT noise or
      // smoothly blurring like a lerp toward the target in both directions. This is
      // what makes it read as *rhythm* rather than jitter or a flowing wave.
      const followBass = (v: number) =>
        (bassRef.current +=
          (v - bassRef.current) * (v > bassRef.current ? 0.45 : 0.1));
      const followMid = (v: number) =>
        (midRef.current +=
          (v - midRef.current) * (v > midRef.current ? 0.5 : 0.14));
      const followTreble = (v: number) =>
        (trebleRef.current +=
          (v - trebleRef.current) * (v > trebleRef.current ? 0.6 : 0.2));
      const followEnergy = (v: number) =>
        (energyRef.current +=
          (v - energyRef.current) * (v > energyRef.current ? 0.4 : 0.12));
      followBass(bass);
      followMid(mid);
      followTreble(treble);
      followEnergy(energy);

      const bands = bandsRef.current;
      for (let i = 0; i < AUDIO_BAND_COUNT; i++) {
        const level = bandAverage(binEdges[i], Math.max(binEdges[i] + 1, binEdges[i + 1]));
        const rate = level > bands[i] ? 0.5 : 0.12;
        bands[i] += (level - bands[i]) * rate;
      }

      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying]);

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
