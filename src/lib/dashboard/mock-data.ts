import type {
  Accent,
  CalendarDay,
  DecoratedTool,
  RecentEntry,
  Tool,
  ToolColor,
  TodoGroup,
} from "./types";

export const ACCENTS: Record<Accent, string> = {
  violet: "#8B5CF6",
  blue: "#3B82F6",
  pink: "#EC4899",
  orange: "#F97316",
  cyan: "#06B6D4",
  teal: "#14B8A6",
  slate: "#64748B",
};

export const ACCENT_RGB: Record<Accent, string> = {
  violet: "139,92,246",
  blue: "59,130,246",
  pink: "236,72,153",
  orange: "249,115,22",
  cyan: "6,182,212",
  teal: "20,184,166",
  slate: "100,116,139",
};

export const TOOLS_RAW: Tool[] = [
  { id: "ap", name: "Arts Portfolio", mono: "AP", accent: "violet", tags: ["Design", "Work"], aliases: ["portfolio", "art portfolio"], favorite: true, sourceType: "internal", iconKey: "palette", iconType: "matching", url: "https://phil-art-vercel-deploy.vercel.app/", checkStatus: "Working", checkColor: "#4ADE80" },
  { id: "cv", name: "Online CV", mono: "CV", accent: "blue", tags: ["Work"], aliases: ["resume", "résumé"], favorite: false, sourceType: "internal", iconKey: "contact", iconType: "matching", url: "https://philzhu-work-onlinecv.vercel.app/", checkStatus: "Working", checkColor: "#4ADE80" },
  { id: "ps", name: "Online PS", mono: "PS", accent: "pink", tags: ["Design", "Productivity"], aliases: ["photoshop", "photo editor"], favorite: true, sourceType: "internal", iconKey: "image", iconType: "matching", url: "https://photoshop-web-ten.vercel.app/", checkStatus: "Working", checkColor: "#4ADE80" },
  { id: "pdf", name: "Online PDF Editor", mono: "PD", accent: "orange", tags: ["Productivity", "Work"], aliases: ["pdf editor", "pdf tool"], favorite: false, sourceType: "internal", iconKey: "file-text", iconType: "matching", url: "https://pdf-editor-two-tau.vercel.app/", checkStatus: "Working", checkColor: "#4ADE80" },
  { id: "am", name: "Animation Maker", mono: "AM", accent: "cyan", tags: ["Design"], aliases: ["whiteboard animation", "video maker"], favorite: false, sourceType: "internal", iconKey: "clapperboard", iconType: "matching", url: "https://videoscribe-html.vercel.app/", checkStatus: "Working", checkColor: "#4ADE80" },
  { id: "mm", name: "Mindmap", mono: "MM", accent: "teal", tags: ["Productivity", "Learn"], aliases: ["mind map", "brainstorm"], favorite: false, sourceType: "internal", iconKey: "chart-network", iconType: "matching", url: "https://mindstudio-tool.vercel.app/", checkStatus: "Working", checkColor: "#4ADE80" },
  { id: "sm", name: "StudyMate", mono: "SM", accent: "teal", tags: ["ServiceNow", "Learn"], aliases: ["exam prep", "study assistant"], favorite: true, sourceType: "internal", iconKey: "graduation-cap", iconType: "matching", url: "https://study-mate-for-exam.vercel.app/", checkStatus: "Working", checkColor: "#4ADE80" },
  { id: "no", name: "Notion", mono: "N", accent: "slate", tags: ["Productivity", "Work"], aliases: ["notes", "knowledge base"], favorite: true, sourceType: "external", iconKey: "book-open-text", iconType: "matching", url: "https://app.notion.com/", checkStatus: "Working", checkColor: "#4ADE80" },
  { id: "ai", name: "AI Agent Learning Notes", mono: "AI", accent: "violet", tags: ["AI", "Learn"], aliases: ["agent notes", "ai learning"], favorite: false, sourceType: "internal", iconKey: "brain-circuit", iconType: "matching", checkStatus: "Unknown", checkColor: "#7C8698" },
];

export const TAGS = [
  "AI",
  "Design",
  "ServiceNow",
  "Automation",
  "Productivity",
  "Developer",
  "Work",
  "Learn",
] as const;

export const RECENT: RecentEntry[] = [
  { id: "sm", time: "Yesterday" },
  { id: "mm", time: "2 days ago" },
  { id: "ap", time: "3 days ago" },
  { id: "cv", time: "1 week ago" },
];

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DOT_DAYS: Record<number, string> = {
  3: "#F59E0B",
  10: "#67E8F9",
  17: "#F59E0B",
  24: "#67E8F9",
  29: "#67E8F9",
  30: "#F59E0B",
};

export interface DecoratedCalendarDay {
  day: number;
  color: string;
  bg: string;
  glow: string;
  weight: number;
  hasDot: boolean;
  dotColor: string;
}

export function buildCalendar(): DecoratedCalendarDay[] {
  const days: CalendarDay[] = [];
  const juneTail = [29, 30];
  juneTail.forEach((d) => days.push({ day: d, muted: true }));
  for (let d = 1; d <= 31; d++) days.push({ day: d, muted: false, today: d === 19 });
  let augDay = 1;
  while (days.length < 42) days.push({ day: augDay++, muted: true });

  return days.map((d) => ({
    day: d.day,
    color: d.today ? "#FFFFFF" : d.muted ? "#4B5878" : "#F2F6FF",
    bg: d.today ? "linear-gradient(135deg,rgba(37,99,235,.82) 0%,rgba(79,70,229,.76) 100%)" : "transparent",
    glow: d.today ? "inset 0 1px 0 rgba(219,234,254,.22), 0 0 0 1px rgba(147,197,253,.46), 0 4px 10px rgba(30,64,175,.20)" : "none",
    weight: d.today ? 700 : 500,
    hasDot: !d.muted && !!DOT_DAYS[d.day],
    dotColor: DOT_DAYS[d.day] || "transparent",
  }));
}

export const TODO_RAW: TodoGroup[] = [
  {
    label: "Today",
    labelColor: "#F2F6FF",
    tasks: [{ title: "Review UI ideas for Online PS", time: "14:00", dot: "#F59E0B" }],
  },
  {
    label: "Tomorrow",
    labelColor: "#F59E0B",
    tasks: [{ title: "Update StudyMate content", time: "10:00", dot: "#EC4899" }],
  },
  {
    label: "This Week",
    labelColor: "#F59E0B",
    tasks: [
      { title: "Prepare portfolio case study", time: "Jul 22", dot: "#F59E0B" },
      { title: "Fix bug in PDF Editor", time: "Jul 25", dot: "#3B82F6" },
    ],
  },
];

export function decorate(tool: Tool): DecoratedTool {
  const color = ACCENTS[tool.accent as Accent] ?? tool.accent;
  const rgb = toolColorRgb(tool.accent);
  return {
    ...tool,
    color,
    accentSoft: `rgba(${rgb},0.18)`,
    accentBorder: `rgba(${rgb},0.35)`,
    tagStr:
      tool.tags.slice(0, 2).join(" · ") +
      (tool.tags.length > 2 ? ` +${tool.tags.length - 2}` : ""),
  };
}

export function toolColorRgb(color: ToolColor): string {
  const namedAccent = ACCENT_RGB[color as Accent];
  if (namedAccent) return namedAccent;
  const hex = color.slice(1);
  return `${parseInt(hex.slice(0, 2), 16)},${parseInt(hex.slice(2, 4), 16)},${parseInt(hex.slice(4, 6), 16)}`;
}
