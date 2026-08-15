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
import {
  createFountainTriggerState,
  integrateFountainParticle,
  stepFountainTriggers,
  writeDetrendedBedTargets,
  writeDetrendedSpectrum,
  writeLogCompressedSpectrum,
} from "@/lib/dashboard/fountain-physics";
import {
  computeAirborneBrightness,
  computeLaunchBrightness,
  computeRestingBrightness,
  smoothBrightness,
} from "@/lib/dashboard/particle-brightness";
import {
  resamplePeakPreservingInto,
  resampleSpectrumInto,
} from "@/lib/dashboard/layered-columns";
import {
  computeAttachedBounceLift,
  computeDropletSpread,
  computeDropletTierImpulse,
  computeDropletTrailLag,
  computeErosionNotchDepth,
  computeLowDebrisArc,
  computeHighAccentBudget,
  computeParticleReleaseDelay,
  computeStrongPrimaryBudget,
  computeStrongRootBudget,
  computeSurfaceGrainScale,
  computeTransitionClusterLifetime,
  computeTrailBrightness,
  computeTrailGrainBudget,
  computeTrailScale,
  writeSolidBarGeometry,
} from "@/lib/dashboard/solid-bar-particles";

const DISPLAY_COLUMN_COUNT = 24;

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
attribute float aBrightness;
varying vec2 vUv;
varying float vX;
varying float vRel;
varying float vBrightness;
uniform float uBaselineY;

void main() {
  vUv = uv;
  vX = aColorX;
  vBrightness = aBrightness;
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
varying float vBrightness;
uniform float uPresence;
const float RGB_LIFT = 1.25;
const float ALPHA_LIFT = 1.10;

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
  float edgeFeather = 1.0 - smoothstep(0.2, 1.0, r);
  vec3 col = auroraGradient(vX);
  col = col * (0.48 + vBrightness * 0.72) * RGB_LIFT;
  float alpha = min(
    0.62,
    (0.10 + vBrightness * 0.52) * (0.75 + vRel * 0.25) *
      uPresence * ALPHA_LIFT * edgeFeather
  );
  if (alpha < 0.003) discard;
  gl_FragColor = vec4(col, alpha);
}
`;

const barVertex = `
attribute float aBarColorX;
attribute float aBarBrightness;
attribute float aErosionCenter;
attribute float aErosionDepth;
varying vec2 vBarUv;
varying float vBarX;
varying float vBarBrightness;
varying float vErosionCenter;
varying float vErosionDepth;

void main() {
  vBarUv = uv;
  vBarX = aBarColorX;
  vBarBrightness = aBarBrightness;
  vErosionCenter = aErosionCenter;
  vErosionDepth = aErosionDepth;
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}
`;

const barFragment = `
precision highp float;
varying float vBarX;
varying float vBarBrightness;
varying vec2 vBarUv;
varying float vErosionCenter;
varying float vErosionDepth;
uniform float uPresence;
const float BAR_RGB_LIFT = 1.18;

vec3 solidBarGradient(float x) {
  vec3 c1 = vec3(0.02, 0.87, 1.0);
  vec3 c2 = vec3(0.22, 0.55, 1.0);
  vec3 c3 = vec3(0.38, 0.32, 0.88);
  vec3 c4 = vec3(0.58, 0.30, 0.98);
  vec3 col = mix(c1, c2, smoothstep(0.0, 0.34, x));
  col = mix(col, c3, smoothstep(0.34, 0.67, x));
  return mix(col, c4, smoothstep(0.67, 1.0, x));
}

void main() {
  float insideTop = step(1.0 - vErosionDepth, vBarUv.y);
  float notchProgress = clamp(
    (vBarUv.y - (1.0 - vErosionDepth)) / max(vErosionDepth, 0.0001),
    0.0,
    1.0
  );
  float notchHalfWidth = 0.14 * mix(1.0, 0.58, notchProgress);
  if (insideTop > 0.5 && abs(vBarUv.x - vErosionCenter) < notchHalfWidth) discard;
  vec3 col = solidBarGradient(vBarX) *
    (0.62 + vBarBrightness * 0.48) * BAR_RGB_LIFT;
  gl_FragColor = vec4(col, uPresence);
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
 *   isPlayingRef: { current: boolean },
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

    const particlesPerAudioBand = pickParticlesPerColumn();
    const particleCount = particlesPerAudioBand * AUDIO_BAND_COUNT;
    const colWidth = 1 / DISPLAY_COLUMN_COUNT;

    // V3 keeps a fixed pool. A frequency band defines only a resting/spawn position;
    // once active, each grain owns its position and ballistic velocity.
    const pActive = new Uint8Array(particleCount);
    const pSurface = new Uint8Array(particleCount);
    const pTrail = new Uint8Array(particleCount);
    const pTrailParent = new Int32Array(particleCount);
    const pTrailRank = new Uint8Array(particleCount);
    const pTrailCount = new Uint8Array(particleCount);
    const pDropletTier = new Uint8Array(particleCount);
    const pX = new Float32Array(particleCount);
    const pY = new Float32Array(particleCount);
    const pVX = new Float32Array(particleCount);
    const pVY = new Float32Array(particleCount);
    const pGravity = new Float32Array(particleCount);
    const pAge = new Float32Array(particleCount);
    const pLifetime = new Float32Array(particleCount);
    const pLaunchBrightness = new Float32Array(particleCount);
    const pLaunchBaseY = new Float32Array(particleCount);
    const pReleaseDelay = new Float32Array(particleCount);
    const pBounceLift = new Float32Array(particleCount);
    // Fixed seeds vary spatial texture only; live audio decides every launch event.
    const pSeed = new Float32Array(particleCount);
    const pBedHeight = new Float32Array(DISPLAY_COLUMN_COUNT);
    const pBandBrightness = new Float32Array(DISPLAY_COLUMN_COUNT);
    const pErosionAge = new Float32Array(DISPLAY_COLUMN_COUNT);
    const pErosionCenter = new Float32Array(DISPLAY_COLUMN_COUNT);
    const displayBands = new Float32Array(DISPLAY_COLUMN_COUNT);
    const displayOnsets = new Float32Array(DISPLAY_COLUMN_COUNT);
    const detailBands = new Float32Array(AUDIO_BAND_COUNT);
    const compressedBands = new Float32Array(AUDIO_BAND_COUNT);
    const detailDisplayBands = new Float32Array(DISPLAY_COLUMN_COUNT);
    const compressedDisplayBands = new Float32Array(DISPLAY_COLUMN_COUNT);
    const bedTargets = new Float32Array(DISPLAY_COLUMN_COUNT);
    pBandBrightness.fill(0.18);
    pTrailParent.fill(-1);
    pErosionAge.fill(1);
    pErosionCenter.fill(0.5);

    for (let idx = 0; idx < particleCount; idx++) {
      pSeed[idx] = seededUnit(idx * 3 + 2);
    }

    // One shared unit quad, instanced per particle — instanceMatrix carries each
    // particle's position + per-axis scale (computed below so a "round" particle stays
    // visually round despite the camera's non-square 0..1 space over a wide/short box).
    const quadGeometry = new THREE.PlaneGeometry(1, 1);
    const aColorX = new THREE.InstancedBufferAttribute(new Float32Array(particleCount), 1);
    const aBrightness = new THREE.InstancedBufferAttribute(
      new Float32Array(particleCount),
      1,
    );
    for (let j = 0; j < particleCount; j++) {
      aColorX.array[j] = 0.5;
      aBrightness.array[j] = 0.18;
    }
    quadGeometry.setAttribute("aColorX", aColorX);
    quadGeometry.setAttribute("aBrightness", aBrightness);

    const particleUniforms = {
      uBaselineY: { value: 0.18 },
      // Fades the whole field out on pause/stop and back in on play — per the spec, the
      // effect should actually disappear when not playing, not just calm down. A smooth
      // fade (not an instant cut) so it doesn't feel like a glitch.
      uPresence: { value: 0 },
    };
    const barGeometry = new THREE.PlaneGeometry(1, 1);
    const aBarColorX = new THREE.InstancedBufferAttribute(
      new Float32Array(DISPLAY_COLUMN_COUNT),
      1,
    );
    const aBarBrightness = new THREE.InstancedBufferAttribute(
      new Float32Array(DISPLAY_COLUMN_COUNT),
      1,
    );
    const aErosionCenter = new THREE.InstancedBufferAttribute(
      new Float32Array(DISPLAY_COLUMN_COUNT),
      1,
    );
    const aErosionDepth = new THREE.InstancedBufferAttribute(
      new Float32Array(DISPLAY_COLUMN_COUNT),
      1,
    );
    for (let col = 0; col < DISPLAY_COLUMN_COUNT; col++) {
      aBarColorX.array[col] = (col + 0.5) * colWidth;
      aBarBrightness.array[col] = 0.18;
      aErosionCenter.array[col] = 0.5;
      aErosionDepth.array[col] = 0;
    }
    barGeometry.setAttribute("aBarColorX", aBarColorX);
    barGeometry.setAttribute("aBarBrightness", aBarBrightness);
    barGeometry.setAttribute("aErosionCenter", aErosionCenter);
    barGeometry.setAttribute("aErosionDepth", aErosionDepth);
    const barMaterial = new THREE.ShaderMaterial({
      vertexShader: barVertex,
      fragmentShader: barFragment,
      uniforms: { uPresence: particleUniforms.uPresence },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const barMesh = new THREE.InstancedMesh(
      barGeometry,
      barMaterial,
      DISPLAY_COLUMN_COUNT,
    );
    barMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    barMesh.renderOrder = 0;
    scene.add(barMesh);
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
    instancedMesh.renderOrder = 1;
    scene.add(instancedMesh);
    const tmpMatrix = new THREE.Matrix4();
    const tmpBarMatrix = new THREE.Matrix4();
    const barLayout = { x: 0, y: 0, width: 0, height: 0 };
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

    let presence = 0;
    let visibleFrameCount = 0;
    let selfCheckDone = false;
    let triggerState = createFountainTriggerState(AUDIO_BAND_COUNT);
    let spawnCursor = 0;
    let eventSerial = 0;
    const particleStep = {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      gravity: 0,
      age: 0,
      lifetime: 0,
    };

    const findInactiveParticle = () => {
      for (let offset = 0; offset < particleCount; offset++) {
        const candidate = (spawnCursor + offset) % particleCount;
        if (pActive[candidate] === 0) {
          spawnCursor = (candidate + 1) % particleCount;
          return candidate;
        }
      }
      return -1;
    };

    const chooseSourceBand = (weights, selector) => {
      let total = 0;
      for (let col = 0; col < DISPLAY_COLUMN_COUNT; col++) {
        total += Math.max(0, weights[col] ?? 0);
      }
      if (total <= 0.0001) return -1;
      let cursor = selector * total;
      for (let col = 0; col < DISPLAY_COLUMN_COUNT; col++) {
        cursor -= Math.max(0, weights[col] ?? 0);
        if (cursor <= 0) return col;
      }
      return DISPLAY_COLUMN_COUNT - 1;
    };

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
      const baselineY = particleUniforms.uBaselineY.value;

      const loudness = playing ? loudnessRef.current : 0;
      const beat = playing && !reducedMotion ? beatPulseRef.current : 0;
      const bands = bandsRef.current;
      triggerState = stepFountainTriggers(triggerState, {
        bands,
        loudness,
        beatPulse: beat,
        playing,
      });
      resampleSpectrumInto(bands, displayBands);
      resampleSpectrumInto(triggerState.onsetStrengths, displayOnsets);
      writeDetrendedSpectrum(bands, detailBands);
      writeLogCompressedSpectrum(bands, compressedBands);
      resamplePeakPreservingInto(detailBands, detailDisplayBands);
      resamplePeakPreservingInto(compressedBands, compressedDisplayBands);
      writeDetrendedBedTargets(
        detailDisplayBands,
        compressedDisplayBands,
        displayOnsets,
        loudness,
        bedTargets,
      );
      const bedAttack = 1 - Math.exp(-(reducedMotion ? 3 : 11) * dtSec);
      const bedRelease = 1 - Math.exp(-(reducedMotion ? 3 : 6.5) * dtSec);
      for (let col = 0; col < DISPLAY_COLUMN_COUNT; col++) {
        pErosionAge[col] += dtSec;
        const target = playing ? bedTargets[col] : 0;
        pBedHeight[col] +=
          (target - pBedHeight[col]) *
          (target > pBedHeight[col] ? bedAttack : bedRelease);
        const brightnessTarget = computeRestingBrightness(
          loudness,
          displayBands[col] ?? 0,
        );
        pBandBrightness[col] = smoothBrightness(
          pBandBrightness[col],
          brightnessTarget,
          dtSec,
        );
        writeSolidBarGeometry(
          col,
          DISPLAY_COLUMN_COUNT,
          pBedHeight[col],
          barLayout,
        );
        tmpBarMatrix.makeScale(barLayout.width, barLayout.height, 1);
        tmpBarMatrix.setPosition(barLayout.x, baselineY + barLayout.y, 0);
        barMesh.setMatrixAt(col, tmpBarMatrix);
        aBarBrightness.array[col] = pBandBrightness[col];
        aErosionCenter.array[col] = pErosionCenter[col];
        aErosionDepth.array[col] =
          pBedHeight[col] > 0
            ? computeErosionNotchDepth(pErosionAge[col], pBedHeight[col]) /
              pBedHeight[col]
            : 0;
      }
      barMesh.instanceMatrix.needsUpdate = true;
      aBarBrightness.needsUpdate = true;
      aErosionCenter.needsUpdate = true;
      aErosionDepth.needsUpdate = true;

      const fullPrimaryBudget = computeStrongPrimaryBudget(
        triggerState.emissionBudget,
      );
      const primaryBudget = reducedMotion
        ? Math.ceil(fullPrimaryBudget * 0.35)
        : fullPrimaryBudget;
      const accentBudget = reducedMotion
        ? 0
        : computeHighAccentBudget(triggerState.primaryBurst);
      const requested = primaryBudget + accentBudget;
      if (requested > 0) {
        eventSerial++;
        const primary = triggerState.primaryBurst > 0;
        const weights = primary ? displayBands : displayOnsets;
        const eventSelector = seededUnit(eventSerial * 97 + 5);
        const eventColumn = Math.max(0, chooseSourceBand(weights, eventSelector));
        const centerSeed = seededUnit(eventSerial * 53 + eventColumn * 17);
        const erosionCenter = 0.3 + centerSeed * 0.4;
        const eventOriginX =
          (eventColumn + erosionCenter) / DISPLAY_COLUMN_COUNT;
        pErosionAge[eventColumn] = 0;
        pErosionCenter[eventColumn] = erosionCenter;
        const fullRootBudget = computeStrongRootBudget(fullPrimaryBudget);
        const bandStrength = Math.max(
          primary ? triggerState.primaryBurst : 0,
          displayOnsets[eventColumn] ?? 0,
          displayBands[eventColumn] ?? 0,
        );
        for (let launch = 0; launch < requested; launch++) {
          const particleIndex = findInactiveParticle();
          if (particleIndex < 0) break;
          const col = eventColumn;

          const trajectorySeed = seededUnit(
            particleIndex * 11 + eventSerial * 31 + launch,
          );
          const driftSeed = seededUnit(
            particleIndex * 13 + eventSerial * 19 + launch * 3,
          );
          const spawnX =
            eventOriginX + (trajectorySeed - 0.5) * colWidth * 0.08;
          const dropletTier = launch < primaryBudget ? 1 : 2;

          pActive[particleIndex] = 1;
          pSurface[particleIndex] = 0;
          pTrail[particleIndex] = 0;
          pTrailParent[particleIndex] = -1;
          pDropletTier[particleIndex] = dropletTier;
          pX[particleIndex] = spawnX;
          const releaseDelay = computeParticleReleaseDelay(
            launch,
            requested,
          );
          const releaseImpulse = computeDropletTierImpulse(
            dropletTier,
            bandStrength,
          );
          const bounceLift = computeAttachedBounceLift(
            releaseDelay,
            releaseDelay * 2,
            bandStrength,
          );
          pY[particleIndex] = bounceLift;
          pLaunchBaseY[particleIndex] = pBedHeight[col];
          pVX[particleIndex] = computeDropletSpread(
            dropletTier,
            bandStrength,
            driftSeed,
          ) * 1.35;
          pVY[particleIndex] = reducedMotion
            ? releaseImpulse * 0.58
            : releaseImpulse + loudness * 0.12 + trajectorySeed * 0.08;
          pGravity[particleIndex] = 1.9 + driftSeed * 0.75;
          pAge[particleIndex] = -releaseDelay;
          pReleaseDelay[particleIndex] = releaseDelay;
          pBounceLift[particleIndex] = bounceLift;
          pLifetime[particleIndex] = 1.45 + trajectorySeed * 0.55;
          pLaunchBrightness[particleIndex] = Math.min(
            1,
            computeLaunchBrightness(
              pBandBrightness[col],
              primary
                  ? triggerState.primaryBurst
                  : displayOnsets[col] ?? 0,
            ) * (dropletTier === 2 ? 1.15 : 1),
          );
          aColorX.array[particleIndex] = spawnX;

          const trailBudget = computeTrailGrainBudget(bandStrength);
          for (let trail = 0; trail < trailBudget; trail++) {
            const trailIndex = findInactiveParticle();
            if (trailIndex < 0) break;
            pActive[trailIndex] = 1;
            pSurface[trailIndex] = 0;
            pTrail[trailIndex] = 1;
            pTrailParent[trailIndex] = particleIndex;
            pTrailRank[trailIndex] = trail;
            pTrailCount[trailIndex] = trailBudget;
            aColorX.array[trailIndex] = spawnX;
          }
        }

        const surfaceBudget = reducedMotion
          ? Math.ceil(fullRootBudget * 0.35)
          : fullRootBudget;
        for (let surface = 0; surface < surfaceBudget; surface++) {
          const particleIndex = findInactiveParticle();
          if (particleIndex < 0) break;
          const col = eventColumn;
          const surfaceSeed = seededUnit(
            particleIndex * 7 + eventSerial * 29 + surface,
          );
          const spawnX =
            eventOriginX + (surfaceSeed - 0.5) * colWidth * 0.08;
          const dropletTier = 0;

          pActive[particleIndex] = 1;
          pSurface[particleIndex] = 1;
          pTrail[particleIndex] = 0;
          pTrailParent[particleIndex] = -1;
          pDropletTier[particleIndex] = dropletTier;
          pX[particleIndex] = spawnX;
          pY[particleIndex] = 0;
          pLaunchBaseY[particleIndex] = pBedHeight[col];
          const releaseDelay = computeParticleReleaseDelay(
            surface,
            surfaceBudget,
          );
          pAge[particleIndex] = -releaseDelay;
          pReleaseDelay[particleIndex] = releaseDelay;
          pLifetime[particleIndex] =
            computeTransitionClusterLifetime(surfaceSeed) *
            (dropletTier === 0 ? 0.9 : 1.35);
          pLaunchBrightness[particleIndex] = computeLaunchBrightness(
            pBandBrightness[col],
            primary ? triggerState.primaryBurst : displayOnsets[col] ?? 0,
          );
          pBounceLift[particleIndex] = computeAttachedBounceLift(
            releaseDelay,
            releaseDelay * 2,
            pLaunchBrightness[particleIndex],
          );
          pSeed[particleIndex] = surfaceSeed;
          pVX[particleIndex] = computeDropletSpread(
            dropletTier,
            bandStrength,
            surfaceSeed,
          ) * 1.35;
          aColorX.array[particleIndex] = spawnX;
        }
        aColorX.needsUpdate = true;
      }

      for (let j = 0; j < particleCount; j++) {
        let x = 0;
        let y = baselineY;
        let rel = 0;
        let sizePx = 0;
        if (pActive[j]) {
          if (pTrail[j]) {
            const parent = pTrailParent[j];
            if (
              parent < 0 ||
              !pActive[parent] ||
              pSurface[parent] ||
              pTrail[parent]
            ) {
              pActive[j] = 0;
              pTrail[j] = 0;
              pTrailParent[j] = -1;
            } else if (pAge[parent] >= 0) {
              const rank = pTrailRank[j];
              const count = pTrailCount[j];
              const lag = computeDropletTrailLag(rank, count);
              const trailY = Math.max(
                0,
                pY[parent] -
                  pVY[parent] * lag -
                  0.5 * pGravity[parent] * lag * lag,
              );
              x = pX[parent] - pVX[parent] * lag;
              y = baselineY + pLaunchBaseY[parent] + trailY;
              rel = Math.min(1, trailY / 0.52);
              sizePx =
                (1.65 + pSeed[parent] * 1.35) *
                computeTrailScale(rank, count);
              aBrightness.array[j] = computeTrailBrightness(
                pLaunchBrightness[parent],
                rank,
                count,
              );
            }
          } else if (pSurface[j]) {
            pAge[j] += dtSec;
            if (pAge[j] >= pLifetime[j]) {
              pActive[j] = 0;
              pSurface[j] = 0;
            } else {
              if (pAge[j] <= 0) {
                const attachedAge = pReleaseDelay[j] + pAge[j];
                x = pX[j];
                y =
                  baselineY +
                  pLaunchBaseY[j] +
                  computeAttachedBounceLift(
                    attachedAge,
                    pReleaseDelay[j] * 2,
                    pLaunchBrightness[j],
                  );
                rel = Math.min(1, pLaunchBaseY[j] / 0.38);
                sizePx = 1.9 + (1 - pSeed[j]) * 0.8;
                aBrightness.array[j] = pLaunchBrightness[j];
              } else {
                const surfaceScale = computeSurfaceGrainScale(
                  pAge[j],
                  pLifetime[j],
                );
                x = pX[j] + pVX[j] * pAge[j];
                y =
                  baselineY +
                  pLaunchBaseY[j] +
                  pBounceLift[j] *
                    (1 - Math.min(1, pAge[j] / pLifetime[j])) +
                  computeLowDebrisArc(
                    pAge[j],
                    pLifetime[j],
                    pSeed[j],
                  ) * (pDropletTier[j] === 0 ? 1 : 1.9);
                rel = Math.min(1, pLaunchBaseY[j] / 0.38);
                sizePx = (1.35 + (1 - pSeed[j]) * 1.25) * surfaceScale;
                aBrightness.array[j] = computeAirborneBrightness(
                  pLaunchBrightness[j],
                  pAge[j],
                  pLifetime[j],
                );
              }
            }
          } else {
            if (pAge[j] < 0) {
              pAge[j] = Math.min(0, pAge[j] + dtSec);
              const attachedAge = pReleaseDelay[j] + pAge[j];
              x = pX[j];
              y =
                baselineY +
                pLaunchBaseY[j] +
                computeAttachedBounceLift(
                  attachedAge,
                  pReleaseDelay[j] * 2,
                  pLaunchBrightness[j],
                );
              rel = Math.min(1, pLaunchBaseY[j] / 0.38);
              sizePx = 2.15 + pSeed[j] * 0.55;
              aBrightness.array[j] = pLaunchBrightness[j];
            } else {
              particleStep.active = true;
              particleStep.x = pX[j];
              particleStep.y = pY[j];
              particleStep.vx = pVX[j];
              particleStep.vy = pVY[j];
              particleStep.gravity = pGravity[j];
              particleStep.age = pAge[j];
              particleStep.lifetime = pLifetime[j];
              integrateFountainParticle(particleStep, dtSec);
              pActive[j] = particleStep.active ? 1 : 0;
              pX[j] = particleStep.x;
              pY[j] = particleStep.y;
              pVX[j] = particleStep.vx;
              pVY[j] = particleStep.vy;
              pAge[j] = particleStep.age;
              x = particleStep.x;
              y = baselineY + pLaunchBaseY[j] + particleStep.y;
              rel = Math.min(1, particleStep.y / 0.52);
              sizePx = (1.65 + pSeed[j] * 1.35) * (0.78 + rel * 0.42);
              aBrightness.array[j] = computeAirborneBrightness(
                pLaunchBrightness[j],
                particleStep.age,
                particleStep.lifetime,
              );
            }
          }
        }

        tmpMatrix.makeScale(sizePx / containerPx.w, sizePx / containerPx.h, 1);
        tmpMatrix.setPosition(x, y, 0);
        instancedMesh.setMatrixAt(j, tmpMatrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;
      aBrightness.needsUpdate = true;
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
        if (isVisible) tryStart();
        else tryStop();
      },
      { threshold: 0 },
    );
    io.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) tryStart();
      else tryStop();
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
      barGeometry.dispose();
      barMaterial.dispose();
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
