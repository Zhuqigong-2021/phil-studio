export const MOTION_EASINGS = {
  out: "cubic-bezier(0.23, 1, 0.32, 1)",
  inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
  drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
} as const;

export const MOTION_CURVES = {
  out: [0.23, 1, 0.32, 1],
  inOut: [0.77, 0, 0.175, 1],
  drawer: [0.32, 0.72, 0, 1],
} as const;

export function getDashboardEntranceTimeline(reduced: boolean) {
  const duration = reduced ? 0.16 : 1.45;
  const ease = reduced ? "power2.out" : "power3.inOut";
  const from = (offset: { x?: number; y?: number }) => ({
    from: reduced ? { autoAlpha: 0 } : { autoAlpha: 0, ...offset },
    to: { autoAlpha: 1, x: 0, y: 0, duration, ease },
  });

  return {
    duration,
    ease,
    sidebar: from({ x: -44 }),
    navbar: from({ y: -32 }),
    utilities: from({ x: 44 }),
    stats: from({ y: 38 }),
    bottom: from({ y: 46 }),
  };
}

export function getPanelMotion(reduced: boolean, direction = 1) {
  return reduced
    ? {
        from: { autoAlpha: 0 },
        to: { autoAlpha: 1, duration: 0.14, ease: "power2.out" },
      }
    : {
        from: { autoAlpha: 0, x: 14 * Math.sign(direction || 1) },
        to: { autoAlpha: 1, x: 0, duration: 0.24, ease: "power3.out" },
      };
}

export function getPanelPresenceMotion(reduced: boolean) {
  return reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.14, ease: MOTION_CURVES.out },
      }
    : {
        initial: {
          opacity: 0,
          transform: "translateY(10px) scale(0.975)",
          filter: "blur(7px)",
        },
        animate: {
          opacity: 1,
          transform: "translateY(0px) scale(1)",
          filter: "blur(0px)",
        },
        exit: {
          opacity: 0,
          transform: "translateY(5px) scale(0.985)",
          filter: "blur(5px)",
          transition: { duration: 0.18, ease: MOTION_CURVES.out },
        },
        transition: { duration: 0.34, ease: MOTION_CURVES.out },
      };
}

export function getStatCountMotion(value: string) {
  const match = /^(\d+)(%)?$/.exec(value);
  if (!match) return null;

  return {
    end: Number(match[1]),
    suffix: match[2] ?? "",
  };
}

export function getStatCountTiming(initial: boolean) {
  return initial
    ? { delay: 0.22, duration: 0.75 }
    : { delay: 0, duration: 0.45 };
}

export function getOverlayMotion(
  reduced: boolean,
  variant: "default" | "modal" | "search" = "default",
) {
  const focused = variant !== "default";
  const transition = {
    duration: reduced ? 0.14 : focused ? 0.22 : 0.18,
    ease: MOTION_CURVES.out,
  };

  const backdrop = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: {
          opacity: 0,
          transition: { duration: 0.15, ease: MOTION_CURVES.out },
        },
        transition,
      }
    : focused
      ? {
          initial: { opacity: 0, backdropFilter: "blur(0px)" },
          animate: { opacity: 1, backdropFilter: "blur(8px)" },
          exit: {
            opacity: 0,
            backdropFilter: "blur(0px)",
            transition: { duration: 0.15, ease: MOTION_CURVES.out },
          },
          transition,
        }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: {
            opacity: 0,
            transition: { duration: 0.15, ease: MOTION_CURVES.out },
          },
          transition,
        };

  if (reduced) {
    return {
      backdrop,
      surface: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.14, ease: MOTION_CURVES.out },
      },
    };
  }

  if (variant === "modal") {
    return {
      backdrop,
      surface: {
        initial: {
          opacity: 0,
          transform: "translateY(14px) scale(0.94)",
          filter: "blur(6px)",
        },
        animate: {
          opacity: 1,
          transform: "translateY(0px) scale(1)",
          filter: "blur(0px)",
        },
        exit: {
          opacity: 0,
          transform: "translateY(6px) scale(0.975)",
          filter: "blur(4px)",
          transition: { duration: 0.15, ease: MOTION_CURVES.out },
        },
        transition: { duration: 0.34, ease: MOTION_CURVES.out },
      },
    };
  }

  if (variant === "search") {
    return {
      backdrop,
      surface: {
        initial: {
          opacity: 0,
          transform: "translateY(-10px) scale(0.965)",
          filter: "blur(6px)",
        },
        animate: {
          opacity: 1,
          transform: "translateY(0px) scale(1)",
          filter: "blur(0px)",
        },
        exit: {
          opacity: 0,
          transform: "translateY(-5px) scale(0.98)",
          filter: "blur(4px)",
          transition: { duration: 0.15, ease: MOTION_CURVES.out },
        },
        transition: { duration: 0.3, ease: MOTION_CURVES.out },
      },
    };
  }

  return {
    backdrop,
    surface: {
      initial: { opacity: 0, transform: "translateY(8px) scale(0.97)" },
      animate: { opacity: 1, transform: "translateY(0px) scale(1)" },
      exit: {
        opacity: 0,
        transform: "translateY(4px) scale(0.985)",
        transition: { duration: 0.15, ease: MOTION_CURVES.out },
      },
      transition: {
        type: "spring" as const,
        duration: 0.28,
        bounce: 0.05,
      },
    },
  };
}

export function getDrawerMotion(reduced: boolean) {
  return reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.14, ease: MOTION_CURVES.out },
      }
    : {
        initial: { opacity: 0, transform: "translateX(-100%)" },
        animate: { opacity: 1, transform: "translateX(0%)" },
        exit: {
          opacity: 0,
          transform: "translateX(-100%)",
          transition: { duration: 0.2, ease: MOTION_CURVES.drawer },
        },
        transition: { duration: 0.26, ease: MOTION_CURVES.drawer },
      };
}

export function getListItemMotion(reduced: boolean) {
  return reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.14, ease: MOTION_CURVES.out },
      }
    : {
        initial: { opacity: 0, transform: "translateY(6px) scale(0.97)" },
        animate: { opacity: 1, transform: "translateY(0px) scale(1)" },
        exit: {
          opacity: 0,
          transform: "translateY(-4px) scale(0.985)",
          transition: { duration: 0.15, ease: MOTION_CURVES.out },
        },
        transition: { duration: 0.2, ease: MOTION_CURVES.out },
      };
}

export function getPopoverMotion(reduced: boolean) {
  return reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.14, ease: MOTION_CURVES.out },
      }
    : {
        initial: { opacity: 0, transform: "translateY(-6px) scale(0.96)" },
        animate: { opacity: 1, transform: "translateY(0px) scale(1)" },
        exit: {
          opacity: 0,
          transform: "translateY(-3px) scale(0.98)",
          transition: { duration: 0.13, ease: MOTION_CURVES.out },
        },
        transition: { duration: 0.18, ease: MOTION_CURVES.out },
      };
}

export function getQuickAccessItemMotion(reduced: boolean, index: number) {
  return reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.14, delay: 0, ease: MOTION_CURVES.out },
      }
    : {
        initial: { opacity: 0, transform: "translateY(8px) scale(0.96)" },
        animate: { opacity: 1, transform: "translateY(0px) scale(1)" },
        transition: {
          duration: 0.22,
          delay: Math.min(index, 5) * 0.03,
          ease: MOTION_CURVES.out,
        },
      };
}

export function shouldDismissDrawer(offsetX: number, velocityX: number) {
  return offsetX <= -64 || velocityX <= -520;
}
