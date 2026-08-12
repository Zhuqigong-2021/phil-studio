const LYRICS_PREFERENCE_KEY = "phil-studio:music:show-lyrics";

export interface MusicPreferenceStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function readLyricsPreference(storage: MusicPreferenceStorage | null) {
  try {
    return storage?.getItem(LYRICS_PREFERENCE_KEY) === "true";
  } catch {
    return false;
  }
}

export function writeLyricsPreference(storage: MusicPreferenceStorage | null, value: boolean) {
  try {
    storage?.setItem(LYRICS_PREFERENCE_KEY, String(value));
  } catch {
    // Browsers may block storage in privacy-restricted contexts.
  }
}
