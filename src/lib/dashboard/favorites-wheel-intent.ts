export interface WheelIntentState {
  direction: -1 | 0 | 1;
  distance: number;
}

export interface WheelIntentResult extends WheelIntentState {
  step: -1 | 0 | 1;
}

export function accumulateWheelIntent(
  state: WheelIntentState,
  deltaY: number,
  threshold: number,
): WheelIntentResult {
  if (!Number.isFinite(deltaY) || deltaY === 0) return { ...state, step: 0 };

  const direction = deltaY > 0 ? 1 : -1;
  if (state.direction !== 0 && direction !== state.direction) {
    return { ...state, step: 0 };
  }

  const distance = state.distance + Math.abs(deltaY);
  if (distance < threshold) return { direction, distance, step: 0 };
  return { direction, distance: 0, step: direction };
}
