"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { DiaTextReveal } from "@/components/magicui/DiaTextReveal";
import { getTypedText } from "./dashboard-greeting-state";

const TITLE = "Bonjour, Phil !";
const WELCOME = "Welcome to your AI Tools Dashboard";
const CHARACTER_MS = 34;
const WELCOME_CHARACTER_MS = 20;
const TYPEWRITER_DELAY_MS = 180;
const ENTRANCE_SETTLE_MS = 1_450;
const TITLE_REVEAL_DELAY_MS = 120;

export default function DashboardGreeting({ paddingTop }: { paddingTop: string }) {
  const reduceMotion = Boolean(useReducedMotion());
  const [typedText, setTypedText] = React.useState(reduceMotion ? TITLE : "");
  const [typedWelcome, setTypedWelcome] = React.useState(reduceMotion ? WELCOME : "");
  const [titleTypingComplete, setTitleTypingComplete] = React.useState(reduceMotion);
  const [subtitleTypingComplete, setSubtitleTypingComplete] = React.useState(reduceMotion);
  const [titleRevealActive, setTitleRevealActive] = React.useState(reduceMotion);

  React.useEffect(() => {
    if (reduceMotion) return;
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const next = getTypedText(
        TITLE,
        now - startedAt - TYPEWRITER_DELAY_MS,
        CHARACTER_MS,
      );
      setTypedText(next.text);
      if (next.complete) {
        setTitleTypingComplete(true);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion]);

  React.useEffect(() => {
    if (reduceMotion || !titleTypingComplete) return;
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const next = getTypedText(WELCOME, now - startedAt, WELCOME_CHARACTER_MS);
      setTypedWelcome(next.text);
      if (next.complete) {
        setSubtitleTypingComplete(true);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion, titleTypingComplete]);

  React.useEffect(() => {
    if (reduceMotion || !subtitleTypingComplete) return;
    const elapsedMs = TYPEWRITER_DELAY_MS
      + TITLE.length * CHARACTER_MS
      + WELCOME.length * WELCOME_CHARACTER_MS;
    const timeoutId = window.setTimeout(
      () => setTitleRevealActive(true),
      Math.max(0, ENTRANCE_SETTLE_MS - elapsedMs) + TITLE_REVEAL_DELAY_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, [reduceMotion, subtitleTypingComplete]);

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
          active={titleRevealActive && !reduceMotion}
          colors={["#A97CF8", "#818CF8", "#67E8F9"]}
          textColor="#ffffff"
        />{" "}
        {titleTypingComplete && <span aria-hidden="true">👋</span>}
      </h1>
      <motion.p
        aria-hidden={!titleTypingComplete}
        initial={{ opacity: 0 }}
        animate={{ opacity: titleTypingComplete ? 1 : 0 }}
        className="text-[#e4e7f1] font-medium text-[16px] mt-[14px] drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]"
      >
        {typedWelcome}
      </motion.p>
      {subtitleTypingComplete && (
        <motion.div
          data-dashboard-location
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 0 }}
          animate={!reduceMotion
            ? { opacity: 1, y: [0, -18, 0, -10, 0, -5, 0, -2, 0] }
            : { opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.16 : 1.45, ease: "easeOut" }}
          className="inline-flex items-center gap-[6px] mt-[12px] text-[#aab4cc]"
        >
          <MapPin className="flex-shrink-0" style={{ width: 15, height: 15 }} strokeWidth={2} fill="none" />
          <span className="text-[15px] font-medium drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">Montréal, Canada</span>
        </motion.div>
      )}
    </motion.div>
  );
}
