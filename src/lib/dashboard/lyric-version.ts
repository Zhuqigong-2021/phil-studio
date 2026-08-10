export type LyricPresentationVersion = "v1" | "v2";
export type ParticleEntryPattern = "diagonal" | "bilateral";

export const ACTIVE_LYRIC_VERSION: LyricPresentationVersion = "v1";

const LYRIC_VERSION_CONFIG = {
  v1: { particleEntryPattern: "diagonal" },
  v2: { particleEntryPattern: "bilateral" },
} as const satisfies Record<
  LyricPresentationVersion,
  { particleEntryPattern: ParticleEntryPattern }
>;

export function getLyricVersionConfig(version: LyricPresentationVersion) {
  return LYRIC_VERSION_CONFIG[version];
}
