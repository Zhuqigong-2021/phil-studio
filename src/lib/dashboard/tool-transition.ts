import gsap from "gsap";

const TOOL_LIBRARY_HANDOFF_KEY = "phil-studio:tool-library-handoff";

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

const activeTransitionLock = createToolTransitionLock();
let inMemoryHandoff = false;

function markToolLibraryHandoff() {
  inMemoryHandoff = true;
  try {
    window.sessionStorage.setItem(TOOL_LIBRARY_HANDOFF_KEY, "1");
  } catch {
    // The in-memory marker still covers normal App Router client navigation.
  }
}

export function consumeToolLibraryHandoff(): boolean {
  let marked = inMemoryHandoff;
  inMemoryHandoff = false;

  try {
    marked = marked || window.sessionStorage.getItem(TOOL_LIBRARY_HANDOFF_KEY) === "1";
    window.sessionStorage.removeItem(TOOL_LIBRARY_HANDOFF_KEY);
  } catch {
    // Session storage can be unavailable in privacy-restricted browsing contexts.
  }

  return marked;
}

export function startToolLibraryTransition(
  sourceElement: HTMLElement,
  router: ToolTransitionRouter,
): (() => void) | null {
  if (!activeTransitionLock.acquire()) return null;

  const destinationElement = document.querySelector<HTMLElement>(
    "[data-tool-library-transition-destination]",
  );

  if (!destinationElement) {
    activeTransitionLock.release();
    router.push("/manage");
    return null;
  }

  const sourceRect = sourceElement.getBoundingClientRect();
  const destinationRect = destinationElement.getBoundingClientRect();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const plan = getToolTransitionPlan(sourceRect, destinationRect, reduceMotion);
  const overlay = sourceElement.cloneNode(false) as HTMLElement;
  let navigated = false;

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
  document.body.appendChild(overlay);

  const cleanup = () => {
    gsap.killTweensOf(overlay);
    overlay.remove();
    activeTransitionLock.release();
  };

  gsap.to(overlay, {
    x: plan.x,
    y: plan.y,
    scaleX: plan.scaleX,
    scaleY: plan.scaleY,
    opacity: plan.opacity,
    borderRadius: plan.borderRadius,
    duration: plan.duration,
    ease: plan.ease,
    onComplete: () => {
      if (navigated) return;
      navigated = true;
      markToolLibraryHandoff();
      cleanup();
      router.push("/manage");
    },
  });

  return cleanup;
}
