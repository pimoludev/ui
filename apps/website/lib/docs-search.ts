/** Put direct component references before broad prose matches. Command owns query state. */
export function orderSearchDocuments<T extends { title: string; group: string }>(documents: readonly T[]): T[] {
  return [...documents].sort((a, b) => {
    const aComponent = a.group === "Components";
    const bComponent = b.group === "Components";
    if (aComponent !== bComponent) return aComponent ? -1 : 1;
    return aComponent ? a.title.length - b.title.length : 0;
  });
}
