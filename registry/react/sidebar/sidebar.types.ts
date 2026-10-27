
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface PimoluSidebarProps
  extends HTMLAttributes<HTMLElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"sidebar">;

  /** Stick to the top of the scroll container. */
  sticky?: boolean;

  /** Show a built-in control to collapse and expand the navigation. */
  collapsible?: boolean;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Initial collapsed state when uncontrolled. */
  defaultCollapsed?: boolean;
  /** Start collapsed below 720px unless the state is controlled or explicitly set. */
  collapseOnMobile?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  collapseLabel?: string;
  expandLabel?: string;

  children: ReactNode;
}

export interface PimoluSidebarHeaderProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"sidebar">;

  children: ReactNode;

  /** Logo or compact identity kept visible in the collapsed desktop rail. */
  collapsedContent?: ReactNode;
}

export interface PimoluSidebarContentProps
  extends HTMLAttributes<HTMLElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"sidebar">;

  "aria-label"?: string;

  children: ReactNode;
}

export interface PimoluSidebarGroupProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"sidebar">;

  children: ReactNode;
}

export interface PimoluSidebarGroupLabelProps
  extends HTMLAttributes<HTMLSpanElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"sidebar">;

  children: ReactNode;
}

export interface PimoluSidebarItemProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"sidebar">;

  active?: boolean;

  disabled?: boolean;

  /** Decorative icon shown before the label. */
  icon?: ReactNode;

  children: ReactNode;
}

export interface PimoluSidebarFooterProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"sidebar">;

  children: ReactNode;

  /** Profile/avatar kept visible when the navigation is collapsed. */
  collapsedContent?: ReactNode;
}
