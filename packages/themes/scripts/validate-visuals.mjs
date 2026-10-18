
const tokenName = /^[a-z][a-z0-9-]*$/;

/**
 * Validates a platform-neutral visual preset.
 *
 * Shape: { light: { "kebab-token": "css value" }, dark: { overrides } }
 * Keys are the exact `--pimolu-<key>` suffix, used verbatim.
 * `dark` is a subset of `light`: it only carries the theme overrides.
 */
export function validateVisual(name, source) {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw new Error(`${name}: invalid visual preset`);
  }

  for (const mode of ["light", "dark"]) {
    const tokens = source[mode];

    if (
      !tokens ||
      typeof tokens !== "object" ||
      Array.isArray(tokens)
    ) {
      throw new Error(`${name}: missing ${mode} visual tokens`);
    }

    for (const [key, value] of Object.entries(tokens)) {
      if (!tokenName.test(key)) {
        throw new Error(
          `${name}/${mode}: invalid token name "${key}"`
        );
      }

      if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(
          `${name}/${mode}: invalid value for "${key}"`
        );
      }

      if (/[;{}]/.test(value)) {
        throw new Error(
          `${name}/${mode}: unsafe value for "${key}"`
        );
      }
    }
  }

  const lightKeys = new Set(Object.keys(source.light));

  for (const key of Object.keys(source.dark)) {
    if (!lightKeys.has(key)) {
      throw new Error(
        `${name}: dark override "${key}" is not declared in light`
      );
    }
  }
}
