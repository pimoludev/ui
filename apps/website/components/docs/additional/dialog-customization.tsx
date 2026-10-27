"use client";

import {
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@pimolu/react";

export function DemoExample() {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button appearance="outline">Project details</Button>
        </DialogTrigger>
        <DialogContent
          classNames={{
            content: "parts-dialog-panel",
            overlay: "parts-dialog-overlay",
            closeButton: "parts-dialog-close"
          }}
          style={{ maxWidth: "min(440px, calc(100vw - 32px))" }}
        >
          <DialogTitle>Make it yours</DialogTitle>
          <DialogDescription>Only this dialog uses these part classes.</DialogDescription>
        </DialogContent>
      </Dialog>
      <style>
        {
          `
.parts-dialog-panel {
  border-radius: 24px;
  border-color: var(--pimolu-primary);
}
.parts-dialog-overlay {
  background: color-mix(in srgb, var(--pimolu-background) 75%, transparent);
}
.parts-dialog-close {
  border-radius: 50%;
}
`
        }
      </style>
    </>
  );
}
