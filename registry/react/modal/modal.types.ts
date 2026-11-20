
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  CSSProperties,
  ReactElement,
  ReactNode,
} from "react";

import type { PimoluModalSize } from "./modal.variants";

/* The size axis is derived from modal.variants.ts, never re-declared. */

export type { PimoluModalSize };

export interface PimoluModalProps {
  /** Trigger, content, header, footer and close controls. */
  children: ReactNode;

  /** Controlled open state. Omit to let the component own it. */
  open?: boolean;

  /** Initial open state when uncontrolled. Defaults to false. */
  defaultOpen?: boolean;

  /** Called whenever the component asks to open or close. */
  onOpenChange?: (open: boolean) => void;
}

export interface PimoluModalTriggerProps {
  /**
   * The element that opens the modal: any element, or a component that
   * passes down the props it receives. It gets the ARIA state, the click
   * handler and the ref, and the handlers it already had keep working.
   */
  children: ReactElement;

  /**
   * Tab index forwarded to the cloned trigger. When the element is not
   * natively focusable and no value is given, Pimolu adds `tabIndex={0}` and
   * `role="button"` so keyboard users can reach it.
   */
  tabIndex?: number;
}

export interface PimoluModalContentProps {
  /** Header, body and footer of the modal. */
  children?: ReactNode;

  /** Maximum width of the panel. Defaults to "md". */
  size?: PimoluModalSize;

  /** Close when the overlay is pressed. Defaults to true. */
  closeOnOverlayClick?: boolean;

  /** Close on Escape. Defaults to true. */
  closeOnEscape?: boolean;

  /** Render the close button in the top corner. Defaults to true. */
  showCloseButton?: boolean;

  /** Accessible name of the corner close button. Defaults to "Close". */
  closeLabel?: string;

  /**
   * Accessible name of the modal. Use it only when there is no
   * `ModalTitle`; a title automatically names the modal.
   */
  "aria-label"?: string;

  /** Overrides the id registered by `ModalTitle`. */
  "aria-labelledby"?: string;

  /** Overrides the id registered by `ModalDescription`. */
  "aria-describedby"?: string;

  /** Class applied to the panel. */
  className?: string;

  /** Inline styles on the panel, including local CSS variables. */
  style?: CSSProperties;

  /** Additive classes on portalled parts; className still targets content. */
  classNames?: PimoluClassNames<"modal">;
}

export interface PimoluModalHeaderProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"modal">;

  children: ReactNode;
  className?: string;
}

export interface PimoluModalTitleProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"modal">;

  children: ReactNode;

  /** Explicit id, instead of the generated one. */
  id?: string;

  className?: string;
}

export interface PimoluModalDescriptionProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"modal">;

  children: ReactNode;

  /** Explicit id, instead of the generated one. */
  id?: string;

  className?: string;
}

export interface PimoluModalFooterProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"modal">;

  children: ReactNode;
  className?: string;
}

export interface PimoluModalCloseProps {
  /**
   * The element that closes the modal: any element, or a component that
   * passes down the props it receives. Its own click handler still runs.
   */
  children: ReactElement;
}
