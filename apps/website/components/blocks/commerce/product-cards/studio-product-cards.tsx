"use client";

import { useState } from "react";
import { Badge, Button, Card, Image } from "@pimolu/react";

export function StudioProductCardsBlock() {
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
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Product cards
        </h2>
      </header>
      <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <Image
            src="/images/pimolu-studio.webp"
            alt="Pimolu product artwork"
            aspectRatio="4 / 3"
            containerStyle={{
              width: "100%",
            }}
          />
          <h3 className="font-serif text-3xl">Listen a little closer.</h3>
          <p className="text-muted">Thoughtful objects for the everyday.</p>
        </div>
        <div className="space-y-4">
          {products.slice(1).map((p) => (
            <Card key={p.id} className="space-y-4 p-5">
              <Badge>{p.category}</Badge>
              <h3 className="text-2xl">{p.name}</h3>
              <p>{"$" + p.price}</p>
              <Button
                appearance="outline"
                onClick={() => setMessage(p.name + " added locally.")}
              >
                Choose {p.name}
              </Button>
            </Card>
          ))}
        </div>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
