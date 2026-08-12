export function getCategoryProgressMotion(index: number, reducedMotion: boolean) {
  if (reducedMotion) return { duration: 0, delay: 0, ease: "none" as const };
  return {
    duration: 0.85,
    delay: index * 0.045,
    ease: "power3.out" as const,
  };
}

export function getCategoryProgressGradient(color: string) {
  return `linear-gradient(90deg, ${color} 0%, ${color} 68%, color-mix(in srgb, ${color} 88%, white) 82%, color-mix(in srgb, ${color} 68%, white) 100%)`;
}
