export type Accent =
  | "violet"
  | "blue"
  | "pink"
  | "orange"
  | "cyan"
  | "teal"
  | "slate";

export type CustomToolColor = `#${string}`;

export type ToolColor = Accent | CustomToolColor;

export type IconType = "official" | "matching" | "monogram";

export type SourceType = "internal" | "external";

export type LinkCheckStatus = "unknown" | "ok" | "warning" | "broken";

/**
 * Matches project.md's "Data and Integration Requirements" — most fields
 * beyond name/url/tags/favorite are unused by the Dashboard screen today
 * but kept here so future screens/backend integration don't need a reshape.
 */
export interface Tool {
  id: string;
  name: string;
  url?: string;
  description?: string;
  mono: string;
  accent: ToolColor;
  tags: string[];
  favorite: boolean;
  sourceType?: SourceType;
  iconKey?: string;
  iconType?: IconType;
  aliases?: string[];
  linkCheckStatus?: LinkCheckStatus;
  checkStatus?: string;
  checkColor?: string;
  lastCheckedAt?: string;
  updatedAt?: string;
  visible?: boolean;
  sortOrder?: number;
}

export interface DecoratedTool extends Tool {
  color: string;
  accentSoft: string;
  accentBorder: string;
  tagStr: string;
}

export interface RecentEntry {
  id: string;
  time: string;
}

export interface TodoTask {
  title: string;
  time: string;
  dot: string;
  done?: boolean;
}

export interface TodoGroup {
  label: string;
  labelColor: string;
  tasks: TodoTask[];
}

export interface CalendarDay {
  day: number;
  muted: boolean;
  today?: boolean;
}

export type PanelId = "qa" | "recent" | "calendar" | "todo";

export type ViewMode = "list" | "grid";
