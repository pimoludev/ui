"use client";

import { useState } from "react";
import { Badge, Button, Card } from "@pimolu/react";

export function CompactPromoBlock() {
  const [message, setMessage] = useState("");
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Promotions
        </h2>
      </header>
      <div className="grid gap-5 md:grid-cols-3">
        {["Audio", "Art", "Studio bundles"].map((label, i) => (
          <Card key={label} className="space-y-5 p-6">
            <Badge>
              {["10% sample offer", "Free sample delivery", "15% sample offer"][i]}
            </Badge>
            <h3 className="text-2xl">{label}</h3>
            <p className="text-muted">
              Replace with your own verified promotion terms and eligibility.
            </p>
            <Button
              appearance="outline"
              onClick={() => setMessage(label + " offer selected locally.")}
            >
              Choose {label} offer
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
