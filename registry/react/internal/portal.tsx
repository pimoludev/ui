"use client";

import {
  useEffect,
  useLayoutEffect,
  useState,
  type RefObject,
  type ReactNode,
} from "react";

import { createPortal } from "react-dom";

/**
 * Renders its children into a host outside the component tree, so a floating
 * surface is not clipped by an ancestor with `overflow: hidden` and is not
 * trapped in a stacking context.
 *
 * Nothing is rendered on the server or during the first client render: the
 * host is only known once effects have run.
 */
export function Portal({
  children,
  container,
  anchorRef,
  onMount,
}: {
  children: ReactNode;
  container?: HTMLElement | null;
  anchorRef?: RefObject<HTMLElement | null>;
  /** Internal placement notification, after portalled child refs are attached. */
  onMount?: () => void;
}) {
  const [host, setHost] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    /* Use the trigger's own theme scope, including nested providers. */
    const themed = anchorRef?.current?.closest(
      "[data-pimolu-theme], [data-pimolu-style]"
    );

    setHost(
      container ??
        (themed instanceof HTMLElement ? themed : document.body)
    );
  }, [container, anchorRef]);

  useLayoutEffect(() => {
    if (host) onMount?.();
  }, [host, onMount]);

  if (!host) return null;

  return createPortal(children, host);
}
