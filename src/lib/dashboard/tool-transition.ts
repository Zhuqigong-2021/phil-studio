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
  width?: number;
  height?: number;
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

export interface ToolLibraryTargetPaddings {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface ToolLibraryTransitionTiming {
  total: number;
  expansionStart: number | null;
  expansionEnd: number | null;
  sourceFadeStart: number | null;
  sourceFadeEnd: number | null;
  previewFadeStart: number | null;
  previewFadeEnd: number | null;
  backgroundStart: number | null;
  contentHandoffStart: number | null;
  routeStart: number;
}

export function getToolLibraryTargetRect(
  bounds: ToolTransitionRect,
  paddings: ToolLibraryTargetPaddings,
  viewportHeight: number,
): ToolTransitionRect {
  const surfaceTop = bounds.top + paddings.top + Math.max(18, Math.min(30, viewportHeight * 0.03));
  return {
    left: bounds.left + paddings.left,
    top: surfaceTop,
    width: Math.max(1, bounds.width - paddings.left - paddings.right),
    height: Math.max(1, bounds.top + bounds.height - paddings.bottom - surfaceTop),
  };
}

export function getToolLibraryTransitionTiming(
  reduceMotion: boolean,
): ToolLibraryTransitionTiming {
  if (reduceMotion) {
    return {
      total: 0.16,
      expansionStart: null,
      expansionEnd: null,
      sourceFadeStart: null,
      sourceFadeEnd: null,
      previewFadeStart: null,
      previewFadeEnd: null,
      backgroundStart: null,
      contentHandoffStart: null,
      routeStart: 0,
    };
  }

  return {
    total: 1.08,
    expansionStart: 0.05,
    expansionEnd: 0.78,
    sourceFadeStart: 0.46,
    sourceFadeEnd: 0.74,
    previewFadeStart: 0.56,
    previewFadeEnd: 0.78,
    backgroundStart: 0.78,
    contentHandoffStart: 0.74,
    routeStart: 0.84,
  };
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
    width: destinationRect.width,
    height: destinationRect.height,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    borderRadius: 20,
    duration: 0.58,
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
      willChange: "transform, width, height, opacity, border-radius",
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
    const destination = document.querySelector<HTMLElement>("[data-dashboard-transition-content]");
    if (!destination) return null;
    const bounds = destination.getBoundingClientRect();
    const styles = window.getComputedStyle(destination);
    const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
    const paddingRight = Number.parseFloat(styles.paddingRight) || 0;
    const paddingTop = Number.parseFloat(styles.paddingTop) || 0;
    const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
    return getToolLibraryTargetRect(bounds, {
      left: paddingLeft,
      right: paddingRight,
      top: paddingTop,
      bottom: paddingBottom,
    }, window.innerHeight);
  },
  cloneShell: (source, deep) => (source as HTMLElement).cloneNode(deep) as HTMLElement,
  appendOverlay: (overlay) => document.body.appendChild(overlay as HTMLElement),
  prefersReducedMotion: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  marker: browserHandoffMarker,
  handoff: browserHandoffRegistry,
  prepareSurroundings: () => {
    const veil = document.createElement("div");
    veil.className = "manage-scene-background";
    veil.setAttribute("data-tool-library-transition-veil", "true");
    Object.assign(veil.style, {
      position: "fixed",
      inset: "0",
      zIndex: "8",
      pointerEvents: "none",
      opacity: "0",
    });
    document.body.appendChild(veil);
    return () => {
      gsap.killTweensOf(veil);
      veil.remove();
    };
  },
  animate: (overlay, plan, onComplete) => {
    const shell = overlay as HTMLElement;
    const sourceContent = shell.querySelector<HTMLElement>("[data-tool-library-source-content]");
    const preview = shell.querySelector<HTMLElement>("[data-tool-library-morph-preview]");
    const veil = document.querySelector<HTMLElement>("[data-tool-library-transition-veil]");
    const timing = getToolLibraryTransitionTiming(plan.opacity === 0);
    const timeline = gsap.timeline();
    if (preview) gsap.set(preview, { autoAlpha: 0 });
    if (timing.expansionStart === null) {
      timeline.to(shell, { opacity: 0, duration: timing.total, ease: "power3.out" }, 0);
      timeline.call(onComplete, [], timing.routeStart);
      return () => timeline.kill();
    }

    timeline.to(shell, {
      ...plan,
      duration: timing.expansionEnd! - timing.expansionStart!,
      ease: "power3.inOut",
    }, timing.expansionStart);
    if (sourceContent) {
      timeline.to(sourceContent, {
        autoAlpha: 0,
        duration: timing.sourceFadeEnd! - timing.sourceFadeStart!,
        ease: "power3.inOut",
      }, timing.sourceFadeStart!);
    }
    if (preview) {
      timeline.to(preview, {
        autoAlpha: 1,
        duration: timing.previewFadeEnd! - timing.previewFadeStart!,
        ease: "power3.out",
      }, timing.previewFadeStart!);
    }
    if (veil) {
      timeline.to(veil, {
        opacity: 1,
        duration: timing.total - timing.backgroundStart!,
        ease: "power3.inOut",
      }, timing.backgroundStart!);
    }
    timeline.call(onComplete, [], timing.routeStart);
    return () => timeline.kill();
  },
});

export function startToolLibraryTransition(
  sourceElement: HTMLElement,
  router: ToolTransitionRouter,
): (() => void) | null {
  return browserTransitionStarter(sourceElement, router);
}

export function completeToolLibraryHandoff(reduceMotion = false) {
  const timing = getToolLibraryTransitionTiming(reduceMotion);
  const layers = document.querySelectorAll<HTMLElement>(
    "[data-tool-library-transition-overlay], [data-tool-library-transition-veil]",
  );
  if (!layers.length) {
    browserHandoffRegistry.complete();
    return;
  }
  gsap.to(layers, {
    opacity: 0,
    duration: reduceMotion ? timing.total : timing.total - timing.routeStart,
    ease: "power2.out",
    onComplete: () => {
      layers.forEach((layer) => layer.remove());
      browserHandoffRegistry.complete();
    },
  });
}
