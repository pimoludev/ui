"use client";

import { useState } from "react";
import { Badge, Card, SearchInput, Select } from "@pimolu/react";

export function CompactApplicationProjectsBlock() {
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
      <div className="space-y-4">
        {visible.map((p) => (
          <Card key={p.id} className="grid gap-5 p-5 sm:grid-cols-[1fr_14rem]">
            <div>
              <Badge>{p.status}</Badge>
              <h3 className="mt-3 text-xl">{p.name}</h3>
            </div>
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
