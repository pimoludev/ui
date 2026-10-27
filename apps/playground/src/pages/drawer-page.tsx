import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  Label,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function RightDrawer() {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button appearance="outline">Open project settings</Button>
      </DrawerTrigger>

      <DrawerContent side="right" size="md">
        <DrawerHeader>
          <DrawerTitle>Project settings</DrawerTitle>
          <DrawerDescription>
            The panel is modal: focus stays inside, the page
            stops scrolling and Escape returns focus to the
            trigger.
          </DrawerDescription>
        </DrawerHeader>

        <div className="pg-stack">
          <div className="pg-stack">
            <Label htmlFor="drawer-name">Name</Label>
            <Input id="drawer-name" defaultValue="Project Atlas" />
          </div>

          <div className="pg-stack">
            <Label htmlFor="drawer-slug">Slug</Label>
            <Input id="drawer-slug" defaultValue="project-atlas" />
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose>
            <Button appearance="ghost">Cancel</Button>
          </DrawerClose>

          <DrawerClose>
            <Button>Save changes</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function BottomDrawer() {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button appearance="outline">Share project</Button>
      </DrawerTrigger>

      <DrawerContent side="bottom" size="sm">
        <DrawerHeader>
          <DrawerTitle>Share this project</DrawerTitle>
          <DrawerDescription>
            Send a read-only link to a teammate.
          </DrawerDescription>
        </DrawerHeader>

        <div className="pg-row">
          <Input defaultValue="https://pimolu.dev/p/atlas" readOnly />
          <Button>Copy link</Button>
        </div>

        <DrawerFooter>
          <DrawerClose>
            <Button appearance="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ControlledDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <Button>Open controlled drawer</Button>
      </DrawerTrigger>

      <DrawerContent side="left" size="sm">
        <DrawerHeader>
          <DrawerTitle>Controlled</DrawerTitle>
          <DrawerDescription>
            The open state lives in the page.
          </DrawerDescription>
        </DrawerHeader>

        <p className="pg-copy">
          The drawer reports every request to close, including
          the overlay and Escape, so the parent stays the source
          of truth.
        </p>

        <DrawerFooter>
          <Button appearance="outline" onClick={() => setOpen(false)}>
            Close from the parent
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function CustomizedParts() {
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


export function DrawerPage() {
  return (
    <>
      <PageHeader
        title="Drawer"
        hint="A modal panel that slides from a viewport edge. It shares the overlay, focus trap, scroll lock and dismissal infrastructure, with four sides and three sizes. Styles come from @pimolu/web-styles/drawer.css."
      />

      <Section
        title="Right side"
        hint="The default placement, useful for a settings form that keeps the page context."
      >
        <RightDrawer />
      </Section>

      <Section
        title="Bottom sheet"
        hint="A short height for a task that benefits from the full width."
      >
        <BottomDrawer />
      </Section>

      <Section
        title="Controlled"
        hint="Side left, size sm, with the open state owned by the page."
      >
        <ControlledDrawer />
      </Section>

      <Section
        title="Examples"
        hint="Drawers are for focused tasks; the page underneath stays visible."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Use a drawer when</CardTitle>
              <CardDescription>
                The task needs more room than a dropdown and
                less commitment than a full page.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="pg-copy">
                The header, body and footer scroll independently
                when the content is long.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reuse the Dialog rules</CardTitle>
              <CardDescription>
                Same focus trap, scroll lock and accessible naming.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="pg-copy">
                A DrawerTitle names the panel; a
                DrawerDescription is announced after it.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
      <Section title="Named-part customization" hint="Add classes directly to stable parts, including portalled panels. Existing className props keep their targets.">
        <CustomizedParts />
      </Section>
    </>
  );
}
