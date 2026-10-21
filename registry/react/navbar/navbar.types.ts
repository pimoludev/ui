import type { PimoluNavbarAppearance } from "./navbar.variants";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface PimoluNavbarProps
  extends HTMLAttributes<HTMLElement> {
  /** Surface treatment. Defaults to surface; transparent inherits the page background. */
  appearance?: PimoluNavbarAppearance;

  /** Stick to the top of the scroll container. */
  sticky?: boolean;

  /** Draw the bottom border. Defaults to true. */
  bordered?: boolean;

  /**
   * Alignment of the navigation items inside the bar. Defaults to "left".
   * The brand stays at the start and the actions at the end.
   */
  itemsPosition?: "left" | "center" | "right";

  /** Collapse links and actions behind NavbarToggle in narrow containers. */
  collapsible?: boolean;

  /** Controlled mobile menu state. */
  open?: boolean;

  /** Initial mobile menu state when uncontrolled. */
  defaultOpen?: boolean;

  onOpenChange?: (open: boolean) => void;

  children: ReactNode;
}

export interface PimoluNavbarBrandProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

export interface PimoluNavbarContentProps
  extends HTMLAttributes<HTMLElement> {
  /** Accessible name of the navigation landmark. */
  "aria-label"?: string;

  children: ReactNode;
}

export interface PimoluNavbarToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Replaces the default hamburger icon. */
  icon?: ReactNode;

  /** Replaces the default close icon. */
  closeIcon?: ReactNode;

  /** Accessible label while the menu is closed. */
  openLabel?: string;

  /** Accessible label while the menu is open. */
  closeLabel?: string;
}

export interface PimoluNavbarItemProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;

  disabled?: boolean;

  /** Decorative icon displayed before the link label. */
  icon?: ReactNode;

  children: ReactNode;
}

export interface PimoluNavbarActionsProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
