const normalizeMarkdownText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const HEADING_PATTERN = /^\s{0,3}(#{1,6})\s+(.*)$/;
const PRICE_AMOUNT_PATTERN = /(?:\$|u\$s|usd|ars|r\$)\s*[\d.,]+/i;
const PRICE_KEYWORD_PATTERN =
  /\b(?:dbl|sgl|slg|tpl|chd|neto|iva|impuesto|impuestos|precio|precios|tarifa|tarifas|total|final)\b/i;
const BUTACA_ADDON_PATTERN =
  /\bbutaca\b.*\b(cama|panoramica|cafetera)\b|\b(cama|panoramica|cafetera)\b.*\bbutaca\b/i;
const MEANINGLESS_INFO_PATTERNS = [
  /^consultanos(?:\s+para)?(?:\s+mas)?(?:\s+informacion|\s+info)?\.?$/,
  /^consultanos\s+para\s+conocer.+$/,
  /^informacion(?:\s+del\s+viaje)?\.?$/,
  /^a\s+confirmar\.?$/,
  /^informacion\s+a\s+confirmar\.?$/,
  /^informacion\s+a\s+consultar\.?$/
];

function stripEmptyMarkdownHeadings(markdown) {
  if (!markdown) return "";

  const lines = String(markdown).split("\n");
  const headingIndexes = [];

  lines.forEach((line, index) => {
    if (HEADING_PATTERN.test(line)) headingIndexes.push(index);
  });

  const keep = new Array(lines.length).fill(true);

  for (let i = 0; i < headingIndexes.length; i += 1) {
    const start = headingIndexes[i] + 1;
    const end = i + 1 < headingIndexes.length ? headingIndexes[i + 1] : lines.length;
    const hasContent = lines.slice(start, end).some((line) => line.trim());
    if (!hasContent) {
      keep[headingIndexes[i]] = false;
    }
  }

  return lines
    .filter((_, index) => keep[index])
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function stripMarkdownSectionByKeyword(markdown, keyword) {
  if (!markdown) {
    return "";
  }

  const normalizedKeyword = normalizeMarkdownText(keyword).trim();
  if (!normalizedKeyword) {
    return String(markdown);
  }

  const lines = String(markdown).split("\n");
  const output = [];
  let skipLevel = null;

  for (const line of lines) {
    const headingMatch = line.match(HEADING_PATTERN);

    if (skipLevel !== null) {
      if (headingMatch) {
        const currentLevel = headingMatch[1].length;
        if (currentLevel <= skipLevel) {
          skipLevel = null;
        } else {
          continue;
        }
      } else {
        continue;
      }
    }

    if (headingMatch) {
      const headingLevel = headingMatch[1].length;
      const headingText = normalizeMarkdownText(headingMatch[2]);
      if (headingText.includes(normalizedKeyword)) {
        skipLevel = headingLevel;
        continue;
      }
    }

    output.push(line);
  }

  return output.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function hasPriceSignals(text) {
  if (!text) return false;
  const value = String(text);
  const normalized = normalizeMarkdownText(value);

  return (
    PRICE_AMOUNT_PATTERN.test(value) ||
    PRICE_AMOUNT_PATTERN.test(normalized) ||
    PRICE_KEYWORD_PATTERN.test(normalized) ||
    BUTACA_ADDON_PATTERN.test(normalized)
  );
}

export function hasMeaningfulInfoText(text) {
  if (!text) return false;

  const normalized = normalizeMarkdownText(text)
    .replace(/[#>*_`-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return false;
  return !MEANINGLESS_INFO_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function stripLinesWithPriceSignals(markdown) {
  if (!markdown) return "";

  const lines = String(markdown).split("\n");
  const output = lines.filter((line) => !hasPriceSignals(line));

  return stripEmptyMarkdownHeadings(output.join("\n"));
}
