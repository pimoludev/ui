"use client";

import { useState } from "react";
import { Badge, Button, Card } from "@pimolu/react";

export function CompactOrderHistoryBlock() {
  const [message, setMessage] = useState("");
  const [orders] = useState([
    {
      id: "PM-1042",
      date: "2026-10-24",
      item: "Studio Headphones",
      total: 129,
      status: "Processing",
    },
    {
      id: "PM-1031",
      date: "2026-09-18",
      item: "Orbit Print",
      total: 39,
      status: "Shipped",
    },
    {
      id: "PM-1010",
      date: "2026-08-12",
      item: "Studio Limited",
      total: 159,
      status: "Delivered",
    },
  ]);
  const [filter, setFilter] = useState("All");
  const visible = orders.filter((o) => filter === "All" || o.status === filter);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Order history
        </h2>
      </header>
      <div className="flex flex-wrap gap-2">
        {["All", "Processing", "Shipped", "Delivered"].map((x) => (
          <Button
            key={x}
            appearance={filter === x ? "solid" : "outline"}
            aria-pressed={filter === x}
            onClick={() => setFilter(x)}
          >
            {x}
          </Button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {visible.map((o) => (
          <Card key={o.id} className="space-y-4 p-5">
            <Badge>{o.status}</Badge>
            <h3 className="text-xl">{o.item}</h3>
            <p>{o.date}</p>
            <p className="text-2xl">{"$" + o.total}</p>
            <Button
              appearance="outline"
              onClick={() => setMessage(o.id + " saved to the local return request.")}
            >
              Prepare return {o.id}
            </Button>
          </Card>
        ))}
      </div>
      {visible.length === 0 && <p>No orders match this status.</p>}
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
