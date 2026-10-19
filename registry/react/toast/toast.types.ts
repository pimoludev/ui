import type { ReactNode } from "react";

import type { PimoluToastVariant } from "./toast.variants";

export type { PimoluToastVariant };

export interface PimoluToastAction {
  label: ReactNode;
  onClick: () => void;
}

export interface PimoluToastOptions {
  title: ReactNode;

  description?: ReactNode;

  variant?: PimoluToastVariant;

  /** Auto-dismiss delay in ms. 0 keeps the toast open. Defaults to 5000. */
  duration?: number;

  action?: PimoluToastAction;

  id?: string;
}

export interface PimoluToastItem extends PimoluToastOptions {
  id: string;
}

export type PimoluToastPosition =
  | "top-right"
  | "top-center"
  | "bottom-right"
  | "bottom-center";

export interface PimoluToasterProps {
  position?: PimoluToastPosition;

  /** Accessible name of the live region. */
  label?: string;
}
