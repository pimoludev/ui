"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  SearchInput,
  Stat,
} from "@pimolu/react";

const startingProjects = ["Atlas website", "Studio workspace", "Identity system"];

export function WorkspaceBlock() {
  const [projects, setProjects] = useState(startingProjects);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const visible = projects.filter((project) =>
    project.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="mx-auto max-w-5xl space-y-6 p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Studio / Workspace</p>
          <h2 className="mt-2 text-3xl font-medium tracking-tight">A clearer view.</h2>
        </div>
        <Badge variant="success">All systems ready</Badge>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent>
            <Stat label="Projects" value={projects.length} />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stat label="Team members" value={8} />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stat label="Completed this week" value={24} />
          </CardContent>
        </Card>
      </div>
      <Card size="lg">
        <CardContent className="space-y-6">
          <SearchInput
            label="Find a project"
            value={query}
            onValueChange={setQuery}
            placeholder="Search your workspace…"
          />
          <ul className="m-0 grid list-none gap-3 p-0">
            {visible.map((project) => (
              <li
                key={project}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3"
              >
                <span>{project}</span>
                <Badge>Active</Badge>
              </li>
            ))}
          </ul>
          {!visible.length && (
            <p className="text-sm text-muted">No matching projects.</p>
          )}
          <form
            className="grid items-end gap-3 sm:grid-cols-[1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              const title = name.trim();
              if (!title) return;
              if (
                projects.some(
                  (project) => project.toLowerCase() === title.toLowerCase(),
                )
              ) {
                setMessage("That project already exists.");
                return;
              }
              setProjects((current) => [...current, title]);
              setName("");
              setQuery("");
              setMessage(`${title} added to this preview.`);
            }}
          >
            <Input
              label="New project"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={64}
              fullWidth
            />
            <Button type="submit" disabled={!name.trim()}>
              Add project
            </Button>
          </form>
          <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
            {message}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
