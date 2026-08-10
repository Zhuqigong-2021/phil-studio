export function getLyricsProgressMotion(showLyrics: boolean) {
  return {
    position: "relative",
    transform: showLyrics ? "translateY(10px)" : "translateY(-5px)",
    transition: "transform 400ms ease-in-out",
  } as const;
}

export function getLyricsStageMotion() {
  return {
    transform: "translateY(8px)",
    justifyContent: "flex-start",
  } as const;
}
