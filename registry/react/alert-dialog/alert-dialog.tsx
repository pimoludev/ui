"use client";

import type {
  PimoluAlertDialogActionProps,
  PimoluAlertDialogContentProps,
  PimoluAlertDialogProps,
} from "./alert-dialog.types";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog/dialog";

export function AlertDialog(props: PimoluAlertDialogProps) {
  return <Dialog {...props} />;
}

export { DialogTrigger as AlertDialogTrigger };

export function AlertDialogContent({
  children,
  ...props
}: PimoluAlertDialogContentProps) {
  return (
    <DialogContent
      closeOnOverlayClick={false}
      closeOnEscape={false}
      showCloseButton={false}
      {...props}
      role="alertdialog"
    >
      {children}
    </DialogContent>
  );
}

export {
  DialogHeader as AlertDialogHeader,
  DialogTitle as AlertDialogTitle,
  DialogDescription as AlertDialogDescription,
  DialogFooter as AlertDialogFooter,
};

export function AlertDialogAction({
  children,
}: PimoluAlertDialogActionProps) {
  return <DialogClose>{children}</DialogClose>;
}

export function AlertDialogCancel({
  children,
}: PimoluAlertDialogActionProps) {
  return <DialogClose>{children}</DialogClose>;
}
