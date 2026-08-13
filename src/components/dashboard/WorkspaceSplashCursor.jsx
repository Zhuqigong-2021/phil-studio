"use client";

import SplashCursor from "@/components/SplashCursor";

export default function WorkspaceSplashCursor() {
  return (
    <SplashCursor
      DENSITY_DISSIPATION={3.5}
      VELOCITY_DISSIPATION={2}
      PRESSURE={0.15}
      CURL={3}
      SPLAT_RADIUS={0.12}
      SPLAT_FORCE={6000}
      COLOR_UPDATE_SPEED={11}
      SHADING
      RAINBOW_MODE={false}
      COLOR="#bb8af0"
    />
  );
}
