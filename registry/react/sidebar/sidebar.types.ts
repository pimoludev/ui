import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface PimoluSidebarProps
  extends HTMLAttributes<HTMLElement> {
  /** Stick to the top of the scroll container. */
  sticky?: boolean;

  children: ReactNode;
}

export interface PimoluSidebarHeaderProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface PimoluSidebarContentProps
  extends HTMLAttributes<HTMLElement> {
  "aria-label"?: string;

  children: ReactNode;
}

export interface PimoluSidebarGroupProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface PimoluSidebarGroupLabelProps
  extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export interface PimoluSidebarItemProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;

  disabled?: boolean;

  /** Decorative icon shown before the label. */
  icon?: ReactNode;

  children: ReactNode;
}

export interface PimoluSidebarFooterProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
