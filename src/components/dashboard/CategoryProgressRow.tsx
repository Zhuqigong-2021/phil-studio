"use client";

import * as React from "react";
import gsap from "gsap";
import { useReducedMotion } from "motion/react";

import {
  getCategoryProgressGradient,
  getCategoryProgressMotion,
} from "@/lib/dashboard/category-progress-motion";

export default function CategoryProgressRow({
  tag,
  percent,
  color,
  index,
}: {
  tag: string;
  percent: number;
  color: string;
  index: number;
}) {
  const barRef = React.useRef<HTMLDivElement>(null);
  const valueRef = React.useRef<HTMLSpanElement>(null);
  const reducedMotion = Boolean(useReducedMotion());

  React.useLayoutEffect(() => {
    const bar = barRef.current;
    const value = valueRef.current;
    if (!bar || !value) return;

    if (reducedMotion) {
      bar.style.width = `${percent}%`;
      value.textContent = `${percent}%`;
      return;
    }

    const counter = { value: 0 };
    const timing = getCategoryProgressMotion(index, false);
    const context = gsap.context(() => {
      gsap.fromTo(
        bar,
        { width: "0%" },
        { width: `${percent}%`, ...timing },
      );
      gsap.to(counter, {
        value: percent,
        ...timing,
        onUpdate: () => {
          value.textContent = `${Math.round(counter.value)}%`;
        },
      });
    });

    return () => context.revert();
  }, [index, percent, reducedMotion]);

  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      <span className="text-[#d7dcee] text-[13px] font-medium w-[100px] flex-shrink-0 truncate">
        {tag}
      </span>
      <div
        className="flex-1 h-[8px] rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          ref={barRef}
          data-category-progress-bar
          className="h-full rounded-full"
          style={{
            width: reducedMotion ? `${percent}%` : "0%",
            background: getCategoryProgressGradient(color),
            boxShadow: `0 0 10px color-mix(in srgb, ${color} 24%, transparent)`,
          }}
        />
      </div>
      <span
        ref={valueRef}
        data-category-progress-value
        className="text-[#b7bed6] text-[13px] font-semibold tabular-nums w-[38px] flex-shrink-0 text-right"
      >
        {reducedMotion ? percent : 0}%
      </span>
    </div>
  );
}
