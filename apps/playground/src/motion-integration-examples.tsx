import { useState } from "react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
  Button, CardContent, CardHeader, CardTitle,
  Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose,
  Drawer, DrawerContent, DrawerTitle, DrawerTrigger,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  PimoluProvider, Popover, Tabs, TabsList, TabsTrigger, TabsContent,
  Tooltip, toast,
} from "@pimolu/react";
import { MotionButton, MotionCard, MotionCombobox, MotionProvider, motionEngine } from "@pimolu/motion";
import { Section } from "./section";
import { AnimationComparison } from "./animation-comparison";

export function MotionIntegrationExamples() {
  const [enabled, setEnabled] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [choice, setChoice] = useState("design");
  return (
    <>
      <AnimationComparison />
      <Section title="Explicit animation" hint="MotionButton animates its native button. Disabled and loading controls suppress interactive gestures.">
        <div className="pg-row">
          <MotionButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring" }} disabled={disabled}>Animated action</MotionButton>
          <MotionButton loading whileTap={{ scale: 0.95 }}>Saving</MotionButton>
          <Button appearance="outline" onClick={() => setDisabled(!disabled)}>Toggle disabled</Button>
        </div>
        <MotionCard style={{ maxWidth: 420 }} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 250, damping: 24 }}>
          <CardHeader><CardTitle>A real Pimolu card</CardTitle></CardHeader>
          <CardContent>Tokens, presets and component props stay the same.</CardContent>
        </MotionCard>
      </Section>
      <Section title="Composite controls" hint="A separate Motion surface preserves the original input ref and field behavior.">
        <MotionCombobox label="Team" options={[{ value: "design", label: "Design" }, { value: "engineering", label: "Engineering" }]} value={choice} onValueChange={setChoice} whileHover={{ y: -2 }} style={{ maxWidth: 360 }} />
        <p role="status">Selected team: {choice}</p>
      </Section>
      <Section title="Global engine and portal lifecycle" hint="Classic Pimolu components inherit the driver. Focus, Escape, positioning and dismissal remain owned by Pimolu. Use the toolbar to try the engine on every component page.">
        <Button appearance="outline" onClick={() => setEnabled(!enabled)}>Use {enabled ? "CSS" : "Motion"} in this section</Button>
        <PimoluProvider animationEngine={enabled ? motionEngine : "css"} className="pg-stack">
          <div className="pg-row">
            <Dialog><DialogTrigger><Button>Open Motion dialog</Button></DialogTrigger><DialogContent><DialogTitle>Keep the interaction intact</DialogTitle><p>Escape or close to test the exit and focus restoration.</p><DialogClose><Button>Close dialog</Button></DialogClose></DialogContent></Dialog>
            <Drawer><DrawerTrigger><Button appearance="outline">Open Motion drawer</Button></DrawerTrigger><DrawerContent><DrawerTitle>Your workspace</DrawerTitle><p>Motion animates the surface; Pimolu manages its modal behavior.</p></DrawerContent></Drawer>
            <Popover label="Motion popover" content={<p>A positioned panel with an animated exit.</p>}><Button appearance="outline">Open Motion popover</Button></Popover>
            <DropdownMenu><DropdownMenuTrigger><Button appearance="outline">Motion menu</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onSelect={() => toast({ title: "Action selected" })}>Notify me</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
            <Tooltip content="A real Pimolu tooltip"><Button appearance="outline">Hover or focus</Button></Tooltip>
          </div>
          <Tabs defaultValue="overview"><TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList><TabsContent value="overview">Your workspace at a glance.</TabsContent><TabsContent value="activity">Everything is up to date.</TabsContent></Tabs>
          <Accordion type="single" collapsible><AccordionItem value="details"><AccordionTrigger>What changes with reduced motion?</AccordionTrigger><AccordionContent>Spatial gestures stop and retained panels close immediately. Try your operating system preference.</AccordionContent></AccordionItem></Accordion>
          <PimoluProvider animationEngine="css"><Button appearance="outline">CSS-only nested section</Button></PimoluProvider>
        </PimoluProvider>
      </Section>
      <Section title="MotionProvider alternative" hint="Use the standalone provider when theme configuration is already supplied higher in the tree.">
        <MotionProvider><Button onClick={() => toast({ title: "Motion is optional", description: "No Motion dependency is added to @pimolu/react." })}>Show notification</Button></MotionProvider>
      </Section>
    </>
  );
}
