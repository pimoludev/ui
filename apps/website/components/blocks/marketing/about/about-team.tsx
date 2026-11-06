"use client";

import { useState } from "react";
import { Avatar, Badge, Button, Card } from "@pimolu/react";

export function AboutTeamBlock() {
  const [discipline, setDiscipline] = useState("Everyone");
  const people = [
    {
      name: "Maya Chen",
      role: "Design",
      initials: "MC",
    },
    {
      name: "Noah Dubois",
      role: "Engineering",
      initials: "ND",
    },
    {
      name: "Ada Martin",
      role: "Design",
      initials: "AM",
    },
    {
      name: "Robin Lee",
      role: "Engineering",
      initials: "RL",
    },
  ];
  return (
    <section className="mx-auto max-w-5xl space-y-8 p-6 sm:p-10">
      <header className="max-w-xl space-y-4">
        <Badge variant="primary">OUR TEAM</Badge>
        <h2 className="text-3xl sm:text-4xl font-medium">
          Different perspectives.
          <br />
          One shared direction.
        </h2>
        <p className="text-muted">Meet the people behind the work.</p>
      </header>
      <div className="flex flex-wrap gap-2" aria-label="Filter team">
        {["Everyone", "Design", "Engineering"].map((x) => (
          <Button
            key={x}
            appearance={discipline === x ? "solid" : "outline"}
            aria-pressed={discipline === x}
            onClick={() => setDiscipline(x)}
          >
            {x}
          </Button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {people
          .filter((p) => discipline === "Everyone" || p.role === discipline)
          .map((p) => (
            <Card key={p.name} className="flex flex-row items-center gap-5 p-6">
              <Avatar name={p.name} />
              <div>
                <h3 className="font-medium">{p.name}</h3>
                <p className="text-sm text-muted">{p.role}</p>
              </div>
            </Card>
          ))}
      </div>
      <p role="status" className="text-sm text-muted">
        Showing {discipline.toLowerCase()}
      </p>
    </section>
  );
}
