import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, Button, Dialog, DialogTrigger, DialogContent, DialogTitle, Drawer, DrawerTrigger, DrawerContent, DrawerTitle, PimoluAnimationProvider, Tabs, TabsList, TabsTrigger, TabsContent } from "@pimolu/react";
import { MotionButton, MotionCard, motionEngine, pimoluMotionPresets } from "@pimolu/motion";
import { Section } from "./section";

export function AnimationComparison() {
  const [engine, setEngine] = useState<"css" | "motion">("css");
  const [order, setOrder] = useState(["Design", "Build", "Review"]);
  const Action = engine === "motion" ? MotionButton : Button;
  return <Section title="CSS and Motion comparison" hint="The same five components. CSS handles ordinary feedback; opt into Motion for springs and coordinated layout changes.">
    <div className="pg-row" role="group" aria-label="Comparison engine">
      <Button aria-pressed={engine === "css"} onClick={() => setEngine("css")}>Compare CSS</Button>
      <Button aria-pressed={engine === "motion"} onClick={() => setEngine("motion")}>Compare Motion</Button>
    </div>
    <div data-testid="animation-comparison" data-engine={engine} className="pg-stack">
      <PimoluAnimationProvider engine={engine === "motion" ? motionEngine : "css"}>
        <div className="pg-stack">
          <div className="pg-row">
            <Action {...(engine === "motion" ? pimoluMotionPresets.press : {})}>Benchmark Button</Action>
            <Dialog><DialogTrigger><Button>Benchmark Dialog</Button></DialogTrigger><DialogContent><DialogTitle>Comparison dialog</DialogTitle><p>Test Escape, focus and repeated opening.</p></DialogContent></Dialog>
            <Drawer><DrawerTrigger><Button>Benchmark Drawer</Button></DrawerTrigger><DrawerContent><DrawerTitle>Comparison drawer</DrawerTitle><p>Test dismissal and focus restoration.</p></DrawerContent></Drawer>
          </div>
          <Tabs defaultValue="one"><TabsList><TabsTrigger value="one">Benchmark tab one</TabsTrigger><TabsTrigger value="two">Benchmark tab two</TabsTrigger></TabsList><TabsContent value="one">First comparison panel</TabsContent><TabsContent value="two">Second comparison panel</TabsContent></Tabs>
          <Accordion type="single" collapsible><AccordionItem value="details"><AccordionTrigger>Benchmark Accordion</AccordionTrigger><AccordionContent>Content remains readable with reduced motion.</AccordionContent></AccordionItem></Accordion>
        </div>
      </PimoluAnimationProvider>
      <h3>Coordinated reordering</h3>
      <p>Buttons reorder the real data. Motion animates positions; the CSS mode applies the same change immediately.</p>
      <div className="pg-stack" aria-label="Project stages">
        {order.map((name, index) => <MotionCard key={name} {...(engine === "motion" ? pimoluMotionPresets.layout : { layout: false })} style={{ padding: 16 }}>
          <div className="pg-row pg-row--between"><span>{name}</span><Button size="sm" disabled={index === 0} aria-label={`Move ${name} up`} onClick={() => setOrder(previous => { const next = [...previous]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; return next; })}>Move up</Button></div>
        </MotionCard>)}
      </div>
      <p role="status">Stage order: {order.join(", ")}</p>
    </div>
  </Section>;
}
