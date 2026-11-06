"use client";

import { useState } from "react";
import { Badge, Button, Card, Input, Progress } from "@pimolu/react";

export function CompactOrderTrackingBlock() {
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
  const [lookup, setLookup] = useState("PM-1042");
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Order tracking
        </h2>
      </header>
      <form
        className="grid gap-3 sm:grid-cols-[1fr_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          const found = orders.find((o) => o.id === lookup.trim().toUpperCase());
          if (found) {
            setSelectedId(found.id);
            setMessage("Sample order found.");
          } else setMessage("Use PM-1042, PM-1031 or PM-1010.");
        }}
      >
        <Input
          label="Order number"
          value={lookup}
          onChange={(e) => setLookup(e.target.value)}
          required
          fullWidth
        />
        <Button type="submit">Track demo order</Button>
      </form>
      <Card className="space-y-6 p-6">
        <h3 className="text-2xl">{selected.id}</h3>
        <Progress
          value={
            selected.status === "Processing"
              ? 33
              : selected.status === "Shipped"
                ? 67
                : 100
          }
          label="Order journey"
        />
        <ol className="grid gap-4 sm:grid-cols-3">
          {["Processing", "Shipped", "Delivered"].map((stage, i) => (
            <li key={stage} className="space-y-2">
              <Badge
                variant={
                  i <=
                  (selected.status === "Processing"
                    ? 0
                    : selected.status === "Shipped"
                      ? 1
                      : 2)
                    ? "success"
                    : "neutral"
                }
              >
                {i + 1}
              </Badge>
              <h3 className="font-medium">{stage}</h3>
              <p className="text-sm text-muted">
                {stage === selected.status
                  ? "Current sample status"
                  : "Journey milestone"}
              </p>
            </li>
          ))}
        </ol>
      </Card>
      {visible.length === 0 && <p>No orders match this status.</p>}
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
