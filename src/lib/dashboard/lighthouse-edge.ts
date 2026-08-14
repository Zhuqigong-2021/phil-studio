export type LighthousePoint = { x: number; y: number };

export type LighthouseRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type LighthouseEdgeGeometry = LighthouseRect & {
  radius: number;
  perimeter: number;
  pathData: string;
};

export type LighthouseEdgeFrame = {
  opacity: number;
  x: number;
  y: number;
  footprint: number;
  dashOffset: number;
};

export function createLighthouseEdgeFrameSignature(frame: LighthouseEdgeFrame) {
  return {
    opacity: frame.opacity.toFixed(3),
    x: frame.x.toFixed(3),
    y: frame.y.toFixed(3),
    footprint: frame.footprint.toFixed(3),
    dashOffset: frame.dashOffset.toFixed(3),
  };
}

function rayHit(
  rect: LighthouseRect,
  source: LighthousePoint,
  angle: number,
): LighthousePoint | null {
  const radians = (angle * Math.PI) / 180;
  const dx = Math.cos(radians);
  const dy = Math.sin(radians);
  const right = rect.left + rect.width;
  const bottom = rect.top + rect.height;
  let near = -Infinity;
  let far = Infinity;

  for (const [origin, direction, min, max] of [
    [source.x, dx, rect.left, right],
    [source.y, dy, rect.top, bottom],
  ] as const) {
    if (Math.abs(direction) < 0.0001) {
      if (origin < min || origin > max) return null;
      continue;
    }
    const a = (min - origin) / direction;
    const b = (max - origin) / direction;
    near = Math.max(near, Math.min(a, b));
    far = Math.min(far, Math.max(a, b));
  }

  if (far < Math.max(near, 0)) return null;
  const distance = Math.max(near, 0);
  return {
    x: source.x + dx * distance,
    y: source.y + dy * distance,
  };
}

function perimeterPosition(
  geometry: LighthouseEdgeGeometry,
  point: LighthousePoint,
) {
  const x = point.x - geometry.left;
  const y = point.y - geometry.top;
  if (Math.abs(y) < 2) return x;
  if (Math.abs(x - geometry.width) < 2) return geometry.width + y;
  if (Math.abs(y - geometry.height) < 2) {
    return geometry.width + geometry.height + (geometry.width - x);
  }
  return 2 * geometry.width + geometry.height + (geometry.height - y);
}

export function createLighthouseEdgeGeometry(
  rect: LighthouseRect,
): LighthouseEdgeGeometry {
  const radius = Math.min(16, rect.width / 2, rect.height / 2);
  return {
    ...rect,
    radius,
    perimeter: 2 * (rect.width + rect.height),
    pathData: `M ${radius} 1 H ${rect.width - radius} Q ${rect.width - 1} 1 ${rect.width - 1} ${radius} V ${rect.height - radius} Q ${rect.width - 1} ${rect.height - 1} ${rect.width - radius} ${rect.height - 1} H ${radius} Q 1 ${rect.height - 1} 1 ${rect.height - radius} V ${radius} Q 1 1 ${radius} 1 Z`,
  };
}

export function calculateLighthouseEdgeHit(
  geometry: LighthouseEdgeGeometry,
  source: LighthousePoint,
  beamAngle: number,
  beamHalfAngle: number,
) {
  const hit = rayHit(geometry, source, beamAngle);
  if (!hit) return null;

  const leftBoundaryHit = rayHit(
    geometry,
    source,
    beamAngle - beamHalfAngle,
  );
  const rightBoundaryHit = rayHit(
    geometry,
    source,
    beamAngle + beamHalfAngle,
  );
  const localPoint = {
    x: hit.x - geometry.left,
    y: hit.y - geometry.top,
  };
  const distanceFromSource = Math.hypot(
    hit.x - source.x,
    hit.y - source.y,
  );
  const estimatedFootprint =
    distanceFromSource * Math.tan((beamHalfAngle * 2 * Math.PI) / 180);
  const boundarySpan =
    leftBoundaryHit && rightBoundaryHit
      ? Math.abs(
          perimeterPosition(geometry, rightBoundaryHit) -
            perimeterPosition(geometry, leftBoundaryHit),
        )
      : estimatedFootprint;
  const wrappedBoundarySpan = Math.min(
    boundarySpan,
    geometry.perimeter - boundarySpan,
  );
  const beamFootprint = Math.max(
    76,
    Math.min(geometry.perimeter * 0.42, wrappedBoundarySpan),
  );

  let fraction = 0;
  if (Math.abs(localPoint.y) < 2) {
    fraction = localPoint.x / geometry.perimeter;
  } else if (Math.abs(localPoint.x - geometry.width) < 2) {
    fraction = (geometry.width + localPoint.y) / geometry.perimeter;
  } else if (Math.abs(localPoint.y - geometry.height) < 2) {
    fraction =
      (geometry.width +
        geometry.height +
        (geometry.width - localPoint.x)) /
      geometry.perimeter;
  } else {
    fraction =
      (2 * geometry.width +
        geometry.height +
        (geometry.height - localPoint.y)) /
      geometry.perimeter;
  }

  return {
    hit,
    localPoint,
    distanceFromSource,
    beamFootprint,
    fraction,
  };
}
