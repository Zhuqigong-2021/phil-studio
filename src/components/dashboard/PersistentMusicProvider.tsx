"use client";

import * as React from "react";
import { flushSync } from "react-dom";

import { TRACKS } from "@/lib/dashboard/music";
import { readLyricsPreference, writeLyricsPreference } from "@/lib/dashboard/music-preferences";

export type MusicPlayMode = "sequential" | "shuffle" | "repeat-one";

type PersistentMusicContextValue = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  currentIndex: number;
  isPlaying: boolean;
  playMode: MusicPlayMode;
  currentTime: number;
  duration: number;
  volume: number;
  showLyrics: boolean;
  setShowLyrics: React.Dispatch<React.SetStateAction<boolean>>;
  playAt(index: number): void;
  playNext(): void;
  playPrev(): void;
  togglePlay(): void;
  cyclePlayMode(): void;
  seek(time: number): void;
  setVolume(volume: number): void;
};

const PersistentMusicContext = React.createContext<PersistentMusicContextValue | null>(null);

export function PersistentMusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [playMode, setPlayMode] = React.useState<MusicPlayMode>("sequential");
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolumeState] = React.useState(1);
  const [showLyrics, setShowLyricsState] = React.useState(false);

  React.useEffect(() => setShowLyricsState(readLyricsPreference(window.localStorage)), []);

  const setShowLyrics = React.useCallback<React.Dispatch<React.SetStateAction<boolean>>>((next) => {
    setShowLyricsState((current) => {
      const value = typeof next === "function" ? next(current) : next;
      writeLyricsPreference(window.localStorage, value);
      return value;
    });
  }, []);

  const randomIndexExcluding = React.useCallback((exclude: number) => {
    if (TRACKS.length <= 1) return exclude;
    let next = exclude;
    while (next === exclude) next = Math.floor(Math.random() * TRACKS.length);
    return next;
  }, []);

  const playAt = React.useCallback((index: number) => {
    flushSync(() => setCurrentIndex(index));
    void audioRef.current?.play().catch(() => setIsPlaying(false));
  }, []);

  const playNext = React.useCallback(() => {
    playAt(playMode === "shuffle" ? randomIndexExcluding(currentIndex) : (currentIndex + 1) % TRACKS.length);
  }, [currentIndex, playAt, playMode, randomIndexExcluding]);

  const playPrev = React.useCallback(() => {
    playAt(playMode === "shuffle" ? randomIndexExcluding(currentIndex) : (currentIndex - 1 + TRACKS.length) % TRACKS.length);
  }, [currentIndex, playAt, playMode, randomIndexExcluding]);

  const togglePlay = React.useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, []);

  const cyclePlayMode = React.useCallback(() => {
    setPlayMode((mode) => mode === "sequential" ? "shuffle" : mode === "shuffle" ? "repeat-one" : "sequential");
  }, []);

  const seek = React.useCallback((time: number) => {
    if (!audioRef.current || !Number.isFinite(time)) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = React.useCallback((next: number) => {
    const value = Math.min(1, Math.max(0, next));
    setVolumeState(value);
    if (audioRef.current) audioRef.current.volume = value;
  }, []);

  const handleEnded = React.useCallback(() => {
    if (playMode === "repeat-one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        void audioRef.current.play();
      }
    } else {
      playAt(playMode === "shuffle" ? randomIndexExcluding(currentIndex) : (currentIndex + 1) % TRACKS.length);
    }
  }, [currentIndex, playAt, playMode, randomIndexExcluding]);

  return (
    <PersistentMusicContext.Provider value={{
      audioRef, currentIndex, isPlaying, playMode, currentTime, duration, volume,
      showLyrics, setShowLyrics, playAt, playNext, playPrev, togglePlay, cyclePlayMode, seek, setVolume,
    }}>
      {children}
      <audio
        ref={audioRef}
        src={TRACKS[currentIndex].src}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onLoadStart={() => { setCurrentTime(0); setDuration(0); }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        onError={() => setIsPlaying(false)}
      />
    </PersistentMusicContext.Provider>
  );
}

export function usePersistentMusic() {
  const value = React.useContext(PersistentMusicContext);
  if (!value) throw new Error("usePersistentMusic must be used within PersistentMusicProvider");
  return value;
}
