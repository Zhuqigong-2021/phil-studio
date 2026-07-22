"use client";

import { Warp } from "@paper-design/shaders-react";

export default function SkillBackground2() {
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
          "#25235F",
          "#3F3C9B",
          "#6257D9",
          "#A5B4FC",
        ]}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 82% 72% at 100% 0%, rgba(224,231,255,.58) 0%, rgba(199,210,254,.42) 34%, rgba(165,180,252,.2) 64%, transparent 88%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
