
import type { PimoluClassNames } from "../customization/customization.types";
import type { PimoluNavbarAppearance } from "./navbar.variants";
import type { PimoluDrawerSide, PimoluDrawerSize } from "../drawer/drawer.types";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface PimoluNavbarProps
  extends HTMLAttributes<HTMLElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"navbar">;

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
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"navbar">;

  children: ReactNode;
}

export interface PimoluNavbarContentProps
  extends HTMLAttributes<HTMLElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"navbar">;

  /** Accessible name of the navigation landmark. */
  "aria-label"?: string;

  children: ReactNode;
}

/** Groups links and actions into a modal menu in narrow, collapsible navbars. */
export interface PimoluNavbarMenuProps {
  children: ReactNode;
  /** Physical viewport edge. Defaults to right; left slides from left to right. */
  side?: PimoluDrawerSide;
  /** Width for left/right or height for top/bottom. Defaults to sm. */
  size?: PimoluDrawerSize;
  /** Cover the entire viewport instead of a partial panel. Defaults to false. */
  fullScreen?: boolean;
  /** Animate entry and exit with native CSS. Defaults to true; reduced motion is respected. */
  animated?: boolean;
  /** Visible heading and accessible dialog name. Defaults to Navigation. */
  label?: string;
  /** Accessible name of the panel close button. Defaults to Close menu. */
  closeLabel?: string;
  /** Classes on the mobile panel, or the contents wrapper on desktop. */
  className?: string;
  /** Mobile panel styles, including --pimolu-drawer-size for custom dimensions. */
  style?: CSSProperties;
  /** Named parts remain available inside the portal. */
  classNames?: PimoluClassNames<"navbar">;
}

export interface PimoluNavbarToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"navbar">;

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
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"navbar">;

  active?: boolean;

  disabled?: boolean;

  /** Decorative icon displayed before the link label. */
  icon?: ReactNode;

  children: ReactNode;
}

export interface PimoluNavbarActionsProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"navbar">;

  children: ReactNode;
}
