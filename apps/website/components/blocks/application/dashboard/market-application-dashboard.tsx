"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Progress,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@pimolu/react";

export function MarketApplicationDashboardBlock() {
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [projects, setProjects] = useState(3);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Dashboard</h2>
      </header>
      <div className="space-y-6">
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
            <Button appearance="outline" disabled={done} onClick={() => setDone(true)}>
              {done ? "Reviewed" : "Approve review"}
            </Button>
          </Card>
          <Card className="space-y-3 p-5">
            <h3>Launch readiness</h3>
            <Progress value={done ? 100 : 67} label="Launch readiness" />
          </Card>
        </div>
        <Tabs defaultValue="work">
          <TabsList aria-label="Dashboard views">
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="work">
            <Card className="mt-5 space-y-3 p-6">
              <h3 className="text-xl">A clear next step</h3>
              <p>
                {done
                  ? "All sample reviews are complete."
                  : "Review the launch checklist before publication."}
              </p>
            </Card>
          </TabsContent>
          <TabsContent value="activity">
            <p className="py-5">{message || "Your sample workspace is ready."}</p>
          </TabsContent>
        </Tabs>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
