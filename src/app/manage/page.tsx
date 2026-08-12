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
import { getManageDirectEntrancePlan } from "@/lib/dashboard/manage-entrance-motion";

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

      const plan = getManageDirectEntrancePlan(reduceMotion);
      const sidebar = document.querySelector("[data-dashboard-sidebar]");
      const navbar = document.querySelector("[data-dashboard-navbar]");
      const header = root.querySelector("[data-manage-entrance-header]");
      const table = root.querySelector("[data-manage-entrance-table]");
      const rows = root.querySelectorAll("[data-manage-entrance-row]");
      const pagination = root.querySelector("[data-manage-entrance-pagination]");
      const timeline = gsap.timeline({ paused: true });

      if (sidebar) timeline.fromTo(sidebar, plan.sidebar.from, plan.sidebar.to, 0);
      if (navbar) timeline.fromTo(navbar, plan.navbar.from, plan.navbar.to, 0);
      if (header) timeline.fromTo(header, plan.header.from, plan.header.to, reduceMotion ? 0 : 0.06);
      if (table) timeline.fromTo(table, plan.table.from, plan.table.to, reduceMotion ? 0 : 0.1);
      if (rows.length) timeline.fromTo(rows, plan.rows.from, plan.rows.to, reduceMotion ? 0 : 0.3);
      if (pagination) {
        timeline.fromTo(pagination, plan.pagination.from, plan.pagination.to, reduceMotion ? 0 : 0.14);
      }
      timeline.play(0);
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
