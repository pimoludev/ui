/** Append consumer classes without replacing the component's state classes. */
export function mergeClasses(...values: Array<string | undefined | false>) {
  const tokens = new Set<string>();
  for (const value of values) {
    if (value) for (const token of value.split(/\s+/)) if (token) tokens.add(token);
  }
  return tokens.size ? [...tokens].join(" ") : undefined;
}
