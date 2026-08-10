"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

import {
  LYRIC_BLUR_KEYFRAMES,
  getLyricNeonColor,
  splitBlurText,
} from "@/lib/dashboard/blur-text";

export default function BlurText({
  text,
  delay = 28,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const characters = splitBlurText(text);

  return (
    <span className={`blur-text-root ${className}`}>
      {characters.map((character, index) => (
        <motion.span
          key={`${index}-${character}`}
          className="blur-text-character"
          data-character={character}
          initial={
            reduceMotion
              ? false
              : {
                  filter: LYRIC_BLUR_KEYFRAMES.filter[0],
                  opacity: LYRIC_BLUR_KEYFRAMES.opacity[0],
                  y: LYRIC_BLUR_KEYFRAMES.y[0],
                }
          }
          animate={
            reduceMotion
              ? { filter: "blur(0px)", opacity: 1, y: 0 }
              : {
                  filter: [...LYRIC_BLUR_KEYFRAMES.filter],
                  opacity: [...LYRIC_BLUR_KEYFRAMES.opacity],
                  y: [...LYRIC_BLUR_KEYFRAMES.y],
                }
          }
          transition={{
            duration: 0.34,
            times: [0, 0.48, 1],
            delay: reduceMotion ? 0 : (index * delay) / 1000,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={
            {
              "--lyric-neon-color": getLyricNeonColor(index, characters.length),
            } as CSSProperties
          }
        >
          <span className="blur-text-character-core">{character}</span>
        </motion.span>
      ))}
    </span>
  );
}
