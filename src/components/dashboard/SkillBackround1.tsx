"use client";

import { Warp } from "@paper-design/shaders-react";

export default function SkillBackround1() {
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
          "#0B0A2E",
          "#312E81",
          "#4F46E5",
          "#818CF8",
        ]}
      />
    </div>
  );
}
