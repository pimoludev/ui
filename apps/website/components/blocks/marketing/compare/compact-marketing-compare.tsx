"use client";

import { useState } from "react";
import {
  Button,
  Select,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@pimolu/react";

export function CompactMarketingCompareBlock() {
  const [message, setMessage] = useState("");
  const [left, setLeft] = useState("Starter");
  const [right, setRight] = useState("Studio");
  const plans = {
    Starter: {
      price: 0,
      seats: 1,
      projects: 3,
    },
    Studio: {
      price: 24,
      seats: 5,
      projects: 20,
    },
    Team: {
      price: 59,
      seats: 15,
      projects: 100,
    },
  };
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Compare</h2>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="First plan" value={left} onValueChange={setLeft} fullWidth>
          {Object.keys(plans).map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
        <Select label="Second plan" value={right} onValueChange={setRight} fullWidth>
          {Object.keys(plans).map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
      </div>
      <Table
        aria-label="Fictional plan comparison"
        containerProps={{
          tabIndex: 0,
          "aria-label": "Scrollable plan comparison",
        }}
      >
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Feature</TableHead>
            <TableHead scope="col">{left}</TableHead>
            <TableHead scope="col">{right}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {["price", "seats", "projects"].map((key) => (
            <TableRow key={key}>
              <TableHead scope="row">
                {key === "price" ? "Monthly USD before tax" : key}
              </TableHead>
              {[left, right].map((name, i) => (
                <TableCell key={i}>
                  {
                    plans[name as keyof typeof plans][
                      key as "price" | "seats" | "projects"
                    ]
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={() =>
          setMessage("Comparison saved locally: " + left + " and " + right)
        }
      >
        Save this comparison
      </Button>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
