export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  color: string;
  cover?: string;
  lyricsSlug?: string;
  lyricsEndTime?: number;
  lyricsLoop?: boolean;
}

const TRACK_COLORS = ["#9a70ff", "#55a7ff", "#f062a2", "#36d399", "#39c8e8", "#ffb545", "#ff7a31", "#2dd4bf"];

// "Artist - Title.mp3" splits on the first dash; anything without a dash is just a title.
// A few source filenames are messy (stray ".128", all-lowercase english titles, trailing
// spaces) — cleaned up by hand below rather than over-engineering the parser for them.
const RAW_TRACKS: { file: string; title: string; artist: string; cover?: string; lyricsSlug?: string; lyricsEndTime?: number; lyricsLoop?: boolean }[] = [
  { file: "Monsters-Timeflies&Katie Sky.mp3", title: "Monsters", artist: "Timeflies & Katie Sky", cover: "/music/covers/Monsters.png", lyricsSlug: "Monsters" },
  { file: "S.H.E-Ring Ring Ring .mp3", title: "Ring Ring Ring", artist: "S.H.E", cover: "/music/covers/ringringring.png", lyricsSlug: "ringringring", lyricsEndTime: 194 },
  { file: "attraction.mp3", title: "Attraction", artist: "小泽正澄", cover: "/music/covers/Attraction.png", lyricsSlug: "Attraction", lyricsLoop: true },
  { file: "soldout.mp3", title: "Sold Out", artist: "Hawk Nelson, Jonathan Steingard", cover: "/music/covers/soldout.png", lyricsSlug: "soldout" },
  { file: "superstar.mp3", title: "Super Star", artist: "S.H.E", cover: "/music/covers/superstar.png", lyricsSlug: "superstar" },
  { file: "the shape of u.mp3", title: "Shape of You", artist: "Ed Sheeran", cover: "/music/covers/shapeofu.png", lyricsSlug: "shapeofyou" },
  { file: "unstoppable.mp3", title: "Unstoppable", artist: "Sia", cover: "/music/covers/Unstoppable.png", lyricsSlug: "Unstoppable" },
  { file: "wake.MP3", title: "Wake", artist: "Hillsong Young", cover: "/music/covers/Wake.png", lyricsSlug: "Wake" },
  { file: "weareeletric.MP3", title: "We Are Electric", artist: "Flying Steps", cover: "/music/covers/weareelectric.png", lyricsSlug: "Weareelectric", lyricsLoop: true },
  { file: "中国话.mp3", title: "中国话", artist: "S.H.E", cover: "/music/covers/中国话.png", lyricsSlug: "中国话" },
  { file: "人族.mp3", title: "人族", artist: "Unknown Artist", cover: "/music/covers/人族.png", lyricsSlug: "人族", lyricsLoop: true },
  { file: "北极星的眼泪.mp3", title: "北极星的眼泪", artist: "张栋梁", cover: "/music/covers/北极星的眼泪.png", lyricsSlug: "北极星的眼泪" },
  { file: "千山万水-周杰伦.mp3", title: "千山万水", artist: "周杰伦", cover: "/music/covers/千山万水.png", lyricsSlug: "千山万水" },
  { file: "只对你有感觉(Remix)-田馥甄,飞轮海.128.mp3", title: "只对你有感觉 (Remix)", artist: "田馥甄, 飞轮海", cover: "/music/covers/只对你有感觉.png", lyricsSlug: "只对你有感觉" },
  { file: "对峙.mp3", title: "对峙", artist: "Unknown Artist", cover: "/music/covers/对峙.png", lyricsSlug: "对峙", lyricsLoop: true },
  { file: "斗牛要不要.mp3", title: "斗牛，要不要", artist: "Tank", cover: "/music/covers/斗牛要不要.png", lyricsSlug: "斗牛要不要" },
  { file: "最好地安排.MP3", title: "最好的安排", artist: "曲婉婷", cover: "/music/covers/最好的安排.png", lyricsSlug: "最好的安排" },
  { file: "遗憾.MP3", title: "遗憾", artist: "麦振鸿", cover: "/music/covers/遗憾.png", lyricsSlug: "遗憾", lyricsLoop: true },
  { file: "黄种人.mp3", title: "黄种人", artist: "谢霆锋", cover: "/music/covers/黄种人.png", lyricsSlug: "黄种人" },
  { file: "七里香.mp3", title: "七里香", artist: "周杰伦", cover: "/music/covers/七里香.png", lyricsSlug: "七里香" },
  { file: "黑色毛衣.mp3", title: "黑色毛衣", artist: "周杰伦", cover: "/music/covers/黑色毛衣.png", lyricsSlug: "黑色毛衣" },
];

export const TRACKS: Track[] = RAW_TRACKS.map((t, i) => ({
  id: `track-${i}`,
  title: t.title,
  artist: t.artist,
  src: encodeURI(`/music/${t.file}`),
  color: TRACK_COLORS[i % TRACK_COLORS.length],
  cover: t.cover ? encodeURI(t.cover) : undefined,
  lyricsSlug: t.lyricsSlug,
  lyricsEndTime: t.lyricsEndTime,
  lyricsLoop: t.lyricsLoop,
}));
