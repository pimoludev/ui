"use client";

import { useState } from "react";
import { Button, Card, Image } from "@pimolu/react";

export function MarketProductCardsBlock() {
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
      <div className="grid gap-5 md:grid-cols-3">
        {products.map((p) => (
          <Card key={p.id} className="min-w-0 space-y-4 p-4">
            <Image
              src={p.image}
              alt={p.name + " illustrative artwork"}
              aspectRatio="4 / 3"
              containerStyle={{
                width: "100%",
              }}
            />
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="text-xl font-medium">{p.name}</h3>
              <span>{"$" + p.price}</span>
            </div>
            <Button onClick={() => setMessage(p.name + " added to the local bag.")}>
              Add to bag
            </Button>
          </Card>
        ))}
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
