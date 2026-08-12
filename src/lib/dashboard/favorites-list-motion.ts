import { MOTION_CURVES } from "./motion-system.ts";

export function getFavoriteRowMotion(index: number, reducedMotion: boolean) {
  if (reducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0, transition: { duration: 0.12, ease: MOTION_CURVES.out } },
      transition: { duration: 0.14, delay: 0, ease: MOTION_CURVES.out, layout: { duration: 0 } },
    };
  }
  return {
    initial: { opacity: 0, transform: "translateY(8px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    exit: {
      opacity: 0,
      transform: "translateY(-4px) scale(0.985)",
      transition: { duration: 0.16, ease: MOTION_CURVES.out },
    },
    transition: {
      duration: 0.24,
      delay: Math.min(index, 7) * 0.045,
      ease: MOTION_CURVES.out,
      layout: { duration: 0.22, ease: MOTION_CURVES.inOut },
    },
  };
}
