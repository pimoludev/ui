"use client";

import {
  Badge,
  Card,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@pimolu/react";

export function WorkflowFeaturesBlock() {
  return (
    <section className="mx-auto max-w-5xl space-y-8 p-6 sm:p-10">
      <header className="max-w-xl space-y-4">
        <Badge variant="primary">ONE CONNECTED WORKFLOW</Badge>
        <h2 className="text-3xl sm:text-4xl font-medium">
          A good idea deserves
          <br />a clear path forward.
        </h2>
      </header>
      <Tabs defaultValue="plan">
        <TabsList aria-label="Workflow features">
          <TabsTrigger value="plan">Plan</TabsTrigger>
          <TabsTrigger value="collaborate">Collaborate</TabsTrigger>
          <TabsTrigger value="launch">Launch</TabsTrigger>
        </TabsList>
        <TabsContent value="plan">
          <div className="grid gap-6 py-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-2xl">Turn a thought into a plan.</h3>
              <p className="text-muted">
                Keep the brief, milestones and next actions together.
              </p>
            </div>
            <Card className="space-y-4 p-6">
              {[
                "Define the audience",
                "Sketch the first flow",
                "Review the prototype",
              ].map((x, i) => (
                <p key={x} className="flex justify-between gap-3">
                  <span>{x}</span>
                  <Badge>{i === 0 ? "Done" : "Next"}</Badge>
                </p>
              ))}
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="collaborate">
          <Card className="my-6 space-y-4 p-6">
            <h3 className="text-2xl">Make room for every perspective.</h3>
            <p className="text-sm text-muted">Keep comments close to the work.</p>
            <p>Maya: The new flow is ready for review.</p>
            <p>Robin: I&apos;ll check the keyboard journey.</p>
          </Card>
        </TabsContent>
        <TabsContent value="launch">
          <Card className="my-6 space-y-4 p-6">
            <h3 className="text-2xl">Ship with a shared checklist.</h3>
            <Progress value={75} aria-label="Sample launch readiness" />
            <p className="text-sm text-muted">3 of 4 launch tasks complete.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
