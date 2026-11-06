"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Image,
} from "@pimolu/react";

export function ArenaHeroBlock() {
  const [open, setOpen] = useState(false);
  return (
    <section className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border">
      <Image
        src="/images/pimolu-atmosphere.webp"
        alt="An imagined world of sculptural arches and reflective light"
        aspectRatio="21 / 9"
        containerStyle={{
          width: "100%",
        }}
        rounded="none"
      />
      <div className="grid gap-6 p-6 sm:p-10 md:grid-cols-2 md:items-center">
        <header className="space-y-4">
          <Badge variant="primary">ORBIT / A FICTIONAL ADVENTURE</Badge>
          <h2 className="text-3xl sm:text-5xl font-semibold uppercase tracking-tight">
            Your world.
            <br />
            Your next move.
          </h2>
        </header>
        <div className="space-y-5">
          <p className="text-muted">
            Explore a world built for the curious. A campaign composition for your next
            game or community launch.
          </p>
          <Button
            onClick={(event) => {
              event.currentTarget.focus();
              setOpen(true);
            }}
          >
            Explore the adventure
          </Button>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inside the Orbit concept</DialogTitle>
          </DialogHeader>
          <p className="leading-relaxed">
            Discover new places, build a home and meet your squad. This is sample
            campaign content, not a released game. Replace this panel with real gameplay
            details or your launch information.
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
}
