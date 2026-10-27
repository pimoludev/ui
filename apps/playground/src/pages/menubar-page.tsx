import { CustomizationExample } from "./menubar-customization-demo";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function EditorMenubar({
  onAction,
}: {
  onAction: (action: string) => void;
}) {
  return (
    <Menubar aria-label="Project menu">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>

        <MenubarContent>
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

        <MenubarContent>
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

        <MenubarContent>
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

        <MenubarContent>
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

function WorkspaceMenubar() {
  return (
    <Menubar aria-label="Workspace menu">
      <MenubarMenu>
        <MenubarTrigger>Acme</MenubarTrigger>

        <MenubarContent>
          <MenubarLabel>Workspace</MenubarLabel>
          <MenubarItem>Preferences…</MenubarItem>
          <MenubarItem>Members</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Sign out</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Reports</MenubarTrigger>

        <MenubarContent>
          <MenubarItem>Q3 summary</MenubarItem>
          <MenubarItem>Revenue</MenubarItem>
          <MenubarItem>Churn</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger disabled>Admin</MenubarTrigger>

        <MenubarContent>
          <MenubarItem>Audit log</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export function MenubarPage() {
  const [lastAction, setLastAction] = useState(
    "Nothing selected yet"
  );

  return (
    <>
      <PageHeader
        title="Menubar"
        hint="A horizontal application menu. ArrowLeft and ArrowRight move between top-level menus, ArrowDown opens the focused menu, Escape closes it and returns focus to the trigger, and an outside click dismisses it. Panels are portalled into the active theme scope. Styles come from @pimolu/web-styles/menubar.css."
      />

      <Section
        title="Application menu"
        hint="The menubar owns a single tab stop. Inside a panel, ArrowUp and ArrowDown cycle through enabled items; disabled entries are skipped."
      >
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

            <Badge variant="neutral">{lastAction}</Badge>
          </div>

          <p className="pg-copy">
            Open a menu and choose an item: the panel closes,
            focus returns to the trigger and the chosen command
            is reported here.
          </p>
        </div>
      </Section>

      <Section
        title="In context"
        hint="Menubar fits a document editor or a desktop-style workspace. Here it shares a header with a primary action."
      >
        <Card>
          <CardHeader>
            <div
              className="pg-row pg-row--between"
              style={{ flexWrap: "wrap" }}
            >
              <EditorMenubar
                onAction={(action) =>
                  setLastAction(`Project · ${action}`)
                }
              />

              <Button size="sm">Share</Button>
            </div>

            <CardTitle>Launch checklist</CardTitle>
            <CardDescription>
              A compact editing surface below the menu bar.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="pg-stack">
              <div className="pg-row pg-row--between">
                <span>Review the pricing page</span>
                <Badge variant="success">Done</Badge>
              </div>

              <div className="pg-row pg-row--between">
                <span>Record the onboarding tour</span>
                <Badge variant="warning">In progress</Badge>
              </div>

              <div className="pg-row pg-row--between">
                <span>Publish the release notes</span>
                <Badge variant="neutral">Todo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Compact workspace menu"
        hint="MenubarLabel groups related commands and a disabled trigger remains visible without opening."
      >
        <WorkspaceMenubar />
      </Section>

      <Section
        title="Keyboard model"
        hint="The same behaviour as desktop application menus."
      >
        <div className="pg-stack">
          <p className="pg-copy">
            <strong>Tab</strong> enters and leaves the menubar.{" "}
            <strong>ArrowLeft / ArrowRight</strong> move between
            menus. <strong>ArrowDown</strong> opens the focused
            menu. <strong>ArrowUp / ArrowDown</strong> move inside
            it. <strong>Home / End</strong> jump to the first or
            last entry. <strong>Escape</strong> closes and
            restores focus.
          </p>

          <p className="pg-meta">
            Items are real buttons with role="menuitem"; the panel
            is a portalled role="menu" labelled by its trigger.
          </p>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
