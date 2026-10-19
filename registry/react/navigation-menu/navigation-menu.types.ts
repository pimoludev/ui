import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface PimoluNavigationMenuProps
  extends HTMLAttributes<HTMLElement> {
  /** Accessible name of the navigation landmark. */
  label?: string;

  children: ReactNode;
}

export interface PimoluNavigationMenuListProps
  extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
}

export interface PimoluNavigationMenuItemProps
  extends HTMLAttributes<HTMLLIElement> {
  /** Value shared by the trigger and its content. */
  value: string;

  children: ReactNode;
}

export interface PimoluNavigationMenuTriggerProps {
  children: ReactNode;
  className?: string;
}

export interface PimoluNavigationMenuContentProps {
  children: ReactNode;
  className?: string;
}

export interface PimoluNavigationMenuLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;

  disabled?: boolean;

  children: ReactNode;
}
