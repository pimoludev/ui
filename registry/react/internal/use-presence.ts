"use client";

import { useEffect, useRef, useState } from "react";

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

    if (prefersReducedMotion()) {
      setRendered(false);
      return;
    }

    setState("closing");

    timer.current = setTimeout(() => {
      setRendered(false);
      timer.current = null;
    }, exitDuration);

    return cancel;
  }, [open, rendered, exitDuration]);

  useEffect(() => cancel, []);

  return { rendered, state };
}
