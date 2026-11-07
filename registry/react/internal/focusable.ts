/**
 * Elements a keyboard can move through, in DOM order. Use semantic and computed
 * visibility rather than layout dimensions, which are also zero in jsdom.
 */
export const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "audio[controls]",
  "video[controls]",
  "details > summary:first-of-type",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function getFocusable(
  container: HTMLElement,
  { includeNegativeTabIndex = false }: { includeNegativeTabIndex?: boolean } = {}
): HTMLElement[] {
  // Several controls share the same ancestors. Cache only for this traversal:
  // the next Tab must see CSS, disabled and visibility changes immediately.
  const styles = new Map<HTMLElement, CSSStyleDeclaration>();
  function computedStyle(element: HTMLElement, view: Window) {
    let style = styles.get(element);
    if (!style) {
      style = view.getComputedStyle(element);
      styles.set(element, style);
    }
    return style;
  }
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      FOCUSABLE_SELECTOR
    )
  ).filter((element) => {
    if ((!includeNegativeTabIndex && element.hasAttribute("tabindex") && element.tabIndex < 0) || element.matches(":disabled") || element.closest("[inert]")) return false;
    const view = element.ownerDocument.defaultView;
    if (!view) return false;
    const style = computedStyle(element, view);
    if (style.visibility === "hidden" || style.visibility === "collapse") return false;
    for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
      const ancestorStyle = computedStyle(ancestor, view);
      if (ancestor.hidden || ancestorStyle.display === "none" || ancestorStyle.contentVisibility === "hidden") return false;
      if (ancestor.tagName === "DETAILS" && !ancestor.hasAttribute("open")) {
        const summary = Array.from(ancestor.children).find((child) => child.tagName === "SUMMARY");
        if (!summary?.contains(element)) return false;
      }
    }
    return true;
  });
}
