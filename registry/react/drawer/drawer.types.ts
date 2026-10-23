import type {
  ReactElement,
  ReactNode,
} from "react";

/** Viewport edge the drawer slides from. */
export type PimoluDrawerSide =
  | "right"
  | "left"
  | "top"
  | "bottom";

/** Panel size along the side axis: width for left/right, height for top/bottom. */
export type PimoluDrawerSize =
  | "sm"
  | "md"
  | "lg";

export interface PimoluDrawerProps {
  /** Trigger, content, header, footer and close controls. */
  children: ReactNode;

  /** Controlled open state. Omit to let the component own it. */
  open?: boolean;

  /** Initial open state when uncontrolled. Defaults to false. */
  defaultOpen?: boolean;

  /** Called whenever the component asks to open or close. */
  onOpenChange?: (open: boolean) => void;
}

export interface PimoluDrawerTriggerProps {
  /**
   * The element that opens the drawer: any element, or a component that
   * passes down the props it receives. It gets the ARIA state, the click
   * handler and the ref, and the handlers it already had keep working.
   */
  children: ReactElement;
}

export interface PimoluDrawerContentProps {
  /** Header, body and footer of the drawer. */
  children?: ReactNode;

  /** Edge of the viewport the panel slides from. Defaults to "right". */
  side?: PimoluDrawerSide;

  /**
   * Panel size along the side axis. Defaults to "md": a width for left and
   * right drawers, a height for top and bottom drawers.
   */
  size?: PimoluDrawerSize;

  /** Close when the overlay is pressed. Defaults to true. */
  closeOnOverlayClick?: boolean;

  /** Close on Escape. Defaults to true. */
  closeOnEscape?: boolean;

  /** Render the close button in the panel corner. Defaults to true. */
  showCloseButton?: boolean;

  /** Accessible name of the corner close button. Defaults to "Close". */
  closeLabel?: string;

  /**
   * Accessible name of the panel. Use it only when there is no `DrawerTitle`;
   * a title automatically names the panel.
   */
  "aria-label"?: string;

  /** Overrides the id registered by `DrawerTitle`. */
  "aria-labelledby"?: string;

  /** Overrides the id registered by `DrawerDescription`. */
  "aria-describedby"?: string;

  /** Class applied to the panel. */
  className?: string;
}

export interface PimoluDrawerHeaderProps {
  children: ReactNode;
  className?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}

export interface PimoluDrawerTitleProps {
  children: ReactNode;

  /** Explicit id, instead of the generated one. */
  id?: string;

  className?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}

export interface PimoluDrawerDescriptionProps {
  children: ReactNode;

  /** Explicit id, instead of the generated one. */
  id?: string;

  className?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}

export interface PimoluDrawerFooterProps {
  children: ReactNode;
  className?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}

export interface PimoluDrawerCloseProps {
  /**
   * The element that closes the drawer: any element, or a component that
   * passes down the props it receives. Its own click handler still runs.
   */
  children: ReactElement;
}
