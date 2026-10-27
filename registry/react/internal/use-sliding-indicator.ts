import { useCallback, useEffect, useLayoutEffect, useState, type RefObject } from "react";

const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Geometry only: native CSS owns interpolation, interruption and reduced motion. */
export function useSlidingIndicator(
  ref: RefObject<HTMLElement | null>,
  selector: string,
  layoutKey: unknown,
) {
  const [indicator, setIndicator] = useState<{
    x: number; y: number; width: number; height: number;
  } | null>(null);
  const [ready, setReady] = useState(false);
  const measure = useCallback(() => {
    const selected = ref.current?.querySelector<HTMLElement>(selector);
    if (!selected || !selected.offsetWidth || !selected.offsetHeight) {
      setIndicator(null);
      return;
    }
    // Local layout coordinates also work in transformed previews and RTL scrollers.
    const next = { x: selected.offsetLeft, y: selected.offsetTop, width: selected.offsetWidth, height: selected.offsetHeight };
    setIndicator((current) => current && current.x === next.x && current.y === next.y && current.width === next.width && current.height === next.height ? current : next);
  }, [ref, selector]);

  useBrowserLayoutEffect(() => {
    const group = ref.current;
    if (!group) return;
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    const observe = () => {
      observer?.disconnect();
      observer?.observe(group);
      group.querySelectorAll<HTMLElement>(':scope > [role="tab"], :scope > [role="radio"]').forEach((item) => observer?.observe(item));
      measure();
    };
    observe();
    const mutations = typeof MutationObserver === "function" ? new MutationObserver(observe) : null;
    mutations?.observe(group, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["class", "disabled", "hidden", "dir"] });
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      mutations?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ref, measure, layoutKey]);

  const visible = indicator !== null;
  useEffect(() => {
    if (!visible) { setReady(false); return; }
    // No entrance from the origin on hydration or when a hidden control appears.
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, [visible]);
  return { indicator, ready, visible };
}
