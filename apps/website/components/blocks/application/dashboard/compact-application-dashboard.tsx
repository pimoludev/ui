"use client";

import { useState } from "react";
import { Badge, Button, Card, Progress } from "@pimolu/react";

export function CompactApplicationDashboardBlock() {
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [projects, setProjects] = useState(3);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Dashboard</h2>
      </header>
      <div className="grid gap-7 md:grid-cols-[14rem_1fr]">
        <aside className="space-y-4">
          <Badge>WORKSPACE / TODAY</Badge>
          <h3 className="font-serif text-3xl">
            Small steps.
            <br />
            Steady progress.
          </h3>
          <p className="text-muted">
            A compact operating dashboard with local actions.
          </p>
        </aside>
        <div className="min-w-0 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="space-y-3 p-5">
              <h3>Active projects</h3>
              <p className="text-4xl">{projects}</p>
              <Button
                appearance="outline"
                onClick={() => {
                  setProjects(projects + 1);
                  setMessage("Sample project created locally.");
                }}
              >
                New project
              </Button>
            </Card>
            <Card className="space-y-3 p-5">
              <h3>Review queue</h3>
              <p className="text-4xl">{done ? 0 : 1}</p>
              <Button
                appearance="outline"
                disabled={done}
                onClick={() => setDone(true)}
              >
                {done ? "Reviewed" : "Approve review"}
              </Button>
            </Card>
            <Card className="space-y-3 p-5">
              <h3>Launch readiness</h3>
              <Progress value={done ? 100 : 67} label="Launch readiness" />
            </Card>
          </div>
          <Card className="p-6">
            <h3 className="text-xl">Next milestone</h3>
            <p className="mt-3">
              {done ? "Ready for the next chapter." : "One approval remains."}
            </p>
          </Card>
        </div>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
