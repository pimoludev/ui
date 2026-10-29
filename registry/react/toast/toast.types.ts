
import type { PimoluClassNames } from "../customization/customization.types";
import type { ReactNode } from "react";

import type { PimoluToastVariant } from "./toast.variants";

export type { PimoluToastVariant };

export interface PimoluToastAction {
  label: ReactNode;
  onClick: () => void;
}

export interface PimoluToastOptions {
  /** Per-notification classes; override the corresponding Toaster parts. */
  classNames?: PimoluClassNames<"toast">;
  title: ReactNode;

  description?: ReactNode;

  variant?: PimoluToastVariant;

  /** Decorative icon. undefined uses the tone icon; null/false hides it. */
  icon?: ReactNode;

  /** Show the close button. Defaults to true. Programmatic dismissal still works. */
  dismissible?: boolean;

  /** Accessible name of the close button. */
  dismissLabel?: string;

  /** Pause the remaining auto-dismiss delay during pointer interaction. Default true. */
  pauseOnHover?: boolean;

  /** Pause while keyboard focus is inside the notification. Default true. */
  pauseOnFocus?: boolean;

  /** Auto-dismiss delay in ms. 0 keeps it open. Default 5000; loading never expires. */
  duration?: number;

  action?: PimoluToastAction;

  id?: string;

  /** Called once after manual, action or automatic dismissal. */
  onDismiss?: (id: string) => void;
}

export type PimoluToastUpdate = Partial<Omit<PimoluToastOptions, "id">>;

export interface PimoluToastPromiseOptions<T> extends Omit<PimoluToastOptions, "title" | "variant"> {
  loading: ReactNode;
  success: ReactNode | ((value: T) => ReactNode);
  error: ReactNode | ((error: unknown) => ReactNode);
}

export interface PimoluToastItem extends PimoluToastOptions {
  id: string;
}

export type PimoluToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export interface PimoluToasterProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"toast">;

  position?: PimoluToastPosition;

  /** Accessible name of the live region. */
  label?: string;
}
