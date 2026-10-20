import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface PimoluMenubarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  children: ReactNode;

  /** Accessible name of the menubar. Defaults to "Menu bar". */
  label?: string;
}

export interface PimoluMenubarMenuProps {
  children: ReactNode;

  className?: string;

  /**
   * Stable identity of the menu. Omit to let the component generate one.
   * Useful only when the same menu must be addressed programmatically.
   */
  value?: string;
}

export interface PimoluMenubarTriggerProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "type"
  > {
  children: ReactNode;
}

export interface PimoluMenubarContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  children: ReactNode;

  /** Distance from the trigger. Defaults to 4. */
  sideOffset?: number;
}

export interface PimoluMenubarItemProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "onSelect"
  > {
  children: ReactNode;

  /** Runs before the menu closes and returns focus to its trigger. */
  onSelect?: () => void;
}

export interface PimoluMenubarSeparatorProps {
  className?: string;
}

export interface PimoluMenubarLabelProps {
  children: ReactNode;
  className?: string;
}
