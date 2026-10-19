"use client";

import {
  useEffect,
  useState,
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
}: {
  children: ReactNode;
  container?: HTMLElement | null;
}) {
  const [host, setHost] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    /* A themed wrapper defines the tokens the surface needs, so a floating
       panel mounts inside it when one exists instead of on <body>. */
    const themed = document.querySelector(
      "[data-pimolu-theme], [data-pimolu-style]"
    );

    setHost(
      container ??
        (themed instanceof HTMLElement ? themed : document.body)
    );
  }, [container]);

  if (!host) return null;

  return createPortal(children, host);
}
