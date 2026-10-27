
import type { PimoluClassNames } from "../customization/customization.types";
import type { ReactElement, ReactNode } from "react";

export interface PimoluDropdownMenuProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface PimoluDropdownMenuTriggerProps {
  children: ReactElement;
}

export interface PimoluDropdownMenuContentProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"dropdown-menu">;

  children: ReactNode;
  /** Distance from the trigger. Defaults to 6. */
  sideOffset?: number;
  align?: "start" | "end";
  className?: string;
}

export interface PimoluDropdownMenuItemProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"dropdown-menu">;

  children: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface PimoluDropdownMenuSeparatorProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"dropdown-menu">;

  className?: string;
}

export interface PimoluDropdownMenuLabelProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"dropdown-menu">;

  children: ReactNode;
  className?: string;
}
