/** Plain text for clipboard (no markdown). */
export function stripMarkdownBold(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1");
}

export function formatInsightForClipboard(
  header: string,
  summary: string,
  footer: string
): string {
  const plainSummary = stripMarkdownBold(summary).trim();
  return `${header}\n\n${plainSummary}\n\n${footer}`;
}
