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
}

export interface PimoluDropdownMenuSeparatorProps {
  className?: string;
}

export interface PimoluDropdownMenuLabelProps {
  children: ReactNode;
  className?: string;
}
