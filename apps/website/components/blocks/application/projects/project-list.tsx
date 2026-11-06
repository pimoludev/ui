"use client";

import { useState } from "react";
import { Badge, Button, Card, CardContent, Input, SearchInput } from "@pimolu/react";

export function ProjectListBlock() {
  const [projects, setProjects] = useState([
    "Atlas website",
    "Studio identity",
    "Orbit launch",
  ]);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const visible = projects.filter((project) =>
    project.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="mx-auto max-w-4xl space-y-6 p-5 sm:p-8">
      <header className="space-y-2">
        <Badge variant="primary">Studio / Projects</Badge>
        <h2 className="text-3xl font-medium">Good ideas, in motion.</h2>
        <p className="text-muted">
          Search, add and archive projects in this local workspace.
        </p>
      </header>
      <SearchInput
        label="Search projects"
        value={query}
        onValueChange={setQuery}
        autoComplete="off"
      />
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const title = name.trim();
          if (!title) return;
          if (projects.includes(title)) {
            setMessage("A project with that name already exists.");
            return;
          }
          setProjects([...projects, title]);
          setName("");
          setMessage(`${title} created locally.`);
        }}
      >
        <Input
          label="Project name"
          value={name}
          onValueChange={setName}
          required
          maxLength={80}
          containerClassName="min-w-0 flex-1"
        />
        <Button type="submit">Create project</Button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((project) => (
          <Card key={project}>
            <CardContent className="space-y-4">
              <Badge variant="success">Active</Badge>
              <h3 className="break-words text-xl font-medium">{project}</h3>
              <Button
                appearance="outline"
                size="sm"
                aria-label={`Archive ${project}`}
                onClick={() => {
                  setProjects(projects.filter((item) => item !== project));
                  setMessage(`${project} archived locally.`);
                }}
              >
                Archive project
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {!visible.length && (
        <p className="text-muted">
          No matching projects. Try another name or add a project.
        </p>
      )}
      <p role="status" className="text-sm text-muted">
        {message ||
          `${visible.length} projects. Changes reset when this preview is reloaded.`}
      </p>
    </section>
  );
}
