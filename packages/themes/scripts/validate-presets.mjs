
const requiredTokens = [
  "background",
  "foreground",
  "surface",
  "surfaceForeground",
  "primary",
  "primaryHover",
  "primaryForeground",
  "secondary",
  "secondaryHover",
  "secondaryForeground",
  "muted",
  "mutedForeground",
  "border",
  "focusRing",
];

function isColor(value) {
  if (typeof value !== "string") return false;

  if (/^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)) {
    return true;
  }

  const match = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0(?:\.\d+)?|1(?:\.0+)?)\s*\)$/i.exec(value);

  return Boolean(
    match &&
    match.slice(1, 4).every((n) => Number(n) <= 255)
  );
}

export function validatePreset(name, source) {
  for (const mode of ["light", "dark"]) {
    const colors = source?.[mode];

    if (
      !colors ||
      typeof colors !== "object" ||
      Array.isArray(colors)
    ) {
      throw new Error(`${name}: missing ${mode} palette`);
    }

    for (const token of requiredTokens) {
      if (!(token in colors)) {
        throw new Error(
          `${name}/${mode}: missing token "${token}"`
        );
      }
    }

    for (const [key, value] of Object.entries(colors)) {
      if (!/^[a-z][a-zA-Z0-9]*$/.test(key)) {
        throw new Error(`${name}/${mode}: invalid token name "${key}"`);
      }

      if (!isColor(value)) {
        throw new Error(
          `${name}/${mode}: invalid color "${key}": ${value}`
        );
      }
    }
  }

  const lightKeys = Object.keys(source.light).sort();
  const darkKeys = Object.keys(source.dark).sort();

  if (JSON.stringify(lightKeys) !== JSON.stringify(darkKeys)) {
    throw new Error(
      `${name}: light and dark must contain the same tokens`
    );
  }
}
