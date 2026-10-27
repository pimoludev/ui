
import type { PimoluClassNames } from "../customization/customization.types";
import type { ReactElement, ReactNode } from "react";

import type { PimoluPopoverPlacement } from "../popover/popover.types";

export type PimoluPopconfirmVariant =
  | "default"
  | "destructive";

export interface PimoluPopconfirmProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"popconfirm">;

  /**
   * The element that opens the confirmation: any element, or a component
   * that passes down the props it receives. Focus returns to it when the
   * confirmation is resolved.
   */
  children: ReactElement;

  /** Question shown at the top of the panel. It names the dialog. */
  title: ReactNode;

  /** Optional explanation under the title. */
  description?: ReactNode;

  /** Label of the confirming action. Defaults to "Confirm". */
  confirmLabel?: ReactNode;

  /** Label of the cancelling action. Defaults to "Cancel". */
  cancelLabel?: ReactNode;

  /** Runs when the confirming action is pressed. */
  onConfirm?: () => void;

  /**
   * Runs when the confirmation is dismissed without confirming: the cancel
   * button, Escape, an outside click, or a second click on the trigger.
   */
  onCancel?: () => void;

  /** Destructive styling for irreversible actions. */
  variant?: PimoluPopconfirmVariant;

  /** Controlled open state. Omit to let the component own it. */
  open?: boolean;

  /** Initial open state when uncontrolled. Defaults to false. */
  defaultOpen?: boolean;

  /** Called whenever the component asks to open or close. */
  onOpenChange?: (open: boolean) => void;

  /** Preferred side of the trigger. Defaults to "bottom". */
  placement?: PimoluPopoverPlacement;

  /** Distance from the trigger, in pixels. Defaults to 8. */
  offset?: number;

  /** Never open. The trigger keeps its own disabled state. */
  disabled?: boolean;

  /** Custom icon; a warning glyph is used by default. */
  icon?: ReactNode;

  /** Class applied to the popover panel. */
  className?: string;
}
