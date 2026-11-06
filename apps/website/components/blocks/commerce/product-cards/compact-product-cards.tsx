"use client";

import { useState } from "react";
import { Badge, Button, Card, Image } from "@pimolu/react";

export function CompactProductCardsBlock() {
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
      <div className="space-y-4">
        {products.map((p) => (
          <Card
            key={p.id}
            className="grid gap-4 p-4 sm:grid-cols-[9rem_1fr] sm:items-center"
          >
            <Image
              src={p.image}
              alt={p.name + " illustrative artwork"}
              aspectRatio="4 / 3"
              containerStyle={{
                width: "100%",
              }}
            />
            <div className="space-y-3">
              <Badge>{p.category}</Badge>
              <h3 className="text-xl">{p.name}</h3>
              <p>{"$" + p.price}</p>
              <Button
                appearance="outline"
                onClick={() => setMessage(p.name + " added locally.")}
              >
                Add {p.name}
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
