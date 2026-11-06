"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Switch,
} from "@pimolu/react";

const plans = [
  {
    name: "Personal",
    monthly: 0,
    annual: 0,
    detail: "Room to explore.",
    features: ["One workspace", "Three projects", "Community support"],
  },
  {
    name: "Studio",
    monthly: 19,
    annual: 15,
    detail: "For your next chapter.",
    features: ["Unlimited projects", "Team collaboration", "Project insights"],
  },
  {
    name: "Team",
    monthly: 49,
    annual: 39,
    detail: "Good work, together.",
    features: ["Everything in Studio", "Shared permissions", "Priority assistance"],
  },
];

export function PricingBlock() {
  const [annual, setAnnual] = useState(false);
  const [selected, setSelected] = useState("");

  return (
    <section className="mx-auto max-w-5xl space-y-8 p-5 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm text-primary">Simple by choice</p>
          <h2 className="mt-2 text-3xl font-medium tracking-tight">
            A plan for what’s next.
          </h2>
        </div>
        <Switch label="Annual billing" checked={annual} onCheckedChange={setAnnual} />
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} size="lg" className="h-full">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>{plan.name}</CardTitle>
                {plan.name === "Studio" && <Badge variant="primary">Popular</Badge>}
              </div>
              <p className="text-sm text-muted">{plan.detail}</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-6">
              <p>
                <span className="text-4xl font-medium">
                  ${annual ? plan.annual : plan.monthly}
                </span>
                <span className="text-sm text-muted"> / month</span>
              </p>
              <p className="text-sm text-muted">
                {plan.monthly === 0
                  ? "Free to get started"
                  : annual
                    ? "Billed annually"
                    : "Billed monthly"}
              </p>
              <ul className="m-0 grid gap-3 pl-5 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Button
                className="mt-auto"
                appearance={plan.name === "Studio" ? "solid" : "outline"}
                onClick={() => setSelected(plan.name)}
              >
                Choose {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-sm text-muted" role="status">
        {selected
          ? `${selected} selected. This preview does not start billing.`
          : "Sample product pricing. Switch billing periods to compare."}
      </p>
    </section>
  );
}
