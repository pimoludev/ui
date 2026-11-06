"use client";

import { useState } from "react";
import {
  Button,
  Image,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@pimolu/react";

export function CompactProductGalleryBlock() {
  const [message] = useState("");
  const views = [
    {
      title: "Studio portrait",
      src: "/images/pimolu-studio.webp",
    },
    {
      title: "Orbit environment",
      src: "/images/pimolu-atmosphere.webp",
    },
    {
      title: "Creative workspace",
      src: "/images/blocks/studio-office.jpg",
    },
  ];
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Product gallery
        </h2>
      </header>
      <div className="grid gap-6 md:grid-cols-[14rem_1fr]">
        <div className="flex flex-col gap-3">
          {views.map((v, i) => (
            <Button
              key={v.title}
              appearance={active === i ? "solid" : "outline"}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              {v.title}
            </Button>
          ))}
          <p className="text-sm text-muted">
            Gallery views are original artwork and a credited studio photograph.
          </p>
        </div>
        <Image
          src={views[active].src}
          alt={views[active].title}
          aspectRatio="4 / 3"
          containerStyle={{
            width: "100%",
          }}
        />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{views[active].title}</DialogTitle>
          </DialogHeader>
          <Image
            src={views[active].src}
            alt={views[active].title}
            aspectRatio="4 / 3"
            containerStyle={{
              width: "100%",
            }}
          />
        </DialogContent>
      </Dialog>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
