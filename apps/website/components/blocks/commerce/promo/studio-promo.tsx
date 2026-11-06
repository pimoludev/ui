"use client";

import { useState } from "react";
import { Badge, Button, Card, Image } from "@pimolu/react";

export function StudioPromoBlock() {
  const [message, setMessage] = useState("");
  const [applied, setApplied] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Promotions
        </h2>
      </header>
      <Card className="grid gap-6 border-primary bg-primary/10 p-6 sm:p-10 md:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <Badge>STUDIO OFFER / DEMO</Badge>
          <h3 className="font-serif text-3xl">
            A little thank you.
            <br />
            10% for your next idea.
          </h3>
          <p className="text-sm text-muted">Your next listening space, for less.</p>
          <Button
            onClick={() => {
              setApplied(true);
              setMessage("Demo offer applied. Bag total is $116.10 before tax.");
            }}
          >
            {applied ? "Offer applied" : "Apply 10% offer"}
          </Button>
        </div>
        <Image
          src="/images/pimolu-studio.webp"
          alt="Pimolu product artwork"
          aspectRatio="4 / 3"
          containerStyle={{
            width: "100%",
          }}
        />
      </Card>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
