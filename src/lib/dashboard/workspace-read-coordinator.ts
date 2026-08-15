export interface CoordinatedWorkspaceRead<T> {
  generation: number;
  promise: Promise<T>;
}

export function createWorkspaceReadCoordinator<T>() {
  let generation = 0;
  const inFlight = new Map<object, CoordinatedWorkspaceRead<T>>();

  return {
    read(key: object, loader: () => Promise<T>): CoordinatedWorkspaceRead<T> {
      const active = inFlight.get(key);
      if (active) return active;

      generation += 1;
      const currentGeneration = generation;
      const promise = loader().finally(() => {
        if (inFlight.get(key)?.promise === promise) inFlight.delete(key);
      });
      const read = { generation: currentGeneration, promise };
      inFlight.set(key, read);
      return read;
    },
    invalidate(): void {
      generation += 1;
      inFlight.clear();
    },
    isCurrent(candidate: number): boolean {
      return candidate === generation;
    },
  };
}
