"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { claimDiaTextReveal } from "./dia-text-reveal-state";

type DiaTextRevealProps = {
  text: string;
  colors?: string[];
  textColor?: string;
  duration?: number;
  delay?: number;
  sessionKey: string;
  className?: string;
};

const DEFAULT_COLORS = ["#A97CF8", "#818CF8", "#67E8F9"];

export function DiaTextReveal({
  text,
  colors = DEFAULT_COLORS,
  textColor = "currentColor",
  duration = 1.6,
  delay = 0.18,
  sessionKey,
  className,
}: DiaTextRevealProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [shouldAnimate, setShouldAnimate] = React.useState(false);
  const [settled, setSettled] = React.useState(false);

  React.useEffect(() => {
    if (reduceMotion) return;
    const frame = window.requestAnimationFrame(() => {
      setShouldAnimate(claimDiaTextReveal(window.sessionStorage, sessionKey));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion, sessionKey]);

  if (!shouldAnimate || settled) {
    return (
      <span className={className} style={{ color: textColor }}>
        {text}
      </span>
    );
  }

  const gradient = [textColor, textColor, ...colors, textColor, textColor].join(
    ", ",
  );

  return (
    <motion.span
      className={className}
      initial={{ backgroundPosition: "100% 50%" }}
      animate={{ backgroundPosition: "0% 50%" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => setSettled(true)}
      style={{
        color: "transparent",
        backgroundImage: `linear-gradient(90deg, ${gradient})`,
        backgroundSize: "300% 100%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
      }}
    >
      {text}
    </motion.span>
  );
}
