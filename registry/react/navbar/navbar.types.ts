import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface PimoluNavbarProps
  extends HTMLAttributes<HTMLElement> {
  /** Stick to the top of the scroll container. */
  sticky?: boolean;

  /** Draw the bottom border. Defaults to true. */
  bordered?: boolean;

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

export interface PimoluNavbarItemProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;

  disabled?: boolean;

  children: ReactNode;
}

export interface PimoluNavbarActionsProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
