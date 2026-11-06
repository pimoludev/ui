"use client";

import { useState } from "react";
import { Button, Card } from "@pimolu/react";

export function CompactInventoryBlock() {
  const [message, setMessage] = useState("");
  const [stock, setStock] = useState([
    {
      id: "ST-01",
      name: "Studio Headphones",
      quantity: 12,
    },
    {
      id: "OR-02",
      name: "Orbit Print",
      quantity: 2,
    },
    {
      id: "ED-03",
      name: "Studio Limited",
      quantity: 0,
    },
  ]);
  const [lowOnly, setLowOnly] = useState(false);
  const visible = stock.filter((p) => !lowOnly || p.quantity < 5);
  function adjust(id: string, delta: number) {
    setStock((rows) =>
      rows.map((p) =>
        p.id === id
          ? {
              ...p,
              quantity: Math.max(0, p.quantity + delta),
            }
          : p,
      ),
    );
    setMessage("Stock adjusted locally. Persist inventory on your server.");
  }
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Product inventory
        </h2>
      </header>
      <Button
        appearance="outline"
        aria-pressed={lowOnly}
        onClick={() => setLowOnly(!lowOnly)}
      >
        {lowOnly ? "Show all inventory" : "Show low stock"}
      </Button>
      <div className="grid gap-5 md:grid-cols-[1fr_2fr]">
        <Card className="space-y-3 p-6">
          <h3 className="text-2xl">Stock overview</h3>
          <p className="text-4xl">{stock.reduce((sum, p) => sum + p.quantity, 0)}</p>
          <p className="text-sm text-muted">Total units</p>
        </Card>
        <div className="space-y-3">
          {visible.map((p) => (
            <Card
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-4 p-5"
            >
              <h3>{p.name}</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  appearance="outline"
                  aria-label={"Decrease " + p.name + " stock"}
                  disabled={p.quantity === 0}
                  onClick={() => adjust(p.id, -1)}
                >
                  -
                </Button>
                <span className="self-center px-2">{p.quantity}</span>
                <Button
                  appearance="outline"
                  aria-label={"Increase " + p.name + " stock"}
                  onClick={() => adjust(p.id, 1)}
                >
                  +
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
