
import type { PimoluClassNames } from "../customization/customization.types";
import type { ReactElement, ReactNode } from "react";

export interface PimoluContextMenuProps {
  children: ReactNode;

  /** Controlled open state. Omit to let the component own it. */
  open?: boolean;

  /** Initial open state when uncontrolled. Defaults to false. */
  defaultOpen?: boolean;

  /** Called whenever the component asks to open or close. */
  onOpenChange?: (open: boolean) => void;
}

export interface PimoluContextMenuTriggerProps {
  /**
   * The single element that opens the menu. It gets the contextmenu handler
   * and the ref, and the handlers it already had keep working.
   */
  children: ReactElement;
}

export interface PimoluContextMenuContentProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"context-menu">;

  children: ReactNode;

  /**
   * Minimum distance kept from the viewport edges, in pixels.
   * Defaults to 8.
   */
  collisionPadding?: number;

  /** Class applied to the menu panel. */
  className?: string;
}

export interface PimoluContextMenuItemProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"context-menu">;

  children: ReactNode;

  /** Called before the menu closes and focus returns to the trigger. */
  onSelect?: () => void;

  disabled?: boolean;
}

export interface PimoluContextMenuSeparatorProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"context-menu">;

  className?: string;
}

export interface PimoluContextMenuLabelProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"context-menu">;

  children: ReactNode;
  className?: string;
}
