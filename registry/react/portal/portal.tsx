"use client";

import type { ReactNode, RefObject } from "react";

import { Portal as InternalPortal } from "../internal/portal";

export interface PimoluPortalProps {
  children: ReactNode;

  /**
   * Explicit host. When omitted, the closest theme scope of `anchorRef` is
   * used, falling back to `document.body`.
   */
  container?: HTMLElement | null;

  /** Element whose theme scope should receive the portal. */
  anchorRef?: RefObject<HTMLElement | null>;
}

/**
 * Low-level public portal. Overlay components use the same implementation.
 * Nothing renders on the server or during the first client render.
 */
export function Portal(props: PimoluPortalProps) {
  return <InternalPortal {...props} />;
}
