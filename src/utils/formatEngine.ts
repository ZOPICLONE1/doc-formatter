import type { ContentSegment, HeadingLevel, Citation, TemplateConfig } from '../types';

let segId = 0;
function nextId(): string {
  return `seg-${++segId}`;
}

/** Parse plain text into segments: split by double-newline as paragraphs */
export function parseTextToSegments(text: string): ContentSegment[] {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length === 0) return [];

  const segments: ContentSegment[] = [];

  paragraphs.forEach((para, idx) => {
    if (idx === 0) {
      // First paragraph → title
      segments.push({ id: nextId(), text: para, level: 'title' });
    } else if (/^(第[一二三四五六七八九十\d]+章|第[一二三四五六七八九十\d]+节|[一二三四五六七八九十\d]+[、．.]|[（(][一二三四五六七八九十\d]+[)）])/.test(para)) {
      // Looks like a heading based on Chinese numbering
      if (/^第[一二三四五六七八九十\d]+章/.test(para)) {
        segments.push({ id: nextId(), text: para, level: 'heading1' });
      } else {
        segments.push({ id: nextId(), text: para, level: 'heading2' });
      }
    } else if (/^[（(][一二三四五六七八九十\d]+[)）]/.test(para)) {
      segments.push({ id: nextId(), text: para, level: 'heading3' });
    } else if (/^[一二三四五六七八九十\d]+[、．.]/.test(para) && para.length < 60) {
      segments.push({ id: nextId(), text: para, level: 'heading3' });
    } else if (/^[a-zA-Z]\.\s/.test(para) && para.length < 80) {
      segments.push({ id: nextId(), text: para, level: 'heading3' });
    } else {
      segments.push({ id: nextId(), text: para, level: 'body' });
    }
  });

  return segments;
}

/** Parse HTML (from mammoth) into segments */
export function parseHtmlToSegments(html: string): ContentSegment[] {
  const div = document.createElement('div');
  div.innerHTML = html;

  const elements = div.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
  const segments: ContentSegment[] = [];

  elements.forEach((el, idx) => {
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return;

    let level: HeadingLevel = 'body';
    const tag = el.tagName.toLowerCase();

    if (idx === 0 && tag === 'p') {
      level = 'title';
    } else if (tag === 'h1') {
      level = 'heading1';
    } else if (tag === 'h2') {
      level = 'heading2';
    } else if (tag === 'h3') {
      level = 'heading3';
    } else if (tag === 'h4' || tag === 'h5') {
      level = 'heading4';
    } else if (tag === 'p') {
      // Try auto-detect Chinese headings
      if (/^(第[一二三四五六七八九十\d]+章|第[一二三四五六七八九十\d]+节)/.test(text)) {
        level = 'heading1';
      } else if (/^[一二三四五六七八九十\d]+[、．.]/.test(text) && text.length < 60) {
        level = 'heading2';
      } else if (/^[（(][一二三四五六七八九十\d]+[)）]/.test(text)) {
        level = 'heading3';
      } else {
        level = 'body';
      }
    }

    segments.push({ id: nextId(), text, level });
  });

  // If nothing parsed, fall back to text-based parsing
  if (segments.length === 0) {
    return parseTextToSegments(div.textContent || '');
  }

  // If the first segment isn't a title but we have content, promote first body to title
  if (segments.length > 0 && segments[0].level === 'body') {
    segments[0].level = 'title';
  }

  return segments;
}

/** Detect [number] citation markers in text and return them */
export function detectCitations(text: string): Citation[] {
  const seen = new Set<number>();
  const citations: Citation[] = [];
  const regex = /\[(\d+)\]/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const num = parseInt(match[1], 10);
    if (!seen.has(num)) {
      seen.add(num);
      citations.push({ id: num, text: '' });
    }
  }

  return citations.sort((a, b) => a.id - b.id);
}

/** Apply citation markers to segment text for preview */
export function highlightCitations(text: string): string {
  return text.replace(/\[(\d+)\]/g, '<mark class="citation-mark">[$1]</mark>');
}

/** Insert a citation marker at cursor position in a segment */
export function insertCitation(segment: ContentSegment, citationId: number): ContentSegment {
  return {
    ...segment,
    text: segment.text + `[${citationId}]`,
  };
}

/** Build the full reference list text */
export function buildReferenceList(citations: Citation[]): string {
  if (citations.length === 0) return '';
  const lines = citations
    .filter((c) => c.text.trim().length > 0)
    .map((c) => `[${c.id}] ${c.text}`);
  return lines.length > 0 ? `\n\n参考文献\n\n${lines.join('\n')}` : '';
}

/** Generate React CSSProperties for a template level */
export function templateLevelToStyle(level: string, config: TemplateConfig): React.CSSProperties {
  const key = level as keyof TemplateConfig;
  const c = config[key];
  if (!c) return {};
  const lineHeight = c.lineSpacingType === 'fixed'
    ? `${c.lineSpacing}pt`
    : c.lineSpacing;
  return {
    fontFamily: `"${c.fontFamily}", serif`,
    fontSize: `${c.fontSize}pt`,
    fontWeight: c.bold ? 700 : 400,
    textAlign: c.alignment,
    lineHeight,
    marginTop: `${c.spaceBefore}pt`,
    marginBottom: `${c.spaceAfter}pt`,
  };
}
