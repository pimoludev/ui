"use client";

import { useState } from "react";
import { Card, SearchInput, Select } from "@pimolu/react";

export function MarketApplicationProjectsBlock() {
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Atlas workspace",
      status: "In progress",
    },
    {
      id: 2,
      name: "Orbit launch",
      status: "Review",
    },
    {
      id: 3,
      name: "Studio store",
      status: "Planned",
    },
  ]);
  const visible = projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Project management
        </h2>
      </header>
      <SearchInput
        label="Search projects"
        value={query}
        onValueChange={setQuery}
        className="w-full"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {["Planned", "In progress", "Review"].map((stage) => (
          <Card key={stage} className="space-y-4 p-4">
            <h3 className="text-xl">{stage}</h3>
            {visible
              .filter((p) => p.status === stage)
              .map((p) => (
                <div
                  key={p.id}
                  className="space-y-4 rounded-lg border border-border p-4"
                >
                  <h4>{p.name}</h4>
                  <Select
                    label={"Stage for " + p.name}
                    value={p.status}
                    onValueChange={(value) => {
                      setProjects((rows) =>
                        rows.map((row) =>
                          row.id === p.id
                            ? {
                                ...row,
                                status: value,
                              }
                            : row,
                        ),
                      );
                      setMessage(p.name + " moved to " + value);
                    }}
                    fullWidth
                  >
                    <option>Planned</option>
                    <option>In progress</option>
                    <option>Review</option>
                  </Select>
                </div>
              ))}
          </Card>
        ))}
      </div>
      {visible.length === 0 && <p>No projects match this search.</p>}
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
