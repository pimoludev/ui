"use client";

import {
  Button,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription
} from "@pimolu/react";

export function DemoExample() {
  return (
    <>
      <Drawer>
        <DrawerTrigger>
          <Button appearance="outline">Project preferences</Button>
        </DrawerTrigger>
        <DrawerContent
          classNames={{
            content: "parts-drawer-panel",
            overlay: "parts-drawer-overlay",
            closeButton: "parts-drawer-close"
          }}
          style={{ maxWidth: "min(420px, 100vw)" }}
        >
          <DrawerTitle>Workspace preferences</DrawerTitle>
          <DrawerDescription>
            A local panel style, with the same focus and Escape behavior.
          </DrawerDescription>
        </DrawerContent>
      </Drawer>
      <style>
        {
          `
.parts-drawer-panel {
  border-color: var(--pimolu-primary);
}
.parts-drawer-overlay {
  background: color-mix(in srgb, var(--pimolu-background) 75%, transparent);
}
.parts-drawer-close {
  border-radius: 50%;
}
`
        }
      </style>
    </>
  );
}
