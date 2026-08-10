// EnergySandVolume — an audio-reactive particle bar/column visualizer that doubles as
// the volume level's visual, styled like a spectrum analyzer but built from individually
// simulated sand grains rather than a scalar "bar height".
//
// Each particle belongs to a column (one of AUDIO_BAND_COUNT real frequency bands, see
// useAudioAnalyser's `bandsRef`) and has its OWN persistent height/velocity: gravity
// pulls it down continuously, and while resting at the bottom it has a per-frame chance
// — proportional to that column's current level and the particle's own random
// "responsiveness" — of launching upward with a randomized impulse. That's what a
// column-height-driven approach (tried first, then a per-column peak-meter version)
// couldn't produce: because every particle's launch timing, strength, and current
// fall-phase differ, the field is naturally sparse when quiet (most particles resting,
// few small hops) and dense when loud (many particles airborne at once, mixed heights)
// — real density variation, not a fixed particle count re-spread over a scalar height.
//
// This does mean the position buffer is updated on the CPU each frame (not a pure GPU
// shader simulation) — at this particle count (roughly 1000-2500) that's a trivial
// amount of per-frame float math, well under budget, and it's what actually lets each
// grain hold its own falling state between frames; a stateless vertex shader can't.
//
// This is a pure visual layer — the real, accessible volume control is the existing
// native <input type="range"> rendered by the caller on top of/alongside this canvas.
// Nothing here touches audio playback or volume; it only reads live levels off refs
// supplied by useAudioAnalyser.
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { AUDIO_BAND_COUNT } from "@/hooks/useAudioAnalyser";
import { computeColumnMotionTargets } from "@/lib/dashboard/audio-reactivity";

// Each particle is a small instanced quad rendered as regular triangles (the same
// technique MagicRings/SideRays/SoftAurora already use successfully) rather than a
// gl.POINTS sprite — point-sprite support/sizing is a notably less consistent corner of
// WebGL across GPU drivers than plain triangle rasterization, and was the prime suspect
// once "no console errors, canvas exists, but genuinely nothing drawn" ruled out a JS-
// level bug. instanceMatrix carries each particle's position + screen-space size; the
// custom aColorX attribute carries where along the gradient it sits (instanceMatrix has
// no room for extra per-instance data beyond the transform).
const particleVertex = `
attribute float aColorX;
varying vec2 vUv;
varying float vX;
varying float vRel;
uniform float uBaselineY;

void main() {
  vUv = uv;
  vX = aColorX;
  vec4 worldPos = instanceMatrix * vec4(position, 1.0);
  vRel = clamp((worldPos.y - uBaselineY) / 0.55, 0.0, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}
`;

const particleFragment = `
precision highp float;
varying vec2 vUv;
varying float vX;
varying float vRel;
uniform float uPresence;

vec3 auroraGradient(float x) {
  vec3 c1 = vec3(0.02, 0.87, 1.0);
  vec3 c2 = vec3(0.22, 0.55, 1.0);
  vec3 c3 = vec3(0.38, 0.32, 0.88);
  vec3 c4 = vec3(0.58, 0.30, 0.98);
  float t1 = smoothstep(0.0, 0.34, x);
  float t2 = smoothstep(0.34, 0.67, x);
  float t3 = smoothstep(0.67, 1.0, x);
  vec3 col = mix(c1, c2, t1);
  col = mix(col, c3, t2);
  col = mix(col, c4, t3);
  return col;
}

void main() {
  vec2 d = vUv - 0.5;
  float r = length(d) * 2.0;
  float falloff = exp(-r * r * 4.2);
  if (falloff < 0.02) discard;
  vec3 col = auroraGradient(vX);
  float alpha = min(0.62, falloff * (0.28 + vRel * 0.32) * uPresence);
  if (alpha < 0.003) discard;
  gl_FragColor = vec4(col, alpha);
}
`;

function pickParticlesPerColumn() {
  if (typeof navigator === "undefined") return 80;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = /** @type {{ deviceMemory?: number }} */ (navigator).deviceMemory;
  if (cores <= 2 || (mem && mem <= 2)) return 30;
  if (cores <= 4) return 52;
  return 100;
}

function seededUnit(index) {
  const value = Math.sin(index * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

/**
 * @param {{
 *   bassRef: { current: number }, midRef: { current: number },
 *   trebleRef: { current: number }, energyRef: { current: number },
 *   loudnessRef: { current: number }, beatPulseRef: { current: number },
 *   bandsRef: { current: Float32Array },
 *   volumeRef: { current: number }, isPlayingRef: { current: boolean },
 *   onFallback?: () => void,
 * }} props
 */
export default function EnergySandVolume({
  bandsRef,
  loudnessRef,
  beatPulseRef,
  isPlayingRef,
  onFallback,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      onFallback?.();
      return;
    }
    if (!renderer) {
      onFallback?.();
      return;
    }

    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 10);
    camera.position.z = 1;

    const particlesPerColumn = pickParticlesPerColumn();
    const particleCount = particlesPerColumn * AUDIO_BAND_COUNT;
    const colWidth = 1 / AUDIO_BAND_COUNT;

    // Per-particle simulation state, kept in plain JS arrays (not GPU buffers) since it
    // needs to persist and evolve frame to frame — a shader has no memory of its own.
    const pCol = new Int16Array(particleCount);
    const pJitterX = new Float32Array(particleCount);
    const pHeightRank = new Float32Array(particleCount);
    const pY = new Float32Array(particleCount);
    const pVY = new Float32Array(particleCount);
    const pGravity = new Float32Array(particleCount);
    // Fixed seeds shape particle placement and size only; they never trigger motion.
    const pSeed = new Float32Array(particleCount);
    const colHeight = new Float32Array(AUDIO_BAND_COUNT);

    let idx = 0;
    for (let col = 0; col < AUDIO_BAND_COUNT; col++) {
      for (let i = 0; i < particlesPerColumn; i++) {
        pCol[idx] = col;
        pJitterX[idx] = seededUnit(idx * 3 + 1) - 0.5;
        // Skewed toward low/mid responsiveness (most grains stay fairly settled) with a
        // smaller tail of very reactive ones (the few that shoot up high) — pow bias
        // instead of a flat random range.
        pSeed[idx] = seededUnit(idx * 3 + 2);
        pHeightRank[idx] =
          (i + 0.35 + pSeed[idx] * 0.3) / particlesPerColumn;
        pGravity[idx] = 1.8 + seededUnit(idx * 3 + 3) * 1.4;
        // Wide spread: some grains drop fast and heavy, others hang and drift — same
        // launch impulse range but very different fall character. Lower range than
        // before (was 1.7-5.1) for a softer, more unhurried overall fall.
        idx++;
      }
    }

    // One shared unit quad, instanced per particle — instanceMatrix carries each
    // particle's position + per-axis scale (computed below so a "round" particle stays
    // visually round despite the camera's non-square 0..1 space over a wide/short box).
    const quadGeometry = new THREE.PlaneGeometry(1, 1);
    const aColorX = new THREE.InstancedBufferAttribute(new Float32Array(particleCount), 1);
    for (let j = 0; j < particleCount; j++) {
      aColorX.array[j] = (pCol[j] + 0.5) * colWidth;
    }
    quadGeometry.setAttribute("aColorX", aColorX);

    const particleUniforms = {
      uBaselineY: { value: 0.18 },
      // Fades the whole field out on pause/stop and back in on play — per the spec, the
      // effect should actually disappear when not playing, not just calm down. A smooth
      // fade (not an instant cut) so it doesn't feel like a glitch.
      uPresence: { value: 0 },
    };
    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: particleUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const instancedMesh = new THREE.InstancedMesh(quadGeometry, particleMaterial, particleCount);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedMesh);
    const tmpMatrix = new THREE.Matrix4();
    // Filled in by resize() below with the container's actual pixel dimensions, needed
    // to convert a desired on-screen particle size (px) into this non-square camera's
    // per-axis scale units.
    const containerPx = { w: 1, h: 1 };

    const dpr = () => Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w <= 0 || h <= 0) return;
      const ratio = dpr();
      renderer.setPixelRatio(ratio);
      renderer.setSize(w, h);
      containerPx.w = w;
      containerPx.h = h;

      // Baseline coincides with the real volume-slider track's vertical center — measured
      // off the DOM each resize rather than a hand-picked constant.
      const stack = container.closest(".volume-waveform-stack");
      const slider = stack ? stack.querySelector("input.volume-slider") : null;
      if (slider) {
        const sliderRect = slider.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const fromTop =
          sliderRect.top + sliderRect.height / 2 - containerRect.top;
        particleUniforms.uBaselineY.value = 1 - fromTop / h;
      }
    };
    resize();
    window.addEventListener("resize", resize);
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    // Belt-and-suspenders retries in case the container measures 0x0 on the very first
    // call (layout not settled yet) and, for whatever reason, the ResizeObserver never
    // fires a follow-up on a given browser — a few cheap delayed retries cost nothing and
    // guarantee this recovers instead of staying permanently unsized.
    const retryTimers = [100, 400, 1000, 2000].map((ms) => setTimeout(resize, ms));

    // Starts true (assume visible) rather than waiting for the IntersectionObserver's
    // first callback to flip it on — if that callback is ever delayed or never fires for
    // any reason on a given browser/extension setup, gating the *start* on it means
    // nothing renders, ever, with no way to recover. The observer is only used below to
    // *pause* once it positively confirms the element left the viewport, never to gate
    // the initial start.
    let isVisible = true;
    let isPageVisible = !document.hidden;
    let frameId = 0;
    let lastT = 0;

    // Smoothed column heights are the only persistent motion state. The targets below
    // come directly from live loudness, beat pulse, and real spectrum values.
    let presence = 0;
    let visibleFrameCount = 0;
    let selfCheckDone = false;
    let lastBeatPulse = 0;

    const animate = (t) => {
      frameId = requestAnimationFrame(animate);
      const dt = lastT === 0 ? 0 : Math.min(t - lastT, 100);
      lastT = t;
      const dtSec = dt / 1000;
      const playing = isPlayingRef.current;

      presence +=
        ((playing ? 1 : 0) - presence) *
        Math.min(1, dtSec * (playing ? 5 : 2.5));
      particleUniforms.uPresence.value = presence;

      const loudness = playing ? loudnessRef.current : 0;
      const beat = playing && !reducedMotion ? beatPulseRef.current : 0;
      const bands = bandsRef.current;
      const targets = computeColumnMotionTargets(bands, loudness, beat);
      const beatRising = beat > 0.08 && beat > lastBeatPulse + 0.03;
      lastBeatPulse = beat;
      const responseRate = reducedMotion ? 2.5 : 12;
      const attackAlpha = 1 - Math.exp(-responseRate * dtSec);
      const releaseAlpha =
        1 - Math.exp(-(reducedMotion ? 2.5 : 7) * dtSec);

      for (let col = 0; col < AUDIO_BAND_COUNT; col++) {
        const target = playing ? targets.baseHeights[col] : 0;
        colHeight[col] +=
          (target - colHeight[col]) *
          (target > colHeight[col] ? attackAlpha : releaseAlpha);
      }

      const baselineY = particleUniforms.uBaselineY.value;
      for (let j = 0; j < particleCount; j++) {
        const col = pCol[j];
        const colCenterX = (col + 0.5) * colWidth;
        const x = colCenterX + pJitterX[j] * colWidth * 0.72;
        const texture = 0.82 + pSeed[j] * 0.18;
        if (beatRising) {
          const rankResponse = 0.2 + pHeightRank[j] * 0.8;
          const particleResponse = 0.75 + pSeed[j] * 0.5;
          pVY[j] +=
            targets.beatImpulses[col] * rankResponse * particleResponse;
        }
        pVY[j] -= pGravity[j] * dtSec;
        pY[j] += pVY[j] * dtSec;
        if (pY[j] <= 0) {
          pY[j] = 0;
          pVY[j] = 0;
        }
        const y =
          baselineY +
          colHeight[col] * Math.pow(pHeightRank[j], 0.82) * texture +
          pY[j];
        const rel = Math.min(1, (colHeight[col] + pY[j]) / 0.48);
        const sizePx = (2.1 + pSeed[j] * 1.5) * (0.75 + rel * 0.55);

        tmpMatrix.makeScale(sizePx / containerPx.w, sizePx / containerPx.h, 1);
        tmpMatrix.setPosition(x, y, 0);
        instancedMesh.setMatrixAt(j, tmpMatrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);

      if (presence > 0.4) visibleFrameCount++;
      if (!selfCheckDone && visibleFrameCount === 30) {
        selfCheckDone = true;
        try {
          const gl = renderer.getContext();
          const w = gl.drawingBufferWidth;
          const h = gl.drawingBufferHeight;
          if (w > 0 && h > 0) {
            const pixels = new Uint8Array(w * h * 4);
            gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            let anyVisible = false;
            for (let i = 3; i < pixels.length; i += 4) {
              if (pixels[i] > 0) {
                anyVisible = true;
                break;
              }
            }
            if (!anyVisible) onFallback?.();
          }
        } catch {
          onFallback?.();
        }
      }
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && frameId === 0) {
        lastT = 0;
        frameId = requestAnimationFrame(animate);
      }
    };
    const tryStop = () => {
      if (frameId !== 0) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        isVisible ? tryStart() : tryStop();
      },
      { threshold: 0 },
    );
    io.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    tryStart();

    return () => {
      tryStop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      ro.disconnect();
      retryTimers.forEach(clearTimeout);
      quadGeometry.dispose();
      particleMaterial.dispose();
      try {
        const loseCtx = renderer.getContext().getExtension("WEBGL_lose_context");
        if (loseCtx) loseCtx.loseContext();
      } catch {
        // best-effort
      }
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [bandsRef, beatPulseRef, isPlayingRef, loudnessRef, onFallback]);

  return (
    <div
      ref={containerRef}
      className="energy-sand-volume"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
