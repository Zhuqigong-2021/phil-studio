"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { TagChip } from "@/hooks/useDashboardState";

const PARTICLE_COUNT = 12;
const PARTICLE_COLORS = ["#67E8F9", "#60A5FA", "#818CF8", "#C084FC"];

type ParticleStyle = CSSProperties & Record<`--${string}`, string>;

function noise(amount = 1) {
  return amount / 2 - Math.random() * amount;
}

function getPoint(distance: number, index: number) {
  const angle = (((360 + noise(8)) / PARTICLE_COUNT) * index * Math.PI) / 180;
  return [distance * Math.cos(angle), distance * Math.sin(angle)];
}

export default function GooeyTagNav({ tags }: { tags: TagChip[] }) {
  const navRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<HTMLDivElement>(null);
  const activeIndex = tags.findIndex((tag) => tag.active);

  const positionEffect = (button: HTMLButtonElement) => {
    const nav = navRef.current;
    const effect = effectRef.current;
    if (!nav || !effect) return;

    const navRect = nav.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    effect.style.transform = `translate3d(${buttonRect.left - navRect.left}px, ${buttonRect.top - navRect.top}px, 0)`;
    effect.style.width = `${buttonRect.width}px`;
    effect.style.height = `${buttonRect.height}px`;
  };

  const burst = () => {
    const effect = effectRef.current;
    if (!effect || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    effect.querySelectorAll(".gooey-tag-particle").forEach((particle) => particle.remove());

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const particle = document.createElement("span");
      const point = document.createElement("span");
      const start = getPoint(54, PARTICLE_COUNT - index);
      const end = getPoint(10 + noise(7), PARTICLE_COUNT - index);
      const duration = 720 + noise(260);
      const style: ParticleStyle = {
        "--start-x": `${start[0]}px`,
        "--start-y": `${start[1]}px`,
        "--end-x": `${end[0]}px`,
        "--end-y": `${end[1]}px`,
        "--particle-time": `${duration}ms`,
        "--particle-scale": `${0.9 + noise(0.25)}`,
        "--particle-color": PARTICLE_COLORS[index % PARTICLE_COLORS.length],
        "--particle-rotate": `${noise(70)}deg`,
      };

      particle.className = "gooey-tag-particle";
      point.className = "gooey-tag-point";
      Object.assign(particle.style, style);
      particle.appendChild(point);
      effect.appendChild(particle);
      window.setTimeout(() => particle.remove(), duration);
    }
  };

  const selectTag = (tag: TagChip, button: HTMLButtonElement) => {
    if (tag.active) return;
    positionEffect(button);
    burst();
    tag.onClick();
  };

  useEffect(() => {
    const nav = navRef.current;
    const activeButton = nav?.querySelector<HTMLButtonElement>(
      `[data-tag-index="${activeIndex}"]`,
    );
    if (activeButton) positionEffect(activeButton);

    if (!nav || !activeButton) return;
    const observer = new ResizeObserver(() => positionEffect(activeButton));
    observer.observe(nav);
    return () => observer.disconnect();
  }, [activeIndex]);

  return (
    <div ref={navRef} className="gooey-tag-nav" aria-label="Filter tools by tag">
      <div ref={effectRef} className="gooey-tag-effect" aria-hidden="true" />
      {tags.map((tag, index) => (
        <button
          key={tag.name}
          type="button"
          data-tag-index={index}
          className={`tool-filter-tag${tag.active ? " is-active" : ""}`}
          aria-pressed={tag.active}
          onClick={(event) => selectTag(tag, event.currentTarget)}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
