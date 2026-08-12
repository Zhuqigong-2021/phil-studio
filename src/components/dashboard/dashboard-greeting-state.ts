export function getTypedText(text: string, elapsedMs: number, characterMs: number) {
  const count = Math.max(
    0,
    Math.min(text.length, Math.floor(elapsedMs / characterMs)),
  );
  return { text: text.slice(0, count), complete: count >= text.length };
}
