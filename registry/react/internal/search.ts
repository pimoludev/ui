
/**
 * Shared search helpers for the option-based components
 * (Combobox, MultiSelect, and later Command / TagsInput).
 */

/** Minimal shape a searchable option must expose. */
export interface SearchableOption {
  label: string;
  keywords?: readonly string[];
}

/**
 * Lower-cases and strips diacritics so "francais" matches "Français".
 */
export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .trim();
}

/**
 * Filters options on their label and keywords. An empty query returns a copy
 * of every option, so callers can keep the original array untouched.
 */
export function filterByQuery<T extends SearchableOption>(
  options: readonly T[],
  query: string
): T[] {
  const search = normalizeSearch(query);

  if (!search) return [...options];

  return options.filter((option) =>
    normalizeSearch(
      [option.label, ...(option.keywords ?? [])].join(" ")
    ).includes(search)
  );
}
