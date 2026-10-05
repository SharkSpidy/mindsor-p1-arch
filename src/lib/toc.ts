export interface TocItem {
  id: string;
  text: string;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Collect "## " headings from markdown, ignoring anything inside code fences. */
export function extractToc(md: string): TocItem[] {
  const items: TocItem[] = [];
  let inFence = false;
  for (const line of md.split('\n')) {
    if (line.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^## (.+)$/.exec(line);
    if (m) {
      const text = m[1].replace(/`/g, '').trim();
      items.push({ id: slugify(text), text });
    }
  }
  return items;
}
