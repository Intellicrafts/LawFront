/**
 * Template rendering utility.
 *
 * Supports:
 *   - {{variable}}                — direct substitution
 *   - {{#if variable}}...{{/if}}  — conditional block, included if value is truthy
 *
 * Returns a structured tree of blocks (headings + paragraphs) that the consumer
 * can render into HTML (for preview) or PDF (for download).
 */

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = d.toLocaleString('en-IN', { month: 'long' });
  const yyyy = d.getFullYear();
  return `${dd} ${mm} ${yyyy}`;
};

const formatNumberWithCommas = (value) => {
  const n = Number(String(value).replace(/,/g, ''));
  if (!Number.isFinite(n)) return String(value);
  return n.toLocaleString('en-IN');
};

const formatValue = (variable, raw) => {
  if (raw === undefined || raw === null || raw === '') {
    return variable ? `[${variable.label || variable.key}]` : '';
  }
  if (variable && variable.type === 'date') return formatDate(raw);
  if (variable && (variable.validation === 'currency' || variable.type === 'number')) {
    return formatNumberWithCommas(raw);
  }
  return String(raw);
};

/** Replace {{variables}} and resolve {{#if}}...{{/if}} blocks. */
const resolveBody = (body, variables, values) => {
  const varMap = Object.fromEntries((variables || []).map((v) => [v.key, v]));

  // First pass — handle conditional blocks. We use a non-greedy match.
  let resolved = body.replace(
    /\{\{#if\s+([a-zA-Z0-9_]+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_, key, inner) => {
      const raw = values[key];
      const truthy = raw !== undefined && raw !== null && String(raw).trim() !== '' && raw !== false && Number(raw) !== 0;
      // For currency 0, treat as falsy. For text/dates, any non-empty string is truthy.
      return truthy ? inner : '';
    }
  );

  // Second pass — direct substitution.
  resolved = resolved.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => {
    const variable = varMap[key];
    return formatValue(variable, values[key]);
  });

  return resolved;
};

/**
 * Parse the body into a structured array of blocks.
 * Block types:
 *   { type: 'heading', text: '...' }
 *   { type: 'paragraph', text: '...' }
 *   { type: 'spacer' }
 */
const parseBlocks = (text) => {
  const lines = text.split('\n');
  const blocks = [];
  let buffer = [];

  const flushParagraph = () => {
    if (buffer.length) {
      const joined = buffer.join(' ').trim();
      if (joined) blocks.push({ type: 'paragraph', text: joined });
      buffer = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === '') {
      flushParagraph();
      continue;
    }
    if (line.startsWith('## ')) {
      flushParagraph();
      blocks.push({ type: 'heading', text: line.replace(/^##\s+/, '').trim() });
      continue;
    }
    buffer.push(line);
  }
  flushParagraph();
  return blocks;
};

/**
 * Public API.
 *
 * @param {object} template — full template object
 * @param {object} values   — { [variableKey]: value }
 * @returns {{ blocks: Array, plainText: string, html: string }}
 */
export const renderTemplate = (template, values = {}) => {
  if (!template) return { blocks: [], plainText: '', html: '' };
  const resolved = resolveBody(template.body || '', template.variables || [], values);
  const blocks = parseBlocks(resolved);

  const plainText = blocks
    .map((b) => (b.type === 'heading' ? `\n${b.text.toUpperCase()}\n` : b.text))
    .join('\n\n');

  const html = blocks
    .map((b) => {
      const safe = b.text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      if (b.type === 'heading') {
        return `<h3 class="doc-heading">${safe}</h3>`;
      }
      return `<p class="doc-paragraph">${safe}</p>`;
    })
    .join('\n');

  return { blocks, plainText, html };
};

export default renderTemplate;
