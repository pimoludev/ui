/**
 * Clone-based triggers clone whatever element the application passes. When that
 * element is not natively focusable, a keyboard user cannot reach the trigger at
 * all. Add the minimum attributes that make it operable, without overriding an
 * explicit choice from the application.
 */
export function ensureTriggerFocusable(node: HTMLElement | null) {
  if (!node) return;
  const focusable =
    node.matches(
      'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
    ) || node.tabIndex >= 0;
  if (focusable) return;
  if (!node.hasAttribute("tabindex")) node.setAttribute("tabindex", "0");
  if (!node.hasAttribute("role")) node.setAttribute("role", "button");
}
