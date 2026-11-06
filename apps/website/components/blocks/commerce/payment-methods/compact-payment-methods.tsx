"use client";

import { useState } from "react";
import { Button, Card, Input, Select } from "@pimolu/react";

export function CompactPaymentMethodsBlock() {
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
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-serif text-3xl">Billing, made clear.</h3>
          <p className="text-muted">
            Update invoice preferences. Real cards must be collected by a payment
            provider.
          </p>
        </div>
        <Card className="p-6">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setMessage("Invoice preferences saved in this preview.");
            }}
          >
            <Input label="Invoice email" type="email" required fullWidth />
            <Select
              label="Payment method"
              value={selected}
              onValueChange={setSelected}
              fullWidth
            >
              {methods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
            <Input label="Billing company" fullWidth />
            <Button type="submit">Save invoice preferences</Button>
          </form>
        </Card>
      </div>

      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
