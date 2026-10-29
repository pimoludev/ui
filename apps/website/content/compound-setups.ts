import type { ComponentSetup } from "./component-setups.ts";

const localRoot = "Keep the related parts inside the same root component. Each instance supplies its own context and state, so you can place independent instances wherever your screen needs them.";
const triggerChild = "A Trigger that wraps a control expects one element that forwards its props and ref. Pimolu Button supports this. The trigger supplies the event handlers and accessible state to that element.";
const controlledOpen = "Let the root own opening by omitting open, or supply both open and onOpenChange when application state owns it. The floating content handles its portal; the code below is the complete component assembly.";

export const compoundSetups: Record<string, ComponentSetup> = {
  dialog: {
    title: "Assemble a trigger and its dialog",
    paragraphs: [localRoot, triggerChild],
    examples: [{ filename: "details-dialog.tsx", code: `"use client";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@pimolu/react";

export function DetailsDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>View details</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Project details</DialogTitle>
        <DialogDescription>Review the project before continuing.</DialogDescription>
        <DialogClose>
          <Button>Done</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
` }],
    notes: [controlledOpen, "DialogTitle names the panel and DialogDescription supplies its supporting description. The dialog manages focus containment, Escape and focus restoration. DialogClose wraps your existing button."],
  },
  "alert-dialog": {
    title: "Connect the confirmation and cancel actions",
    paragraphs: [localRoot, "AlertDialog composes Dialog with alertdialog semantics. Include its title, description and an explicit cancel path. Action and Cancel wrap a single button and close the dialog when activated."],
    examples: [{ filename: "archive-confirmation.tsx", code: `"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@pimolu/react";

export function ArchiveConfirmation() {
  const [archived, setArchived] = useState(false);

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button>Archive draft</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Archive this draft?</AlertDialogTitle>
          <AlertDialogDescription>
            This example archives the draft in local state.
          </AlertDialogDescription>
          <div className="flex flex-wrap gap-3">
            <AlertDialogCancel>
              <Button appearance="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction>
              <Button onClick={() => setArchived(true)}>Archive</Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      <p role="status">{archived ? "Draft archived." : "Draft available."}</p>
    </>
  );
}
` }],
    notes: ["Escape, overlay dismissal and the corner close button default to disabled for AlertDialog. Keep Cancel visible. For asynchronous work that must finish before closing, control open/onOpenChange and handle pending state through your own button instead of closing immediately with AlertDialogAction."],
  },
  drawer: {
    title: "Assemble a drawer for one screen interaction",
    paragraphs: [localRoot, triggerChild],
    examples: [{ filename: "details-drawer.tsx", code: `"use client";

import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@pimolu/react";

export function DetailsDrawer() {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button>Open details</Button>
      </DrawerTrigger>
      <DrawerContent side="right">
        <DrawerTitle>Project details</DrawerTitle>
        <DrawerDescription>Review the current project.</DrawerDescription>
        <DrawerClose>
          <Button>Done</Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}
` }],
    notes: [controlledOpen, "Drawer supplies its modal overlay and focus management. Set side on DrawerContent. An ordinary Sidebar stays in the page layout; use a Drawer when mobile navigation needs a modal panel."],
  },
  "dropdown-menu": {
    title: "Keep each menu trigger and panel together",
    paragraphs: [localRoot, triggerChild],
    examples: [{ filename: "draft-menu.tsx", code: `"use client";

import { useState } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@pimolu/react";

export function DraftMenu() {
  const [message, setMessage] = useState("");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button>Draft actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setMessage("Draft selected.")}>
            Select draft
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p role="status">{message}</p>
    </>
  );
}
` }],
    notes: [controlledOpen, "Use onSelect for each command. Selecting an enabled item closes its menu; connect the callback to your application action."],
  },
  "context-menu": {
    title: "Provide a context target and a visible action path",
    paragraphs: [localRoot, "ContextMenuTrigger attaches the context-menu handler to its child. The menu supports the keyboard context-menu path on a focused target. Keep a visible action for touch users and anyone who does not discover right click."],
    examples: [{ filename: "draft-context-menu.tsx", code: `"use client";

import { useState } from "react";
import {
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@pimolu/react";

export function DraftContextMenu() {
  const [message, setMessage] = useState("");
  const select = () => setMessage("Draft selected.");

  return (
    <div className="grid gap-3">
      <ContextMenu>
        <ContextMenuTrigger>
          <Button appearance="outline">Right-click this draft</Button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={select}>Select draft</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <Button onClick={select}>Select draft</Button>
      <p role="status">{message}</p>
    </div>
  );
}
` }],
    notes: [controlledOpen, triggerChild],
  },
  "hover-card": {
    title: "Connect supplementary content to its trigger",
    paragraphs: [localRoot, triggerChild],
    examples: [{ filename: "profile-hover-card.tsx", code: `"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger, Link } from "@pimolu/react";

export function ProfileHoverCard() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Link href="/team/ada">Ada Lovelace</Link>
      </HoverCardTrigger>
      <HoverCardContent label="About Ada Lovelace">
        <p>Product engineer on the design system team.</p>
      </HoverCardContent>
    </HoverCard>
  );
}
` }],
    notes: ["Name HoverCardContent with label or labelledBy. Keep the profile link useful by itself: the card supplements the trigger with details. For actions users must reach reliably on touch devices, compose a Popover or Dialog."],
  },
  popover: {
    title: "Supply a trigger and a named panel",
    paragraphs: ["Popover receives its panel through content and wraps one trigger child. Name the panel with label or labelledBy. Its trigger and panel belong to that single Popover instance.", triggerChild],
    examples: [{ filename: "project-popover.tsx", code: `"use client";

import { Button, Input, Popover } from "@pimolu/react";

export function ProjectPopover() {
  return (
    <Popover
      label="Project note"
      content={<Input label="Note" placeholder="Add a note" />}
    >
      <Button>Add project note</Button>
    </Popover>
  );
}
` }],
    notes: [controlledOpen, "Popover allows interactive content and keeps its panel open during editing by default. closeOnSelect closes on clicks bubbling from the content; enable it for action lists rather than a form that needs several interactions."],
  },
  accordion: {
    title: "Group triggers and panels by item",
    paragraphs: [localRoot, "The hierarchy is `Accordion → AccordionItem → AccordionTrigger + AccordionContent`. Each item has a unique value. The trigger renders its own button, so give it a label directly."],
    examples: [{ filename: "help-accordion.tsx", code: `"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@pimolu/react";

export function HelpAccordion() {
  return (
    <Accordion type="single" collapsible defaultValue="usage">
      <AccordionItem value="usage">
        <AccordionTrigger>How do I get started?</AccordionTrigger>
        <AccordionContent>Install Pimolu and load its shared styles.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="themes">
        <AccordionTrigger>Can I change the theme?</AccordionTrigger>
        <AccordionContent>Choose a preset through PimoluProvider.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
` }],
    notes: ["Single mode uses one string value. Multiple mode uses an array of strings. Use defaultValue for initial selection, or value/onValueChange for application-owned expansion. collapsible allows the open single item to close."],
  },
  menubar: {
    title: "Give each application menu its own group",
    paragraphs: [localRoot, "The hierarchy is `Menubar → MenubarMenu → MenubarTrigger + MenubarContent`. MenubarItem belongs inside the content. These triggers and items render buttons, so supply their text directly."],
    examples: [{ filename: "application-menu.tsx", code: `"use client";

import { useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@pimolu/react";

export function ApplicationMenu() {
  const [message, setMessage] = useState("");

  return (
    <>
      <Menubar label="Application commands">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => setMessage("New draft requested.")}>
              New draft
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <p role="status">{message}</p>
    </>
  );
}
` }],
    notes: ["Add another MenubarMenu for each top-level menu. Menubar coordinates arrow navigation between its menus and handles panel portals. Run application commands through item onSelect callbacks."],
  },
  "navigation-menu": {
    title: "Group destination links under their trigger",
    paragraphs: [localRoot, "The hierarchy is `NavigationMenu → NavigationMenuList → NavigationMenuItem`. Place that item's Trigger and Content together inside it. Use a stable value for each item and real hrefs for destination links."],
    examples: [{ filename: "resources-navigation.tsx", code: `"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@pimolu/react";

export function ResourcesNavigation() {
  return (
    <NavigationMenu label="Resources">
      <NavigationMenuList>
        <NavigationMenuItem value="learn">
          <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/docs">Documentation</NavigationMenuLink>
            <NavigationMenuLink href="/components">Components</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
` }],
    notes: ["NavigationMenuTrigger renders a button. NavigationMenuLink renders an anchor. Preserve those semantics when adding content, and keep command actions in the appropriate application menu."],
  },
  tabs: {
    title: "Match each trigger to its panel",
    paragraphs: [localRoot, "Place triggers in TabsList and panels alongside it under Tabs. The value on each trigger must match exactly one panel value. defaultValue selects the first visible panel."],
    examples: [{ filename: "project-tabs.tsx", code: `"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@pimolu/react";

export function ProjectTabs() {
  return (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Project sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Your project overview.</TabsContent>
      <TabsContent value="activity">Your recent activity.</TabsContent>
    </Tabs>
  );
}
` }],
    notes: ["Use value/onValueChange when your application owns the active panel. The root connects keyboard navigation and ARIA relationships. The basic composition above works in beta.3.1; animated and the sliding-indicator customizations documented below await the next npm release."],
  },
  "toggle-group": {
    title: "Let the group coordinate its items",
    paragraphs: [localRoot, "ToggleGroupItem needs its ToggleGroup context. Use type=single with a string value for exclusive choices, or type=multiple with an array for independent choices."],
    examples: [{ filename: "formatting-toggles.tsx", code: `"use client";

import { ToggleGroup, ToggleGroupItem } from "@pimolu/react";

export function FormattingToggles() {
  return (
    <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Formatting">
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
    </ToggleGroup>
  );
}
` }],
    notes: ["Use value/onValueChange to apply the selection to your editor or other application state. The group supplies the shared selection and keyboard navigation; the example itself stores selection internally."],
  },
  toolbar: {
    title: "Use toolbar parts for coordinated keyboard navigation",
    paragraphs: [localRoot, "Toolbar supplies its keyboard navigation context. Compose ToolbarButton, ToolbarLink and ToolbarGroup within it. A ToolbarToggleItem additionally belongs inside ToolbarToggleGroup."],
    examples: [{ filename: "editor-toolbar.tsx", code: `"use client";

import {
  Toolbar,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from "@pimolu/react";

export function EditorToolbar() {
  return (
    <Toolbar label="Editor formatting">
      <ToolbarToggleGroup type="multiple" aria-label="Text style">
        <ToolbarToggleItem value="bold">Bold</ToolbarToggleItem>
        <ToolbarToggleItem value="italic">Italic</ToolbarToggleItem>
      </ToolbarToggleGroup>
    </Toolbar>
  );
}
` }],
    notes: ["The toggle group reports formatting choices through onValueChange. Connect those choices to your editor. ToolbarButton provides a toolbar action; it uses native button onClick for the application callback."],
  },
  stepper: {
    title: "Connect the current step to application state",
    paragraphs: [localRoot, "StepperItem reads the active step from Stepper. Step numbers start at 1. Enable clickable if users can select a step, and update activeStep through onStepChange when controlling it."],
    examples: [{ filename: "setup-steps.tsx", code: `"use client";

import { useState } from "react";
import { Stepper, StepperItem } from "@pimolu/react";

export function SetupSteps() {
  const [step, setStep] = useState(1);

  return (
    <>
      <Stepper
        aria-label="Project setup"
        activeStep={step}
        onStepChange={setStep}
        clickable
      >
        <StepperItem step={1} title="Details" />
        <StepperItem step={2} title="Review" />
      </Stepper>
      <p role="status">Current step: {step}</p>
    </>
  );
}
` }],
    notes: ["Stepper displays progress and selection. Render each step's actual form or content in your application, and validate it before advancing when your workflow requires validation."],
  },
  "input-group": {
    title: "Compose one field from its group parts",
    paragraphs: ["InputGroup shares sizing, disabled and invalid state with InputGroupInput and InputGroupButton. Use those parts when adding an addon or adjacent action so the group keeps one coherent field surface.", "Provide the field's accessible name with a visible Label and matching id. An addon is supporting content; it does not supply the input's accessible name."],
    examples: [{ filename: "website-field.tsx", code: `"use client";

import { InputGroup, InputGroupAddon, InputGroupInput, Label } from "@pimolu/react";
import { useId } from "react";

export function WebsiteField() {
  const id = useId();

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>Website domain</Label>
      <InputGroup>
        <InputGroupAddon>https://</InputGroupAddon>
        <InputGroupInput id={id} name="domain" placeholder="example.com" />
      </InputGroup>
    </div>
  );
}
` }],
    notes: ["InputGroupInput accepts native input props and can be registered with useForm. The group handles presentation; your form owns the field value and submission."],
  },
  radio: {
    title: "Share selection through RadioGroup",
    paragraphs: ["RadioGroup supplies its child radios with a shared name, selection and change handling. It also renders a fieldset and legend from label. Give every Radio a unique value and a visible label.", "Use defaultValue for an internally managed choice, or value/onValueChange when application state owns selection. A standalone Radio can also use native checked/name/onChange props."],
    examples: [{ filename: "delivery-choice.tsx", code: `"use client";

import { Radio, RadioGroup } from "@pimolu/react";

export function DeliveryChoice() {
  return (
    <RadioGroup name="delivery" label="Delivery" defaultValue="standard">
      <Radio value="standard" label="Standard" />
      <Radio value="express" label="Express" />
    </RadioGroup>
  );
}
` }],
    notes: ["Set name when the selected value must be included under a predictable key in native FormData. Selection controls the local field; connect order processing and persistence in your application."],
  },
  "focus-scope": {
    title: "Activate managed focus only during the interaction",
    paragraphs: ["FocusScope moves focus inside when active and can keep Tab navigation within its children. It restores the previous focus when deactivated or unmounted. Always provide a reachable way to finish the interaction.", "Dialog and Drawer already manage focus. Use FocusScope for your own temporary interaction, and set trapped={false} when you only need initial focus without containing Tab."],
    examples: [{ filename: "temporary-editor.tsx", code: `"use client";

import { useState } from "react";
import { Button, FocusScope, Input } from "@pimolu/react";

export function TemporaryEditor() {
  const [editing, setEditing] = useState(false);

  return (
    <div className="grid gap-3">
      <Button onClick={() => setEditing(true)}>Edit project</Button>
      {
        editing && (
          <FocusScope className="grid gap-3">
            <Input label="Project name" />
            <Button onClick={() => setEditing(false)}>Finish editing</Button>
          </FocusScope>
        )
      }
    </div>
  );
}
` }],
    notes: ["FocusScope supplies focus behavior. Your application supplies semantics, dismissal and visibility. In this example the opener stays mounted so focus can return to it when editing finishes."],
  },
  navbar: {
    title: "Connect the mobile toggle to its navigation",
    paragraphs: [localRoot, "NavbarToggle reads its Navbar's menu state. Enable collapsible on the root and place the toggle, brand, content and actions within it. The toggle handles the open/close interaction for that navigation."],
    examples: [{ filename: "site-navigation.tsx", code: `"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarToggle,
} from "@pimolu/react";

export function SiteNavigation() {
  return (
    <Navbar collapsible>
      <NavbarBrand href="/">Pimolu</NavbarBrand>
      <NavbarToggle openLabel="Open navigation" closeLabel="Close navigation" />
      <NavbarContent aria-label="Main navigation">
        <NavbarItem href="/docs">Documentation</NavbarItem>
        <NavbarItem href="/components">Components</NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
` }],
    notes: ["For application-owned opening, supply open/onOpenChange on Navbar. Close it on route changes when needed. Navbar lays out navigation and its responsive menu; destination handling belongs to your router."],
  },
  sidebar: {
    title: "Keep identity and navigation inside the sidebar",
    paragraphs: [localRoot, "Enable collapsible for the built-in toggle. SidebarHeader, SidebarContent and SidebarFooter receive the collapsed state. Use collapsedContent to keep a compact identity or profile visible in the collapsed rail."],
    examples: [{ filename: "workspace-sidebar.tsx", code: `"use client";

import {
  Avatar,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
} from "@pimolu/react";

export function WorkspaceSidebar() {
  return (
    <Sidebar collapsible>
      <SidebarHeader collapsedContent={<span>P</span>}>Pimolu workspace</SidebarHeader>
      <SidebarContent aria-label="Workspace navigation">
        <SidebarItem href="/projects" icon={<span>▦</span>}>Projects</SidebarItem>
        <SidebarItem href="/activity" icon={<span>◷</span>}>Activity</SidebarItem>
      </SidebarContent>
      <SidebarFooter collapsedContent={<Avatar name="Ada Lovelace" size="sm" />}>
        Ada Lovelace
      </SidebarFooter>
    </Sidebar>
  );
}
` }],
    notes: ["Use collapsed/onCollapsedChange when a surrounding layout controls the rail. Supply icons so collapsed items stay recognizable. collapseOnMobile changes the responsive default; compose a Drawer when the navigation should open as a modal mobile panel."],
  },
};
