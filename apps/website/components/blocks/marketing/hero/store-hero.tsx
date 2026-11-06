"use client";

import { useState } from "react";
import { Badge, Button, Image } from "@pimolu/react";

export function StoreHeroBlock() {
  const [quantity, setQuantity] = useState(0);
  return (
    <section className="mx-auto grid max-w-5xl gap-8 p-6 sm:p-10 md:grid-cols-2 md:items-center">
      <header className="space-y-6">
        <Badge>THE STUDIO COLLECTION / 01</Badge>
        <h2 className="font-serif text-3xl sm:text-5xl">
          Find your
          <br />
          <em className="text-primary">own rhythm.</em>
        </h2>
        <p className="max-w-sm text-muted">
          A little focus. A favorite record. Room for the moments in between.
        </p>
        <p className="text-xl">Studio headphones · $129</p>
        <Button onClick={() => setQuantity(quantity + 1)}>Add headphones to bag</Button>
        <p role="status" className="text-sm text-muted">
          {quantity
            ? quantity + " in your local bag · $" + quantity * 129
            : "Fictional product. No checkout or payment."}
        </p>
        {quantity > 0 && (
          <Button appearance="ghost" onClick={() => setQuantity(0)}>
            Empty preview bag
          </Button>
        )}
      </header>
      <Image
        src="/images/pimolu-studio.webp"
        alt="Pimolu studio headphones on a sculptural stand"
        aspectRatio="1 / 1"
        containerStyle={{
          width: "100%",
        }}
      />
    </section>
  );
}
