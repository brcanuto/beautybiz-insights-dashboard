// Collapse weird spacing
function collapseWhitespace(str: string): string {
  return str.replace(/\s+/g, " ").trim();
}

// Title-case every word: "men's clothing" -> "Men's Clothing"
export function normalizeCategory(raw: string): string {
  return collapseWhitespace(raw)
    .toLowerCase()
    .split(" ")
    .map((word) =>
      word ? word[0].toUpperCase() + word.slice(1) : word
    )
    .join(" ");
}

// Capitalize first letter of a sentence-style string
export function normalizeText(raw: string): string {
  const cleaned = collapseWhitespace(raw);
  if (!cleaned) return cleaned;
  return cleaned[0].toUpperCase() + cleaned.slice(1);
}

// Normalize a full Fake Store product
export function normalizeProduct<
  T extends { title?: string; category?: string; description?: string }
>(product: T): T {
  return {
    ...product,
    title: product.title ? normalizeText(product.title) : product.title,
    description: product.description
      ? normalizeText(product.description)
      : product.description,
    category: product.category
      ? normalizeCategory(product.category)
      : product.category,
  }
}
