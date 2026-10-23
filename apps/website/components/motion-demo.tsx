"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger, PimoluAnimationProvider } from "@pimolu/react";
import { MotionButton, MotionCard, MotionCombobox, motionEngine, pimoluMotionPresets } from "@pimolu/motion";
import { AnimatePresence } from "motion/react";

export function MotionDemo() {
  const [enabled, setEnabled] = useState(true);
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const reopenTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(reopenTimer.current), []);
  return <div className="rounded-xl border border-border p-6 flex flex-col gap-6" data-testid="motion-demo">
    <div className="flex flex-wrap items-center gap-4">
      <MotionButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring" }}>Try MotionButton</MotionButton>
      <Button appearance="outline" aria-pressed={enabled} onClick={() => setEnabled(!enabled)}>Global engine: {enabled ? "Motion" : "CSS"}</Button>
      <Button appearance="outline" onClick={() => setVisible(!visible)}>Toggle animated card</Button>
    </div>
    <AnimatePresence initial={false}>
      {visible && <MotionCard key="card" {...pimoluMotionPresets.reveal} data-testid="motion-card" style={{ padding: 20 }}>A Pimolu surface with an AnimatePresence exit.</MotionCard>}
    </AnimatePresence>
    <MotionCombobox label="Animated team selector" options={[{ value: "design", label: "Design" }, { value: "engineering", label: "Engineering" }]} defaultValue="design" whileHover={{ y: -2 }} style={{ maxWidth: 360 }} />
    <PimoluAnimationProvider engine={enabled ? motionEngine : "css"}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger><Button appearance="outline">Try the animated dialog</Button></DialogTrigger>
        <DialogContent>
          <DialogTitle>Same Pimolu. Optional Motion.</DialogTitle>
          <p>Escape, focus trapping and dismissal keep their Pimolu behavior.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <DialogClose><Button>Close example</Button></DialogClose>
            <Button appearance="outline" onClick={() => {
              clearTimeout(reopenTimer.current);
              setOpen(false);
              reopenTimer.current = setTimeout(() => setOpen(true), 50);
            }}>Reopen during exit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </PimoluAnimationProvider>
    <p className="text-sm text-muted">Motion is supplied by the application. The React library keeps CSS as its default.</p>
  </div>;
}
