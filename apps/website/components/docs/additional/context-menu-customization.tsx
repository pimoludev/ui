"use client";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuSeparator
} from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <ContextMenu>
            <ContextMenuTrigger>
              <div className="p-6 bg-surface border border-border rounded-md">
                Right-click this panel to open the project menu.
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent
              classNames={{
                root: "custom-context-menu-root",
                label: "custom-context-menu-label"
              }}
            >
              <ContextMenuLabel>Project</ContextMenuLabel>
              <ContextMenuItem>Open</ContextMenuItem>
              <ContextMenuItem>Rename</ContextMenuItem>
              <ContextMenuItem>Duplicate</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem disabled>Archive</ContextMenuItem>
              <ContextMenuItem>Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </>)
      }
      <style>
        {
          `
.custom-context-menu-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-context-menu-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
