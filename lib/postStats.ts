// Normalize text by stripping HTML and collapsing whitespace
export function normalizeText(input: string): string {
  if (!input) return "";
  const withoutTags = input.replace(/<[^>]*>/g, " ");
  return withoutTags.replace(/\s+/g, " ").trim();
}

// Tokenize words, counting unicode apostrophes/hyphens commonly found in prose
export function getWordCount(text: string): number {
  const normalized = normalizeText(text);
  if (!normalized) return 0;
  const tokens = normalized.match(/\b[\p{L}\p{N}’'-]+\b/gu); // unicode letters/numbers
  return tokens ? tokens.length : 0;
}

/**
 * Compute reading time in minutes with a minimum of 1 minute.
 * wpm = words per minute.
 */
export function getReadingTimeMinutes(text: string, wpm = 200): number {
  const words = getWordCount(text);
  const rate = Math.max(1, Math.floor(wpm)); // avoid 0 or negative
  return Math.max(1, Math.ceil(words / rate));
}

/**
 * Return post stats:
 * - words: total word count
 * - minutes: reading time rounded up, min 1 minute
 */
export function getPostStats(text: string, wpm = 200) {
  const words = getWordCount(text);
  const rate = Math.max(1, Math.floor(wpm));
  const minutes = Math.max(1, Math.ceil(words / rate));
  return { words, minutes };
}
