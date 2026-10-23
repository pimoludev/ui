import type {
  ReactElement,
  ReactNode,
} from "react";

import type { PimoluDialogSize } from "./dialog.variants";

/* The size axis is derived from dialog.variants.ts, never re-declared. */

export type { PimoluDialogSize };

export interface PimoluDialogProps {
  /** Trigger, content, header, footer and close controls. */
  children: ReactNode;

  /** Controlled open state. Omit to let the component own it. */
  open?: boolean;

  /** Initial open state when uncontrolled. Defaults to false. */
  defaultOpen?: boolean;

  /** Called whenever the component asks to open or close. */
  onOpenChange?: (open: boolean) => void;
}

export interface PimoluDialogTriggerProps {
  /**
   * The element that opens the dialog: any element, or a component that
   * passes down the props it receives. It gets the ARIA state, the click
   * handler and the ref, and the handlers it already had keep working.
   */
  children: ReactElement;
}

export interface PimoluDialogContentProps {
  /** Header, body and footer of the dialog. */
  children?: ReactNode;

  /** Maximum width of the panel. Defaults to "md". */
  size?: PimoluDialogSize;

  /** Close when the overlay is pressed. Defaults to true. */
  closeOnOverlayClick?: boolean;

  /** Close on Escape. Defaults to true. */
  closeOnEscape?: boolean;

  /** Render the close button in the top corner. Defaults to true. */
  showCloseButton?: boolean;

  /** Accessible name of the corner close button. Defaults to "Close". */
  closeLabel?: string;

  /** Semantics of the panel. Defaults to "dialog". */
  role?: "dialog" | "alertdialog";

  /**
   * Accessible name of the dialog. Use it only when there is no
   * `DialogTitle`; a title automatically names the dialog.
   */
  "aria-label"?: string;

  /** Overrides the id registered by `DialogTitle`. */
  "aria-labelledby"?: string;

  /** Overrides the id registered by `DialogDescription`. */
  "aria-describedby"?: string;

  /** Class applied to the panel. */
  className?: string;
}

export interface PimoluDialogHeaderProps {
  children: ReactNode;
  className?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}

export interface PimoluDialogTitleProps {
  children: ReactNode;

  /** Explicit id, instead of the generated one. */
  id?: string;

  className?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}

export interface PimoluDialogDescriptionProps {
  children: ReactNode;

  /** Explicit id, instead of the generated one. */
  id?: string;

  className?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}

export interface PimoluDialogFooterProps {
  children: ReactNode;
  className?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}

export interface PimoluDialogCloseProps {
  /**
   * The element that closes the dialog: any element, or a component that
   * passes down the props it receives. Its own click handler still runs.
   */
  children: ReactElement;
}
