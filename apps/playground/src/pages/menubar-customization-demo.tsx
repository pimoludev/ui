"use client";

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarLabel,
  MenubarItem,
  MenubarSeparator,
  Badge
} from "@pimolu/react";
import { useState } from "react";

function EditorMenubar({
  onAction,
}: {
  onAction: (action: string) => void;
}) {
  return (
    <Menubar
      aria-label="Project menu"
      classNames={{
        root: "custom-menubar-root",
        trigger: "custom-menubar-trigger"
      }}
    >
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent
          classNames={{
            root: "custom-menubar-root",
            trigger: "custom-menubar-trigger"
          }}
        >
          <MenubarLabel>Project</MenubarLabel>
          <MenubarItem
            onSelect={() => onAction("New window")}
          >
            New window
          </MenubarItem>
          <MenubarItem
            onSelect={() => onAction("Open project")}
          >
            Open…
          </MenubarItem>
          <MenubarItem
            onSelect={() => onAction("Save")}
          >
            Save
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem
            onSelect={() => onAction("Export as PDF")}
          >
            Export as PDF
          </MenubarItem>
          <MenubarItem disabled>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent
          classNames={{
            root: "custom-menubar-root",
            trigger: "custom-menubar-trigger"
          }}
        >
          <MenubarItem
            onSelect={() => onAction("Undo")}
          >
            Undo
          </MenubarItem>
          <MenubarItem
            onSelect={() => onAction("Redo")}
          >
            Redo
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem
            onSelect={() => onAction("Cut")}
          >
            Cut
          </MenubarItem>
          <MenubarItem
            onSelect={() => onAction("Copy")}
          >
            Copy
          </MenubarItem>
          <MenubarItem
            onSelect={() => onAction("Paste")}
          >
            Paste
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent
          classNames={{
            root: "custom-menubar-root",
            trigger: "custom-menubar-trigger"
          }}
        >
          <MenubarItem
            onSelect={() => onAction("Zoom in")}
          >
            Zoom in
          </MenubarItem>
          <MenubarItem
            onSelect={() => onAction("Zoom out")}
          >
            Zoom out
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem
            onSelect={() => onAction("Toggle full screen")}
          >
            Full screen
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent
          classNames={{
            root: "custom-menubar-root",
            trigger: "custom-menubar-trigger"
          }}
        >
          <MenubarItem
            onSelect={() => onAction("Open documentation")}
          >
            Documentation
          </MenubarItem>
          <MenubarItem
            onSelect={() => onAction("Keyboard shortcuts")}
          >
            Keyboard shortcuts
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem
            onSelect={() => onAction("About Acme Studio")}
          >
            About Acme Studio
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export function CustomizationExample() {
  const [lastAction, setLastAction] = useState(
    "Nothing selected yet"
  );
  return (
    <>
      {
        (<>
          <div className="pg-stack">
            <div
              className="pg-row pg-row--between"
              style={{ flexWrap: "wrap" }}
            >
              <EditorMenubar
                onAction={(action) =>
                  setLastAction(`File menu · ${action}`)
                }
              />
              <Badge variant="neutral">
                {lastAction}
              </Badge>
            </div>
            <p className="pg-copy">
              Open a menu and choose an item: the panel closes, focus returns
              to the trigger and the chosen command is reported here.
            </p>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-menubar-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-menubar-trigger {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
