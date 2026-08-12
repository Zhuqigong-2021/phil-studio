import gsap from "gsap";

const TOOL_LIBRARY_HANDOFF_KEY = "phil-studio:tool-library-handoff";
const TOOL_LIBRARY_HANDOFF_TTL_MS = 15_000;

export interface ToolTransitionRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ToolTransitionPlan {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  borderRadius: number;
  duration: number;
  ease: "power3.inOut";
}

export interface ToolTransitionLock {
  acquire: () => boolean;
  release: () => void;
}

export interface ToolTransitionRouter {
  push: (href: string) => void;
}

export interface ToolTransitionStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

export interface ToolLibraryHandoffMarker {
  mark: () => void;
  detect: () => boolean;
  clear: () => void;
}

export interface ToolTransitionSource {
  getBoundingClientRect: () => ToolTransitionRect;
}

export interface ToolTransitionOverlay {
  style: object;
  setAttribute: (name: string, value: string) => void;
  removeAttribute: (name: string) => void;
  classList: { add: (...tokens: string[]) => void };
  remove: () => void;
}

export interface ToolLibraryTransitionDependencies {
  lock: ToolTransitionLock;
  findDestinationRect: () => ToolTransitionRect | null;
  cloneShell: (source: ToolTransitionSource, deep: false) => ToolTransitionOverlay;
  appendOverlay: (overlay: ToolTransitionOverlay) => void;
  prefersReducedMotion: () => boolean;
  marker: ToolLibraryHandoffMarker;
  animate: (
    overlay: ToolTransitionOverlay,
    plan: ToolTransitionPlan,
    onComplete: () => void,
  ) => () => void;
}

export function createToolTransitionLock(): ToolTransitionLock {
  let locked = false;

  return {
    acquire() {
      if (locked) return false;
      locked = true;
      return true;
    },
    release() {
      locked = false;
    },
  };
}

export function getToolTransitionPlan(
  sourceRect: ToolTransitionRect,
  destinationRect: ToolTransitionRect,
  reduceMotion: boolean,
): ToolTransitionPlan {
  if (reduceMotion) {
    return {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 0,
      borderRadius: 16,
      duration: 0.16,
      ease: "power3.inOut",
    };
  }

  return {
    x: destinationRect.left - sourceRect.left,
    y: destinationRect.top - sourceRect.top,
    scaleX: destinationRect.width / sourceRect.width,
    scaleY: destinationRect.height / sourceRect.height,
    opacity: 0.16,
    borderRadius: 20,
    duration: 0.42,
    ease: "power3.inOut",
  };
}

export function createToolLibraryHandoffMarker({
  storage,
  now = Date.now,
  ttlMs = TOOL_LIBRARY_HANDOFF_TTL_MS,
}: {
  storage: () => ToolTransitionStorage | null;
  now?: () => number;
  ttlMs?: number;
}): ToolLibraryHandoffMarker {
  let inMemoryTimestamp: number | null = null;

  const clear = () => {
    inMemoryTimestamp = null;
    try {
      storage()?.removeItem(TOOL_LIBRARY_HANDOFF_KEY);
    } catch {
      // Storage can be unavailable in privacy-restricted browsing contexts.
    }
  };

  return {
    mark() {
      const timestamp = now();
      inMemoryTimestamp = timestamp;
      try {
        storage()?.setItem(TOOL_LIBRARY_HANDOFF_KEY, JSON.stringify({ timestamp }));
      } catch {
        // The in-memory timestamp still covers normal App Router navigation.
      }
    },
    detect() {
      let timestamp = inMemoryTimestamp;
      try {
        const raw = storage()?.getItem(TOOL_LIBRARY_HANDOFF_KEY);
        if (raw) {
          const stored = JSON.parse(raw) as { timestamp?: unknown };
          if (typeof stored.timestamp === "number" && Number.isFinite(stored.timestamp)) {
            timestamp = timestamp === null ? stored.timestamp : Math.max(timestamp, stored.timestamp);
          }
        }
      } catch {
        // Fall back to the in-memory timestamp.
      }

      const age = timestamp === null ? Number.POSITIVE_INFINITY : now() - timestamp;
      if (age < 0 || age > ttlMs) {
        clear();
        return false;
      }
      return true;
    },
    clear,
  };
}

const browserHandoffMarker = createToolLibraryHandoffMarker({
  storage: () => {
    try {
      return typeof window === "undefined" ? null : window.sessionStorage;
    } catch {
      return null;
    }
  },
});

export function beginToolLibraryHandoffEntrance(
  marker: ToolLibraryHandoffMarker = browserHandoffMarker,
) {
  const handoff = marker.detect();
  return {
    handoff,
    establish(schedule: (callback: () => void) => () => void) {
      return handoff ? schedule(marker.clear) : () => undefined;
    },
  };
}

export function createToolLibraryTransitionStarter(
  dependencies: ToolLibraryTransitionDependencies,
) {
  return (
    sourceElement: ToolTransitionSource,
    router: ToolTransitionRouter,
  ): (() => void) | null => {
    if (!dependencies.lock.acquire()) return null;

    const sourceRect = sourceElement.getBoundingClientRect();
    const destinationRect = dependencies.findDestinationRect();
    let cleaned = false;
    let navigated = false;
    let cancelAnimation: (() => void) | null = null;
    let overlay: ToolTransitionOverlay | null = null;

    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      cancelAnimation?.();
      cancelAnimation = null;
      overlay?.remove();
      dependencies.lock.release();
    };

    if (!destinationRect) {
      navigated = true;
      router.push("/manage");
      return cleanup;
    }

    const plan = getToolTransitionPlan(
      sourceRect,
      destinationRect,
      dependencies.prefersReducedMotion(),
    );
    overlay = dependencies.cloneShell(sourceElement, false);
    overlay.setAttribute("aria-hidden", "true");
    overlay.removeAttribute("role");
    overlay.removeAttribute("tabindex");
    overlay.classList.add("dashboard-tool-transition-overlay");
    Object.assign(overlay.style, {
      position: "fixed",
      left: `${sourceRect.left}px`,
      top: `${sourceRect.top}px`,
      width: `${sourceRect.width}px`,
      height: `${sourceRect.height}px`,
      margin: "0",
      zIndex: "120",
      pointerEvents: "none",
      transformOrigin: "0 0",
      overflow: "hidden",
      willChange: "transform, opacity, border-radius",
    });
    dependencies.appendOverlay(overlay);

    cancelAnimation = dependencies.animate(overlay, plan, () => {
      if (cleaned || navigated) return;
      navigated = true;
      dependencies.marker.mark();
      cleanup();
      router.push("/manage");
    });
    if (cleaned) {
      cancelAnimation();
      cancelAnimation = null;
    }

    return cleanup;
  };
}

const browserTransitionStarter = createToolLibraryTransitionStarter({
  lock: createToolTransitionLock(),
  findDestinationRect: () =>
    document
      .querySelector<HTMLElement>("[data-tool-library-transition-destination]")
      ?.getBoundingClientRect() ?? null,
  cloneShell: (source, deep) => (source as HTMLElement).cloneNode(deep) as HTMLElement,
  appendOverlay: (overlay) => document.body.appendChild(overlay as HTMLElement),
  prefersReducedMotion: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  marker: browserHandoffMarker,
  animate: (overlay, plan, onComplete) => {
    gsap.to(overlay, {
      ...plan,
      onComplete,
    });
    return () => gsap.killTweensOf(overlay);
  },
});

export function startToolLibraryTransition(
  sourceElement: HTMLElement,
  router: ToolTransitionRouter,
): (() => void) | null {
  return browserTransitionStarter(sourceElement, router);
}
