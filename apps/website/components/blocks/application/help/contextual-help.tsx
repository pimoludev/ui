"use client";

import { useState } from "react";
import { Badge, Button, Card, Select } from "@pimolu/react";

export function ContextualHelpBlock() {
  const [task, setTask] = useState("Invite a teammate");
  const [vote, setVote] = useState("");
  const steps: Record<string, string[]> = {
    "Invite a teammate": [
      "Open your workspace members page.",
      "Enter a teammate's email and choose a role.",
      "Review their permissions before sending an invitation.",
    ],
    "Export a project": [
      "Open the project you want to export.",
      "Choose an available export format.",
      "Review the file before sharing it outside your team.",
    ],
  };
  return (
    <section className="mx-auto grid max-w-4xl gap-8 p-6 sm:p-10 md:grid-cols-2">
      <header className="space-y-4">
        <Badge variant="primary">A LITTLE GUIDANCE</Badge>
        <h2 className="text-3xl sm:text-4xl font-medium">
          Keep your
          <br />
          next step clear.
        </h2>
        <p className="text-sm text-muted">
          Find an answer without leaving your workspace.
        </p>
      </header>
      <Card className="space-y-5 p-6">
        <Select
          label="I need help with"
          value={task}
          onValueChange={(v) => {
            setTask(v);
            setVote("");
          }}
          fullWidth
        >
          {Object.keys(steps).map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
        <ol className="list-inside list-decimal space-y-4">
          {steps[task].map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2">
          {["Helpful", "Still stuck"].map((x) => (
            <Button
              key={x}
              appearance="outline"
              aria-pressed={vote === x}
              onClick={() => setVote(x)}
            >
              {x}
            </Button>
          ))}
        </div>
        <p role="status" className="text-sm text-muted">
          {vote === "Still stuck"
            ? "Add your support contact or ticket form here."
            : vote
              ? "Thanks for the feedback. Stored locally only."
              : "Was this guide useful?"}
        </p>
      </Card>
    </section>
  );
}
