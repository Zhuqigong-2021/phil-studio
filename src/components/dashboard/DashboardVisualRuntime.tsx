"use client";

import dynamic from "next/dynamic";
import React from "react";

const WorkspaceSplashCursor = dynamic(
  () => import("@/components/dashboard/WorkspaceSplashCursor"),
  { ssr: false },
);

export const EnergySandVolume = dynamic(
  () => import("@/components/dashboard/EnergySandVolume"),
  {
    ssr: false,
    loading: () => <div aria-hidden="true" className="energy-sand-volume" style={{ width: "100%", height: "100%" }} />,
  },
);

export const MagicRings = dynamic(
  () => import("@/components/dashboard/MagicRings"),
  {
    ssr: false,
    loading: () => <div aria-hidden="true" className="magic-rings-container" />,
  },
);

export const SideRays = dynamic(
  () => import("@/components/dashboard/SideRays"),
  {
    ssr: false,
    loading: () => <div aria-hidden="true" className="side-rays-container" />,
  },
);

const DashboardVisualRuntime = React.memo(function DashboardVisualRuntime() {
  return <WorkspaceSplashCursor />;
});

export default DashboardVisualRuntime;
