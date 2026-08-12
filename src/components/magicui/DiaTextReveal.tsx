"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

type DiaTextRevealProps = {
  text: string;
  colors?: string[];
  textColor?: string;
  duration?: number;
  delay?: number;
  active?: boolean;
  onRevealComplete?: () => void;
  className?: string;
};

const DEFAULT_COLORS = ["#A97CF8", "#818CF8", "#67E8F9"];

export function DiaTextReveal({
  text,
  colors = DEFAULT_COLORS,
  textColor = "currentColor",
  duration = 1.8,
  delay = 0.35,
  active = true,
  onRevealComplete,
  className,
}: DiaTextRevealProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [mounted, setMounted] = React.useState(false);
  const [settled, setSettled] = React.useState(false);

  React.useEffect(() => {
    if (reduceMotion) return;
    const frame = window.requestAnimationFrame(() => setMounted(true));

    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion]);

  if (reduceMotion || !active || !mounted || settled) {
    return (
      <span className={className} style={{ color: textColor }}>
        {text}
      </span>
    );
  }

  const gradient = ["transparent", ...colors, "transparent"].join(", ");

  return (
    <span className={className} style={{ color: textColor, position: "relative" }}>
      {text}
      <motion.span
        aria-hidden="true"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{
          clipPath: [
            "inset(0 100% 0 0)",
            "inset(0 0 0 0)",
            "inset(0 0 0 100%)",
          ],
        }}
        transition={{
          duration,
          delay,
          times: [0, 0.5, 1],
          ease: [0.45, 0, 0.2, 1],
        }}
        onAnimationComplete={() => {
          setSettled(true);
          onRevealComplete?.();
        }}
        style={{
          position: "absolute",
          inset: 0,
          color: "transparent",
          backgroundImage: `linear-gradient(90deg, ${gradient})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
        }}
      >
        {text}
      </motion.span>
    </span>
  );
}
