"use client";

import { Warp } from "@paper-design/shaders-react";

export default function SkillBackground5() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        isolation: "isolate",
        contain: "strict",
        pointerEvents: "none",
      }}
    >
      <Warp
        style={{ width: "100%", height: "100%", display: "block" }}
        proportion={0.45}
        softness={1}
        distortion={0.25}
        swirl={0.8}
        swirlIterations={10}
        shape="checks"
        shapeScale={0.1}
        scale={1}
        rotation={0}
        speed={1}
        colors={[
          "#0B153F",
          "#3438F2",
          "#6259D8",
          "#9DB8FF",
        ]}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: [
            "radial-gradient(ellipse 48% 50% at 0% 58%, rgba(11,21,63,.62) 0%, rgba(11,21,63,.38) 44%, transparent 76%)",
            "radial-gradient(ellipse 50% 46% at 12% 108%, rgba(11,21,63,.68) 0%, rgba(11,21,63,.4) 46%, transparent 78%)",
            "radial-gradient(ellipse 54% 40% at 54% 112%, rgba(11,21,63,.58) 0%, rgba(11,21,63,.32) 48%, transparent 80%)",
          ].join(", "),
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 82% 72% at 100% 0%, rgba(219,230,255,.56) 0%, rgba(184,204,255,.4) 34%, rgba(145,173,250,.2) 64%, transparent 88%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
