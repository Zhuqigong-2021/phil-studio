"use client";

import { Check, Minus, X } from "lucide-react";
import { useEffect, useReducer } from "react";

import {
  FAVORITE_TOAST_EVENT,
  reduceFavoriteToast,
  type FavoriteToastDetail,
} from "../../lib/dashboard/favorite-toast.ts";

const DISMISS_AFTER_MS = 3000;

const toneStyles = {
  success: {
    Icon: Check,
    border: "border-emerald-400/45",
    glow: "shadow-[0_18px_50px_rgba(16,185,129,0.2)]",
    iconBackground: "rounded-full bg-emerald-500",
  },
  info: {
    Icon: Minus,
    border: "border-indigo-400/45",
    glow: "shadow-[0_18px_50px_rgba(99,102,241,0.22)]",
    iconBackground: "rounded-full bg-indigo-500",
  },
  error: {
    Icon: X,
    border: "border-rose-400/50",
    glow: "shadow-[0_18px_50px_rgba(244,63,94,0.22)]",
    iconBackground: "rounded-full bg-rose-500",
  },
} as const;

export default function FavoriteToastHost() {
  const [state, dispatch] = useReducer(reduceFavoriteToast, { current: null });
  const toast = state.current;

  useEffect(() => {
    const showToast = (event: Event) => {
      dispatch({ type: "show", detail: (event as CustomEvent<FavoriteToastDetail>).detail });
    };
    window.addEventListener(FAVORITE_TOAST_EVENT, showToast);
    return () => window.removeEventListener(FAVORITE_TOAST_EVENT, showToast);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => {
      dispatch({ type: "dismiss", id: toast.id });
    }, DISMISS_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const { Icon, border, glow, iconBackground } = toneStyles[toast.tone];
  return (
    <div className="pointer-events-none fixed left-1/2 top-5 z-[1000] -translate-x-1/2">
      <div
        role={toast.tone === "error" ? "alert" : "status"}
        aria-live={toast.tone === "error" ? "assertive" : "polite"}
        className={`flex max-w-[min(420px,calc(100vw-2rem))] animate-[favorite-toast-fade-in_180ms_ease-out_both] items-center gap-3 rounded-[10px] border ${border} bg-[#17152d]/75 px-4 py-3 text-sm font-medium text-white backdrop-blur-xl ${glow} motion-reduce:animate-none`}
      >
        <span className={`flex h-5 w-5 shrink-0 items-center justify-center ${iconBackground}`}>
          <Icon aria-hidden="true" className="h-4 w-4 text-white" strokeWidth={3} />
        </span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
