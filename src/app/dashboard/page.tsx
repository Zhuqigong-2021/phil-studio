"use client";

import React from "react";
import { createPortal, flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "./dashboard.css";
import { getLyricsProgressMotion } from "./lyrics-progress-motion";
import svgPaths from "./svg-paths";
import {
  getDashboardEntranceMotion,
  getDrawerMotion,
  getListItemMotion,
  getOverlayMotion,
  getPanelMotion,
  getPopoverMotion,
  getQuickAccessItemMotion,
  getStatCountMotion,
  getStatCountTiming,
  shouldDismissDrawer,
} from "@/lib/dashboard/motion-system";
import WorkspaceSplashCursor from "@/components/dashboard/WorkspaceSplashCursor";
import EnergySandVolume from "@/components/dashboard/EnergySandVolume";
import SyncedLyrics from "@/components/dashboard/SyncedLyrics";
import { useAudioAnalyser } from "@/hooks/useAudioAnalyser";
import { useLyricsTimeline } from "@/hooks/useLyricsTimeline";
import MagicRings from "@/components/dashboard/MagicRings";
import SideRays from "@/components/dashboard/SideRays";
import AddToolModal from "@/components/dashboard/AddToolModal";
import DatabaseToastViewport from "@/components/dashboard/DatabaseToastViewport";
import DashboardToolTransition from "@/components/dashboard/DashboardToolTransition";
import DynamicToolIcon from "@/components/dashboard/DynamicToolIcon";
import type { IconType } from "react-icons";
import {
  WiCloud,
  WiDayCloudy,
  WiDaySunny,
  WiFog,
  WiNightAltCloudy,
  WiNightClear,
  WiRain,
  WiShowers,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import {
  PenLine,
  Languages,
  BookOpenText,
  Sparkles,
  ImageIcon,
  Film,
  Mic,
  Code2,
  Bot,
  Star,
  Clock,
  Settings2,
  Settings,
  MapPin,
  LogOut,
  Plus,
  Check,
  ExternalLink,
  X,
  History,
  Tags,
  ChevronDown,
  CloudSun,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  Subtitles,
  Music,
  Volume1,
  Volume2,
  VolumeX,
  Trash2,
  LoaderCircle,
} from "lucide-react";
import { TRACKS, type Track } from "@/lib/dashboard/music";
import {
  TOOLS_RAW,
  toolColorRgb,
} from "@/lib/dashboard/mock-data";
import {
  DEFAULT_TOOL_ICON_KEY,
  hasToolIcon,
} from "@/lib/dashboard/tool-icons";
import type { Tool } from "@/lib/dashboard/types";
import { buildCategoryStats, matchesToolQuery, selectPinnedTools } from "@/lib/dashboard/custom-tools";
import { signOutFromApp } from "@/lib/auth/client";
import { recordRecentTool } from "@/lib/dashboard/recent-tools";
import { useDailyTasks } from "@/hooks/useDailyTasks";
import { formatTaskTime, type DailyTask } from "@/lib/dashboard/daily-tasks";
import { useFocusLog } from "@/hooks/useFocusLog";
import type { FocusEntry } from "@/lib/dashboard/focus-log";
import { useCustomTools } from "@/hooks/useCustomTools";

const toolUrlById = new Map(TOOLS_RAW.map((tool) => [tool.id, tool.url]));

const imgBg = "/backgrounds/dark-old-port-background-layout-final.png";
const imgAvatar = "/backgrounds/dark-old-port-avatar.png";

interface DashboardToolView {
  id: string;
  icon: React.ReactNode;
  label: string;
  border: string;
  bg: string;
  shadow: string;
  href?: string;
  tool: Tool;
}

const DashboardWorkspaceContext = React.createContext<ReturnType<typeof useCustomTools> | null>(null);

function useDashboardWorkspace() {
  const workspace = React.useContext(DashboardWorkspaceContext);
  if (!workspace) throw new Error("Dashboard workspace is unavailable.");
  return workspace;
}

function DashboardWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const workspace = useCustomTools();
  return (
    <DashboardWorkspaceContext.Provider value={workspace}>
      {children}
    </DashboardWorkspaceContext.Provider>
  );
}

function DashboardBackground() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const blurLayerRef = React.useRef<HTMLDivElement>(null);
  const sharpLayerRef = React.useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const blurLayer = blurLayerRef.current;
    const sharpLayer = sharpLayerRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!root || !blurLayer || !sharpLayer || reduceMotion || !finePointer.matches) {
      return;
    }

    const sharpX = gsap.quickTo(sharpLayer, "x", { duration: 0.8, ease: "power3.out" });
    const sharpY = gsap.quickTo(sharpLayer, "y", { duration: 0.8, ease: "power3.out" });
    const blurX = gsap.quickTo(blurLayer, "x", { duration: 1, ease: "power3.out" });
    const blurY = gsap.quickTo(blurLayer, "y", { duration: 1, ease: "power3.out" });

    const move = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      sharpX(x * 5);
      sharpY(y * 5);
      blurX(x * -3);
      blurY(y * -3);
    };
    const reset = () => {
      sharpX(0);
      sharpY(0);
      blurX(0);
      blurY(0);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      gsap.killTweensOf([sharpLayer, blurLayer]);
    };
  }, [reduceMotion]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const syncVisibility = () => {
      root.classList.toggle("dashboard-background--paused", document.hidden);
    };
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden">
      <div ref={blurLayerRef} className="dashboard-background-parallax-layer absolute inset-0">
        <img
          alt=""
          src={imgBg}
          className="dashboard-background-blur absolute inset-0 size-full object-cover"
        />
      </div>
      <div ref={sharpLayerRef} className="dashboard-background-parallax-layer absolute inset-0">
        <img
          alt=""
          src={imgBg}
          className="dashboard-background-sharp absolute inset-0 size-full object-cover"
        />
      </div>
      <div className="absolute inset-0" style={{ background: "rgba(8,13,36,0.28)" }} />
      <div className="dashboard-background-water-shimmer absolute inset-x-0 bottom-0 h-[48%]" />
    </div>
  );
}

// ─── Icon components ───────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
      <path d={svgPaths.p33889400} fill="#D8D2FF" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      fill="none"
      height="21"
      viewBox="0 0 21 21"
      width="21"
      className="flex-shrink-0"
    >
      <path d={svgPaths.p26b4500} stroke="#B8C2DF" strokeWidth="2" />
      <path d="M17.5 17.5L14 14" stroke="#B8C2DF" strokeWidth="2" />
    </svg>
  );
}

function IconAddTool() {
  return (
    <svg fill="none" height="32" viewBox="0 0 32 32" width="32">
      <path d={svgPaths.p369e1000} stroke="#A86CFF" strokeWidth="2" />
    </svg>
  );
}

function IconFavorites() {
  return (
    <svg fill="none" height="26" viewBox="0 0 26 26" width="26">
      <path d={svgPaths.p31ce0b00} fill="#67E8F9" />
    </svg>
  );
}

function IconFavoriteMusic() {
  return (
    <svg fill="none" height="26" viewBox="0 0 26 26" width="26">
      <path
        d="M9 18.25V7.5L20 5.5V16.25"
        stroke="#818CF8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M9 9.7L20 7.7"
        stroke="#818CF8"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path d={svgPaths.p2d820000} stroke="#818CF8" strokeWidth="1.8" />
      <path d={svgPaths.p1353e100} stroke="#818CF8" strokeWidth="1.8" />
    </svg>
  );
}

function IconTaskCompletion() {
  return (
    <svg fill="none" height="26" viewBox="0 0 26 26" width="26">
      <path d={svgPaths.p5d19170} stroke="#2DD4BF" strokeWidth="1.8" />
      <path
        d={svgPaths.p19214200}
        stroke="#2DD4BF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M10 4.5V3.5H16V4.5"
        stroke="#2DD4BF"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconThemeSwitch() {
  return (
    <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
      <path
        d={svgPaths.pa3d6470}
        stroke="#D8CCFF"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d={svgPaths.p34b65880}
        stroke="#D8CCFF"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ToolIconArtsPortfolio() {
  return (
    <svg fill="none" height="36" viewBox="0 0 36 36" width="36">
      <path
        d={svgPaths.p282bd200}
        stroke="#9B6CFF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        d={svgPaths.p18154f90}
        stroke="#9B6CFF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        d={svgPaths.p14214b00}
        stroke="#9B6CFF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function ToolIconOnlineCv() {
  return (
    <svg fill="none" height="36" viewBox="0 0 36 36" width="36">
      <path
        d={svgPaths.p14bc8880}
        stroke="#55A7FF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        d={svgPaths.p695e520}
        stroke="#55A7FF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function ToolIconOnlinePs() {
  return (
    <svg fill="none" height="36" viewBox="0 0 36 36" width="36">
      <path
        d={svgPaths.p3614c700}
        stroke="#F062A2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <text
        x="18"
        y="19.5"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#F062A2"
        fontSize="13.5"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        Ps
      </text>
    </svg>
  );
}

function ToolIconPdfEditor() {
  return (
    <svg fill="none" height="36" viewBox="0 0 36 36" width="36">
      <path
        d={svgPaths.p406ba80}
        stroke="#FF7A31"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        d={svgPaths.p2c0be700}
        stroke="#FF7A31"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function ToolIconAnimation() {
  return (
    <svg fill="none" height="36" viewBox="0 0 36 36" width="36">
      <path
        d={svgPaths.p1c5d7800}
        stroke="#39C8E8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        d={svgPaths.p33009e00}
        stroke="#39C8E8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function ToolIconMindmap() {
  return (
    <svg fill="none" height="36" viewBox="0 0 36 36" width="36">
      <path
        d={svgPaths.p1fe8d0f0}
        stroke="#2DD4BF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        d={svgPaths.p1083f70}
        stroke="#2DD4BF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        d={svgPaths.p14566c30}
        stroke="#2DD4BF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        d={svgPaths.p3cc84080}
        stroke="#2DD4BF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function ToolIconStudyMate() {
  return (
    <svg fill="none" height="36" viewBox="0 0 36 36" width="36">
      <path
        d={svgPaths.p35baa198}
        stroke="#36D399"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function ToolIconNotion() {
  return (
    <svg fill="none" height="36" viewBox="0 0 36 36" width="36">
      <path
        d={svgPaths.p33933c00}
        stroke="#E7EAF3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        d={svgPaths.p3dc56540}
        stroke="#E7EAF3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function ToolIconAgentNote() {
  return (
    <svg fill="none" height="36" viewBox="0 0 36 36" width="36">
      <path
        d={svgPaths.p21e65700}
        stroke="#B67CFF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        d={svgPaths.p24a43a00}
        stroke="#B67CFF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        d={svgPaths.p2e3abf51}
        stroke="#B67CFF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

// ─── Glass panel ───────────────────────────────────────────────────────────────
// Light source: top-left. The highlight gradient is baked into the background
// itself, so no extra DOM layer is needed and there are zero z-index issues.
// The inset box-shadow adds a bright top edge to mimic an edge-lit glass surface.

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  tint?: string;
  opacity?: number;
  blur?: string;
  lightAngle?: number;
  // how far the highlight spreads: 1.0 = full (90%), 0.5 = compact (45%)
  highlightSpread?: number;
  highlightOpacity?: number;
  onClick?: () => void;
  panelRef?: React.Ref<HTMLDivElement>;
}

function GlassPanel({
  children,
  className = "",
  tint = "20,16,48",
  opacity = 0.68,
  blur = "10px",
  lightAngle = 135,
  highlightSpread = 1.0,
  highlightOpacity = 1.0,
  onClick,
  panelRef,
}: GlassPanelProps) {
  const s = highlightSpread;
  const o = highlightOpacity;
  const highlight = `linear-gradient(${lightAngle}deg, rgba(200,201,212,${+(0.16 * o).toFixed(3)}) 0%, rgba(158,166,183,${+(0.1 * o).toFixed(3)}) ${Math.round(35 * s)}%, rgba(105,118,138,${+(0.025 * o).toFixed(3)}) ${Math.round(62 * s)}%, rgba(89,102,122,0) ${Math.round(90 * s)}%)`;
  const base = `rgba(${tint},${opacity})`;

  return (
    <div
      ref={panelRef}
      className={`glass-shine-card rounded-2xl overflow-hidden ${onClick ? "cursor-pointer ui-interactive-card" : ""} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      style={{
        backdropFilter: `blur(${blur})`,
        background: `${highlight}, ${base}`,
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.15),
          inset 1px 0 0 rgba(255,255,255,0.06),
          0 7px 20px -3px rgba(0,4,12,0.22)
        `,
        border: "none",
        transition: "box-shadow 180ms var(--ease-out)",
      }}
    >
      {children}
    </div>
  );
}

// ─── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
  lightAngle = 183,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  lightAngle?: number;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <GlassPanel
      className="stat-card relative w-[210px] flex-shrink-0 min-[1180px]:w-auto min-[1180px]:flex-1 min-[1180px]:min-w-0 h-[11.4vh] flex items-center gap-3 px-4"
      tint="55,44,82"
      opacity={0.25}
      blur="13px"
      lightAngle={lightAngle}
      onClick={onClick}
    >
      {active && (
        <motion.div
          layoutId="dashboard-active-stat"
          className="stat-card-selection pointer-events-none absolute inset-[1px] rounded-[15px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,122,246,0.1), rgba(103,232,249,0.025))",
            boxShadow:
              "inset 0 0 0 1px rgba(139, 122, 246, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 0 1px rgba(129, 107, 255, 0.12), 0 8px 24px rgba(79, 55, 180, 0.16)",
          }}
          transition={{ type: "spring", duration: 0.28, bounce: 0.08 }}
        />
      )}
      <div
        className="stat-card-icon relative z-10 flex items-center justify-center rounded-[10px] size-[52px] flex-shrink-0"
        style={{
          // Same lightAngle each card's own GlassPanel highlight uses, so the icon box catches
          // light from the same direction as the rest of the card instead of glowing on its own.
          background: `linear-gradient(${lightAngle}deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 32%, rgba(10,14,45,0) 60%)`,
          backgroundColor: "rgba(15,20,52,0.95)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.1), 0 5px 10px -4px rgba(0,0,0,0.36)",
          border: "none",
        }}
      >
        {icon}
      </div>
      <div className="relative z-10">
        <p className="font-extrabold text-white text-[29px] leading-none tracking-[-0.03em] tabular-nums">
          <AnimatedStatValue value={value} />
        </p>
        <p className="text-[#bec5d8] text-[13px] mt-[2px]">{label}</p>
      </div>
    </GlassPanel>
  );
}

function AnimatedStatValue({ value }: { value: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = React.useRef(false);
  const reduceMotion = Boolean(useReducedMotion());

  React.useLayoutEffect(() => {
    const parsed = getStatCountMotion(value);
    const element = ref.current;
    if (!element || !parsed || reduceMotion) return;

    const timing = getStatCountTiming(!hasAnimatedRef.current);
    hasAnimatedRef.current = true;
    element.textContent = `0${parsed.suffix}`;
    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value: parsed.end,
      ...timing,
      ease: "power2.out",
      onUpdate: () => {
        element.textContent = `${Math.round(counter.value)}${parsed.suffix}`;
      },
    });

    return () => {
      tween.kill();
    };
  }, [reduceMotion, value]);

  return <span ref={ref}>{value}</span>;
}

// ─── Tool tile ─────────────────────────────────────────────────────────────────

function ToolTile({
  id,
  icon,
  label,
  borderColor,
  bgColor,
  shadowColor,
  href,
}: {
  id?: string;
  icon: React.ReactNode;
  label: string;
  borderColor: string;
  bgColor: string;
  shadowColor: string;
  href?: string;
}) {
  const Wrapper = href ? "a" : "div";
  return (
    <Wrapper
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={id && href ? () => recordRecentTool(id) : undefined}
      className="ui-tool-tile flex flex-col items-center gap-[10px] cursor-pointer group flex-shrink-0"
      title={href ? label : `${label} (link coming soon)`}
    >
      <div
        className="ui-tile-surface glass-shine-card flex items-center justify-center rounded-[12px] w-[70px] h-[66px]"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 55%), ${bgColor}`,
          border: `1px solid ${borderColor}`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0px 4px 14px 0px ${shadowColor}`,
        }}
      >
        {icon}
      </div>
      <p
        title={label}
        className="w-[70px] truncate whitespace-nowrap text-center text-[12px] font-medium leading-tight text-[#f2f4fa]"
      >
        {label}
      </p>
    </Wrapper>
  );
}

// ─── Quick tile ────────────────────────────────────────────────────────────────

function QuickTile({
  icon,
  label,
  index,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  index: number;
  href?: string;
  onClick?: () => void;
}) {
  const Wrapper = href ? motion.a : motion.div;
  const itemMotion = getQuickAccessItemMotion(
    Boolean(useReducedMotion()),
    index,
  );
  return (
    <Wrapper
      data-quick-access-item
      {...itemMotion}
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={onClick}
      className="ui-tool-tile flex-shrink-0 w-[72px] min-[1180px]:w-[calc((100%-48px)/4)] flex flex-col items-center gap-[8px] cursor-pointer group"
    >
      <div
        className="ui-tile-surface glass-shine-card flex items-center justify-center rounded-[14px] w-[clamp(44px,5.5vh,64px)] h-[clamp(44px,5.5vh,64px)] mx-auto"
        style={{
          backdropFilter: "blur(8px) saturate(140%)",
          WebkitBackdropFilter: "blur(8px) saturate(140%)",
          background:
            "linear-gradient(150deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%), rgba(38,42,54,0.55)",
          border: "none",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -6px 10px rgba(0,0,0,0.18), 0 calc(clamp(44px, 5.5vh, 64px) * 0.28) calc(clamp(44px, 5.5vh, 64px) * 0.4) calc(clamp(44px, 5.5vh, 64px) * -0.22) rgba(0,0,0,0.55)",
        }}
      >
        {icon}
      </div>
      <p
        title={label}
        className="w-[clamp(44px,5.5vh,64px)] truncate whitespace-nowrap text-center text-[12px] font-medium leading-tight text-[#f1f3fa]"
      >
        {label}
      </p>
    </Wrapper>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────

const iconCls = "size-[14px] flex-shrink-0 text-[#c8d0e4]";

const aiTools: { icon: React.ReactNode; label: string; indent?: boolean }[] = [
  { icon: <PenLine className={iconCls} />, label: "AI Writer" },
  { icon: <Languages className={iconCls} />, label: "AI Translator" },
  { icon: <BookOpenText className={iconCls} />, label: "AI Comic" },
  { icon: <Sparkles className={iconCls} />, label: "AI Manga/Anime" },
  { icon: <ImageIcon className={iconCls} />, label: "AI Image" },
  { icon: <Film className={iconCls} />, label: "AI Video" },
  { icon: <Mic className={iconCls} />, label: "AI Voice" },
  { icon: <Code2 className={iconCls} />, label: "AI Code" },
  { icon: <Bot className={iconCls} />, label: "AI Agents" },
];

const systemLinks: { icon: React.ReactNode; label: string; href?: string }[] = [
  { icon: <Settings2 className={iconCls} />, label: "Manage", href: "/manage" },
  { icon: <Clock className={iconCls} />, label: "Recent Activity" },
  { icon: <Settings className={iconCls} />, label: "Settings" },
];

function NavItem({
  icon,
  label,
  expanded,
  active,
  onClick,
  indent,
  emphasized = false,
}: {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  active: boolean;
  onClick: () => void;
  indent?: boolean;
  emphasized?: boolean;
}) {
  const reduceMotion = Boolean(useReducedMotion());
  const [keyboardActivation, setKeyboardActivation] = React.useState(false);
  const radius = emphasized ? 11 : 9;

  return (
    <div
      onClick={onClick}
      onPointerDown={() => {
        setKeyboardActivation(false);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setKeyboardActivation(true);
          onClick();
        }
      }}
      className={`relative flex items-center cursor-pointer transition-colors group ${active ? "" : "hover:bg-[rgba(255,255,255,0.05)]"}`}
      style={{
        borderRadius: radius,
        gap: expanded ? (emphasized ? 12 : 11) : 0,
        padding: expanded
          ? emphasized
            ? "12px 16px"
            : "9px 10px"
          : emphasized
            ? "12px 0"
            : "10px 0",
        paddingLeft: expanded ? (indent ? 24 : emphasized ? 16 : 10) : 0,
        justifyContent: expanded ? "flex-start" : "center",
        border: "1px solid transparent",
      }}
      title={!expanded ? label : undefined}
    >
      {active && (
        <motion.div
          layoutId={
            reduceMotion || keyboardActivation
              ? undefined
              : "dashboard-active-nav"
          }
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            borderRadius: radius,
            background:
              "linear-gradient(135deg, rgba(140,80,220,0.35), rgba(85,58,156,0.28))",
            border: "1px solid rgba(140,100,220,0.4)",
            boxShadow: "inset 0 1px 0 rgba(200,150,255,0.15)",
          }}
          transition={{ type: "spring", duration: 0.24, bounce: 0.04 }}
        />
      )}
      <span
        className={`relative z-10 flex-shrink-0 ${active ? "[&>*]:text-white" : "group-hover:[&>*]:text-white"}`}
      >
        {icon}
      </span>
      {expanded && (
        <span
          className={`relative z-10 text-[13.5px] leading-none whitespace-nowrap transition-colors ${
            active
              ? "text-white font-medium"
              : "text-[#c8d0e4] font-normal group-hover:text-white"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// ─── Weather modal — shown from the sidebar's Weather shortcut below 1180px ─────

function WeatherModalDark({ onClose }: { onClose: () => void }) {
  const overlayMotion = getOverlayMotion(Boolean(useReducedMotion()));
  const { weather, error } = useWeather();
  const now = useNow();
  const details = weather ? weatherDetails(weather.code, weather.isDay) : null;
  const WeatherIcon = details?.Icon;

  const weekday = now
    ? new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone }).format(
        now,
      )
    : "";
  const monthDay = now
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone,
      }).format(now)
    : "";
  const timeParts = now
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone,
      }).formatToParts(now)
    : [];
  const clock = timeParts
    .filter((p) => p.type !== "dayPeriod")
    .map((p) => p.value)
    .join("")
    .trim();
  const period = timeParts.find((p) => p.type === "dayPeriod")?.value ?? "";

  return (
    <motion.div
      {...overlayMotion.backdrop}
      onClick={onClose}
      // z-95, not 90: when opened from the mobile nav drawer (which is also portaled to
      // document.body), the drawer's own <aside> sits at z-91 — a lower z-index here would
      // let that panel visually cover part of this centered modal instead of dimming behind it.
      className="dashboard-motion-root dashboard-overlay-backdrop fixed inset-0 z-[95] flex items-center justify-center"
      style={{ background: "rgba(2,6,23,0.6)", padding: 16 }}
    >
      <motion.div
        {...overlayMotion.surface}
        onClick={(e) => e.stopPropagation()}
        className="glass-shine-card rounded-2xl overflow-hidden flex flex-col"
        style={{
          width: "min(360px,100%)",
          background: "rgba(20,16,48,0.94)",
          backdropFilter: "blur(20px) saturate(170%) brightness(1.2)",
          border: "1px solid rgba(160,110,255,0.24)",
          boxShadow: "0 24px 60px rgba(0,4,20,0.4)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(160,110,255,0.14)" }}
        >
          <span className="text-white font-semibold text-[16px]">Weather</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center rounded-[8px]"
            style={{
              width: 26,
              height: 26,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(160,110,255,0.2)",
            }}
          >
            <X
              style={{ width: 13, height: 13 }}
              className="text-[#9aa3be]"
              strokeWidth={2}
            />
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 px-5 py-6">
          {WeatherIcon ? (
            <WeatherIcon
              className="text-white"
              style={{ width: 56, height: 56 }}
              aria-hidden="true"
            />
          ) : (
            <span className="text-white text-[48px] font-bold leading-none">
              ☁
            </span>
          )}
          <p className="text-white font-extrabold text-[40px] leading-none tracking-[-0.03em] tabular-nums mt-2">
            {weather ? `${weather.temperature}°C` : error ? "—" : "…"}
          </p>
          <p className="text-[#b6bdd0] text-[14px] mt-1">
            {details
              ? details.label
              : error
                ? "Weather unavailable"
                : "Updating…"}{" "}
            · Montréal
          </p>
          {weather && (
            <p className="text-[#8891ac] text-[12px]">
              H{weather.high}° · L{weather.low}°
            </p>
          )}
        </div>

        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(160,110,255,0.14)" }}
        >
          <div>
            <p className="text-white font-medium text-[14px]">
              {weekday || "—"}
            </p>
            <p className="text-[#8891ac] text-[12px]">
              {monthDay || "Loading date"}
            </p>
          </div>
          <p className="text-white font-semibold text-[16px]">
            {clock || "--:--"} {period}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Settings modal — theme + logout, opened from the mobile nav drawer's Settings row ──

function SettingsModalDark({ onClose }: { onClose: () => void }) {
  const overlayMotion = getOverlayMotion(Boolean(useReducedMotion()));

  return (
    <motion.div
      {...overlayMotion.backdrop}
      onClick={onClose}
      className="dashboard-motion-root dashboard-overlay-backdrop fixed inset-0 z-[95] flex items-center justify-center"
      style={{ background: "rgba(2,6,23,0.6)", padding: 16 }}
    >
      <motion.div
        {...overlayMotion.surface}
        onClick={(e) => e.stopPropagation()}
        className="glass-shine-card rounded-2xl overflow-hidden flex flex-col"
        style={{
          width: "min(340px,100%)",
          background: "rgba(20,16,48,0.94)",
          backdropFilter: "blur(20px) saturate(170%) brightness(1.2)",
          border: "1px solid rgba(160,110,255,0.24)",
          boxShadow: "0 24px 60px rgba(0,4,20,0.4)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(160,110,255,0.14)" }}
        >
          <span className="text-white font-semibold text-[16px]">Settings</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center rounded-[8px]"
            style={{
              width: 26,
              height: 26,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(160,110,255,0.2)",
            }}
          >
            <X
              style={{ width: 13, height: 13 }}
              className="text-[#9aa3be]"
              strokeWidth={2}
            />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5">
          {/* Theme switch */}
          <div
            className="flex items-center gap-[7px] px-3 h-[46px] rounded-[23px]"
            style={{
              background:
                "linear-gradient(87deg, rgba(9,20,40,0.5) 0%, rgba(9,20,40,0.5) 100%), linear-gradient(87deg, rgba(216,211,227,0.10) 0%, rgba(169,167,184,0.05) 50%, rgba(111,116,136,0.01) 100%)",
              border: "1px solid rgba(141,150,172,0.20)",
            }}
          >
            <IconThemeSwitch />
            <span className="text-[#f4f2ff] text-[13px] font-semibold whitespace-nowrap flex-1">
              Light
            </span>
            <div
              className="h-[22px] w-[30px] rounded-[11px] relative flex-shrink-0 ml-[2px]"
              style={{ background: "#7255db" }}
            >
              <div
                className="absolute right-[3px] top-[3px] bg-[#cfc4ff] rounded-[8px] size-[16px]"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
              />
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={() => void signOutFromApp()}
            className="flex items-center gap-[10px] px-4 h-[46px] rounded-[23px] text-[#fca5a5] text-[13px] font-medium cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.06)]"
            style={{ border: "1px solid rgba(252,165,165,0.22)" }}
          >
            <LogOut style={{ width: 15, height: 15 }} />
            Logout
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Mobile nav drawer — replaces the sidebar below 951px, opened from the topbar's
// brand button; its own Settings row opens SettingsModalDark instead of just navigating. ──

function MobileNavDrawer({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const reduceMotion = Boolean(useReducedMotion());
  const overlayMotion = getOverlayMotion(reduceMotion);
  const drawerMotion = getDrawerMotion(reduceMotion);
  const [activeNav, setActiveNav] = React.useState("Dashboard");
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [weatherModalOpen, setWeatherModalOpen] = React.useState(false);

  return (
    <>
      <motion.div
        {...overlayMotion.backdrop}
        onClick={onClose}
        className="dashboard-motion-root dashboard-overlay-backdrop fixed inset-0 z-[90]"
        style={{ background: "rgba(2,6,23,0.6)" }}
      />
      {/* Fixed positioning lives on this plain wrapper, not the styled <aside> itself: the
          .glass-shine-card class sets `position: relative` (for its ::before/::after glow
          overlays), which — same specificity as Tailwind's `fixed` utility and loaded later
          in the stylesheet — silently wins and turns "fixed" into an in-flow relative block. */}
      <motion.div
        {...drawerMotion}
        drag="x"
        dragListener={!reduceMotion}
        dragConstraints={{ left: -96, right: 0 }}
        dragElastic={{ left: 0.12, right: 0 }}
        onDragEnd={(_, info) => {
          if (shouldDismissDrawer(info.offset.x, info.velocity.x)) onClose();
        }}
        className="dashboard-motion-root fixed left-0 top-0 h-screen z-[91]"
        style={{ width: "min(280px,84vw)" }}
      >
        <aside
          className="glass-shine-card h-full flex flex-col"
          style={{
            background: `
              linear-gradient(265deg, rgba(200,202,218,0.11) 0%, rgba(160,172,196,0.05) 18%, rgba(120,136,162,0.01) 34%, transparent 48%),
              rgba(14,17,44,0.96)
            `,
            backdropFilter: "blur(20px) saturate(160%)",
            boxShadow:
              "inset -1px 0 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,3,14,0.55)",
          }}
        >
          {/* Brand */}
          <div
            className="flex items-center gap-3 flex-shrink-0"
            style={{ padding: "24px 20px 20px" }}
          >
            <BrandMark size={44} />
            <div>
              <p className="text-white font-semibold text-[16px] leading-tight whitespace-nowrap">
                Phil&apos;s Studio
              </p>
              <p className="text-[#8f9ab8] text-[13px] tracking-wide whitespace-nowrap">
                AI Tool Collection
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex items-center justify-center rounded-[8px] flex-shrink-0 ml-auto"
              style={{
                width: 30,
                height: 30,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(160,110,255,0.2)",
              }}
            >
              <X
                style={{ width: 15, height: 15 }}
                className="text-[#9aa3be]"
                strokeWidth={2}
              />
            </button>
          </div>

          {/* Dashboard */}
          <div className="mb-2 flex-shrink-0" style={{ padding: "0 12px" }}>
            <NavItem
              icon={<HomeIcon />}
              label="Dashboard"
              expanded
              active={activeNav === "Dashboard"}
              onClick={() => {
                setActiveNav("Dashboard");
                onClose();
              }}
              emphasized
            />
          </div>

          {/* Scrollable nav */}
          <div
            className="mt-2 flex-1 min-h-0 pb-3 [&::-webkit-scrollbar]:hidden"
            style={{
              overflowY: "auto",
              scrollbarWidth: "none",
              padding: "0 12px",
            }}
          >
            <p className="text-[#78849f] text-[11px] font-semibold mb-[12px] tracking-[0.08em] px-2">
              AI TOOLS
            </p>
            <nav className="flex flex-col gap-[1px]">
              {aiTools.map(({ icon, label, indent }) => (
                <NavItem
                  key={label}
                  icon={icon}
                  label={label}
                  expanded
                  indent={indent}
                  active={activeNav === label}
                  onClick={() => {
                    setActiveNav(label);
                    onClose();
                  }}
                />
              ))}
            </nav>
            <div
              className="bg-[rgba(100,120,180,0.15)] h-px mx-2"
              style={{ margin: "18px 8px" }}
            />
            <p className="text-[#78849f] text-[11px] font-semibold mb-[12px] tracking-[0.08em] px-2">
              SYSTEM
            </p>
            <nav className="flex flex-col gap-[1px]">
              {systemLinks.map(({ icon, label, href }) => (
                <NavItem
                  key={label}
                  icon={icon}
                  label={label}
                  expanded
                  active={activeNav === label}
                  onClick={() => {
                    setActiveNav(label);
                    // Settings opens the theme/logout modal instead of just navigating.
                    if (label === "Settings") setSettingsOpen(true);
                    else {
                      onClose();
                      if (href) router.push(href);
                    }
                  }}
                />
              ))}
              <NavItem
                icon={<CloudSun className={iconCls} />}
                label="Weather"
                expanded
                active={false}
                onClick={() => setWeatherModalOpen(true)}
              />
            </nav>
          </div>

          {/* Personal workspace */}
          <div className="py-4 flex-shrink-0" style={{ padding: "16px 12px" }}>
            <div
              className="rounded-[12px] px-4 py-3 flex items-center justify-between gap-2"
              style={{
                background:
                  "linear-gradient(135deg, rgba(160,90,255,0.22) 0%, rgba(77,47,147,0.32) 100%)",
                border: "1px solid rgba(140,80,220,0.35)",
                boxShadow: "inset 0 1px 0 rgba(200,150,255,0.12)",
              }}
            >
              <div>
                <p className="text-[#c094ff] font-semibold text-[15px] whitespace-nowrap">
                  My Workspace
                </p>
                <p className="text-[#a0a8be] text-[12px] mt-[2px]">
                  Built for my flow
                </p>
              </div>
              <span
                className="text-white text-[12px] font-semibold rounded-[9px] px-4 py-[7px] flex-shrink-0 select-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(130,70,240,0.9) 0%, rgba(90,40,180,1) 100%)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.18), 0 3px 10px rgba(100,40,200,0.35)",
                }}
              >
                Curated
              </span>
            </div>
          </div>
        </aside>
      </motion.div>

      <AnimatePresence>
        {settingsOpen && (
          <SettingsModalDark onClose={() => setSettingsOpen(false)} />
        )}
        {weatherModalOpen && (
          <WeatherModalDark onClose={() => setWeatherModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function Sidebar({ activeRoute = "dashboard" }: { activeRoute?: "dashboard" | "manage" }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [activeNav, setActiveNav] = React.useState(
    activeRoute === "manage" ? "Manage" : "Dashboard",
  );
  const resolvedActiveNav = activeRoute === "manage" ? "Manage" : activeNav;
  // Below 1180px the hero's weather panel can end up squeezed out of easy reach, so a Weather
  // shortcut appears under SYSTEM at that width, opening a modal with the same live weather info.
  const [narrow, setNarrow] = React.useState(false);
  const [weatherModalOpen, setWeatherModalOpen] = React.useState(false);

  // Auto-collapse below 1280px on mount and resize
  React.useEffect(() => {
    const check = () => {
      setCollapsed(window.innerWidth < 1280);
      const isNarrow = window.innerWidth < 1180;
      setNarrow(isNarrow);
      // The Weather nav item only exists below 1180px — if the window widens past that
      // while the modal is open, close it since its trigger is no longer on screen.
      if (!isNarrow) setWeatherModalOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const expanded = !collapsed || hovered;
  const w = expanded ? 260 : 64;

  const sidebarStyle: React.CSSProperties = {
    width: w,
    backdropFilter: "blur(14px)",
    background: `
      linear-gradient(265deg, rgba(200,202,218,0.11) 0%, rgba(160,172,196,0.05) 18%, rgba(120,136,162,0.01) 34%, transparent 48%),
      rgba(14,17,44,0.72)
    `,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14), inset -1px 0 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,3,14,0.45)`,
    border: "none",
    transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
    overflowX: "hidden",
  };

  return (
    <>
      <aside
        className="glass-shine-card sidebar-panel flex-1 flex flex-col m-5 mr-0 rounded-2xl min-h-0"
        style={sidebarStyle}
        onMouseEnter={() => collapsed && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Brand */}
        <div
          className="flex items-center gap-3 pt-6 pb-5 flex-shrink-0"
          style={{
            padding: expanded ? "24px 20px 20px" : "20px 6px",
            justifyContent: expanded ? "flex-start" : "center",
          }}
        >
          <div
            className="flex items-center justify-center rounded-[13px] flex-shrink-0"
            style={{
              width: 44,
              height: 44,
              minWidth: 44,
              background:
                "linear-gradient(135deg, rgba(140,70,255,0.6) 0%, rgba(63,26,122,0.9) 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px rgba(120,50,220,0.3)",
              border: "1px solid rgba(180,100,255,0.25)",
            }}
          >
            <span className="text-[#d0a8ff] text-[22px] font-bold leading-none">
              ✦
            </span>
          </div>
          {expanded && (
            <div
              style={{
                opacity: hovered || !collapsed ? 1 : 0,
                transition: "opacity 0.15s",
              }}
            >
              <p className="text-white font-semibold text-[16px] leading-tight whitespace-nowrap">
                Phil&apos;s Studio
              </p>
              <p className="text-[#8f9ab8] text-[13px] tracking-wide whitespace-nowrap">
                AI Tool Collection
              </p>
            </div>
          )}
        </div>

        {/* Dashboard */}
        <div
          className="mb-2 flex-shrink-0"
          style={{ padding: expanded ? "0 12px" : "0 6px" }}
        >
          <NavItem
            icon={<HomeIcon />}
            label="Dashboard"
            expanded={expanded}
            active={resolvedActiveNav === "Dashboard"}
            onClick={() => {
              setActiveNav("Dashboard");
              router.push("/dashboard");
            }}
            emphasized
          />
        </div>

        {/* Scrollable nav */}
        <div
          className="mt-2 flex-1 min-h-0 pb-3 [&::-webkit-scrollbar]:hidden"
          style={{
            overflowY: "auto",
            scrollbarWidth: "none",
            padding: expanded ? "0 12px" : "0 6px",
          }}
        >
          {expanded && (
            <p className="text-[#78849f] text-[11px] font-semibold mb-[12px] tracking-[0.08em] px-2">
              AI TOOLS
            </p>
          )}
          <nav className="flex flex-col gap-[1px]">
            {aiTools.map(({ icon, label, indent }) => (
              <NavItem
                key={label}
                icon={icon}
                label={label}
                expanded={expanded}
                indent={indent}
                active={resolvedActiveNav === label}
                onClick={() => setActiveNav(label)}
              />
            ))}
          </nav>
          <div
            className="bg-[rgba(100,120,180,0.15)] h-px mx-2"
            style={{ margin: "18px 8px" }}
          />
          {expanded && (
            <p className="text-[#78849f] text-[11px] font-semibold mb-[12px] tracking-[0.08em] px-2">
              SYSTEM
            </p>
          )}
          <nav className="flex flex-col gap-[1px]">
            {systemLinks.map(({ icon, label, href }) => (
              <NavItem
                key={label}
                icon={icon}
                label={label}
                expanded={expanded}
                active={resolvedActiveNav === label}
                onClick={() => {
                  setActiveNav(label);
                  if (href) router.push(href);
                }}
              />
            ))}
            {narrow && (
              <NavItem
                icon={<CloudSun className={iconCls} />}
                label="Weather"
                expanded={expanded}
                active={false}
                onClick={() => setWeatherModalOpen(true)}
              />
            )}
          </nav>
        </div>

        {/* Personal workspace */}
        <div
          className="py-4 flex-shrink-0"
          style={{ padding: expanded ? "16px 12px" : "12px 6px" }}
        >
          {expanded ? (
            <div
              className="rounded-[12px] px-4 py-3 flex items-center justify-between gap-2"
              style={{
                background:
                  "linear-gradient(135deg, rgba(160,90,255,0.22) 0%, rgba(77,47,147,0.32) 100%)",
                border: "1px solid rgba(140,80,220,0.35)",
                boxShadow: "inset 0 1px 0 rgba(200,150,255,0.12)",
              }}
            >
              <div>
                <p className="text-[#c094ff] font-semibold text-[15px] whitespace-nowrap">
                  My Workspace
                </p>
                <p className="text-[#a0a8be] text-[12px] mt-[2px]">
                  Built for my flow
                </p>
              </div>
              <span
                className="text-white text-[12px] font-semibold rounded-[9px] px-4 py-[7px] flex-shrink-0 select-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(130,70,240,0.9) 0%, rgba(90,40,180,1) 100%)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.18), 0 3px 10px rgba(100,40,200,0.35)",
                }}
              >
                Curated
              </span>
            </div>
          ) : (
            <div
              className="flex items-center justify-center rounded-[12px]"
              style={{
                height: 44,
                background:
                  "linear-gradient(135deg, rgba(160,90,255,0.22) 0%, rgba(77,47,147,0.32) 100%)",
                border: "1px solid rgba(140,80,220,0.35)",
              }}
              title="My Workspace — Curated"
            >
              <span className="text-[#c094ff] text-[18px]">♛</span>
            </div>
          )}
        </div>
      </aside>

      {/* Portaled to document.body: the sidebar's wrapper div (`relative z-10`) creates its own
        stacking context, so a fixed modal rendered inside it still loses to <main>'s z-10 layer
        on DOM-order tie-break, no matter how high its own z-index is. A portal escapes that
        entirely and centers on the true viewport. */}
      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {weatherModalOpen && (
                <WeatherModalDark onClose={() => setWeatherModalOpen(false)} />
              )}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}

// ─── Top bar ───────────────────────────────────────────────────────────────────

function ProfileMenu() {
  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  const [profileImageFailed, setProfileImageFailed] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const popoverMotion = getPopoverMotion(Boolean(useReducedMotion()));
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) return;
        const session = (await response.json()) as {
          user?: { image?: string | null };
        };
        if (active && session.user?.image) setProfileImage(session.user.image);
      } catch {
        // no session — keep the default avatar
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onClickAway = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    window.addEventListener("mousedown", onClickAway);
    return () => window.removeEventListener("mousedown", onClickAway);
  }, [menuOpen]);

  const avatarSrc =
    profileImage && !profileImageFailed ? profileImage : imgAvatar;

  return (
    <div className="relative flex-shrink-0" ref={menuRef}>
      {/* Profile — avatar · name · personal workspace · chevron */}
      <div
        className="flex items-center gap-[10px] cursor-pointer"
        onClick={() => setMenuOpen((o) => !o)}
      >
        <img
          alt="Profile"
          src={avatarSrc}
          onError={() => setProfileImageFailed(true)}
          className="size-[46px] rounded-full object-cover flex-shrink-0"
          style={{
            boxShadow:
              "0 0 0 2px rgba(160,110,255,0.45), 0 4px 12px rgba(0,0,0,0.4)",
          }}
        />
        <div className="flex-shrink-0">
          <p className="text-white font-semibold text-[16px] leading-tight whitespace-nowrap">
            Phil
          </p>
          <p className="text-[#aab2c8] text-[13px] whitespace-nowrap">
            Personal
          </p>
        </div>
        <ChevronDown
          className="text-[#aab2c8] flex-shrink-0 transition-transform ml-[6px]"
          style={{
            width: 16,
            height: 16,
            transform: menuOpen ? "rotate(180deg)" : "none",
          }}
        />
      </div>

      <AnimatePresence>
        {menuOpen && (
        <motion.div
          {...popoverMotion}
          className="absolute right-0 top-[calc(100%+10px)] rounded-2xl overflow-hidden z-50"
          style={{
            width: 200,
            backdropFilter: "blur(14px) saturate(160%)",
            background: "rgba(15,20,48,0.92)",
            border: "1px solid rgba(141,150,172,0.22)",
            boxShadow:
              "0 16px 38px rgba(0,4,20,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
            padding: 6,
            transformOrigin: "top right",
          }}
        >
          <div
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-[10px] px-3 py-[9px] rounded-[10px] cursor-pointer text-[#e7ecff] text-[13px] font-medium hover:bg-[rgba(255,255,255,0.06)] transition-colors"
          >
            <Settings2 style={{ width: 15, height: 15 }} />
            Account Settings
          </div>
          <button
            type="button"
            onClick={() => void signOutFromApp()}
            className="flex w-full items-center gap-[10px] px-3 py-[9px] rounded-[10px] cursor-pointer text-[#fca5a5] text-[13px] font-medium hover:bg-[rgba(255,255,255,0.06)] transition-colors"
          >
            <LogOut style={{ width: 15, height: 15 }} />
            Logout
          </button>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CommandPaletteDark({
  query,
  setQuery,
  results,
  onClose,
  inputRef,
}: {
  query: string;
  setQuery: (q: string) => void;
  results: DashboardToolView[];
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { setToolFavorite, favoritePendingIds } = useDashboardWorkspace();

  return (
    <div
      onClick={onClose}
      className="dashboard-motion-root dashboard-overlay-backdrop fixed inset-0 z-[100] flex items-start justify-center"
      style={{
        background: "rgba(2,6,23,0.6)",
        paddingTop: "12vh",
        zIndex: 120,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-shine-card rounded-2xl overflow-hidden flex flex-col"
        style={{
          width: "min(560px,90vw)",
          maxHeight: "60vh",
          background: "rgba(20,16,48,0.92)",
          backdropFilter: "blur(20px) saturate(170%) brightness(1.2)",
          border: "1px solid rgba(160,110,255,0.24)",
          boxShadow: "0 24px 60px rgba(0,4,20,0.4)",
        }}
      >
        <div
          className="flex items-center gap-[10px] px-4 py-[14px] flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(160,110,255,0.14)" }}
        >
          <SearchIcon />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
            placeholder="Search tools, agents, files…"
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-[#f2f4fa] text-[14px]"
          />
          <span
            className="text-[11px] text-[#9aa3be] rounded-[6px] px-[6px] py-[2px] flex-shrink-0"
            style={{ border: "1px solid rgba(186,150,253,0.25)" }}
          >
            Esc
          </span>
        </div>
        <div
          className="flex-1 overflow-y-auto px-2 pt-2 pb-4 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {results.length > 0 ? (
            results.map((t) => {
              const Link = t.href ? "a" : "div";
              const isFavorite = t.tool.favorite;
              const favoritePending = favoritePendingIds.includes(t.id);
              return (
                <div
                  key={t.label}
                  className="flex items-center gap-3 px-[10px] py-[10px] rounded-[10px] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                >
                  {/* A <button> can't nest inside an <a>, so the star lives as a sibling of
                      the navigable part rather than inside it. */}
                  <Link
                    {...(t.href
                      ? {
                          href: t.href,
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {})}
                    onClick={onClose}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    <div
                      className="flex items-center justify-center rounded-[9px] size-[40px] flex-shrink-0 overflow-hidden"
                      style={{
                        background: t.bg,
                        border: `1px solid ${t.border}`,
                      }}
                    >
                      {t.icon}
                    </div>
                    <span className="flex-1 min-w-0 text-[13px] font-semibold text-[#f2f4fa] truncate">
                      {t.label}
                    </span>
                  </Link>
                  <button
                    type="button"
                    aria-label={
                      favoritePending
                        ? `Updating ${t.label} favorite`
                        : isFavorite
                        ? `Remove ${t.label} from favorites`
                        : `Add ${t.label} to favorites`
                    }
                    disabled={favoritePendingIds.includes(t.id)}
                    onClick={() =>
                      void setToolFavorite(t.id, !isFavorite).catch(() => undefined)
                    }
                    className="flex-shrink-0 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                    style={{ width: 22, height: 22 }}
                  >
                    {favoritePending ? (
                      <LoaderCircle
                        className="h-4 w-4 animate-spin text-[#a5b4fc] motion-reduce:animate-none"
                        aria-hidden="true"
                      />
                    ) : (
                      <Star
                        className={isFavorite ? "text-[#facc15]" : "text-[#5c6580]"}
                        style={{ width: 16, height: 16 }}
                        fill={isFavorite ? "#facc15" : "none"}
                        strokeWidth={1.6}
                      />
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-[13px] text-[#7c8698]">
              No matches for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Search bar + ⌘K command palette — extracted so it can render either in the topbar
// (>=951px) or as its own full-width row under the greeting in HeroSection (<951px).
function useToolViews(): DashboardToolView[] {
  const { tools } = useDashboardWorkspace();
  return React.useMemo(() => {
    return tools.map((tool) => {
      const rgb = toolColorRgb(tool.accent);
      const builtIn = builtInToolViews.find((view) => view.id === tool.id);
      if (builtIn) {
        return {
          ...builtIn,
          bg: `rgba(${rgb},0.07)`,
          icon: hasToolIcon(tool.iconKey) ? (
            <DynamicToolIcon
              iconKey={tool.iconKey!}
              color={`rgb(${rgb})`}
              size={28}
              strokeWidth={1.8}
            />
          ) : builtIn.icon,
          label: tool.name,
          href: tool.url,
          tool,
        };
      }
      return {
        id: tool.id,
        icon: (
          <DynamicToolIcon
            iconKey={tool.iconKey ?? DEFAULT_TOOL_ICON_KEY}
            color={`rgb(${rgb})`}
            size={28}
            strokeWidth={1.8}
          />
        ),
        label: tool.name,
        border: `rgba(${rgb},0.45)`,
        bg: `rgba(${rgb},0.07)`,
        shadow: `rgba(${rgb},0.18)`,
        href: tool.url,
        tool,
      };
    });
  }, [tools]);
}

function GlobalSearchBar({ fullWidth }: { fullWidth?: boolean }) {
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const toolViews = useToolViews();

  const openPalette = React.useCallback(() => {
    setPaletteOpen(true);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 30);
  }, []);
  const closePalette = React.useCallback(() => setPaletteOpen(false), []);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
      } else if (e.key === "Escape") {
        closePalette();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openPalette, closePalette]);

  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? toolViews.filter((t) => matchesToolQuery(t.tool, trimmed))
    : toolViews;

  return (
    <>
      <div
        className={`${fullWidth ? "w-full" : "w-[min(600px,26vw)]"} flex items-center gap-3 px-5 h-[48px] rounded-[24px] cursor-pointer`}
        role="button"
        tabIndex={0}
        onClick={openPalette}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openPalette()}
        style={{
          backdropFilter: "blur(10px)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 60%), rgba(7,14,34,0.55)",
          border: "none",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 16px rgba(0,3,14,0.25)",
        }}
      >
        <SearchIcon />
        <p className="text-[#aeb7d2] text-[16px] flex-1 min-w-0 truncate">
          Search tools, agents, files...
        </p>
        {!fullWidth && (
          <div
            className="rounded-[7px] px-3 h-[26px] flex items-center flex-shrink-0"
            style={{ background: "rgba(30,38,65,0.95)", border: "none" }}
          >
            <span className="text-[#9aa3be] text-[12px] font-medium">⌘ K</span>
          </div>
        )}
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {paletteOpen && (
                <CommandPaletteDark
                  query={query}
                  setQuery={setQuery}
                  results={results}
                  onClose={closePalette}
                  inputRef={inputRef}
                />
              )}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}

// Brand mark — the "✦" glyph tile shared by the desktop sidebar and, below 951px, the
// topbar's drawer trigger.
function BrandMark({ size }: { size: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-[13px] flex-shrink-0"
      style={{
        width: size,
        height: size,
        minWidth: size,
        background:
          "linear-gradient(135deg, rgba(140,70,255,0.6) 0%, rgba(63,26,122,0.9) 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px rgba(120,50,220,0.3)",
        border: "1px solid rgba(180,100,255,0.25)",
      }}
    >
      <span
        className="text-[#d0a8ff] font-bold leading-none"
        style={{ fontSize: size * 0.5 }}
      >
        ✦
      </span>
    </div>
  );
}

function TopBar({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  const narrow = useBelowWidth(MOBILE_NAV_BREAKPOINT);

  if (narrow) {
    // Below 951px the sidebar is gone: just the brand mark + name, tap to open the drawer.
    // Search moves into HeroSection; theme switch, settings and the profile menu are dropped.
    return (
      <header data-dashboard-enter className="flex items-center px-5 pt-[42px] pb-0 flex-shrink-0">
        <button
          type="button"
          onClick={onOpenDrawer}
          className="flex items-center gap-3 cursor-pointer"
          aria-label="Open menu"
        >
          <BrandMark size={38} />
          <p className="text-white font-semibold text-[16px] leading-tight whitespace-nowrap">
            Phil&apos;s Studio
          </p>
        </button>
      </header>
    );
  }

  return (
    // pt matches Sidebar's brand row content offset (20px outer margin + 24px inner
    // padding, minus half the height difference between the 44px brand icon and the
    // 48px search bar) so the search bar/profile row lines up with "Phil's Studio",
    // not with the empty top edge of the sidebar's glass panel.
    <header
      data-dashboard-enter
      className="grid relative z-30 px-5 pt-[42px] pb-0 flex-shrink-0"
      style={{
        gridTemplateColumns: "auto 1fr auto",
        gap: "12px",
        alignItems: "center",
      }}
    >
      {/* Search — proportional width matching Figma (599/1632 ≈ 37% of main) */}
      <GlobalSearchBar />

      {/* Spacer — 1fr middle cell */}
      <div />

      {/* Right controls — auto-width right cell, always fully visible */}
      <div className="flex items-center gap-3">
        {/* Theme switch */}
        <div
          className="flex items-center gap-[7px] px-3 h-[46px] rounded-[23px]"
          style={{
            backdropFilter: "blur(9px)",
            background:
              "linear-gradient(87deg, rgba(9,20,40,0.38) 0%, rgba(9,20,40,0.38) 100%), linear-gradient(87deg, rgba(216,211,227,0.10) 0%, rgba(169,167,184,0.05) 50%, rgba(111,116,136,0.01) 100%)",
            border: "1px solid rgba(141,150,172,0.20)",
            boxShadow: "0 8px 24px rgba(0,4,15,0.22)",
          }}
        >
          <IconThemeSwitch />
          <span className="text-[#f4f2ff] text-[13px] font-semibold whitespace-nowrap">
            Light
          </span>
          <div
            className="h-[22px] w-[30px] rounded-[11px] relative flex-shrink-0 ml-[2px]"
            style={{ background: "#7255db" }}
          >
            <div
              className="absolute right-[3px] top-[3px] bg-[#cfc4ff] rounded-[8px] size-[16px]"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
            />
          </div>
        </div>

        {/* Settings */}
        <button
          className="flex items-center justify-center size-[46px] rounded-full transition-opacity hover:opacity-80"
          style={{
            backdropFilter: "blur(9px)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0) 55%), rgba(9,20,40,0.38)",
            border: "1px solid rgba(141,150,172,0.20)",
            boxShadow: "0 8px 24px rgba(0,4,15,0.22)",
          }}
        >
          <Settings
            className="text-[#D8CCFF]"
            style={{ width: 20, height: 20 }}
            strokeWidth={1.9}
          />
        </button>

        <ProfileMenu />
      </div>
    </header>
  );
}

// ─── Live weather + date/time ───────────────────────────────────────────────────
// Ported from src/components/dashboard/panels/WeatherWidget.tsx + DateTimeWidget.tsx

const timeZone = "America/Toronto";
const weatherUrl =
  "https://api.open-meteo.com/v1/forecast?latitude=45.5017&longitude=-73.5673&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FToronto&forecast_days=1";

interface WeatherResponse {
  current: { temperature_2m: number; weather_code: number; is_day: number };
  daily: { temperature_2m_max: number[]; temperature_2m_min: number[] };
}

interface WeatherState {
  temperature: number;
  high: number;
  low: number;
  code: number;
  isDay: boolean;
}

function weatherDetails(
  code: number,
  isDay: boolean,
): { label: string; Icon: IconType } {
  if (code === 0)
    return { label: "Clear", Icon: isDay ? WiDaySunny : WiNightClear };
  if (code === 1 || code === 2)
    return {
      label: "Partly Cloudy",
      Icon: isDay ? WiDayCloudy : WiNightAltCloudy,
    };
  if (code === 3) return { label: "Cloudy", Icon: WiCloud };
  if (code === 45 || code === 48) return { label: "Foggy", Icon: WiFog };
  if ([51, 53, 55, 56, 57, 80, 81, 82].includes(code))
    return { label: "Showers", Icon: WiShowers };
  if ([61, 63, 65, 66, 67].includes(code))
    return { label: "Rain", Icon: WiRain };
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return { label: "Snow", Icon: WiSnow };
  if ([95, 96, 99].includes(code))
    return { label: "Thunderstorm", Icon: WiThunderstorm };
  return { label: "Current Conditions", Icon: WiCloud };
}

function useWeather() {
  const [weather, setWeather] = React.useState<WeatherState | null>(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 8_000);
      try {
        const response = await fetch(weatherUrl, { signal: controller.signal });
        if (!response.ok)
          throw new Error(`Weather request failed: ${response.status}`);
        const data = (await response.json()) as WeatherResponse;
        if (cancelled) return;
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          high: Math.round(data.daily.temperature_2m_max[0]),
          low: Math.round(data.daily.temperature_2m_min[0]),
          code: data.current.weather_code,
          isDay: data.current.is_day === 1,
        });
        setError(false);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        window.clearTimeout(timeout);
      }
    };
    void load();
    const interval = window.setInterval(load, 10 * 60_000);
    window.addEventListener("focus", load);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", load);
    };
  }, []);

  return { weather, error };
}

function useNow() {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    const sync = () => setNow(new Date());
    sync();
    const interval = window.setInterval(sync, 30_000);
    return () => window.clearInterval(interval);
  }, []);
  return now;
}

// ─── Focus timer (Recent Activity card) ─────────────────────────────────────────
// A Pomodoro-style check-in: pick a duration + what you're working on, and when the
// countdown ends it's logged with a timestamp so the card can show "Xm ago" — the log
// itself resets at midnight (see useFocusLog / focus-log.ts).

const FOCUS_DURATIONS_MIN = [5, 10, 15, 20, 25, 30];

interface FocusSession {
  task: string;
  durationMin: number;
  endsAt: number;
}

function formatCountdown(remainingMs: number) {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatTimeAgo(completedAt: number, now: number) {
  const minutes = Math.max(0, Math.floor((now - completedAt) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// Short two-tone chime via the Web Audio API — no external asset needed, and it fails
// silently if audio is unavailable (e.g. autoplay blocked before any user interaction).
// Classic "kitchen timer" alarm — 4 sharp, loud beeps instead of a soft two-note chime,
// since the previous one was easy to miss.
function playFocusChime() {
  try {
    type AudioCtorWindow = Window & {
      webkitAudioContext?: typeof AudioContext;
    };
    const AudioCtx =
      window.AudioContext ?? (window as AudioCtorWindow).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const beepDuration = 0.14;
    const gap = 0.1;
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 988; // B5 — cuts through more than the previous sine tones
      const start = now + i * (beepDuration + gap);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.9, start + 0.008);
      gain.gain.setValueAtTime(0.9, start + beepDuration - 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + beepDuration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + beepDuration + 0.01);
    }
    window.setTimeout(() => void ctx.close(), 1200);
  } catch {
    // Audio unavailable — the completed entry is still logged either way.
  }
}

// Lives in DarkThemePage (not the Recent Activity card) so the countdown keeps running
// in the background even while another stat tab is active.
function useFocusTimer(onComplete: (session: FocusSession) => void) {
  const [session, setSession] = React.useState<FocusSession | null>(null);
  const [remainingMs, setRemainingMs] = React.useState(0);
  const onCompleteRef = React.useRef(onComplete);
  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  React.useEffect(() => {
    if (!session) return;
    const tick = () => {
      const remaining = session.endsAt - Date.now();
      if (remaining <= 0) {
        setRemainingMs(0);
        playFocusChime();
        onCompleteRef.current(session);
        setSession(null);
      } else {
        setRemainingMs(remaining);
      }
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [session]);

  const start = React.useCallback((task: string, durationMin: number) => {
    setSession({
      task,
      durationMin,
      endsAt: Date.now() + durationMin * 60_000,
    });
  }, []);

  const cancel = React.useCallback(() => setSession(null), []);

  return { session, remainingMs, start, cancel };
}

// ─── Music player state ─────────────────────────────────────────────────────────
// Lives in DarkThemePage (not MusicPlayerPanel) with the <audio> element rendered there
// too, so playback survives switching to another stat tab — MusicPlayerPanel only mounts
// while "Favorite Music" is the active tab, and unmounting it would otherwise kill the
// <audio> element and stop the music, same reasoning as useFocusTimer above.
// audioRef is created by the caller (DarkThemePage) and passed in rather than created and
// returned here: bundling a ref into the same object as the callbacks below made the
// react-hooks lint rule treat every property access on that object — even unrelated
// callbacks — as an unsafe ref read once it escaped as a prop.
function formatDuration(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

type MusicPlayMode = "sequential" | "shuffle" | "repeat-one";

const EQUALIZER_NEON_COLORS = [
  "#38bdf8",
  "#499cf5",
  "#5a7cf3",
  "#6b5bf0",
  "#7c3aed",
];
const EQUALIZER_DURATIONS = [0.6, 0.85, 0.55, 0.95, 0.7];

function useMusicPlayer(audioRef: React.RefObject<HTMLAudioElement | null>) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  // One button cycles through all three modes rather than separate shuffle/repeat toggles.
  const [playMode, setPlayMode] = React.useState<MusicPlayMode>("sequential");
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  const track = TRACKS[currentIndex];

  // Drives the progress bar. The <audio> element is created once and persists across
  // track changes (only its src swaps), so these listeners are attached once rather than
  // re-subscribed per track; "loadstart" (fired as soon as a new src starts loading) resets
  // the displayed time so the previous track's numbers don't flash before new metadata loads.
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onLoadStart = () => {
      setCurrentTime(0);
      setDuration(0);
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("loadstart", onLoadStart);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    // Catch-up for the very first track: its metadata can finish loading between mount
    // and this effect running, so the "loadedmetadata" event fires before these listeners
    // are attached and gets missed entirely — duration would then stay stuck at 0:00.
    const catchUp = window.setTimeout(() => {
      if (audio.readyState >= 1) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration || 0);
      }
    }, 0);
    return () => {
      window.clearTimeout(catchUp);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("loadstart", onLoadStart);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [audioRef]);

  const randomIndexExcluding = (exclude: number) => {
    if (TRACKS.length <= 1) return exclude;
    let next = exclude;
    while (next === exclude) next = Math.floor(Math.random() * TRACKS.length);
    return next;
  };

  const playAt = React.useCallback(
    (index: number) => {
      flushSync(() => setCurrentIndex(index));
      const audio = audioRef.current;
      if (!audio) return;
      void audio.play().catch(() => setIsPlaying(false));
    },
    [audioRef],
  );

  // Manual skip always moves through the list (or jumps randomly in shuffle) — repeat-one
  // only kicks in when a track ends on its own, not on an explicit prev/next tap.
  const playNext = React.useCallback(() => {
    playAt(
      playMode === "shuffle"
        ? randomIndexExcluding(currentIndex)
        : (currentIndex + 1) % TRACKS.length,
    );
  }, [currentIndex, playAt, playMode]);

  const playPrev = React.useCallback(() => {
    playAt(
      playMode === "shuffle"
        ? randomIndexExcluding(currentIndex)
        : (currentIndex - 1 + TRACKS.length) % TRACKS.length,
    );
  }, [currentIndex, playAt, playMode]);

  const togglePlay = React.useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [audioRef]);
  const cyclePlayMode = React.useCallback(() => {
    setPlayMode((m) =>
      m === "sequential"
        ? "shuffle"
        : m === "shuffle"
          ? "repeat-one"
          : "sequential",
    );
  }, []);

  const handleEnded = React.useCallback(() => {
    if (playMode === "repeat-one") {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        void audio.play().catch(() => {});
      }
      return;
    }
    if (playMode === "shuffle") {
      playAt(randomIndexExcluding(currentIndex));
      return;
    }
    // Sequential loops the whole library rather than stopping at the last track.
    playAt((currentIndex + 1) % TRACKS.length);
  }, [playMode, currentIndex, playAt, audioRef]);

  const stop = React.useCallback(() => setIsPlaying(false), []);

  // Scrubbing the progress bar — updates both the actual playback position and the
  // displayed currentTime immediately, rather than waiting for the next "timeupdate"
  // event (which can lag a beat behind a drag).
  const seek = React.useCallback(
    (time: number) => {
      const audio = audioRef.current;
      if (!audio || !Number.isFinite(time)) return;
      audio.currentTime = time;
      setCurrentTime(time);
    },
    [audioRef],
  );

  const [volume, setVolumeState] = React.useState(1);
  const setVolume = React.useCallback(
    (v: number) => {
      const clamped = Math.min(1, Math.max(0, v));
      setVolumeState(clamped);
      if (audioRef.current) audioRef.current.volume = clamped;
    },
    [audioRef],
  );
  // Apply once the <audio> element exists — its default volume is 1 anyway, but this
  // keeps it in sync if that default ever changes.
  React.useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only meant to run once, on mount
  }, [audioRef]);

  // Live playback amplitude for audio-reactive visuals (energy sand volume, aurora,
  // etc.) — see useAudioAnalyser for the single-instance AnalyserNode management.
  const {
    bassRef,
    midRef,
    trebleRef,
    energyRef,
    loudnessRef,
    beatPulseRef,
    audioLevelRef,
    bandsRef,
  } = useAudioAnalyser(audioRef, isPlaying);

  return {
    track,
    currentIndex,
    isPlaying,
    playMode,
    currentTime,
    duration,
    volume,
    playAt,
    playNext,
    playPrev,
    togglePlay,
    cyclePlayMode,
    handleEnded,
    stop,
    seek,
    setVolume,
    audioLevelRef,
    bassRef,
    midRef,
    trebleRef,
    energyRef,
    loudnessRef,
    beatPulseRef,
    bandsRef,
  };
}

function FocusSettingsModal({
  onClose,
  onStart,
}: {
  onClose: () => void;
  onStart: (task: string, durationMin: number) => void;
}) {
  const overlayMotion = getOverlayMotion(Boolean(useReducedMotion()));
  const [durationMin, setDurationMin] = React.useState(25);
  const [task, setTask] = React.useState("");

  const handleStart = () => {
    onStart(task.trim() || "Focus session", durationMin);
    onClose();
  };

  return (
    <motion.div
      {...overlayMotion.backdrop}
      onClick={onClose}
      className="dashboard-motion-root dashboard-overlay-backdrop fixed inset-0 z-[95] flex items-center justify-center"
      style={{ background: "rgba(2,6,23,0.6)", padding: 16 }}
    >
      <motion.div
        {...overlayMotion.surface}
        onClick={(e) => e.stopPropagation()}
        className="glass-shine-card rounded-2xl overflow-hidden flex flex-col"
        style={{
          width: "min(360px,100%)",
          background: "rgba(20,16,48,0.94)",
          backdropFilter: "blur(20px) saturate(170%) brightness(1.2)",
          border: "1px solid rgba(160,110,255,0.24)",
          boxShadow: "0 24px 60px rgba(0,4,20,0.4)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(160,110,255,0.14)" }}
        >
          <span className="text-white font-semibold text-[16px]">
            Focus Timer
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center rounded-[8px]"
            style={{
              width: 26,
              height: 26,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(160,110,255,0.2)",
            }}
          >
            <X
              style={{ width: 13, height: 13 }}
              className="text-[#9aa3be]"
              strokeWidth={2}
            />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5">
          <div>
            <p className="text-[#aeb7d2] text-[12px] font-medium mb-2">
              Duration
            </p>
            <div className="grid grid-cols-3 gap-2">
              {FOCUS_DURATIONS_MIN.map((min) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => setDurationMin(min)}
                  className="h-[38px] rounded-[10px] text-[13px] font-semibold transition-colors cursor-pointer"
                  style={{
                    background:
                      durationMin === min
                        ? "linear-gradient(135deg, rgba(140,80,220,0.55) 0%, rgba(85,58,156,0.45) 100%)"
                        : "rgba(255,255,255,0.05)",
                    border:
                      durationMin === min
                        ? "1px solid rgba(160,110,255,0.5)"
                        : "1px solid rgba(141,150,172,0.16)",
                    color: durationMin === min ? "#ffffff" : "#c8d0e4",
                    outline: "none",
                  }}
                >
                  {min}m
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[#aeb7d2] text-[12px] font-medium mb-2">
              What are you working on?
            </p>
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              placeholder="e.g. Deep work on AI Writer"
              className="w-full box-border h-[40px] rounded-[11px] px-3 text-[13px] text-[#f2f4fa] outline-none bg-[rgba(255,255,255,0.05)]"
              style={{ border: "1px solid rgba(141,150,172,0.20)" }}
            />
          </div>

          <button
            type="button"
            onClick={handleStart}
            className="h-[42px] rounded-[11px] text-white text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:brightness-110 hover:shadow-[0_10px_28px_rgba(122,80,230,0.45)]"
            style={{
              background: "linear-gradient(120deg, #7255db, #a86cff)",
              border: "none",
              boxShadow: "0 4px 14px rgba(114,85,219,0.25)",
            }}
          >
            Start {durationMin}m focus session
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Shared narrow-layout breakpoint: below this, the sidebar is replaced by a drawer opened
// from a brand button in the topbar (see MobileNavDrawer / TopBar / DarkThemePage).
const MOBILE_NAV_BREAKPOINT = 951;

function useBelowWidth(px: number) {
  const [below, setBelow] = React.useState(false);
  React.useEffect(() => {
    const check = () => setBelow(window.innerWidth < px);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [px]);
  return below;
}

function WeatherTimeRow() {
  const { weather, error } = useWeather();
  const now = useNow();
  const details = weather ? weatherDetails(weather.code, weather.isDay) : null;
  const WeatherIcon = details?.Icon;

  const timeParts = now
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone,
      }).formatToParts(now)
    : [];
  const clock = timeParts
    .filter((p) => p.type !== "dayPeriod")
    .map((p) => p.value)
    .join("")
    .trim();
  const period = timeParts.find((p) => p.type === "dayPeriod")?.value ?? "";
  const weekday = now
    ? new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone }).format(
        now,
      )
    : "";
  const monthDay = now
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone,
      }).format(now)
    : "";

  return (
    <>
      <div className="flex-1 flex items-center gap-3 justify-start">
        {WeatherIcon ? (
          <WeatherIcon
            className="text-white flex-shrink-0"
            style={{ width: 32, height: 32 }}
            aria-hidden="true"
          />
        ) : (
          <span className="text-white text-[32px] font-bold leading-none flex-shrink-0">
            ☁
          </span>
        )}
        <div>
          <p className="text-white font-extrabold text-[20px] leading-none tracking-[-0.03em] tabular-nums">
            {weather ? `${weather.temperature}°C` : error ? "—" : "…"}
          </p>
          <p className="text-[#b6bdd0] text-[13px]">Montréal</p>
        </div>
      </div>
      <div className="bg-[#4a5470] w-px h-[44px] flex-shrink-0" />
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-white font-extrabold text-[19px] leading-none tracking-[-0.03em]">
          {weekday || "—"}
        </p>
        <p className="text-[#b6bdd0] text-[13px]">
          {monthDay || "Loading date"}
        </p>
      </div>
      <div className="bg-[#4a5470] w-px h-[44px] flex-shrink-0" />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white font-extrabold text-[17px] leading-none tracking-[-0.03em] tabular-nums">
          {clock || "--:--"} {period}
        </p>
      </div>
    </>
  );
}

// ─── Hero section ──────────────────────────────────────────────────────────────

function HeroSection() {
  const [heroPt, setHeroPt] = React.useState("7vh");
  const [addToolOpen, setAddToolOpen] = React.useState(false);
  // Below 1180px the weather card is reachable from the sidebar's Weather shortcut instead, so
  // it's dropped here rather than fighting for space in the narrow right column.
  const [showWeatherCard, setShowWeatherCard] = React.useState(true);
  // Below 951px the greeting + side column no longer have room for Quick Access, so it drops
  // out of that column and becomes its own full-width row underneath.
  const [stackQuickAccess, setStackQuickAccess] = React.useState(false);
  const toolViews = useToolViews();
  const workspace = useDashboardWorkspace();
  const { pinnedToolIds } = workspace;

  React.useEffect(() => {
    const update = () => {
      const tall = window.innerHeight >= 800;
      const wide = window.innerWidth >= 1280;
      setHeroPt(tall && wide ? "11vh" : "7vh");
      setShowWeatherCard(window.innerWidth >= 1180);
      setStackQuickAccess(window.innerWidth < 951);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const quickAccessTools = React.useMemo(() => {
    return selectPinnedTools(toolViews, pinnedToolIds);
  }, [pinnedToolIds, toolViews]);

  const quickAccessPanel = (
    <GlassPanel
      className="h-[20.6vh] flex flex-col px-5 py-4"
      tint="68,60,92"
      opacity={0.27}
      blur="13px"
      lightAngle={151}
    >
      <p className="text-white font-semibold text-[17px] mb-2">Quick Access</p>
      <div className="bg-[rgba(120,135,200,0.16)] h-px mb-3" />
      {/* At >=1180px each tile's width is computed so exactly 4 fill the row (100% minus
          the 3 gaps between them, divided by 4) — any tile past the 4th sits just off the
          edge and is only reachable by scrolling right. */}
      <div
        className="flex gap-2 min-[1180px]:gap-[16px] flex-1 items-center overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <QuickTile
          icon={<IconAddTool />}
          label="Add Tool"
          index={0}
          onClick={() => setAddToolOpen(true)}
        />
        {quickAccessTools.map((t, index) => (
          <QuickTile
            key={t.id}
            icon={t.icon}
            label={t.label}
            index={index + 1}
            href={t.href}
            onClick={() => recordRecentTool(t.id)}
          />
        ))}
      </div>
    </GlassPanel>
  );

  return (
    <>
      <section
        data-dashboard-enter
        className="flex flex-row gap-4 px-5 flex-shrink-0"
      >
        {/* Greeting */}
        <div
          className="flex-1 flex flex-col justify-start"
          style={{ paddingTop: heroPt }}
        >
          <h1 className="text-white font-semibold text-[34px] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Bonjour, Phil ! 👋
          </h1>
          <p className="text-[#e4e7f1] font-medium text-[16px] mt-[14px] drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
            Welcome to your AI Tools Dashboard
          </p>
          <div className="inline-flex items-center gap-[6px] mt-[12px] text-[#aab4cc]">
            <MapPin
              className="flex-shrink-0"
              style={{ width: 15, height: 15 }}
              strokeWidth={2}
              fill="none"
            />
            <span className="text-[15px] font-medium drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
              Montréal, Canada
            </span>
          </div>

          {/* Below 951px the topbar drops the search bar (replaced by the drawer's brand
            button), so it reappears here as its own full-width row. */}
          {stackQuickAccess && (
            <div className="mt-4 max-w-[480px]">
              <GlobalSearchBar fullWidth />
            </div>
          )}
        </div>

        {/* Weather + Quick Access */}
        {!stackQuickAccess && (
          <div
            className="flex flex-col gap-3 w-[min(488px,32vw)] flex-shrink-0"
            style={{ paddingTop: heroPt }}
          >
            {/* Weather */}
            {showWeatherCard && (
              <GlassPanel
                className="h-[11.4vh] flex flex-row items-center px-5 gap-0"
                tint="60,52,68"
                opacity={0.25}
                blur="13px"
                lightAngle={147}
              >
                {/* 3 equal columns — live weather / date / time */}
                <WeatherTimeRow />
              </GlassPanel>
            )}

            {quickAccessPanel}
          </div>
        )}

      </section>

      {typeof document !== "undefined"
        ? createPortal(
            <AddToolModal
              open={addToolOpen}
              onClose={() => setAddToolOpen(false)}
              workspace={workspace}
            />,
            document.body,
          )
        : null}

      {stackQuickAccess && (
        // Generous top margin so the background photo still shows through — down past the
        // yacht, further along the river — instead of Quick Access crowding right up under
        // the search bar.
        <section className="px-5 flex-shrink-0 mt-[9vh]">
          {quickAccessPanel}
        </section>
      )}
    </>
  );
}

// ─── Stats row ─────────────────────────────────────────────────────────────────

type StatKey = "recent" | "categories" | "favorites" | "music" | "completion";

function StatsRow({
  active,
  onSelect,
  completionPercent,
  focusEntryCount,
  categoryCount,
  favoriteCount,
}: {
  active: StatKey;
  onSelect: (key: StatKey) => void;
  completionPercent: number;
  focusEntryCount: number;
  categoryCount: number;
  favoriteCount: number;
}) {
  return (
    // Below 1180px the 5 flex-1 cards would keep shrinking until the bold numbers/labels
    // stop being legible — instead their width locks at a fixed size and the row scrolls
    // horizontally, same fallback pattern already used by the All Tools tile row.
    <section
      data-dashboard-enter
      className="flex gap-3 px-5 flex-shrink-0 overflow-x-auto min-[1180px]:overflow-visible [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: "none" }}
    >
      <StatCard
        icon={
          <History
            className="text-[#9a72ff]"
            style={{ width: 26, height: 26 }}
            strokeWidth={2}
          />
        }
        value={String(focusEntryCount)}
        label="Recent Activities"
        lightAngle={207}
        active={active === "recent"}
        onClick={() => onSelect("recent")}
      />
      <StatCard
        icon={
          <Tags
            className="text-[#C9AE58]"
            style={{ width: 24, height: 24 }}
            strokeWidth={2}
          />
        }
        value={String(categoryCount)}
        label="Categories"
        lightAngle={196}
        active={active === "categories"}
        onClick={() => onSelect("categories")}
      />
      <StatCard
        icon={<IconFavorites />}
        value={String(favoriteCount)}
        label="Favorites"
        lightAngle={183}
        active={active === "favorites"}
        onClick={() => onSelect("favorites")}
      />
      <StatCard
        icon={<IconFavoriteMusic />}
        value={String(TRACKS.length)}
        label="Favorite Music"
        lightAngle={171}
        active={active === "music"}
        onClick={() => onSelect("music")}
      />
      <StatCard
        icon={<IconTaskCompletion />}
        value={`${completionPercent}%`}
        label="Task Completion"
        lightAngle={159}
        active={active === "completion"}
        onClick={() => onSelect("completion")}
      />
    </section>
  );
}

// ─── Bottom row ────────────────────────────────────────────────────────────────

const builtInToolViews: DashboardToolView[] = [
  {
    id: "ap",
    icon: <ToolIconArtsPortfolio />,
    label: "Arts Portfolio",
    border: "rgba(155,108,255,0.45)",
    bg: "rgba(155,108,255,0.13)",
    shadow: "rgba(155,108,255,0.18)",
    href: toolUrlById.get("ap"),
  },
  {
    id: "cv",
    icon: <ToolIconOnlineCv />,
    label: "Online CV",
    border: "rgba(85,167,255,0.45)",
    bg: "rgba(85,167,255,0.13)",
    shadow: "rgba(85,167,255,0.18)",
    href: toolUrlById.get("cv"),
  },
  {
    id: "ps",
    icon: <ToolIconOnlinePs />,
    label: "Online PS",
    border: "rgba(240,98,162,0.45)",
    bg: "rgba(240,98,162,0.13)",
    shadow: "rgba(240,98,162,0.18)",
    href: toolUrlById.get("ps"),
  },
  {
    id: "pdf",
    icon: <ToolIconPdfEditor />,
    label: "PDF Editor",
    border: "rgba(255,122,49,0.45)",
    bg: "rgba(255,122,49,0.13)",
    shadow: "rgba(255,122,49,0.18)",
    href: toolUrlById.get("pdf"),
  },
  {
    id: "am",
    icon: <ToolIconAnimation />,
    label: "Animation",
    border: "rgba(57,200,232,0.45)",
    bg: "rgba(57,200,232,0.13)",
    shadow: "rgba(57,200,232,0.18)",
    href: toolUrlById.get("am"),
  },
  {
    id: "mm",
    icon: <ToolIconMindmap />,
    label: "Mindmap",
    border: "rgba(45,212,191,0.45)",
    bg: "rgba(45,212,191,0.13)",
    shadow: "rgba(45,212,191,0.18)",
    href: toolUrlById.get("mm"),
  },
  {
    id: "sm",
    icon: <ToolIconStudyMate />,
    label: "Study Mate",
    border: "rgba(54,211,153,0.45)",
    bg: "rgba(54,211,153,0.13)",
    shadow: "rgba(54,211,153,0.18)",
    href: toolUrlById.get("sm"),
  },
  {
    id: "no",
    icon: <ToolIconNotion />,
    label: "Notion",
    border: "rgba(221,226,239,0.40)",
    bg: "rgba(221,226,239,0.09)",
    shadow: "rgba(221,226,239,0.12)",
    href: toolUrlById.get("no"),
  },
  {
    id: "ai",
    icon: <ToolIconAgentNote />,
    label: "Agent Note",
    border: "rgba(182,124,255,0.45)",
    bg: "rgba(182,124,255,0.13)",
    shadow: "rgba(182,124,255,0.18)",
    href: toolUrlById.get("ai"),
  },
].map((view) => ({
  ...view,
  tool: TOOLS_RAW.find((tool) => tool.id === view.id)!,
}));

// Recent Activity doubles as a Pomodoro-style focus-timer check-in: "Settings" opens
// FocusSettingsModal to pick a duration + task, the countdown runs in DarkThemePage (via
// useFocusTimer) so it survives switching stat tabs, and on completion the entry lands
// here with a live "Xm ago" timestamp. The log itself clears at midnight (useFocusLog).
function RecentActivityPanel({
  entries,
  session,
  remainingMs,
  onOpenSettings,
  onCancelSession,
}: {
  entries: FocusEntry[];
  session: FocusSession | null;
  remainingMs: number;
  onOpenSettings: () => void;
  onCancelSession: () => void;
}) {
  const now = useNow();
  const nowMs = now?.getTime() ?? 0;

  return (
    <GlassPanel
      className="w-[min(420px,37vw)] flex-shrink-0 flex flex-col px-5 pt-4 pb-5 overflow-hidden max-[950px]:w-full max-[950px]:min-h-[240px] max-[950px]:order-1"
      tint="44,34,64"
      opacity={0.3}
      blur="14px"
      lightAngle={166}
      highlightOpacity={0.55}
    >
      <div className="flex items-center justify-between mb-[22px] flex-shrink-0">
        <p className="text-white font-semibold text-[18px]">Recent Activity</p>
        <button
          type="button"
          onClick={onOpenSettings}
          className="text-[#9a70ff] text-[14px] font-medium hover:text-[#b590ff] transition-colors cursor-pointer"
        >
          Settings
        </button>
      </div>

      {session && (
        <div
          className="flex items-center justify-between rounded-[12px] px-4 py-3 mb-3 flex-shrink-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(139,92,246,0.26) 0%, rgba(99,102,241,0.26) 100%)",
            border: "1px solid rgba(140,80,220,0.32)",
          }}
        >
          <div className="min-w-0">
            <p className="text-white text-[13px] font-semibold truncate">
              {session.task}
            </p>
            <p className="text-[#c8d0e4] text-[11px] mt-[2px] tabular-nums">
              {formatCountdown(remainingMs)} remaining
            </p>
          </div>
          <button
            type="button"
            onClick={onCancelSession}
            aria-label="Cancel focus session"
            className="flex items-center justify-center rounded-[8px] flex-shrink-0 cursor-pointer"
            style={{
              width: 26,
              height: 26,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(160,110,255,0.2)",
            }}
          >
            <X
              style={{ width: 13, height: 13 }}
              className="text-[#9aa3be]"
              strokeWidth={2}
            />
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0 relative">
        {entries.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center px-4">
            <p className="text-[#7c8698] text-[13px] leading-relaxed">
              No focus sessions logged yet today — hit Settings to start one.
            </p>
          </div>
        ) : (
          <div
            className="absolute inset-0 overflow-y-auto flex flex-col px-2 [&::-webkit-scrollbar]:hidden"
            style={{
              scrollbarWidth: "none",
              maskImage:
                "linear-gradient(to bottom, black 72%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 72%, transparent 100%)",
            }}
          >
            {entries.map((entry, i) => {
              const color = categoryBarColors[i % categoryBarColors.length];
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 flex-shrink-0 mb-[14px] last:mb-0"
                >
                  <span
                    className="rounded-full flex-shrink-0"
                    style={{
                      width: 8,
                      height: 8,
                      background: color,
                      boxShadow: `0 0 6px 2px ${color}99, 0 0 2px ${color}`,
                    }}
                  />
                  <p className="text-[#d7dcee] text-[12px] font-medium flex-1 leading-snug truncate">
                    {entry.task} · {entry.durationMin}m
                  </p>
                  <span className="text-[#6a748e] text-[11px] flex-shrink-0 whitespace-nowrap">
                    {formatTimeAgo(entry.completedAt, nowMs)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </GlassPanel>
  );
}

// ─── Music player — shown in place of Recent Activity when "Favorite Music" is active ──
// Files live in public/music/*.mp3 (metadata hand-mapped in lib/dashboard/music.ts since
// there's no build-time directory scan available to a client component).

const VOLUME_WAVE_CONTROLS = [
  {
    phase: 0.18,
    period: 1750,
    amplitude: 0.7,
    peak: 0.86,
    slope: 0.32,
    hue: 188,
    brightness: 0.88,
  },
  {
    phase: 1.42,
    period: 2230,
    amplitude: 0.94,
    peak: 1.08,
    slope: 0.46,
    hue: 201,
    brightness: 1.02,
  },
  {
    phase: 2.36,
    period: 1490,
    amplitude: 0.62,
    peak: 0.76,
    slope: 0.27,
    hue: 224,
    brightness: 0.84,
  },
  {
    phase: 3.72,
    period: 2680,
    amplitude: 1.08,
    peak: 1.18,
    slope: 0.54,
    hue: 248,
    brightness: 1.12,
  },
  {
    phase: 4.64,
    period: 1960,
    amplitude: 0.8,
    peak: 0.9,
    slope: 0.38,
    hue: 214,
    brightness: 0.94,
  },
  {
    phase: 5.48,
    period: 2410,
    amplitude: 0.98,
    peak: 1.03,
    slope: 0.49,
    hue: 232,
    brightness: 1.06,
  },
] as const;

function AmbientVolumeWaveform({
  isPlaying,
  audioLevelRef,
}: {
  isPlaying: boolean;
  audioLevelRef?: React.RefObject<number>;
}): React.ReactElement {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const hasPlayedRef = React.useRef(isPlaying);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hasPlayed = hasPlayedRef.current;
    if (isPlaying) hasPlayedRef.current = true;
    const shouldSettle = !isPlaying && hasPlayed;
    const settleStartedAt = performance.now();
    let animationFrame: number | null = null;
    let width = 0;
    let height = 0;
    // Where the wave's fixed head/baseline sits, in canvas-local px — measured directly
    // off the real <input class="volume-slider"> element's position each resize, rather
    // than a hand-tuned fraction of the canvas height. The canvas is deliberately bigger
    // than the slider (bleed room for the glow), so a fixed fraction drifted out of sync
    // with the slider's actual position the moment either box's size changed; reading the
    // real DOM rect keeps them locked together regardless.
    let baseline = 0;
    // The wave's x-axis is mapped over [trackLeft, trackLeft + trackWidth] — the real
    // slider's horizontal span in canvas-local px — not the wider canvas box itself
    // (which has left/right bleed room baked into its CSS size for the glow).
    let trackLeft = 0;
    let trackWidth = 0;

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const slider = canvas.parentElement?.querySelector(
        "input.volume-slider",
      );
      if (slider) {
        const sliderBounds = slider.getBoundingClientRect();
        baseline = sliderBounds.top + sliderBounds.height / 2 - bounds.top;
        trackLeft = sliderBounds.left - bounds.left;
        trackWidth = sliderBounds.width;
      } else {
        baseline = height * 0.86;
        trackLeft = 0;
        trackWidth = width;
      }
    };

    const draw = (now: number, activity: number) => {
      if (width <= 0 || height <= 0) return;

      context.clearRect(0, 0, width, height);

      // A mild power curve on top of the raw activity range — pushes mid/low values
      // darker while keeping the loud end near full brightness, so the light/dark
      // contrast between quiet and loud moments reads more strongly than a straight
      // linear fade would.
      const waveformStrength = Math.pow(0.1 + activity * 0.9, 1.4);
      const lastIndex = VOLUME_WAVE_CONTROLS.length - 1;
      const points = VOLUME_WAVE_CONTROLS.map((control, index) => {
        // The head is pinned exactly on the volume line's own start — no movement at
        // all — so the curve visibly grows out of that fixed point rather than floating
        // independently above it. A short ease-in over the first couple of points keeps
        // the transition from the pinned head into the free-floating wave smooth instead
        // of a sharp kink.
        if (index === 0) {
          return { x: trackLeft, y: baseline, control };
        }
        const easeIn = Math.min(1, index / 1.5);
        const primary = Math.sin(
          (now / control.period) * Math.PI * 2 + control.phase,
        );
        const secondary = Math.sin(
          (now / (control.period * (1 + control.slope))) * Math.PI * 2 +
            control.phase * 1.7,
        );
        const rawMovement =
          (primary * control.amplitude + secondary * control.slope) / 1.35;
        // Clamped to non-negative so the curve only ever rises above the volume line's
        // baseline, never dips below it.
        const movement = Math.max(0, rawMovement) * easeIn;
        const x = trackLeft + (index / lastIndex) * trackWidth;
        const y =
          baseline - movement * height * 0.32 * control.peak * waveformStrength;
        return { x, y, control };
      });
      // Spans cyan → purple → pink (not the narrow ~40° cyan/blue cluster the raw control
      // hues gave, which barely read as a gradient at a glance) — matches the rest of the
      // card's blue-to-purple-to-pink neon palette (Side Rays, Magic Rings, the play ring).
      const hueDrift = activity * 10 * Math.sin(now / 1300);
      const topHue = 192 + hueDrift;
      const midHue = 268 + hueDrift * 0.5;
      const edgeHue = 322 - hueDrift;

      const traceWave = () => {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (let index = 1; index < points.length; index += 1) {
          const previous = points[index - 1];
          const point = points[index];
          context.quadraticCurveTo(
            previous.x,
            previous.y,
            (previous.x + point.x) / 2,
            (previous.y + point.y) / 2,
          );
        }
        const lastPoint = points[points.length - 1];
        context.lineTo(lastPoint.x, lastPoint.y);
      };

      context.save();
      traceWave();
      context.lineTo(width, height);
      context.lineTo(0, height);
      context.closePath();
      const fill = context.createLinearGradient(0, 0, 0, height);
      fill.addColorStop(
        0,
        `hsla(${topHue}, 100%, 72%, ${0.68 * waveformStrength})`,
      );
      fill.addColorStop(
        0.48,
        `hsla(${midHue}, 100%, 68%, ${0.4 * waveformStrength})`,
      );
      fill.addColorStop(1, `hsla(${edgeHue}, 100%, 64%, 0.04)`);
      context.fillStyle = fill;
      context.shadowBlur = 18 + activity * 14;
      context.shadowColor = `hsla(${midHue}, 100%, 68%, ${0.55 * waveformStrength})`;
      context.fill();
      context.restore();

      context.save();
      traceWave();
      const line = context.createLinearGradient(0, 0, width, 0);
      line.addColorStop(
        0,
        `hsla(${topHue}, 100%, 80%, ${0.75 * waveformStrength})`,
      );
      line.addColorStop(
        0.52,
        `hsla(${midHue}, 100%, 82%, ${waveformStrength})`,
      );
      line.addColorStop(
        1,
        `hsla(${edgeHue}, 100%, 78%, ${0.8 * waveformStrength})`,
      );
      context.strokeStyle = line;
      context.lineWidth = 1.6 + activity * 1.1;
      context.shadowBlur = 10 + activity * 10;
      context.shadowColor = `hsla(${midHue}, 100%, 78%, ${waveformStrength})`;
      context.stroke();
      context.restore();

      const brightness =
        VOLUME_WAVE_CONTROLS.reduce(
          (total, point) => total + point.brightness,
          0,
        ) / VOLUME_WAVE_CONTROLS.length;
      const baselineGlow = context.createLinearGradient(0, 0, width, 0);
      baselineGlow.addColorStop(
        0,
        `hsla(${topHue}, 100%, ${72 * brightness}%, 0.32)`,
      );
      baselineGlow.addColorStop(
        0.5,
        `hsla(${midHue}, 100%, ${78 * brightness}%, 0.76)`,
      );
      baselineGlow.addColorStop(
        1,
        `hsla(${edgeHue}, 100%, ${74 * brightness}%, 0.36)`,
      );
      context.save();
      context.beginPath();
      context.moveTo(0, baseline + 1);
      context.lineTo(width, baseline + 1);
      context.strokeStyle = baselineGlow;
      context.lineWidth = 1;
      context.shadowBlur = 7;
      context.shadowColor = `hsla(${midHue}, 100%, 78%, 0.7)`;
      context.stroke();
      context.restore();
    };

    const stopAnimation = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };

    // While playing, driven by the real audio level instead of a flat 1 — a low baseline
    // (quiet passages read as visibly dim) scaled up hard toward louder ones (bright),
    // so the light/dark swing between quiet and loud moments actually reads at a glance
    // instead of the whole range being compressed into a narrow, subtle band.
    const playingActivity = () => {
      const level = audioLevelRef?.current ?? 1;
      return Math.min(1, 0.12 + level * 1.9);
    };

    const animate = (now: number) => {
      if (mediaQuery.matches) {
        draw(now, 0);
        stopAnimation();
        return;
      }

      const elapsed = now - settleStartedAt;
      const activity = isPlaying
        ? playingActivity()
        : shouldSettle
          ? Math.max(0, 1 - Math.min(1, elapsed / 400))
          : 0;
      draw(now, activity);

      if (isPlaying || (shouldSettle && elapsed < 400)) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        animationFrame = null;
      }
    };

    const getActivity = (now: number) => {
      if (isPlaying) return playingActivity();
      if (!shouldSettle) return 0;
      return Math.max(0, 1 - Math.min(1, (now - settleStartedAt) / 400));
    };

    const redrawForMotionPreference = () => {
      stopAnimation();
      const now = performance.now();
      draw(now, mediaQuery.matches ? 0 : getActivity(now));
      if (
        !mediaQuery.matches &&
        (isPlaying || (shouldSettle && now - settleStartedAt < 400))
      ) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      const now = performance.now();
      draw(now, mediaQuery.matches ? 0 : getActivity(now));
    });

    resizeCanvas();
    resizeObserver.observe(canvas);
    mediaQuery.addEventListener("change", redrawForMotionPreference);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      stopAnimation();
      resizeObserver.disconnect();
      mediaQuery.removeEventListener("change", redrawForMotionPreference);
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="volume-waveform-canvas"
    />
  );
}

function MusicPlayerPanel({
  track,
  currentIndex,
  isPlaying,
  playMode,
  currentTime,
  duration,
  volume,
  onPlayAt,
  onPlayNext,
  onPlayPrev,
  onTogglePlay,
  onCyclePlayMode,
  onVolumeChange,
  onSeek,
  audioLevelRef,
  bassRef,
  midRef,
  trebleRef,
  energyRef,
  loudnessRef,
  beatPulseRef,
  bandsRef,
}: {
  track: Track;
  currentIndex: number;
  isPlaying: boolean;
  playMode: MusicPlayMode;
  currentTime: number;
  duration: number;
  volume: number;
  onPlayAt: (index: number) => void;
  onPlayNext: () => void;
  onPlayPrev: () => void;
  onTogglePlay: () => void;
  onCyclePlayMode: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  audioLevelRef: React.RefObject<number>;
  bassRef: React.RefObject<number>;
  midRef: React.RefObject<number>;
  trebleRef: React.RefObject<number>;
  energyRef: React.RefObject<number>;
  loudnessRef: React.RefObject<number>;
  beatPulseRef: React.RefObject<number>;
  bandsRef: React.RefObject<Float32Array>;
}) {
  const progressPct =
    duration > 0
      ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
      : 0;
  // The list toggle covers the transport row (prev/play/next) below the now-playing
  // header, not the header itself — see the mode/list icon row further down.
  const [showList, setShowList] = React.useState(false);
  const [showLyrics, setShowLyrics] = React.useState(false);
  const lyricLines = useLyricsTimeline(track.lyricsSlug, showLyrics, duration);

  const isPlayingRef = React.useRef(isPlaying);
  React.useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  // Falls back to the plain Canvas2D waveform if WebGL init fails for any reason — the
  // volume slider itself is unaffected either way, since it's a separate native <input>.
  const [energyVisualFailed, setEnergyVisualFailed] = React.useState(false);
  const handleEnergyVisualFallback = React.useCallback(() => {
    setEnergyVisualFailed(true);
  }, []);

  // Drag-to-seek on the progress bar — the whole bar is the hit target (not just the
  // dot), since a 7px dot alone would be a tiny, fiddly thing to grab.
  const progressBarRef = React.useRef<HTMLDivElement>(null);
  const seekFromClientX = React.useCallback(
    (clientX: number) => {
      const bar = progressBarRef.current;
      if (!bar || duration <= 0) return;
      const rect = bar.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      onSeek(pct * duration);
    },
    [duration, onSeek],
  );
  const handleProgressPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    seekFromClientX(e.clientX);
  };
  const handleProgressPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    seekFromClientX(e.clientX);
  };
  const handleProgressPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };
  // Remembers the level to restore to when un-muting, since muting just drives volume to 0.
  const lastVolumeRef = React.useRef(volume || 1);
  React.useEffect(() => {
    if (volume > 0) lastVolumeRef.current = volume;
  }, [volume]);
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  // Cover-art spin driven directly via requestAnimationFrame + a ref, rather than a CSS
  // @keyframes animation — the earlier CSS-class-driven border glow silently never showed
  // up for reasons that didn't reproduce under inspection, so rotation uses the same
  // "drive it straight from JS" workaround to guarantee it actually plays.
  const coverRef = React.useRef<HTMLDivElement>(null);
  const rotationRef = React.useRef(0);
  React.useEffect(() => {
    const el = coverRef.current;
    if (!el) return;
    // Only spin real (circular) cover art. A rounded-square fallback tile has corners
    // that swing outside its circular neon ring/glow every rotation — reads as a
    // broken rotated-diamond glitch instead of a spinning record.
    if (!isPlaying || !track.cover) {
      el.style.transform = "rotate(0deg)";
      return;
    }
    const degPerMs = 360 / 7000; // one full turn every 7s
    let lastTime = performance.now();
    let frameId: number;
    const tick = (now: number) => {
      rotationRef.current =
        (rotationRef.current + (now - lastTime) * degPerMs) % 360;
      lastTime = now;
      el.style.transform = `rotate(${rotationRef.current}deg)`;
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, track.cover]);

  return (
    <GlassPanel
      className="music-player-card flex-shrink-0 flex flex-col px-5 pt-4 pb-5 overflow-hidden max-[950px]:min-h-[240px] max-[950px]:order-1"
      tint="34,34,95"
      opacity={0.2}
      blur="14px"
      lightAngle={166}
      highlightOpacity={0.55}
    >
      {/* React Bits' Side Rays — two blended light beams cast from the top-right corner
          across the whole card. Absolutely positioned behind all the real content,
          pointer-events off so it never intercepts clicks. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -10,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <SideRays
          rayColor1="#60a5fa"
          rayColor2="#c084fc"
          origin="top-right"
          intensity={2.2}
          spread={1.8}
          opacity={0.65}
        />
      </div>

      {/* Same flowing conic-gradient border glow as .glass-shine-card:hover, but rendered
          as a real element driven by the isPlaying prop directly (inline style) instead of
          a CSS class toggle on the shared GlassPanel wrapper — that route never showed up,
          so this sidesteps whatever was swallowing the class-based version entirely. */}
      {isPlaying && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            padding: "1.5px",
            borderRadius: 16,
            pointerEvents: "none",
            background: `conic-gradient(
              from var(--glass-border-angle, 35deg),
              transparent 0deg,
              rgba(103, 232, 249, 0.16) 24deg,
              rgba(96, 165, 250, 0.95) 48deg,
              rgba(186, 230, 253, 0.3) 72deg,
              transparent 112deg,
              transparent 180deg,
              rgba(216, 180, 254, 0.18) 204deg,
              rgba(192, 132, 252, 0.95) 228deg,
              rgba(244, 114, 182, 0.34) 252deg,
              transparent 292deg,
              transparent 360deg
            )`,
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            maskComposite: "exclude",
            filter:
              "drop-shadow(0 0 4px rgba(96, 165, 250, 0.72)) drop-shadow(0 0 7px rgba(192, 132, 252, 0.42))",
            animation: "glass-border-flow 5.2s linear infinite",
          }}
        />
      )}

      {/* Two-column layout — fixed-width left column (art + volume), right column (title,
          artist, progress bar, controls) free to grow. Skips the parts with no matching
          feature here (synced lyrics line, verified badge). */}
      <div className="music-player-layout flex flex-row items-start gap-8 flex-1 min-h-0">
        <div
          className="music-player-left flex flex-col items-center flex-shrink-0 h-full py-2"
          style={{ width: 102 }}
        >
          <div
            className="music-player-cover-shell"
            style={{
              position: "relative",
              width: 102,
              height: 102,
              flexShrink: 0,
            }}
          >
            {/* Ambient background light behind the ring — a soft, heavily blurred FULL DISC
                using the same conic-gradient stops as the ring (not masked down to a thin
                band), so blur actually spreads outward as a halo instead of being clipped
                back to the ring's own width by the mask. Because it shares the ring's exact
                gradient + rotation variable, whatever color the ring shows at a given angle
                is the color glowing behind it there too, and the two stay in sync as they
                spin — instead of one flat fixed-color box-shadow (which is what previously
                made the halo always read as a single flat hue, usually cyan, regardless of
                where the colorful part of the ring currently was). */}
            {isPlaying && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: -11,
                  borderRadius: "50%",
                  pointerEvents: "none",
                  background: `conic-gradient(
                    from var(--glass-border-angle, 35deg),
                    #38bdf8 0deg,
                    #3b82f6 90deg,
                    #9333ea 180deg,
                    #ec4899 270deg,
                    #38bdf8 360deg
                  )`,
                  filter: "blur(18px)",
                  opacity: 0.3,
                  mixBlendMode: "screen",
                  animation: "glass-border-flow 5.2s linear infinite",
                }}
              />
            )}
            {/* Colorful neon outline outside the black vinyl-rim ring — same flowing
                conic-gradient technique as the play button/card, while playing. The glow
                is a blurred duplicate of this exact same multi-color gradient (not a
                fixed-color drop-shadow), so at any point around the ring the light behind
                it matches whatever color the ring itself is there — cyan glows cyan,
                purple glows purple — instead of one flat glow color everywhere. */}
            {isPlaying && (
              <>
                {(["blur", "sharp"] as const).map((layer) => (
                  <div
                    key={layer}
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: -3,
                      borderRadius: "50%",
                      padding: "2px",
                      pointerEvents: "none",
                      // A full closed loop (no transparent gap segments) — at this smaller
                      // size the card/button's gap-based "comet" pattern read as a
                      // broken/incomplete ring instead of a flowing highlight.
                      background: `conic-gradient(
                        from var(--glass-border-angle, 35deg),
                        #38bdf8 0deg,
                        #3b82f6 90deg,
                        #9333ea 180deg,
                        #ec4899 270deg,
                        #38bdf8 360deg
                      )`,
                      WebkitMask:
                        "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      WebkitMaskComposite: "xor",
                      mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      maskComposite: "exclude",
                      filter: layer === "blur" ? "blur(4px)" : "none",
                      opacity: layer === "blur" ? 0.9 : 1,
                      animation: "glass-border-flow 5.2s linear infinite",
                    }}
                  />
                ))}
              </>
            )}
            <div
              ref={coverRef}
              className={`music-player-cover flex items-center justify-center flex-shrink-0 overflow-hidden ${track.cover ? "rounded-full" : "rounded-[20px]"}`}
              style={{
                position: "relative",
                width: 102,
                height: 102,
                minWidth: 102,
                minHeight: 102,
                background: track.cover ? undefined : `${track.color}22`,
                border: track.cover
                  ? "2px solid rgba(160,150,255,0.5)"
                  : `1px solid ${track.color}55`,
                // While playing, the dynamic multi-color halo behind the ring already
                // supplies the colored light, so this drops back to a plain dark contact
                // shadow instead of layering a second, flat-colored (and previously
                // dominant-looking) glow of its own on top of it.
                boxShadow: isPlaying
                  ? "0 0 20px 2px rgba(0,0,0,0.35)"
                  : `0 0 30px 4px ${track.color}40`,
                transition: isPlaying ? "none" : "transform 600ms ease-out",
              }}
            >
              {track.cover ? (
                // Gramophone-style spinning cover art — the black vinyl-rim ring is on the
                // <img> itself; the colorful ring around it comes from the border above (or
                // the flowing overlay while playing) and rotation is driven on this
                // container, not the <img>, so no-cover tracks still spin their icon too.
                <img
                  src={track.cover}
                  alt=""
                  className="size-full rounded-full object-cover box-border"
                  style={{ border: "4px solid rgba(0,0,0,0.85)" }}
                />
              ) : (
                <Music
                  style={{ width: 34, height: 34, color: track.color }}
                  strokeWidth={2}
                />
              )}
            </div>
          </div>

          {/* Spacer pushes the volume control down so it lines up with the progress
              bar/controls group on the right, instead of hugging the album art. */}
          <div className="flex-1 min-h-0" />

          {/* Volume control — bottom of the fixed-width left column, level with the
              progress bar/controls group on the right. */}
          <div className="flex items-center gap-2 w-full flex-shrink-0">
            <button
              type="button"
              onClick={() =>
                onVolumeChange(volume === 0 ? lastVolumeRef.current : 0)
              }
              aria-label={volume === 0 ? "Unmute" : "Mute"}
              className="flex-shrink-0 cursor-pointer"
              style={{ position: "relative", top: -14 }}
            >
              <VolumeIcon
                className="text-[#8891ac]"
                style={{ width: 16, height: 16 }}
                strokeWidth={2.5}
              />
            </button>
            <div className="volume-waveform-stack flex-1 min-w-0">
              {/* Energy Sand Volume — GPU particle + shader dune, audio-reactive via
                  bass/mid/treble/energy refs (see useAudioAnalyser). Falls back to the
                  plain Canvas2D waveform if WebGL init ever fails; either way the real,
                  accessible volume control is the <input> below, untouched. */}
              <div className="energy-sand-volume-canvas" aria-hidden="true">
                {energyVisualFailed ? (
                  <AmbientVolumeWaveform
                    isPlaying={isPlaying}
                    audioLevelRef={audioLevelRef}
                  />
                ) : (
                  <EnergySandVolume
                    bassRef={bassRef}
                    midRef={midRef}
                    trebleRef={trebleRef}
                    energyRef={energyRef}
                    loudnessRef={loudnessRef}
                    beatPulseRef={beatPulseRef}
                    bandsRef={bandsRef}
                    isPlayingRef={isPlayingRef}
                    onFallback={handleEnergyVisualFallback}
                  />
                )}
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                aria-label="Volume"
                className="volume-slider flex-1 min-w-0"
                // Read by the track's gradient in darktheme.css — only the filled portion
                // (0 to this %) gets the cyan-to-white treatment; the rest stays gray.
                style={{ ["--volume-pct" as string]: `${volume * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="music-player-main relative top-2 flex-1 min-w-0 h-full flex flex-col justify-start gap-3 py-2">
          {/* Now playing — never covered by the song list. Extra top margin pushes it down
              to line up with the album art's vertical position instead of hugging the very
              top edge. */}
          <div className="music-player-heading relative flex items-center gap-3 flex-shrink-0 mt-3">
            <div className="min-w-0 flex-1">
              <p
                className="text-white text-[19px] font-bold truncate leading-tight"
                style={{ textShadow: `0 0 18px ${track.color}80` }}
              >
                {track.title}
              </p>
              {/* Static artist name — no more marquee — plus a neon "verified" check badge */}
              <div className="flex items-center gap-2 mt-[3px] min-w-0">
                <p className="text-[#8891ac] text-[13px] truncate min-w-0">
                  {track.artist}
                </p>
                {/* Scalloped "verified seal" — a center disc plus 6 overlapping petal
                    circles, so the notches between them are naturally rounded (circles
                    have no sharp corners) instead of the pointy polygon-star tips before. */}
                <div
                  aria-hidden="true"
                  className="relative flex-shrink-0"
                  style={{ width: 16, height: 16 }}
                >
                  <svg
                    viewBox="0 0 32 32"
                    width={16}
                    height={16}
                    style={{
                      filter:
                        "drop-shadow(0 0 3px rgba(147,51,234,0.6)) drop-shadow(0 0 5px rgba(59,130,246,0.4))",
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="verifiedBadgeGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                    <g fill="url(#verifiedBadgeGradient)">
                      <circle cx="16" cy="16" r="9" />
                      <circle cx="16" cy="7" r="6" />
                      <circle cx="23.8" cy="11.5" r="6" />
                      <circle cx="23.8" cy="20.5" r="6" />
                      <circle cx="16" cy="25" r="6" />
                      <circle cx="8.2" cy="20.5" r="6" />
                      <circle cx="8.2" cy="11.5" r="6" />
                    </g>
                  </svg>
                  <Check
                    style={{
                      position: "absolute",
                      inset: 0,
                      margin: "auto",
                      width: 9,
                      height: 9,
                    }}
                    className="text-white"
                    strokeWidth={4.5}
                  />
                </div>
              </div>
            </div>
            <div
              className="music-player-equalizer absolute right-0 flex items-end gap-[3px] flex-shrink-0"
              style={{ height: 16, bottom: "100%" }}
              aria-hidden="true"
            >
              {EQUALIZER_NEON_COLORS.map((color, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full flex-shrink-0"
                  style={{
                    background:
                      i === 0 || i === 2 || i === 4
                        ? `linear-gradient(180deg, #ffffff 0%, #ffffff 15%, ${color} 65%, ${color} 100%)`
                        : color,
                    height: 4,
                    animation: isPlaying
                      ? `music-bar-jump ${EQUALIZER_DURATIONS[i]}s steps(5, jump-end) ${i * 0.09}s infinite`
                      : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Song list — covers the progress bar/transport row when open, never the
              title/artist above or the mode/list icons in the control row below */}
          {showList ? (
            <div className="flex-1 min-h-0 relative">
              <div
                className="absolute inset-0 overflow-y-auto flex flex-col gap-[4px] px-1 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none" }}
              >
                {TRACKS.map((t, i) => {
                  const active = i === currentIndex;
                  return (
                    <div
                      key={t.id}
                      onClick={() => onPlayAt(i)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        (e.key === "Enter" || e.key === " ") && onPlayAt(i)
                      }
                      className="flex items-center gap-3 px-2 py-[7px] rounded-[9px] cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                      style={
                        active
                          ? { background: "rgba(154,112,255,0.14)" }
                          : undefined
                      }
                    >
                      <div
                        className="relative flex items-center justify-center overflow-hidden rounded-[8px] size-[30px] flex-shrink-0"
                        style={{
                          background: t.cover ? undefined : `${t.color}22`,
                          border: `1px solid ${t.color}45`,
                        }}
                      >
                        {t.cover && (
                          <img
                            src={t.cover}
                            alt=""
                            className="absolute inset-0 size-full object-cover"
                          />
                        )}
                        {active && isPlaying ? (
                          <div
                            className="relative flex items-end gap-[2px]"
                            style={{
                              height: 12,
                              // A dark scrim behind the bars when there's a cover image
                              // underneath, so they stay visible against a bright photo
                              // instead of blending in.
                              ...(t.cover
                                ? {
                                    background: "rgba(0,0,0,0.45)",
                                    borderRadius: 4,
                                    padding: "2px 4px",
                                  }
                                : undefined),
                            }}
                            aria-hidden="true"
                          >
                            {[0, 1, 2].map((bi) => (
                              <span
                                key={bi}
                                className="w-[2px] rounded-full flex-shrink-0"
                                style={{
                                  background: t.color,
                                  height: 4,
                                  animation: `music-bar 0.9s ease-in-out ${bi * 0.15}s infinite`,
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          !t.cover && (
                            <Music
                              style={{ width: 13, height: 13, color: t.color }}
                              strokeWidth={2}
                            />
                          )
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[12.5px] font-medium truncate ${active ? "text-white" : "text-[#d7dcee]"}`}
                        >
                          {t.title}
                        </p>
                        <p className="text-[#6a748e] text-[11px] truncate">
                          {t.artist}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* Spacer pushes the progress bar + controls group down, level with the
                  volume control on the left, instead of hugging the title/artist above. */}
              <div className="flex-1 min-h-0 flex items-end justify-center">
                {showLyrics && lyricLines.length > 0 && (
                  <SyncedLyrics
                    lines={lyricLines}
                    currentTime={currentTime}
                    fallback={track.title}
                    endTime={
                      track.lyricsEndTime ??
                      (track.lyricsLoop ? duration : undefined)
                    }
                  />
                )}
              </div>

              {/* Progress bar — draggable to seek. Glowing dot marks the current position;
                  elapsed/total time sit under its left/right ends. */}
              <div
                data-lyrics-progress-motion
                className="flex-shrink-0"
                style={getLyricsProgressMotion(showLyrics)}
              >
                <div
                  ref={progressBarRef}
                  onPointerDown={handleProgressPointerDown}
                  onPointerMove={handleProgressPointerMove}
                  onPointerUp={handleProgressPointerUp}
                  onPointerCancel={handleProgressPointerUp}
                  style={{
                    position: "relative",
                    height: 3,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.16)",
                    cursor: duration > 0 ? "pointer" : "default",
                    touchAction: "none",
                    zIndex: 1,
                  }}
                >
                  {/* Fixed blue-to-purple gradient (matching the volume slider below),
                      not the track's own accent color — per feedback to follow the
                      reference image's colors specifically. */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 999,
                      width: `${progressPct}%`,
                      // Trails off to white at the right end so it blends into the glowing
                      // white dot instead of ending abruptly on purple.
                      background:
                        "linear-gradient(90deg, #55a7ff 0%, #9a70ff 70%, #ffffff 100%)",
                      boxShadow: "0 0 10px 1px rgba(154,112,255,0.4)",
                    }}
                  />
                  {/* Small white dot with a bright, layered glow */}
                  <div
                    style={{
                      position: "absolute",
                      width: 7,
                      height: 7,
                      top: "50%",
                      left: `${progressPct}%`,
                      transform: "translate(-50%, -50%)",
                      borderRadius: "50%",
                      background: "#ffffff",
                      boxShadow:
                        "0 0 2px 1px #ffffff, 0 0 8px 3px rgba(255,255,255,0.85), 0 0 16px 6px rgba(255,255,255,0.5)",
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[#8891ac] text-[12px] tabular-nums">
                    {formatDuration(currentTime)}
                  </span>
                  <span className="text-[#8891ac] text-[12px] tabular-nums">
                    {formatDuration(duration)}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Bottom control row — all icons are direct flex children spaced with
              justify-between so they spread evenly across the row. Mode icon on the far
              left, list-toggle on the far right; both stay visible/clickable even while
              the list is open (the list-toggle also closes it). */}
          <div
            className="flex items-center justify-between flex-shrink-0"
            style={{ position: "relative", top: 2 }}
          >
            <button
              type="button"
              onClick={onCyclePlayMode}
              aria-label="Change play mode"
              className="cursor-pointer transition-transform hover:scale-110"
            >
              {playMode === "shuffle" ? (
                <Shuffle
                  className="text-[#9a70ff]"
                  style={{ width: 16, height: 16 }}
                  strokeWidth={2.5}
                />
              ) : playMode === "repeat-one" ? (
                <Repeat1
                  className="text-[#9a70ff]"
                  style={{ width: 16, height: 16 }}
                  strokeWidth={2.5}
                />
              ) : (
                <Repeat
                  className="text-[#8891ac]"
                  style={{ width: 16, height: 16 }}
                  strokeWidth={2.5}
                />
              )}
            </button>

            {!showList && (
              <button
                type="button"
                onClick={onPlayPrev}
                aria-label="Previous track"
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <SkipBack
                  className="text-white"
                  style={{ width: 18, height: 18 }}
                  fill="currentColor"
                  strokeWidth={2}
                />
              </button>
            )}

            {!showList && (
              <div
                className="music-player-play-shell flex-shrink-0"
                style={{ position: "relative", width: 52, height: 52 }}
              >
                {/* Exact same flowing conic-gradient outline as the card's own isPlaying
                    border effect above — not a glow/shadow, the literal animated outline,
                    just scaled down to button size. */}
                {isPlaying && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      padding: "1.5px",
                      pointerEvents: "none",
                      // Saturated blue → purple/pink, not the card's pale tints — at button
                      // scale those pastel stops just blurred into a whitish haze with no
                      // visible color shift.
                      background: `conic-gradient(
                        from var(--glass-border-angle, 35deg),
                        transparent 0deg,
                        rgba(56, 189, 248, 0.75) 24deg,
                        rgba(59, 130, 246, 1) 48deg,
                        rgba(147, 197, 253, 0.85) 72deg,
                        transparent 112deg,
                        transparent 180deg,
                        rgba(217, 70, 239, 0.7) 204deg,
                        rgba(168, 85, 247, 1) 228deg,
                        rgba(244, 114, 182, 0.85) 252deg,
                        transparent 292deg,
                        transparent 360deg
                      )`,
                      WebkitMask:
                        "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      WebkitMaskComposite: "xor",
                      mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      maskComposite: "exclude",
                      // Brighter + wider-spread glow than before (was reading too dim).
                      filter:
                        "drop-shadow(0 0 2px rgba(59, 130, 246, 1)) drop-shadow(0 0 4px rgba(168, 85, 247, 0.9)) drop-shadow(0 0 7px rgba(147, 197, 253, 0.6))",
                      animation: "glass-border-flow 5.2s linear infinite",
                    }}
                  />
                )}
                {/* Paused state — React Bits' MagicRings shader, concentric neon rings
                    pulsing outward from the button. Sized bigger than the button and
                    centered behind it (pointer-events off, lower z-index) so the rings
                    radiate past its edge without blocking clicks or covering the icon. */}
                {!isPlaying && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: -19,
                      pointerEvents: "none",
                      zIndex: 0,
                    }}
                  >
                    <MagicRings
                      color="#38bdf8"
                      colorTwo="#c084fc"
                      ringCount={3}
                      baseRadius={0.25}
                      radiusStep={0.07}
                      lineThickness={0.8}
                      attenuation={14}
                      scaleRate={0.08}
                      noiseAmount={0.04}
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={onTogglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="music-player-play-button flex items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-105"
                  style={{
                    width: 52,
                    height: 52,
                    // Saturated blue-to-purple fill, not a pale pastel — the earlier lighter
                    // version still read as washed-out white with no visible color shift.
                    background:
                      "linear-gradient(135deg, rgba(0, 184, 219,0.2), rgba(147,51,234,0.45))",
                    border: "2px solid rgba(255,255,255,0.25)",
                    boxShadow:
                      "0 6px 18px rgba(0,0,0,0.25) inset, 0 0 14px 2px rgba(59,130,246,0.45), 0 0 26px 6px rgba(168,85,247,0.3)",
                    outline: "none",
                  }}
                >
                  {isPlaying ? (
                    <Pause
                      className="text-white"
                      style={{ width: 20, height: 20 }}
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ) : (
                    <Play
                      className="text-white"
                      style={{ width: 20, height: 20, marginLeft: 2 }}
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  )}
                </button>
              </div>
            )}

            {!showList && (
              <button
                type="button"
                onClick={onPlayNext}
                aria-label="Next track"
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <SkipForward
                  className="text-white"
                  style={{ width: 18, height: 18 }}
                  fill="currentColor"
                  strokeWidth={2}
                />
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowLyrics((v) => !v)}
              aria-label={showLyrics ? "Hide lyrics" : "Show lyrics"}
              className="flex items-center justify-center rounded-[8px] flex-shrink-0 cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.06)]"
              style={{ width: 26, height: 26 }}
            >
              <Subtitles
                className={showLyrics ? "text-[#9a70ff]" : "text-[#8891ac]"}
                style={{ width: 15, height: 15 }}
                strokeWidth={2.5}
              />
            </button>

            <button
              type="button"
              onClick={() => setShowList((v) => !v)}
              aria-label={showList ? "Back to player" : "Show song list"}
              className="flex items-center justify-center rounded-[8px] flex-shrink-0 cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.06)]"
              style={{ width: 26, height: 26 }}
            >
              <ListMusic
                className={showList ? "text-[#9a70ff]" : "text-[#8891ac]"}
                style={{ width: 15, height: 15 }}
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

// ─── Task Completion — ported from src/components/dashboard/panels/TodoWidget.tsx ──

function TaskCompletionPanel({
  tasks,
  addTask,
  toggleTask,
  updateTask,
  deleteTask,
}: {
  tasks: DailyTask[];
  addTask: (title: string) => boolean;
  toggleTask: (id: string) => void;
  updateTask: (id: string, title: string) => boolean;
  deleteTask: (id: string) => void;
}) {
  const reduceMotion = Boolean(useReducedMotion());
  const listItemMotion = getListItemMotion(reduceMotion);
  const [isAdding, setIsAdding] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null);
  const [draftTitle, setDraftTitle] = React.useState("");
  const cancelledEditIdRef = React.useRef<string | null>(null);
  const completedCount = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? (completedCount / tasks.length) * 100 : 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!addTask(title)) return;
    setTitle("");
    setIsAdding(false);
  };

  const startEditing = (task: DailyTask) => {
    cancelledEditIdRef.current = null;
    setEditingTaskId(task.id);
    setDraftTitle(task.title);
  };

  const finishEditing = (task: DailyTask) => {
    if (cancelledEditIdRef.current === task.id) {
      cancelledEditIdRef.current = null;
      setEditingTaskId(null);
      setDraftTitle("");
      return;
    }
    const nextTitle = draftTitle.trim();
    if (nextTitle) updateTask(task.id, nextTitle);
    setEditingTaskId(null);
    setDraftTitle("");
  };

  return (
    <GlassPanel
      className="w-[min(420px,37vw)] flex-shrink-0 flex flex-col px-5 pt-4 pb-5 overflow-hidden max-[950px]:w-full max-[950px]:min-h-[240px] max-[950px]:order-1"
      tint="44,34,64"
      opacity={0.3}
      blur="14px"
      lightAngle={166}
      highlightOpacity={0.55}
    >
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <p className="text-white font-semibold text-[18px]">
          Task Completion{" "}
          <span className="text-[#8891ac] text-[13px] font-medium">
            ({completedCount}/{tasks.length})
          </span>
        </p>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-[5px] text-[#9a70ff] text-[13px] font-medium hover:text-[#b590ff] transition-colors flex-shrink-0"
        >
          <Plus style={{ width: 14, height: 14 }} />
          Add Task
        </button>
      </div>

      <div
        className="h-[3px] rounded-full overflow-hidden flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-200"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #9a70ff, #55a7ff)",
          }}
        />
      </div>

      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="flex gap-[6px] flex-shrink-0 mt-3"
        >
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setTitle("");
                setIsAdding(false);
              }
            }}
            aria-label="Task title"
            placeholder="What needs to be done?"
            maxLength={120}
            className="flex-1 min-w-0 h-[32px] px-3 rounded-[9px] text-[#f2f4fa] text-[12px] outline-none"
            style={{
              background: "rgba(6,12,35,0.5)",
              border: "1px solid rgba(154,112,255,0.28)",
            }}
          />
          <button
            type="submit"
            disabled={!title.trim()}
            className="h-[32px] px-3 rounded-[9px] text-white text-[12px] font-semibold flex-shrink-0"
            style={{
              background: "#7255db",
              opacity: title.trim() ? 1 : 0.5,
              cursor: title.trim() ? "pointer" : "default",
            }}
          >
            Add
          </button>
        </form>
      )}

      <div
        className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-[6px] mt-3 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {tasks.length === 0 && (
          <div
            className="flex-1 flex items-center justify-center text-[#7c8698] text-[12px] text-center"
            style={{ minHeight: 90 }}
          >
            No tasks yet. Add one for today.
          </div>
        )}
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout={!reduceMotion}
            {...listItemMotion}
            className="group flex items-center gap-[10px] px-[10px] rounded-[10px] flex-shrink-0 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            style={{ minHeight: 44 }}
          >
            <button
              type="button"
              role="checkbox"
              aria-checked={task.done}
              aria-label={`${task.done ? "Mark incomplete" : "Mark complete"}: ${task.title}`}
              onClick={() => toggleTask(task.id)}
              className="flex items-center justify-center rounded-[5px] flex-shrink-0"
              style={{
                width: 18,
                height: 18,
                border: `1px solid ${task.done ? "#9a70ff" : "rgba(255,255,255,0.32)"}`,
                background: task.done ? "#9a70ff" : "transparent",
              }}
            >
              {task.done && (
                <Check
                  style={{ width: 12, height: 12 }}
                  className="text-white"
                  strokeWidth={3}
                />
              )}
            </button>
            {editingTaskId === task.id ? (
              <input
                autoFocus
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                onBlur={() => finishEditing(task)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.currentTarget.blur();
                  if (event.key === "Escape") {
                    cancelledEditIdRef.current = task.id;
                    event.currentTarget.blur();
                  }
                }}
                aria-label={`Edit task: ${task.title}`}
                maxLength={120}
                className="flex-1 min-w-0 h-[30px] rounded-[7px] px-2 text-[12px] font-medium text-[#eef1fb] outline-none"
                style={{
                  background: "rgba(6,12,35,0.5)",
                  border: "1px solid rgba(154,112,255,0.48)",
                  boxShadow: "0 0 12px rgba(154,112,255,0.12)",
                }}
              />
            ) : (
              <button
                type="button"
                onClick={() => startEditing(task)}
                aria-label={`Edit task: ${task.title}`}
                className="flex-1 min-w-0 text-left text-[12px] font-medium truncate"
                style={{
                  color: task.done ? "#7c8698" : "#d7dcee",
                  textDecoration: task.done ? "line-through" : "none",
                }}
              >
                {task.title}
              </button>
            )}
            <div className="relative h-7 w-[68px] flex-shrink-0">
              <span className="absolute inset-0 flex items-center justify-end text-[#6a748e] text-[11px] transition-opacity duration-150 group-hover:opacity-0">
                {formatTaskTime(task.createdAt)}
              </span>
              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete ${task.title}`}
                className="absolute inset-0 flex items-center justify-end gap-1 text-[#ff6b9d] text-[11px] font-medium opacity-0 pointer-events-none transition-[opacity,color] duration-150 group-hover:opacity-100 group-hover:pointer-events-auto focus:opacity-100 focus:pointer-events-auto hover:text-[#ff8eb3]"
              >
                <Trash2 aria-hidden="true" style={{ width: 12, height: 12 }} />
                Delete
              </button>
            </div>
          </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
}

function AllToolsPanel() {
  const toolViews = useToolViews();
  return (
    <DashboardToolTransition>
      {({ sourceRef, startTransition }) => (
        <GlassPanel
          panelRef={sourceRef}
          className="flex-1 min-w-0 flex flex-col px-5 py-4 overflow-hidden max-[950px]:w-full max-[950px]:min-h-[320px] max-[950px]:order-2"
          tint="30,24,50"
          opacity={0.3}
          blur="14px"
          lightAngle={188}
          highlightOpacity={0.55}
        >
          <div className="flex items-center justify-between mb-8 min-[1180px]:mb-5 flex-shrink-0">
            <p className="text-white font-semibold text-[18px]">All Tools</p>
            <button
              type="button"
              onClick={startTransition}
              className="text-[#9a70ff] text-[14px] font-medium hover:text-[#b590ff] transition-colors"
            >
              View All
            </button>
          </div>
          {/* Single row at >=1180px; below that it wraps into 2 rows (grid-auto-flow: column packs
              tiles column-first into 2 rows) while staying horizontally scrollable to the right. */}
          <div
            className="grid grid-flow-col grid-rows-2 gap-x-[31px] gap-y-0.5 min-[1180px]:grid-rows-1 min-[1180px]:items-center overflow-x-auto flex-1 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {toolViews.map((t) => (
              <ToolTile
                key={t.label}
                id={t.id}
                icon={t.icon}
                label={t.label}
                borderColor={t.border}
                bgColor={t.bg}
                shadowColor={t.shadow}
                href={t.href}
              />
            ))}
          </div>
        </GlassPanel>
      )}
    </DashboardToolTransition>
  );
}

// ─── Categories — % share of tools per category tag ────────────────────────────

const categoryBarColors = [
  "#9a70ff",
  "#55a7ff",
  "#f062a2",
  "#36d399",
  "#39c8e8",
  "#ffb545",
  "#ff7a31",
  "#2dd4bf",
];

function CategoriesPanel() {
  const { tools, categories } = useDashboardWorkspace();
  const categoryStats = React.useMemo(
    () => buildCategoryStats(tools, categories),
    [categories, tools],
  );

  return (
    <GlassPanel
      className="w-[min(420px,37vw)] flex-shrink-0 flex flex-col px-5 pt-4 pb-5 overflow-hidden max-[950px]:w-full max-[950px]:min-h-[240px] max-[950px]:order-1"
      tint="44,34,64"
      opacity={0.3}
      blur="14px"
      lightAngle={166}
      highlightOpacity={0.55}
    >
      <div className="flex items-center justify-between mb-[22px] flex-shrink-0">
        <p className="text-white font-semibold text-[18px]">Categories</p>
        <span className="text-[#8891ac] text-[13px]">
          {categories.length} categories
        </span>
      </div>
      <div className="flex-1 min-h-0 relative">
        <div
          className="absolute inset-0 overflow-y-auto flex flex-col gap-[14px] px-2 [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: "none",
            maskImage:
              "linear-gradient(to bottom, black 88%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 88%, transparent 100%)",
          }}
        >
          {categoryStats.map(({ tag, percent }, i) => (
            <div key={tag} className="flex items-center gap-3 flex-shrink-0">
              <span className="text-[#d7dcee] text-[13px] font-medium w-[100px] flex-shrink-0 truncate">
                {tag}
              </span>
              <div
                className="flex-1 h-[8px] rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-300"
                  style={{
                    width: `${percent}%`,
                    background: categoryBarColors[i % categoryBarColors.length],
                  }}
                />
              </div>
              <span className="text-[#b7bed6] text-[13px] font-semibold w-[38px] flex-shrink-0 text-right">
                {percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}

// ─── Favorites — click the filled star to un-favorite and remove from the list ──

function FavoritesPanel({
  favoriteTools,
  favoritePendingIds,
  onToggleFavorite,
}: {
  favoriteTools: DashboardToolView[];
  favoritePendingIds: string[];
  onToggleFavorite: (id: string) => void;
}) {
  const reduceMotion = Boolean(useReducedMotion());
  const listItemMotion = getListItemMotion(reduceMotion);

  return (
    <GlassPanel
      className="w-[min(420px,37vw)] flex-shrink-0 flex flex-col px-5 pt-4 pb-5 overflow-hidden max-[950px]:w-full max-[950px]:min-h-[240px] max-[950px]:order-1"
      tint="44,34,64"
      opacity={0.3}
      blur="14px"
      lightAngle={166}
      highlightOpacity={0.55}
    >
      <div className="flex items-center justify-between mb-[22px] flex-shrink-0">
        <p className="text-white font-semibold text-[18px]">Favorites</p>
        <span className="text-[#8891ac] text-[13px]">
          {favoriteTools.length} favorited
        </span>
      </div>
      <div className="flex-1 min-h-0 relative">
        <div
          className="absolute inset-0 overflow-y-auto flex flex-col gap-[10px] px-2 [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: "none",
            maskImage:
              "linear-gradient(to bottom, black 88%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 88%, transparent 100%)",
          }}
        >
          {favoriteTools.length === 0 && (
            <div
              className="flex-1 flex items-center justify-center text-[#7c8698] text-[13px] text-center"
              style={{ minHeight: 90 }}
            >
              No favorites yet.
            </div>
          )}
          <AnimatePresence initial={false}>
            {favoriteTools.map((t) => (
            <motion.div
              key={t.id}
              layout={!reduceMotion}
              {...listItemMotion}
              className="flex items-center gap-3 flex-shrink-0"
            >
              <div
                className="flex items-center justify-center rounded-[8px] size-[28px] flex-shrink-0"
                style={{ background: t.bg, border: `1px solid ${t.border}` }}
              >
                <span style={{ transform: "scale(0.42)" }}>{t.icon}</span>
              </div>
              <span className="flex-1 min-w-0 text-[#d7dcee] text-[13px] font-medium truncate">
                {t.label}
              </span>
              {t.href && (
                <a
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => recordRecentTool(t.id)}
                  aria-label={`Open ${t.label}`}
                  className="flex-shrink-0 flex items-center justify-center text-[#8891ac] hover:text-[#dde2f0] transition-colors"
                >
                  <ExternalLink
                    style={{ width: 15, height: 15 }}
                    strokeWidth={2}
                  />
                </a>
              )}
              <button
                type="button"
                aria-label={favoritePendingIds.includes(t.id)
                  ? `Updating ${t.label} favorite`
                  : `Remove ${t.label} from favorites`}
                disabled={favoritePendingIds.includes(t.id)}
                onClick={() => onToggleFavorite(t.id)}
                className="flex-shrink-0 flex items-center justify-center transition-transform hover:scale-110"
              >
                {favoritePendingIds.includes(t.id) ? (
                  <LoaderCircle
                    className="h-[18px] w-[18px] animate-spin text-[#a5b4fc] motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                ) : (
                  <Star
                    className="text-[#facc15]"
                    style={{ width: 18, height: 18 }}
                    fill="#facc15"
                    strokeWidth={1.5}
                  />
                )}
              </button>
            </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </GlassPanel>
  );
}

function BottomRow({
  active,
  tasks,
  addTask,
  toggleTask,
  updateTask,
  deleteTask,
  favoriteTools,
  favoritePendingIds,
  onToggleFavorite,
  focusEntries,
  focusSession,
  focusRemainingMs,
  onOpenFocusSettings,
  onCancelFocusSession,
  music,
}: {
  active: StatKey;
  tasks: DailyTask[];
  addTask: (title: string) => boolean;
  toggleTask: (id: string) => void;
  updateTask: (id: string, title: string) => boolean;
  deleteTask: (id: string) => void;
  favoriteTools: DashboardToolView[];
  favoritePendingIds: string[];
  onToggleFavorite: (id: string) => void;
  focusEntries: FocusEntry[];
  focusSession: FocusSession | null;
  focusRemainingMs: number;
  onOpenFocusSettings: () => void;
  onCancelFocusSession: () => void;
  music: ReturnType<typeof useMusicPlayer>;
}) {
  const panelHostRef = React.useRef<HTMLDivElement>(null);
  const previousActiveRef = React.useRef(active);
  const reduceMotion = Boolean(useReducedMotion());

  React.useLayoutEffect(() => {
    const panel = panelHostRef.current?.firstElementChild;
    if (!panel) return;

    const statOrder: StatKey[] = ["recent", "categories", "favorites", "music", "completion"];
    const direction =
      statOrder.indexOf(active) >= statOrder.indexOf(previousActiveRef.current)
        ? 1
        : -1;
    const values = getPanelMotion(reduceMotion, direction);
    const context = gsap.context(() => {
      gsap.fromTo(panel, values.from, values.to);
    }, panelHostRef);
    previousActiveRef.current = active;

    return () => context.revert();
  }, [active, reduceMotion]);

  return (
    <section
      data-dashboard-enter
      className="flex gap-3 px-5 pb-5 flex-1 min-h-0 max-[950px]:flex-col max-[950px]:flex-none"
    >
      <AllToolsPanel />

      <div key={active} ref={panelHostRef} className="contents">
        {active === "completion" ? (
          <TaskCompletionPanel
            tasks={tasks}
            addTask={addTask}
            toggleTask={toggleTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        ) : active === "categories" ? (
          <CategoriesPanel />
        ) : active === "favorites" ? (
          <FavoritesPanel
            favoriteTools={favoriteTools}
            favoritePendingIds={favoritePendingIds}
            onToggleFavorite={onToggleFavorite}
          />
        ) : active === "music" ? (
          <MusicPlayerPanel
            track={music.track}
            currentIndex={music.currentIndex}
            isPlaying={music.isPlaying}
            playMode={music.playMode}
            currentTime={music.currentTime}
            duration={music.duration}
            volume={music.volume}
            onPlayAt={music.playAt}
            onPlayNext={music.playNext}
            onPlayPrev={music.playPrev}
            onTogglePlay={music.togglePlay}
            onCyclePlayMode={music.cyclePlayMode}
            onVolumeChange={music.setVolume}
            onSeek={music.seek}
            audioLevelRef={music.audioLevelRef}
            bassRef={music.bassRef}
            midRef={music.midRef}
            trebleRef={music.trebleRef}
            energyRef={music.energyRef}
            loudnessRef={music.loudnessRef}
            beatPulseRef={music.beatPulseRef}
            bandsRef={music.bandsRef}
          />
        ) : (
          <RecentActivityPanel
            entries={focusEntries}
            session={focusSession}
            remainingMs={focusRemainingMs}
            onOpenSettings={onOpenFocusSettings}
            onCancelSession={onCancelFocusSession}
          />
        )}
      </div>
    </section>
  );
}

// ─── App root ──────────────────────────────────────────────────────────────────

function DashboardPageContent({
  mainContent,
  activeRoute,
}: {
  mainContent?: React.ReactNode;
  activeRoute: "dashboard" | "manage";
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const narrowNav = useBelowWidth(MOBILE_NAV_BREAKPOINT);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toolViews = useToolViews();
  const { tools, categories, setToolFavorite, favoritePendingIds } = useDashboardWorkspace();
  const categoryCount = categories.length;

  const [activeStat, setActiveStat] = React.useState<StatKey>("recent");
  const { tasks, addTask, toggleTask, updateTask, deleteTask } = useDailyTasks();
  const completedCount = tasks.filter((t) => t.done).length;
  const completionPercent = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  const toggleFavorite = React.useCallback(
    (id: string) => {
      if (favoritePendingIds.includes(id)) return;
      const currentFavorite = tools.find((tool) => tool.id === id)?.favorite ?? false;
      void setToolFavorite(id, !currentFavorite).catch(() => undefined);
    },
    [favoritePendingIds, setToolFavorite, tools],
  );
  const favoriteTools = React.useMemo(
    () => toolViews.filter((view) => view.tool.favorite || favoritePendingIds.includes(view.id)),
    [favoritePendingIds, toolViews],
  );
  const favoriteCount = favoriteTools.length;

  const { entries: focusEntries, addEntry: addFocusEntry } = useFocusLog();
  const [focusSettingsOpen, setFocusSettingsOpen] = React.useState(false);
  const {
    session: focusSession,
    remainingMs: focusRemainingMs,
    start: startFocusSession,
    cancel: cancelFocusSession,
  } = useFocusTimer((completed) =>
    addFocusEntry(completed.task, completed.durationMin),
  );

  const musicAudioRef = React.useRef<HTMLAudioElement>(null);
  const music = useMusicPlayer(musicAudioRef);

  React.useLayoutEffect(() => {
    const values = getDashboardEntranceMotion(reduceMotion);
    const context = gsap.context(() => {
      gsap.fromTo("[data-dashboard-enter]", values.from, values.to);
    }, rootRef);

    return () => context.revert();
  }, [reduceMotion]);

  return (
    <div
      ref={rootRef}
      className="dashboard-motion-root relative w-full h-screen overflow-hidden bg-[#020817] flex max-[950px]:h-auto max-[950px]:min-h-screen max-[950px]:overflow-y-auto max-[950px]:overflow-x-hidden [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: "none" }}
    >
      <WorkspaceSplashCursor />
      {/* Background: sharp photo + blurred glow version behind. Below 951px the page scrolls
          and grows well past one viewport — without a cap this box (and every "inset-0" layer
          inside it) would stretch to match, forcing object-cover to zoom into a tall, narrow
          crop that loses the tower/yacht/Ferris wheel. Capping it to one screen height and
          pinning it to the top keeps that framing in the hero area, same as before scrolling
          was added; the rest of the scrollable page just continues on the plain bg color. */}
      <div
        className="absolute top-0 left-0 right-0 bottom-0 max-[950px]:bottom-auto max-[950px]:h-screen pointer-events-none select-none"
        style={{ isolation: "isolate" }}
      >
        <DashboardBackground />
        {/* Crisp contrast lift over the clock tower / core building — mix-blend-overlay (not
            screen) so it sharpens local contrast instead of adding a flat, blurred brightness
            haze; kept low-blur so the tower itself stays sharp. */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ mixBlendMode: "overlay" }}
        >
          <div
            style={{
              position: "absolute",
              top: "0%",
              left: "34%",
              width: "26%",
              height: "58%",
              filter: "blur(6px)",
              // background:
              //   "radial-gradient(rectangle closest-side at 50% 45%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%)",
            }}
          />
          {/* Ferris wheel, right-of-center */}
          <div
            style={{
              position: "absolute",
              top: "0%",
              left: "58%",
              width: "26%",
              height: "85%",
              filter: "blur(0px)",
              background:
                "radial-gradient(circle closest-side at 50% 45%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0) 100%)",
            }}
          />
        </div>

        {/* === Figma: LIGHT CONTROL / Top Purple Ambient === */}
        {/* Layer 1: Broad Linear Wash — mix-blend-soft-light, rotated 7.15deg, blur 21px */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ mixBlendMode: "soft-light" }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: "-10%",
              width: "120%",
              height: "80%",
              transform: "rotate(7.15deg)",
              filter: "blur(21px)",
              background:
                "linear-gradient(180deg, rgba(136,112,179,0.26) 0%, rgba(116,96,152,0.16) 38%, rgba(94,82,127,0.07) 72%, rgba(81,71,109,0) 100%)",
            }}
          />
        </div>
        {/* Layer 2: Horizon Haze — mix-blend-soft-light, rotated 7.15deg, blur 29px, center bloom.
            Its gradient only varies horizontally, so without a vertical mask the box's bottom
            edge (top 5% + height 55% = 60% down the page) cuts off abruptly — that hard edge,
            not fully hidden by the blur, is what shows up as a bright horizontal seam. */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ mixBlendMode: "soft-light" }}
        >
          <div
            style={{
              position: "absolute",
              top: "5%",
              left: "-10%",
              width: "120%",
              height: "55%",
              transform: "rotate(7.15deg)",
              filter: "blur(29px)",
              background:
                "linear-gradient(90deg, rgba(98,84,125,0.04) 0%, rgba(212,150,248,0.51) 50%, rgba(98,84,125,0.04) 100%)",
              maskImage:
                "linear-gradient(180deg, transparent 0%, black 25%, black 65%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(180deg, transparent 0%, black 25%, black 65%, transparent 100%)",
            }}
          />
        </div>

        {/* Corner vignette fades (Figma: BACKGROUND CONTROL / Corner Fade & Blur) */}
        {/* Top-left navy fade */}
        <div
          className="absolute"
          style={{
            top: "-5%",
            left: "-5%",
            width: "55%",
            height: "55%",
            background:
              "radial-gradient(ellipse at center, rgba(7,17,39,0.66) 0%, rgba(7,17,39,0.38) 46%, rgba(7,17,39,0.12) 78%, transparent 100%)",
            filter: "blur(39px)",
          }}
        />
        {/* Top-right weak violet */}
        <div
          className="absolute"
          style={{
            top: "-5%",
            right: "-5%",
            width: "40%",
            height: "45%",
            background:
              "radial-gradient(ellipse at center, rgba(33,22,56,0.38) 0%, rgba(33,22,56,0.22) 46%, rgba(33,22,56,0.07) 78%, transparent 100%)",
            filter: "blur(33px)",
          }}
        />
        {/* Bottom-left deep navy */}
        <div
          className="absolute"
          style={{
            bottom: "-5%",
            left: "-5%",
            width: "55%",
            height: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(2,10,25,0.84) 0%, rgba(2,10,25,0.49) 46%, rgba(2,10,25,0.15) 78%, transparent 100%)",
            filter: "blur(46px)",
          }}
        />
        {/* Bottom-right broad dark */}
        <div
          className="absolute"
          style={{
            bottom: "-5%",
            right: "-5%",
            width: "50%",
            height: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(3,11,28,0.72) 0%, rgba(3,11,28,0.42) 46%, rgba(3,11,28,0.13) 78%, transparent 100%)",
            filter: "blur(52px)",
          }}
        />
      </div>

      {/* Always mounted (not inside MusicPlayerPanel, which only renders while "Favorite
          Music" is the active tab) so playback survives switching to another stat card. */}
      <audio
        ref={musicAudioRef}
        src={music.track.src}
        onEnded={music.handleEnded}
        onError={music.stop}
      />

      {/* Sidebar — replaced below 951px by a drawer opened from the topbar's brand button */}
      {!narrowNav && (
        <div data-dashboard-enter className="relative z-10 flex-shrink-0 self-stretch flex flex-col">
          <Sidebar activeRoute={activeRoute} />
        </div>
      )}

      {/* Main — fills remaining width, no overflow, all in viewport */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0">
        <TopBar onOpenDrawer={() => setDrawerOpen(true)} />
        {/* Content stack — flex-col, each section flex-shrink-0 except BottomRow which is flex-1
            (except below 951px, where the whole page scrolls instead — see the root div and
            BottomRow's max-[950px] overrides). */}
        {mainContent ? (
          <div className="flex-1 min-h-0 overflow-hidden px-5 pb-5 pt-3 max-[950px]:overflow-visible">
            {mainContent}
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-[clamp(12px,2vh,32px)] overflow-hidden pt-3 min-h-0 max-[950px]:overflow-visible max-[950px]:min-h-0">
            <HeroSection />
            <StatsRow
              active={activeStat}
              onSelect={setActiveStat}
              completionPercent={completionPercent}
              focusEntryCount={focusEntries.length}
              categoryCount={categoryCount}
              favoriteCount={favoriteCount}
            />
            <BottomRow
              active={activeStat}
              tasks={tasks}
              addTask={addTask}
              toggleTask={toggleTask}
              updateTask={updateTask}
              deleteTask={deleteTask}
              favoriteTools={favoriteTools}
              favoritePendingIds={favoritePendingIds}
              onToggleFavorite={toggleFavorite}
              focusEntries={focusEntries}
              focusSession={focusSession}
              focusRemainingMs={focusRemainingMs}
              onOpenFocusSettings={() => setFocusSettingsOpen(true)}
              onCancelFocusSession={cancelFocusSession}
              music={music}
            />
          </div>
        )}
      </main>

      <AnimatePresence>
        {focusSettingsOpen && (
          <FocusSettingsModal
            onClose={() => setFocusSettingsOpen(false)}
            onStart={(task, durationMin) => startFocusSession(task, durationMin)}
          />
        )}
      </AnimatePresence>

      {/* Portaled to document.body — same reasoning as WeatherModalDark: nested inside a
          `relative z-10` sibling here, a fixed drawer would lose stacking-context tie-breaks
          against <main>, which also has `z-10` but comes later in the DOM. */}
      {/* Guarded on narrowNav too: if the window widens past 951px while the drawer is open,
          its trigger (the topbar brand button) disappears, so the drawer closes with it. */}
      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {drawerOpen && narrowNav && (
                <MobileNavDrawer onClose={() => setDrawerOpen(false)} />
              )}
            </AnimatePresence>,
            document.body,
            )
          : null}
      <DatabaseToastViewport />
    </div>
  );
}

export function DashboardPageView({
  mainContent,
  activeRoute = "dashboard",
}: {
  mainContent?: React.ReactNode;
  activeRoute?: "dashboard" | "manage";
}) {
  return (
    <DashboardWorkspaceProvider>
      <DashboardPageContent mainContent={mainContent} activeRoute={activeRoute} />
    </DashboardWorkspaceProvider>
  );
}

export default function DashboardPage() {
  return <DashboardPageView />;
}
