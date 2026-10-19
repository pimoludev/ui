import type { ReactElement } from "react";

import type {
  PimoluDialogContentProps,
  PimoluDialogProps,
} from "../dialog/dialog.types";

export type PimoluAlertDialogProps = PimoluDialogProps;

export type PimoluAlertDialogContentProps = Omit<
  PimoluDialogContentProps,
  "role"
>;

export interface PimoluAlertDialogActionProps {
  /** Usually a Button; it closes the dialog when activated. */
  children: ReactElement;
}
