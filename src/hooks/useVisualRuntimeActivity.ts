"use client";

import { useEffect, useState, type RefObject } from "react";

export interface VisualRuntimeActivityState {
  enabled: boolean;
  reducedMotion: boolean;
  pageVisible: boolean;
  intersecting: boolean;
}

export function isVisualRuntimeActive(state: VisualRuntimeActivityState): boolean {
  return state.enabled && !state.reducedMotion && state.pageVisible && state.intersecting;
}

export function useVisualRuntimeActivity({
  elementRef,
  enabled = true,
  reducedMotion = false,
}: {
  elementRef: RefObject<Element | null>;
  enabled?: boolean;
  reducedMotion?: boolean;
}): boolean {
  const [pageVisible, setPageVisible] = useState(() =>
    typeof document === "undefined" ? true : !document.hidden,
  );
  const [intersecting, setIntersecting] = useState(true);

  useEffect(() => {
    const syncVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry?.isIntersecting ?? false),
      { threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef]);

  return isVisualRuntimeActive({ enabled, reducedMotion, pageVisible, intersecting });
}
