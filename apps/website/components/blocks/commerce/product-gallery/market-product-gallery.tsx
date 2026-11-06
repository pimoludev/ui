"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Image,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@pimolu/react";

export function MarketProductGalleryBlock() {
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
      <div className="grid gap-5 sm:grid-cols-2">
        {views.map((v, i) => (
          <Card
            key={v.title}
            className={i === 0 ? "space-y-4 p-4 sm:col-span-2" : "space-y-4 p-4"}
          >
            <Image
              src={v.src}
              alt={v.title}
              aspectRatio="16 / 9"
              containerStyle={{
                width: "100%",
              }}
            />
            <Button
              appearance="outline"
              onClick={(e) => {
                e.currentTarget.focus();
                setActive(i);
                setOpen(true);
              }}
            >
              Enlarge {v.title}
            </Button>
          </Card>
        ))}
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
