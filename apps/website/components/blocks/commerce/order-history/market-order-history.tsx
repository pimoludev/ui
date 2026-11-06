"use client";

import { useState } from "react";
import {
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@pimolu/react";

export function MarketOrderHistoryBlock() {
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
      <Table
        aria-label="order history"
        containerProps={{
          tabIndex: 0,
          "aria-label": "Scrollable order history",
        }}
      >
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Order</TableHead>
            <TableHead scope="col">Date</TableHead>
            <TableHead scope="col">Total</TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((o) => (
            <TableRow key={o.id}>
              <TableCell>{o.id}</TableCell>
              <TableCell>{o.date}</TableCell>
              <TableCell>{"$" + o.total}</TableCell>
              <TableCell>{o.status}</TableCell>
              <TableCell>
                <Button
                  appearance="ghost"
                  onClick={() => setMessage("Receipt selected for " + o.id)}
                >
                  Receipt {o.id}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {visible.length === 0 && <p>No orders match this status.</p>}
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
