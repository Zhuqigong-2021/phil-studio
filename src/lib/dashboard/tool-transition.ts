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

export interface ToolLibraryHandoffRegistry {
  retain: (cleanup: () => void) => void;
  complete: () => void;
  hasActive: () => boolean;
}

export interface ToolLibraryTransitionDependencies {
  lock: ToolTransitionLock;
  findDestinationRect: () => ToolTransitionRect | null;
  cloneShell: (source: ToolTransitionSource, deep: true) => ToolTransitionOverlay;
  appendOverlay: (overlay: ToolTransitionOverlay) => void;
  prefersReducedMotion: () => boolean;
  marker: ToolLibraryHandoffMarker;
  handoff: ToolLibraryHandoffRegistry;
  prepareSurroundings?: (source: ToolTransitionSource) => () => void;
  animate: (
    overlay: ToolTransitionOverlay,
    plan: ToolTransitionPlan,
    onComplete: () => void,
  ) => () => void;
}

export function createToolLibraryHandoffRegistry(): ToolLibraryHandoffRegistry {
  let activeCleanup: (() => void) | null = null;

  return {
    retain(cleanup) {
      activeCleanup?.();
      activeCleanup = cleanup;
    },
    complete() {
      const cleanup = activeCleanup;
      activeCleanup = null;
      cleanup?.();
    },
    hasActive() {
      return activeCleanup !== null;
    },
  };
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
    let restoreSurroundings: (() => void) | null = null;

    const finalize = () => {
      if (cleaned) return;
      cleaned = true;
      cancelAnimation?.();
      cancelAnimation = null;
      overlay?.remove();
      restoreSurroundings?.();
      restoreSurroundings = null;
      dependencies.lock.release();
    };

    const cancel = () => {
      if (navigated) return;
      finalize();
    };

    if (!destinationRect) {
      navigated = true;
      router.push("/manage");
      return cancel;
    }

    const plan = getToolTransitionPlan(
      sourceRect,
      destinationRect,
      dependencies.prefersReducedMotion(),
    );
    restoreSurroundings = dependencies.prepareSurroundings?.(sourceElement) ?? null;
    overlay = dependencies.cloneShell(sourceElement, true);
    overlay.setAttribute("aria-hidden", "true");
    overlay.setAttribute("data-tool-library-transition-overlay", "true");
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
      dependencies.handoff.retain(finalize);
      router.push("/manage");
    });
    if (cleaned) {
      cancelAnimation();
      cancelAnimation = null;
    }

    return cancel;
  };
}

const browserHandoffRegistry = createToolLibraryHandoffRegistry();

const browserTransitionStarter = createToolLibraryTransitionStarter({
  lock: createToolTransitionLock(),
  findDestinationRect: () => {
    const desktop = window.innerWidth >= 900;
    const left = desktop ? 300 : 20;
    const top = desktop ? 102 : 82;
    const right = 20;
    const bottom = 20;
    return {
      left,
      top,
      width: Math.max(1, window.innerWidth - left - right),
      height: Math.max(1, window.innerHeight - top - bottom),
    };
  },
  cloneShell: (source, deep) => (source as HTMLElement).cloneNode(deep) as HTMLElement,
  appendOverlay: (overlay) => document.body.appendChild(overlay as HTMLElement),
  prefersReducedMotion: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  marker: browserHandoffMarker,
  handoff: browserHandoffRegistry,
  prepareSurroundings: (source) => {
    const sourceNode = source as HTMLElement;
    const root = sourceNode.closest<HTMLElement>(".dashboard-motion-root");
    const veil = document.createElement("div");
    veil.setAttribute("data-tool-library-transition-veil", "true");
    Object.assign(veil.style, {
      position: "fixed",
      inset: "0",
      zIndex: "110",
      pointerEvents: "none",
      opacity: "0",
      background: "radial-gradient(circle at 56% 12%, rgba(89, 72, 180, 0.22), transparent 42%), linear-gradient(145deg, rgba(2, 8, 23, 0.76), rgba(8, 15, 38, 0.94))",
      backdropFilter: "blur(3px)",
    });
    document.body.appendChild(veil);
    gsap.to(veil, { opacity: 1, duration: 0.34, ease: "power2.out" });
    if (root) {
      gsap.to(root, {
        opacity: 0.22,
        filter: "blur(10px)",
        scale: 0.992,
        duration: 0.34,
        ease: "power2.out",
      });
    }
    return () => {
      gsap.killTweensOf(veil);
      veil.remove();
      if (root) gsap.killTweensOf(root);
    };
  },
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

export function completeToolLibraryHandoff(reduceMotion = false) {
  const layers = document.querySelectorAll<HTMLElement>(
    "[data-tool-library-transition-overlay], [data-tool-library-transition-veil]",
  );
  if (!layers.length) {
    browserHandoffRegistry.complete();
    return;
  }
  gsap.to(layers, {
    opacity: 0,
    duration: reduceMotion ? 0.12 : 0.3,
    ease: "power2.out",
    onComplete: () => {
      layers.forEach((layer) => layer.remove());
      browserHandoffRegistry.complete();
    },
  });
}
