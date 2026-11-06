"use client";

import { useState } from "react";
import { Badge, Button, Card, Image } from "@pimolu/react";

export function ProductComparisonBlock() {
  const [selected, setSelected] = useState("");
  return (
    <section className="mx-auto max-w-5xl space-y-8 p-6 sm:p-10">
      <header className="space-y-4 text-center">
        <Badge>STUDIO / SIDE BY SIDE</Badge>
        <h2 className="font-serif text-3xl sm:text-4xl">Find your listening style.</h2>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {[
          {
            name: "Studio Everyday",
            price: 129,
            battery: "24 hours",
            weight: "240 g",
          },
          {
            name: "Studio Extended",
            price: 179,
            battery: "36 hours",
            weight: "270 g",
          },
        ].map((p) => (
          <Card key={p.name} className="space-y-4 p-6">
            <Image
              src="/images/pimolu-studio.webp"
              alt="Illustrative headphones, shared demo artwork for both models"
              aspectRatio="16 / 9"
              containerStyle={{
                width: "100%",
              }}
            />
            <h3 className="text-2xl">{p.name}</h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <dt>Price</dt>
              <dd>${p.price}</dd>
              <dt>Sample battery life</dt>
              <dd>{p.battery}</dd>
              <dt>Sample weight</dt>
              <dd>{p.weight}</dd>
            </dl>
            <Button
              fullWidth
              appearance={selected === p.name ? "solid" : "outline"}
              aria-pressed={selected === p.name}
              onClick={() => setSelected(p.name)}
            >
              Choose {p.name}
            </Button>
          </Card>
        ))}
      </div>
      <p role="status" className="text-sm text-muted">
        {selected
          ? selected + " selected for this preview."
          : "Choose a model to compare your preference."}
      </p>
    </section>
  );
}
