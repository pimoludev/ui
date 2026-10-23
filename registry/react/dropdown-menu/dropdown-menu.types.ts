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
  children: ReactNode;
  /** Distance from the trigger. Defaults to 6. */
  sideOffset?: number;
  align?: "start" | "end";
  className?: string;
}

export interface PimoluDropdownMenuItemProps {
  children: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}

export interface PimoluDropdownMenuSeparatorProps {
  className?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}

export interface PimoluDropdownMenuLabelProps {
  children: ReactNode;
  className?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}
