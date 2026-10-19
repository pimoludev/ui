
import { useEffect, type RefObject } from "react";

type ValidatableElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

/**
 * Applies a custom validity message to a native form control.
 *
 * Components that submit through a hidden input cannot rely on the `required`
 * attribute of the visible field: a search-like field is legitimately empty
 * while values are selected. The caller computes the message (for example
 * "select at least one option") and passes an empty string to clear it.
 */
export function useCustomValidity(
  ref: RefObject<ValidatableElement | null>,
  message: string
): void {
  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    element.setCustomValidity(message);
  }, [ref, message]);
}
