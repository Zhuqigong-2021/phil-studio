import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("./EnergySandVolume.jsx", import.meta.url),
  "utf8",
);
const playerSource = readFileSync(
  new URL("../../app/dashboard/page.tsx", import.meta.url),
  "utf8",
);

test("particle overlap uses bounded alpha compositing instead of additive white saturation", () => {
  assert.doesNotMatch(source, /THREE\.AdditiveBlending/);
  assert.match(source, /blending:\s*THREE\.NormalBlending/);
  assert.doesNotMatch(source, /gl_FragColor\s*=\s*vec4\(col\s*\*/);
});

test("player passes a stable fallback callback so progress renders do not recreate WebGL", () => {
  assert.match(
    playerSource,
    /const handleEnergyVisualFallback = React\.useCallback\(/,
  );
  assert.match(playerSource, /onFallback=\{handleEnergyVisualFallback\}/);
  assert.doesNotMatch(
    playerSource,
    /onFallback=\{\(\) => setEnergyVisualFailed\(true\)\}/,
  );
});

test("V3 uses pooled fountain physics instead of rigid column-packed heights", () => {
  assert.match(source, /from "@\/lib\/dashboard\/fountain-physics"/);
  assert.match(source, /stepFountainTriggers/);
  assert.match(source, /integrateFountainParticle/);
  assert.doesNotMatch(source, /colHeight\[col\]\s*\*\s*Math\.pow/);
  assert.doesNotMatch(source, /Math\.random\(/);
});

test("V4 carries music-driven brightness through fixed particle state", () => {
  assert.match(source, /from "@\/lib\/dashboard\/particle-brightness"/);
  assert.match(source, /const pLaunchBrightness = new Float32Array/);
  assert.match(source, /attribute float aBrightness/);
  assert.match(source, /computeRestingBrightness/);
  assert.match(source, /computeLaunchBrightness/);
  assert.match(source, /computeAirborneBrightness/);
  assert.match(source, /smoothBrightness/);
  assert.match(source, /blending:\s*THREE\.NormalBlending/);
  assert.doesNotMatch(source, /THREE\.AdditiveBlending/);
});

test("V4-B globally lifts presentation while preserving bounded music contrast", () => {
  assert.match(source, /const float RGB_LIFT = 1\.25/);
  assert.match(source, /const float ALPHA_LIFT = 1\.10/);
  assert.match(source, /vBrightness \* 0\.72/);
  assert.match(source, /min\(\s*0\.62,/);
  assert.match(source, /blending:\s*THREE\.NormalBlending/);
  assert.doesNotMatch(source, /THREE\.AdditiveBlending/);
});

test("V4 feathers every grain from a clear core to a transparent edge", () => {
  assert.match(
    source,
    /float edgeFeather = 1\.0 - smoothstep\(0\.2, 1\.0, r\)/,
  );
  assert.match(source, /uPresence \* ALPHA_LIFT \* edgeFeather/);
  assert.doesNotMatch(source, /falloff < 0\.02/);
  assert.match(source, /if \(alpha < 0\.003\) discard/);
});

test("V5 maps eighteen analyser bands into twenty-four captured bar surfaces", () => {
  assert.match(source, /const DISPLAY_COLUMN_COUNT = 24/);
  assert.match(source, /const displayBands = new Float32Array\(DISPLAY_COLUMN_COUNT\)/);
  assert.match(source, /const displayOnsets = new Float32Array\(DISPLAY_COLUMN_COUNT\)/);
  assert.match(source, /resampleSpectrumInto\(bands, displayBands\)/);
  assert.match(source, /resampleSpectrumInto\(triggerState\.onsetStrengths, displayOnsets\)/);
  assert.match(source, /const eventOriginX =/);
  assert.match(source, /const col = eventColumn/);
  assert.match(source, /const pLaunchBaseY = new Float32Array\(particleCount\)/);
  assert.match(source, /pLaunchBaseY\[particleIndex\] = pBedHeight\[col\]/);
  assert.match(source, /y = baselineY \+ pLaunchBaseY\[j\] \+ particleStep\.y/);
});

test("V5 detrends and peak-preserves the twenty-four bar skyline", () => {
  assert.match(source, /writeDetrendedSpectrum\(bands, detailBands\)/);
  assert.match(source, /writeLogCompressedSpectrum\(bands, compressedBands\)/);
  assert.match(source, /resamplePeakPreservingInto\(detailBands, detailDisplayBands\)/);
  assert.match(source, /writeDetrendedBedTargets\(/);
  assert.doesNotMatch(source, /createAdaptiveSpectrumState|writeAdaptiveSpectrum/);
  assert.doesNotMatch(source, /computeFountainBedTargets\(heightBands/);
});

test("V5 uses a dedicated unfeathered mesh for continuous solid bars", () => {
  assert.match(source, /from "@\/lib\/dashboard\/solid-bar-particles"/);
  assert.match(source, /const barVertex = `/);
  assert.match(source, /const barFragment = `/);
  assert.match(source, /const barMesh = new THREE\.InstancedMesh\(/);
  assert.match(source, /DISPLAY_COLUMN_COUNT,/);
  assert.match(source, /const aBarColorX = new THREE\.InstancedBufferAttribute/);
  assert.match(source, /const aBarBrightness = new THREE\.InstancedBufferAttribute/);
  assert.match(source, /writeSolidBarGeometry\(/);
  assert.match(source, /barMesh\.renderOrder = 0/);
  assert.match(source, /instancedMesh\.renderOrder = 1/);
  const barShader = source.match(/const barFragment = `([\s\S]*?)`;/)?.[1] ?? "";
  assert.doesNotMatch(barShader, /edgeFeather/);
  assert.match(barShader, /gl_FragColor = vec4\(col, uPresence\)/);
});

test("V5 particle pool is invisible at rest and bridges events through local erosion", () => {
  assert.match(source, /const pSurface = new Uint8Array\(particleCount\)/);
  assert.match(
    source,
    /computeStrongPrimaryBudget\(\s*triggerState\.emissionBudget,?\s*\)/,
  );
  assert.match(source, /computeStrongRootBudget\(fullPrimaryBudget\)/);
  assert.match(source, /computeHighAccentBudget\(triggerState\.primaryBurst\)/);
  assert.match(source, /const requested = primaryBudget \+ accentBudget/);
  assert.match(source, /const surfaceBudget = reducedMotion/);
  assert.match(source, /const pDropletTier = new Uint8Array\(particleCount\)/);
  assert.match(source, /computeDropletTierImpulse\(/);
  assert.match(source, /computeDropletSpread\([\s\S]*?\) \* 1\.35/);
  assert.match(source, /dropletTier === 2 \? 1\.15 : 1/);
  assert.doesNotMatch(source, /computeNaturalClusterBudget\(requested\)/);
  assert.match(source, /computeTransitionClusterLifetime\(/);
  assert.match(source, /computeSurfaceGrainScale\(/);
  assert.match(source, /computeAttachedBounceLift\(/);
  assert.match(source, /computeParticleReleaseDelay\(/);
  assert.match(source, /computeLowDebrisArc\(/);
  assert.match(source, /const pTrailParent = new Int32Array\(particleCount\)/);
  assert.match(source, /computeTrailGrainBudget\(bandStrength\)/);
  assert.match(source, /computeTrailScale\(rank, count\)/);
  assert.match(source, /computeTrailBrightness\(/);
  assert.match(source, /computeDropletTrailLag\(rank, count\)/);
  assert.match(source, /pVX\[j\] = particleStep\.vx/);
  assert.match(source, /const aErosionCenter = new THREE\.InstancedBufferAttribute/);
  assert.match(source, /const aErosionDepth = new THREE\.InstancedBufferAttribute/);
  assert.match(source, /let sizePx = 0/);
  assert.doesNotMatch(source, /computeSolidRankHeight/);
  assert.doesNotMatch(source, /computeHeadParticleScale/);
  assert.doesNotMatch(source, /pHeadLoosening/);
});

test("V5 bars stay opaque and uniformly receive a bounded brightness lift", () => {
  const barShader = source.match(/const barFragment = `([\s\S]*?)`;/)?.[1] ?? "";
  assert.match(barShader, /const float BAR_RGB_LIFT = 1\.18/);
  assert.doesNotMatch(barShader, /verticalLight|musicTopLift/);
  assert.match(barShader, /gl_FragColor = vec4\(col, uPresence\)/);
});
