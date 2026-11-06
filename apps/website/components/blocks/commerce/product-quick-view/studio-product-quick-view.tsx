"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Image,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@pimolu/react";

export function StudioProductQuickViewBlock() {
  const [message, setMessage] = useState("");
  const products = [
    {
      id: "studio",
      name: "Studio Headphones",
      price: 129,
      image: "/images/pimolu-studio.webp",
      category: "Audio",
    },
    {
      id: "orbit",
      name: "Orbit Art Print",
      price: 39,
      image: "/images/pimolu-atmosphere.webp",
      category: "Art",
    },
    {
      id: "edition",
      name: "Studio Limited",
      price: 159,
      image: "/images/pimolu-studio.webp",
      category: "Audio",
    },
  ];
  const [selected, setSelected] = useState(products[0]);
  const [open, setOpen] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Product quick view
        </h2>
      </header>
      <div className="grid gap-5 md:grid-cols-3">
        {products.map((p) => (
          <Card key={p.id} className="space-y-4 p-4">
            <Image
              src={p.image}
              alt={p.name + " illustrative artwork"}
              aspectRatio="4 / 3"
              containerStyle={{
                width: "100%",
              }}
            />
            <h3 className="text-xl">{p.name}</h3>
            <Button
              appearance="outline"
              onClick={(e) => {
                e.currentTarget.focus();
                setSelected(p);
                setOpen(true);
              }}
            >
              Quick view {p.name}
            </Button>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 sm:grid-cols-2">
            <Image
              src={selected.image}
              alt={selected.name + " illustrative artwork"}
              aspectRatio="4 / 3"
              containerStyle={{
                width: "100%",
              }}
            />
            <div className="space-y-4">
              <Badge>{selected.category}</Badge>
              <p className="text-2xl">{"$" + selected.price}</p>
              <p className="text-muted">
                A balanced frame and soft cushions for your listening space.
              </p>
              <Button
                onClick={() => {
                  setMessage(selected.name + " added locally.");
                  setOpen(false);
                }}
              >
                Add selected product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
