"use client";

import { useState } from "react";
import { Button, Card } from "@pimolu/react";

export function MarketPaymentMethodsBlock() {
  const [message, setMessage] = useState("");
  const [methods, setMethods] = useState([
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
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Payment methods
        </h2>
      </header>
      <div className="grid gap-5 sm:grid-cols-2">
        {methods.map((m) => (
          <Card key={m.id} className="space-y-5 border-t-4 border-primary p-6">
            <h3 className="text-2xl">{m.name}</h3>
            <p>{"Expires " + m.expires}</p>
            <Button
              appearance="outline"
              onClick={() => {
                setMethods(methods.filter((x) => x.id !== m.id));
                setMessage("Demo payment method removed.");
              }}
            >
              Remove {m.name}
            </Button>
          </Card>
        ))}
        {methods.length === 0 && (
          <Button
            onClick={() =>
              setMethods([
                {
                  id: "visa",
                  name: "Visa ending 4242",
                  expires: "12/29",
                },
              ])
            }
          >
            Restore demo method
          </Button>
        )}
      </div>

      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
