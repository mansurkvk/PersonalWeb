// Basliklari URL dostu slug yapisina cevirir.
export function slugify(value: string) {
  const trMap: Record<string, string> = {
    "ğ": "g",
    "ü": "u",
    "ş": "s",
    "ı": "i",
    "ö": "o",
    "ç": "c",
    "Ğ": "g",
    "Ü": "u",
    "Ş": "s",
    "İ": "i",
    "Ö": "o",
    "Ç": "c"
  };

  return value
    .split("")
    .map((char) => trMap[char] ?? char)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
