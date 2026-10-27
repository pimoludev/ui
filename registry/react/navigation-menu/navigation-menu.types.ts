
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface PimoluNavigationMenuProps
  extends HTMLAttributes<HTMLElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"navigation-menu">;

  /** Accessible name of the navigation landmark; `aria-label` takes precedence. */
  label?: string;

  children: ReactNode;
}

export interface PimoluNavigationMenuListProps
  extends HTMLAttributes<HTMLUListElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"navigation-menu">;

  children: ReactNode;
}

export interface PimoluNavigationMenuItemProps
  extends HTMLAttributes<HTMLLIElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"navigation-menu">;

  /** Value shared by the trigger and its content. */
  value: string;

  children: ReactNode;
}

export interface PimoluNavigationMenuTriggerProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"navigation-menu">;

  children: ReactNode;
  className?: string;
}

export interface PimoluNavigationMenuContentProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"navigation-menu">;

  children: ReactNode;
  className?: string;
}

export interface PimoluNavigationMenuLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"navigation-menu">;

  active?: boolean;

  disabled?: boolean;

  children: ReactNode;
}
