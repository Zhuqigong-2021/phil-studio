"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "@/styles/secondary.css";
import { useManagePageState } from "@/hooks/useManagePageState";
import SecondaryPageShell from "@/components/dashboard/SecondaryPageShell";
import ManageContent from "@/components/dashboard/pages/ManageContent";
import { beginToolLibraryHandoffEntrance } from "@/lib/dashboard/tool-transition";

export default function ManagePage() {
  const state = useManagePageState();
  const entranceRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = entranceRef.current;
    if (!root) return;

    const entrance = beginToolLibraryHandoffEntrance();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      if (entrance.handoff) {
        const targets = root.querySelectorAll(
          ".tool-library-header, .tool-library-sync-error, .tool-library-table-scroll, .tool-library-pagination",
        );
        gsap.fromTo(
          targets,
          { opacity: 0, y: reduceMotion ? 0 : 12 },
          {
            opacity: 1,
            y: 0,
            duration: reduceMotion ? 0.16 : 0.28,
            ease: "power2.out",
            stagger: reduceMotion ? 0 : 0.045,
          },
        );
        return;
      }

      gsap.fromTo(
        root,
        { opacity: 0, y: reduceMotion ? 0 : 8 },
        { opacity: 1, y: 0, duration: reduceMotion ? 0.16 : 0.28, ease: "power2.out" },
      );
    }, root);

    const cancelMarkerClear = entrance.establish((clearMarker) => {
      const timeoutId = window.setTimeout(clearMarker, 0);
      return () => window.clearTimeout(timeoutId);
    });

    return () => {
      cancelMarkerClear();
      context.revert();
    };
  }, []);

  return (
    <SecondaryPageShell state={state} active="manage">
      <div ref={entranceRef} className="tool-library-page-enter">
        <ManageContent state={state} />
      </div>
    </SecondaryPageShell>
  );
}
