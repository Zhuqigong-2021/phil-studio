"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { DiaTextReveal } from "@/components/magicui/DiaTextReveal";
import { getTypedText } from "./dashboard-greeting-state";

const TITLE = "Bonjour, Phil !";
const CHARACTER_MS = 55;
const TYPEWRITER_DELAY_MS = 850;

export default function DashboardGreeting({ paddingTop }: { paddingTop: string }) {
  const reduceMotion = Boolean(useReducedMotion());
  const [typedText, setTypedText] = React.useState(reduceMotion ? TITLE : "");
  const [typingComplete, setTypingComplete] = React.useState(reduceMotion);
  const [revealComplete, setRevealComplete] = React.useState(reduceMotion);

  React.useEffect(() => {
    if (reduceMotion) return;
    const startedAt = performance.now();
    let frame = 0;
    const onTypingComplete = () => setTypingComplete(true);
    const tick = (now: number) => {
      const next = getTypedText(
        TITLE,
        now - startedAt - TYPEWRITER_DELAY_MS,
        CHARACTER_MS,
      );
      setTypedText(next.text);
      if (next.complete) {
        onTypingComplete();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion]);

  const onRevealComplete = React.useCallback(() => setRevealComplete(true), []);

  return (
    <motion.div
      data-dashboard-greeting
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0.16 : 0.65, delay: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
      className="flex-1 flex flex-col justify-start"
      style={{ paddingTop }}
    >
      <h1 className="text-white font-semibold text-[34px] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
        <DiaTextReveal
          text={typedText}
          active={typingComplete && !reduceMotion}
          colors={["#A97CF8", "#818CF8", "#67E8F9"]}
          textColor="#ffffff"
          onRevealComplete={onRevealComplete}
        />{" "}
        <span aria-hidden="true">👋</span>
      </h1>
      <p className="text-[#e4e7f1] font-medium text-[16px] mt-[14px] drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
        Welcome to your AI Tools Dashboard
      </p>
      <motion.div
        data-dashboard-location
        animate={revealComplete && !reduceMotion ? { y: [0, -18, 0, -10, 0, -5, 0, -2, 0] } : { y: 0 }}
        transition={{ duration: 1.45, ease: "easeOut" }}
        className="inline-flex items-center gap-[6px] mt-[12px] text-[#aab4cc]"
      >
        <MapPin className="flex-shrink-0" style={{ width: 15, height: 15 }} strokeWidth={2} fill="none" />
        <span className="text-[15px] font-medium drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">Montréal, Canada</span>
      </motion.div>
    </motion.div>
  );
}
