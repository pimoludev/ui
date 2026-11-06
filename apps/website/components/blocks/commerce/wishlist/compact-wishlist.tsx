"use client";

import { useState } from "react";
import { Button, Card, Image } from "@pimolu/react";

export function CompactWishlistBlock() {
  const [message] = useState("");
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
  const [saved, setSaved] = useState(["studio", "orbit"]);
  const items = products.filter((p) => saved.includes(p.id));
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Wishlist</h2>
      </header>
      <p>{items.length} saved items</p>
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
              appearance={saved.includes(p.id) ? "solid" : "outline"}
              aria-pressed={saved.includes(p.id)}
              onClick={() =>
                setSaved(
                  saved.includes(p.id)
                    ? saved.filter((id) => id !== p.id)
                    : [...saved, p.id],
                )
              }
            >
              {saved.includes(p.id) ? "Saved " : "Save "}
              {p.name}
            </Button>
          </Card>
        ))}
      </div>
      {items.length === 0 && (
        <Button appearance="outline" onClick={() => setSaved(["studio", "orbit"])}>
          Restore sample wishlist
        </Button>
      )}
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
