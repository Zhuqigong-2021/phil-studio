import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  AudioLines,
  BadgeCheck,
  Bell,
  Bot,
  Bookmark,
  Braces,
  BriefcaseBusiness,
  Brush,
  Bug,
  Building2,
  CalendarDays,
  Camera,
  ChartNoAxesColumnIncreasing,
  ChartPie,
  CheckCircle2,
  CirclePlus,
  Clapperboard,
  ClipboardList,
  Clock,
  Cloud,
  Code2,
  Compass,
  Contact,
  Cpu,
  Crop,
  Database,
  Disc3,
  Download,
  ExternalLink,
  File,
  FileArchive,
  FileAudio,
  FileCode2,
  FileImage,
  Files,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Film,
  Folder,
  FolderOpen,
  Frame,
  GalleryHorizontal,
  Gift,
  GitBranch,
  GitPullRequest,
  Globe2,
  Hammer,
  Headphones,
  Heart,
  Home,
  Image,
  Kanban,
  KeyRound,
  Layers3,
  Lightbulb,
  Link,
  ListTodo,
  LockKeyhole,
  Mail,
  Map as MapIcon,
  MapPin,
  Mic,
  Music,
  Package,
  Palette,
  Paperclip,
  Pause,
  PenTool,
  Pencil,
  Phone,
  Pipette,
  Play,
  Podcast,
  Presentation,
  Radio,
  Rocket,
  Save,
  Search,
  Server,
  Settings,
  Shapes,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  SwatchBook,
  Target,
  Terminal,
  TrendingUp,
  Upload,
  User,
  Users,
  Video,
  Volume2,
  WandSparkles,
  Webhook,
  Workflow,
  Wrench,
} from "lucide-react";

export const ICON_CATEGORIES = [
  "Popular",
  "Work",
  "Design",
  "Code",
  "Media",
  "Files",
  "Objects",
] as const;

export type ToolIconCategory = (typeof ICON_CATEGORIES)[number];

export interface ToolIconDefinition {
  key: string;
  label: string;
  category: ToolIconCategory;
  keywords: readonly string[];
  Icon: LucideIcon;
}

function defineIcon(
  key: string,
  label: string,
  category: ToolIconCategory,
  Icon: LucideIcon,
  keywords: readonly string[] = [],
): ToolIconDefinition {
  return { key, label, category, Icon, keywords };
}

export const TOOL_ICONS = [
  defineIcon("app-window", "App Window", "Popular", AppWindow, ["应用", "工具"]),
  defineIcon("home", "Home", "Popular", Home, ["首页", "主页"]),
  defineIcon("search", "Search", "Popular", Search, ["搜索", "查找"]),
  defineIcon("settings", "Settings", "Popular", Settings, ["设置", "配置"]),
  defineIcon("star", "Star", "Popular", Star, ["星标", "收藏"]),
  defineIcon("heart", "Heart", "Popular", Heart, ["喜欢", "收藏"]),
  defineIcon("bookmark", "Bookmark", "Popular", Bookmark, ["书签", "保存"]),
  defineIcon("user", "User", "Popular", User, ["用户", "个人"]),
  defineIcon("users", "Users", "Popular", Users, ["用户组", "团队"]),
  defineIcon("bell", "Bell", "Popular", Bell, ["通知", "提醒"]),
  defineIcon("calendar-days", "Calendar", "Popular", CalendarDays, ["日历", "日期"]),
  defineIcon("clock", "Clock", "Popular", Clock, ["时间", "计时"]),
  defineIcon("check-circle", "Check Circle", "Popular", CheckCircle2, ["完成", "成功"]),
  defineIcon("circle-plus", "Add", "Popular", CirclePlus, ["新增", "创建"]),
  defineIcon("external-link", "External Link", "Popular", ExternalLink, ["外部链接", "打开"]),
  defineIcon("link", "Link", "Popular", Link, ["链接", "网址"]),

  defineIcon("briefcase-business", "Briefcase", "Work", BriefcaseBusiness, ["工作", "business", "office"]),
  defineIcon("building", "Building", "Work", Building2, ["公司", "企业", "office"]),
  defineIcon("presentation", "Presentation", "Work", Presentation, ["演示", "幻灯片"]),
  defineIcon("bar-chart", "Bar Chart", "Work", ChartNoAxesColumnIncreasing, ["报表", "分析"]),
  defineIcon("pie-chart", "Pie Chart", "Work", ChartPie, ["图表", "分析"]),
  defineIcon("trending-up", "Trending Up", "Work", TrendingUp, ["增长", "趋势"]),
  defineIcon("target", "Target", "Work", Target, ["目标", "计划"]),
  defineIcon("clipboard-list", "Clipboard List", "Work", ClipboardList, ["清单", "任务"]),
  defineIcon("list-todo", "To-do List", "Work", ListTodo, ["待办", "任务"]),
  defineIcon("kanban", "Kanban", "Work", Kanban, ["看板", "项目"]),
  defineIcon("mail", "Mail", "Work", Mail, ["邮件", "消息"]),
  defineIcon("phone", "Phone", "Work", Phone, ["电话", "联系"]),
  defineIcon("contact", "Contact", "Work", Contact, ["联系人", "名片"]),
  defineIcon("badge-check", "Verified", "Work", BadgeCheck, ["认证", "批准"]),

  defineIcon("palette", "Palette", "Design", Palette, ["调色板", "颜色"]),
  defineIcon("brush", "Brush", "Design", Brush, ["画笔", "绘画"]),
  defineIcon("pen-tool", "Pen Tool", "Design", PenTool, ["钢笔", "矢量"]),
  defineIcon("pencil", "Pencil", "Design", Pencil, ["铅笔", "编辑"]),
  defineIcon("shapes", "Shapes", "Design", Shapes, ["形状", "图形"]),
  defineIcon("layers", "Layers", "Design", Layers3, ["图层", "层级"]),
  defineIcon("image", "Image", "Design", Image, ["图片", "照片"]),
  defineIcon("camera", "Camera", "Design", Camera, ["相机", "摄影"]),
  defineIcon("magic-wand", "Magic Wand", "Design", WandSparkles, ["魔棒", "特效"]),
  defineIcon("sparkles", "Sparkles", "Design", Sparkles, ["闪光", "效果"]),
  defineIcon("frame", "Frame", "Design", Frame, ["画框", "画布"]),
  defineIcon("crop", "Crop", "Design", Crop, ["裁剪", "剪切"]),
  defineIcon("pipette", "Color Picker", "Design", Pipette, ["吸管", "取色"]),
  defineIcon("swatch-book", "Swatches", "Design", SwatchBook, ["色板", "色卡"]),

  defineIcon("code", "Code", "Code", Code2, ["代码", "开发"]),
  defineIcon("terminal", "Terminal", "Code", Terminal, ["终端", "命令行"]),
  defineIcon("braces", "Braces", "Code", Braces, ["括号", "json"]),
  defineIcon("file-code", "Code File", "Code", FileCode2, ["代码文件", "脚本"]),
  defineIcon("bug", "Bug", "Code", Bug, ["错误", "调试"]),
  defineIcon("git-branch", "Git Branch", "Code", GitBranch, ["分支", "版本控制"]),
  defineIcon("git-pull-request", "Pull Request", "Code", GitPullRequest, ["合并请求", "git"]),
  defineIcon("database", "Database", "Code", Database, ["数据库", "数据"]),
  defineIcon("server", "Server", "Code", Server, ["服务器", "后端"]),
  defineIcon("cloud", "Cloud", "Code", Cloud, ["云端", "部署"]),
  defineIcon("cpu", "CPU", "Code", Cpu, ["处理器", "硬件"]),
  defineIcon("bot", "Bot", "Code", Bot, ["机器人", "ai", "agent"]),
  defineIcon("workflow", "Workflow", "Code", Workflow, ["工作流", "自动化"]),
  defineIcon("webhook", "Webhook", "Code", Webhook, ["接口", "集成"]),

  defineIcon("play", "Play", "Media", Play, ["播放", "开始"]),
  defineIcon("pause", "Pause", "Media", Pause, ["暂停", "停止"]),
  defineIcon("music", "Music", "Media", Music, ["音乐", "歌曲"]),
  defineIcon("video", "Video", "Media", Video, ["视频", "录像"]),
  defineIcon("mic", "Microphone", "Media", Mic, ["麦克风", "录音"]),
  defineIcon("headphones", "Headphones", "Media", Headphones, ["耳机", "音频"]),
  defineIcon("volume", "Volume", "Media", Volume2, ["音量", "声音"]),
  defineIcon("radio", "Radio", "Media", Radio, ["广播", "电台"]),
  defineIcon("podcast", "Podcast", "Media", Podcast, ["播客", "节目"]),
  defineIcon("film", "Film", "Media", Film, ["电影", "影片"]),
  defineIcon("clapperboard", "Clapperboard", "Media", Clapperboard, ["场记板", "制作"]),
  defineIcon("disc", "Disc", "Media", Disc3, ["唱片", "光盘"]),
  defineIcon("audio-lines", "Audio Lines", "Media", AudioLines, ["声波", "音频"]),
  defineIcon("gallery", "Gallery", "Media", GalleryHorizontal, ["画廊", "相册"]),

  defineIcon("file", "File", "Files", File, ["文件"]),
  defineIcon("files", "Files", "Files", Files, ["多个文件", "文档"]),
  defineIcon("folder", "Folder", "Files", Folder, ["文件夹", "目录"]),
  defineIcon("folder-open", "Open Folder", "Files", FolderOpen, ["打开文件夹", "目录"]),
  defineIcon("file-text", "Text File", "Files", FileText, ["文本", "文档"]),
  defineIcon("file-spreadsheet", "Spreadsheet", "Files", FileSpreadsheet, ["表格", "excel"]),
  defineIcon("file-image", "Image File", "Files", FileImage, ["图片文件", "照片"]),
  defineIcon("file-video", "Video File", "Files", FileVideo, ["视频文件"]),
  defineIcon("file-audio", "Audio File", "Files", FileAudio, ["音频文件"]),
  defineIcon("file-archive", "Archive", "Files", FileArchive, ["压缩包", "归档"]),
  defineIcon("download", "Download", "Files", Download, ["下载"]),
  defineIcon("upload", "Upload", "Files", Upload, ["上传"]),
  defineIcon("save", "Save", "Files", Save, ["保存"]),
  defineIcon("paperclip", "Attachment", "Files", Paperclip, ["附件", "回形针"]),

  defineIcon("lightbulb", "Lightbulb", "Objects", Lightbulb, ["想法", "灵感"]),
  defineIcon("rocket", "Rocket", "Objects", Rocket, ["火箭", "发布"]),
  defineIcon("globe", "Globe", "Objects", Globe2, ["全球", "网站"]),
  defineIcon("map", "Map", "Objects", MapIcon, ["地图", "导航"]),
  defineIcon("map-pin", "Map Pin", "Objects", MapPin, ["位置", "地点"]),
  defineIcon("compass", "Compass", "Objects", Compass, ["指南针", "探索"]),
  defineIcon("key", "Key", "Objects", KeyRound, ["钥匙", "权限"]),
  defineIcon("lock", "Lock", "Objects", LockKeyhole, ["锁", "安全"]),
  defineIcon("shield-check", "Shield", "Objects", ShieldCheck, ["盾牌", "安全"]),
  defineIcon("wrench", "Wrench", "Objects", Wrench, ["扳手", "工具"]),
  defineIcon("hammer", "Hammer", "Objects", Hammer, ["锤子", "构建"]),
  defineIcon("package", "Package", "Objects", Package, ["包裹", "产品"]),
  defineIcon("shopping-cart", "Shopping Cart", "Objects", ShoppingCart, ["购物车", "商店"]),
  defineIcon("gift", "Gift", "Objects", Gift, ["礼物", "奖励"]),
] as const satisfies readonly ToolIconDefinition[];

export type ToolIconKey = (typeof TOOL_ICONS)[number]["key"];

export const DEFAULT_TOOL_ICON_KEY: ToolIconKey = "app-window";

const iconsByKey = new Map(TOOL_ICONS.map((icon) => [icon.key, icon]));

export function getToolIcon(key: string | null | undefined): ToolIconDefinition {
  return iconsByKey.get(key ?? "") ?? iconsByKey.get(DEFAULT_TOOL_ICON_KEY)!;
}

export function searchToolIcons(
  query: string,
  category: ToolIconCategory | "all",
): ToolIconDefinition[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return TOOL_ICONS.filter((icon) => {
    if (category !== "all" && icon.category !== category) return false;
    if (!normalizedQuery) return true;

    return [icon.key, icon.label, icon.category, ...icon.keywords]
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalizedQuery);
  });
}
