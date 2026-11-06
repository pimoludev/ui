"use client";

import { useState } from "react";
import { Card, Select } from "@pimolu/react";

export function MarketOrderManagementBlock() {
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([
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
  const [filter] = useState("All");
  const visible = orders.filter((o) => filter === "All" || o.status === filter);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Order management
        </h2>
      </header>
      <div className="grid gap-5 md:grid-cols-3">
        {["Processing", "Shipped", "Delivered"].map((stage) => (
          <Card key={stage} className="space-y-4 p-4">
            <h3 className="text-xl">{stage}</h3>
            {orders
              .filter((o) => o.status === stage)
              .map((o) => (
                <div
                  key={o.id}
                  className="space-y-3 rounded-lg border border-border p-3"
                >
                  <h4 className="font-medium">{o.id}</h4>
                  <p className="text-sm">{o.item}</p>
                  <Select
                    label={"Status for " + o.id}
                    value={o.status}
                    onValueChange={(value) => {
                      setOrders((rows) =>
                        rows.map((row) =>
                          row.id === o.id
                            ? {
                                ...row,
                                status: value,
                              }
                            : row,
                        ),
                      );
                      setMessage(o.id + " updated locally to " + value);
                    }}
                    fullWidth
                  >
                    {["Processing", "Shipped", "Delivered"].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </Select>
                </div>
              ))}
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
