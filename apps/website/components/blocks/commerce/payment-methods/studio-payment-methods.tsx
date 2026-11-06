"use client";

import { useState } from "react";
import { Badge, Button, Card } from "@pimolu/react";

export function StudioPaymentMethodsBlock() {
  const [message, setMessage] = useState("");
  const [methods] = useState([
    {
      id: "visa",
      name: "Visa ending 4242",
      expires: "12/29",
    },
    {
      id: "mastercard",
      name: "Mastercard ending 5555",
      expires: "08/28",
    },
  ]);
  const [selected, setSelected] = useState("visa");
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Payment methods
        </h2>
      </header>
      <div className="mx-auto max-w-lg space-y-5">
        {methods.map((m) => (
          <Card key={m.id} className="space-y-4 p-5">
            <Badge>{selected === m.id ? "Default" : "Saved demo method"}</Badge>
            <h3 className="text-xl">{m.name}</h3>
            <p className="text-muted">{"Expires " + m.expires}</p>
            <Button
              appearance={selected === m.id ? "solid" : "outline"}
              aria-pressed={selected === m.id}
              onClick={() => {
                setSelected(m.id);
                setMessage("Default method changed locally.");
              }}
            >
              Use {m.name}
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
