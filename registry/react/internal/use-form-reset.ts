
import { useEffect, useRef, type RefObject } from "react";

/**
 * Re-synchronizes a React-controlled value with the native form reset.
 *
 * Native `reset()` restores the DOM value to its default without React knowing,
 * so any mirrored state (a counter, a tag list, a selected value) would drift.
 * The callback runs on the form's reset event; it is kept in a ref so the
 * subscription stays stable.
 *
 * Pass `enabled: false` for controlled components: the parent owns the value
 * and must reset it itself.
 */
export function useFormReset(
  ref: RefObject<
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | null
  >,
  enabled: boolean,
  onReset: () => void
): void {
  const handler = useRef(onReset);

  useEffect(() => {
    handler.current = onReset;
  }, [onReset]);

  useEffect(() => {
    if (!enabled) return;

    const form = ref.current?.form;

    if (!form) return;

    function handleReset() {
      handler.current();
    }

    form.addEventListener("reset", handleReset);

    return () => {
      form.removeEventListener("reset", handleReset);
    };
  }, [ref, enabled]);
}
