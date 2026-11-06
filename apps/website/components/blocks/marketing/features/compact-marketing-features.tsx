"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Progress,
} from "@pimolu/react";

export function CompactMarketingFeaturesBlock() {
  const [message] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Features & bento
        </h2>
      </header>
      <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <h3 className="font-serif text-3xl">
            Less friction.
            <br />
            More forward.
          </h3>
          <p className="text-sm text-muted">Plan, collaborate and ship in one place.</p>
          <Badge>PLAN / REVIEW / LAUNCH</Badge>
        </div>
        <Tabs defaultValue="review">
          <TabsList aria-label="Feature workflow">
            <TabsTrigger value="plan">Plan</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
            <TabsTrigger value="launch">Launch</TabsTrigger>
          </TabsList>
          <TabsContent value="plan">
            <Card className="mt-5 space-y-4 p-6">
              <h3 className="text-xl">A clear plan</h3>
              <ul className="list-inside list-disc space-y-2">
                <li>Set a useful scope</li>
                <li>Invite the right people</li>
              </ul>
            </Card>
          </TabsContent>
          <TabsContent value="review">
            <Card className="mt-5 space-y-4 p-6">
              <h3 className="text-xl">Keep the quality bar</h3>
              <Button disabled={done} onClick={() => setDone(true)}>
                {done ? "Review complete" : "Complete sample review"}
              </Button>
            </Card>
          </TabsContent>
          <TabsContent value="launch">
            <Card className="mt-5 space-y-4 p-6">
              <h3 className="text-xl">Ready to share</h3>
              <Progress value={done ? 100 : 50} label="Launch progress" />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
