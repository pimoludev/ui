"use client";

import { useState } from "react";
import { Badge, Button, Card } from "@pimolu/react";

export function MarketInventoryBlock() {
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
      <div className="grid gap-4 md:grid-cols-3">
        {visible.map((p) => (
          <Card key={p.id} className="space-y-5 p-5">
            <Badge variant={p.quantity < 5 ? "warning" : "success"}>
              {p.quantity < 5 ? "Restock" : "Available"}
            </Badge>
            <h3 className="text-xl">{p.name}</h3>
            <p className="text-sm text-muted">{p.id}</p>
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
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
