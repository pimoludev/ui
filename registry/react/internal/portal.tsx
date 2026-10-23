"use client";

import {
  useEffect,
  useState,
  type RefObject,
  type ReactNode,
} from "react";

import { createPortal } from "react-dom";
import { AnimationScope } from "../animation/animation-engine";

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
}: {
  children: ReactNode;
  container?: HTMLElement | null;
  anchorRef?: RefObject<HTMLElement | null>;
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

  if (!host) return null;

  return createPortal(<AnimationScope>{children}</AnimationScope>, host);
}
