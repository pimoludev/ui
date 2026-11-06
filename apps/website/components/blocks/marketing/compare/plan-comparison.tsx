"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@pimolu/react";

export function PlanComparisonBlock() {
  const [plan, setPlan] = useState("");
  return (
    <section className="mx-auto max-w-5xl space-y-6 p-6 sm:p-10">
      <header className="space-y-4">
        <Badge variant="primary">COMPARE PLANS</Badge>
        <h2 className="text-3xl sm:text-4xl font-medium">
          Choose what fits.
          <br />
          Keep room to grow.
        </h2>
      </header>
      <Table
        bordered
        aria-label="plan features"
        containerProps={{
          tabIndex: 0,
          "aria-label": "Plan comparison, scroll horizontally if needed",
        }}
      >
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Feature</TableHead>
            <TableHead scope="col">Starter</TableHead>
            <TableHead scope="col">Studio</TableHead>
            <TableHead scope="col">Team</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["Projects", "3", "Unlimited", "Unlimited"],
            ["Members", "1", "5", "25"],
            ["Analytics", "Basic", "Advanced", "Advanced"],
            ["Permissions", "Owner", "Editor roles", "Custom roles"],
          ].map((row) => (
            <TableRow key={row[0]}>
              <TableHead scope="row">{row[0]}</TableHead>
              {row.slice(1).map((v, i) => (
                <TableCell key={i}>{v}</TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableHead scope="row">Select</TableHead>
            {["Starter", "Studio", "Team"].map((x) => (
              <TableCell key={x}>
                <Button
                  size="sm"
                  appearance={plan === x ? "solid" : "outline"}
                  aria-pressed={plan === x}
                  onClick={() => setPlan(x)}
                >
                  Select {x}
                </Button>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
      <p role="status" className="text-sm text-muted">
        {plan
          ? plan + " selected. No subscription started."
          : "Compare the details before choosing."}
      </p>
    </section>
  );
}
