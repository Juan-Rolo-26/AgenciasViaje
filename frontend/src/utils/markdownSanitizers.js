const normalizeMarkdownText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const HEADING_PATTERN = /^\s{0,3}(#{1,6})\s+(.*)$/;

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
