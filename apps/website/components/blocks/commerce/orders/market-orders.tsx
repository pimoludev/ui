"use client";

import { useState } from "react";
import { Badge, Button, Card, Select } from "@pimolu/react";

export function MarketOrdersBlock() {
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
  const [selectedId, setSelectedId] = useState("PM-1042");
  const selected = orders.find((o) => o.id === selectedId)!;
  const [filter] = useState("All");
  const visible = orders.filter((o) => filter === "All" || o.status === filter);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Order details
        </h2>
      </header>
      <div className="mx-auto max-w-xl space-y-6">
        <Select
          label="Choose order"
          value={selectedId}
          onValueChange={setSelectedId}
          fullWidth
        >
          {orders.map((o) => (
            <option key={o.id} value={o.id}>
              {o.id}
            </option>
          ))}
        </Select>
        <Card className="space-y-5 p-6">
          <div className="flex flex-wrap justify-between gap-3">
            <h3 className="text-2xl">{selected.id}</h3>
            <Badge variant="primary">{selected.status}</Badge>
          </div>
          <p>{selected.item}</p>
          <p className="text-3xl">{"$" + selected.total}</p>
          <dl className="grid grid-cols-2 gap-3">
            <dt>Placed</dt>
            <dd>{selected.date}</dd>
            <dt>Payment</dt>
            <dd>Sample paid order</dd>
          </dl>
        </Card>
        <Button
          fullWidth
          appearance="outline"
          onClick={() =>
            setMessage(
              "Receipt prepared for " + selected.id + ". Connect your invoice service.",
            )
          }
        >
          Prepare receipt
        </Button>
      </div>
      {visible.length === 0 && <p>No orders match this status.</p>}
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
