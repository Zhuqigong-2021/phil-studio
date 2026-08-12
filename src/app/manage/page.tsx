"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { AnimatePresence } from "motion/react";
import "@/styles/secondary.css";
import { DashboardPageView, useDashboardWorkspace } from "@/app/dashboard/page";
import AddToolModal from "@/components/dashboard/AddToolModal";
import { useManagePageStateWithWorkspace } from "@/hooks/useManagePageState";
import ManageContent from "@/components/dashboard/pages/ManageContent";
import {
  beginToolLibraryHandoffEntrance,
  completeToolLibraryHandoff,
} from "@/lib/dashboard/tool-transition";

export default function ManagePage() {
  return (
    <DashboardPageView
      activeRoute="manage"
      backgroundMode="manage"
      mainContent={<ManageWorkspace />}
    />
  );
}

function ManageWorkspace() {
  const workspace = useDashboardWorkspace();
  const state = useManagePageStateWithWorkspace(workspace);
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
      const timeoutId = window.setTimeout(() => {
        completeToolLibraryHandoff(reduceMotion);
        clearMarker();
      }, reduceMotion ? 20 : 120);
      return () => window.clearTimeout(timeoutId);
    });

    return () => {
      cancelMarkerClear();
      context.revert();
    };
  }, []);

  return (
    <>
          <div ref={entranceRef} className="tool-library-page-enter">
            <ManageContent state={state} />
          </div>
          <AnimatePresence>
            {state.addToolOpen && (
              <AddToolModal
                open
                onClose={state.closeAddTool}
                workspace={workspace}
              />
            )}
          </AnimatePresence>
    </>
  );
}
