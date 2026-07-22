"use client";

import { Warp } from "@paper-design/shaders-react";

export default function SkillBackground3() {
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
        colors={["#25235F", "#3F3C9B", "#6257D9", "#A5B4FC"]}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: [
            "radial-gradient(ellipse 9% 6% at 87% 0%, rgba(255,255,255,.38) 0%, rgba(245,247,255,.2) 36%, rgba(224,231,255,.07) 66%, transparent 88%)",
            "radial-gradient(ellipse 82% 72% at 100% 0%, rgba(224,231,255,.58) 0%, rgba(199,210,254,.42) 34%, rgba(165,180,252,.2) 64%, transparent 88%)",
          ].join(", "),
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 24%, rgba(0,0,0,.12) 40%, rgba(0,0,0,.58) 58%, #000 74%)",
          maskImage:
            "linear-gradient(90deg, transparent 24%, rgba(0,0,0,.12) 40%, rgba(0,0,0,.58) 58%, #000 74%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 14% 10% at 100% 0%, rgba(17,21,63,.68) 0%, rgba(30,27,75,.4) 42%, rgba(37,35,95,.12) 70%, transparent 90%)",
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          WebkitMaskImage:
            "linear-gradient(165deg, transparent 42%, rgba(0,0,0,.12) 55%, rgba(0,0,0,.52) 72%, #000 94%)",
          maskImage:
            "linear-gradient(165deg, transparent 42%, rgba(0,0,0,.12) 55%, rgba(0,0,0,.52) 72%, #000 94%)",
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
          colors={["#11153F", "#1E1B4B", "#25235F", "#3730A3"]}
        />
      </div>
    </div>
  );
}
