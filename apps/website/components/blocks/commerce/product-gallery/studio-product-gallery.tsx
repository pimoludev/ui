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

export function StudioProductGalleryBlock() {
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
      <div className="space-y-5">
        <Image
          src={views[active].src}
          alt={views[active].title}
          aspectRatio="4 / 3"
          containerStyle={{
            width: "100%",
          }}
        />
        <div className="flex flex-wrap gap-3">
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
        </div>
        <p>{views[active].title}</p>
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
