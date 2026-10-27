
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  CSSProperties,
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

  /** Inline styles on the panel, including local CSS variables. */
  style?: CSSProperties;

  /** Additive classes on portalled parts; className still targets content. */
  classNames?: PimoluClassNames<"dialog">;
}

export interface PimoluDialogHeaderProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"dialog">;

  children: ReactNode;
  className?: string;
}

export interface PimoluDialogTitleProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"dialog">;

  children: ReactNode;

  /** Explicit id, instead of the generated one. */
  id?: string;

  className?: string;
}

export interface PimoluDialogDescriptionProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"dialog">;

  children: ReactNode;

  /** Explicit id, instead of the generated one. */
  id?: string;

  className?: string;
}

export interface PimoluDialogFooterProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"dialog">;

  children: ReactNode;
  className?: string;
}

export interface PimoluDialogCloseProps {
  /**
   * The element that closes the dialog: any element, or a component that
   * passes down the props it receives. Its own click handler still runs.
   */
  children: ReactElement;
}
