import { useMemo, type Ref, type RefCallback } from "react";

/** Preserve internal DOM bookkeeping and React 18/19 callback-ref cleanup. */
export function useMergedRefs<Element>(first: Ref<Element> | undefined, second: Ref<Element> | undefined): RefCallback<Element> {
  return useMemo(() => {
    const cleanups = new Map<Ref<Element>, () => void>();
    return (node: Element | null) => {
      for (const ref of [first, second]) {
        if (!ref) continue;
        if (typeof ref !== "function") { ref.current = node; continue; }
        const previous = cleanups.get(ref);
        if (previous) { previous(); cleanups.delete(ref); }
        if (node === null && previous) continue;
        const cleanup = ref(node);
        if (typeof cleanup === "function") cleanups.set(ref, cleanup);
      }
    };
  }, [first, second]);
}
