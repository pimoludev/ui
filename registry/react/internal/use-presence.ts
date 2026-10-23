"use client";

import { useEffect, useRef, useState } from "react";
import { usePimoluExitDuration } from "../animation/animation-engine";

export type OverlayPresenceState =
  | "open"
  | "closing";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
  );
}

/**
 * Keeps a floating or modal surface mounted while it animates out.
 *
 * Returns `rendered` (mount the DOM) and `state` (drive the CSS animation).
 */
export function usePresence(
  open: boolean,
  exitDuration = 150
) {
  exitDuration = usePimoluExitDuration(exitDuration);
  const [rendered, setRendered] = useState(open);
  const [state, setState] = useState<OverlayPresenceState>(
    "open"
  );

  const timer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  function cancel() {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }

  useEffect(() => {
    if (open) {
      cancel();
      setRendered(true);
      setState("open");
      return;
    }

    if (!rendered) return;

    if (prefersReducedMotion() || exitDuration <= 0) {
      setRendered(false);
      return;
    }

    setState("closing");

    timer.current = setTimeout(() => {
      setRendered(false);
      timer.current = null;
    }, exitDuration);

    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const reduce = () => {
      if (media?.matches) { cancel(); setRendered(false); }
    };
    media?.addEventListener("change", reduce);
    return () => { cancel(); media?.removeEventListener("change", reduce); };
  }, [open, rendered, exitDuration]);

  useEffect(() => cancel, []);

  // Opening must be synchronous; CSS-only disclosure panels also hide in the
  // same commit, preserving their original layout and keyboard contract.
  return {
    rendered: exitDuration <= 0 ? open : open || rendered,
    state: open ? "open" as const : state,
  };
}
