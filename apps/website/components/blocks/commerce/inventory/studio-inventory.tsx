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

export function StudioInventoryBlock() {
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
      <Table
        aria-label="inventory, editable locally"
        containerProps={{
          tabIndex: 0,
          "aria-label": "Scrollable inventory",
        }}
      >
        <TableHeader>
          <TableRow>
            <TableHead scope="col">SKU</TableHead>
            <TableHead scope="col">Product</TableHead>
            <TableHead scope="col">Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    appearance="outline"
                    aria-label={"Decrease " + p.name + " stock"}
                    disabled={p.quantity === 0}
                    onClick={() => adjust(p.id, -1)}
                  >
                    -
                  </Button>
                  <span>{p.quantity}</span>
                  <Button
                    appearance="outline"
                    aria-label={"Increase " + p.name + " stock"}
                    onClick={() => adjust(p.id, 1)}
                  >
                    +
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
