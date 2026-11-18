/**
 * Render a short frontmatter string as HTML: escape it, then turn `backticks` into <code>.
 * Used for decision and next-step lines, which are plain text apart from code spans.
 */
export function inlineCode(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  return escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
}
