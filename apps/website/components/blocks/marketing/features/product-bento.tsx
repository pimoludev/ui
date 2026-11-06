"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from "@pimolu/react";

export function ProductBentoBlock() {
  const [completed, setCompleted] = useState(false);
  return (
    <section className="mx-auto max-w-5xl space-y-8 p-5 sm:p-8">
      <header className="max-w-xl space-y-3">
        <Badge variant="primary">Built for your rhythm</Badge>
        <h2 className="text-3xl font-medium">The details that keep work moving.</h2>
        <p className="text-muted">
          Plan clearly, share progress and find the next small step.
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        <Card size="lg" className="md:row-span-2">
          <CardHeader>
            <CardTitle>A clearer next step</CardTitle>
            <p className="text-sm text-muted">An interactive launch checklist.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-4xl font-medium">{completed ? "3 / 3" : "2 / 3"}</p>
            <Progress value={completed ? 100 : 67} aria-label="Launch progress" />
            <ul className="space-y-3 pl-5">
              <li>Define the story</li>
              <li>Review the experience</li>
              <li>{completed ? "Launch approved" : "Approve the launch"}</li>
            </ul>
            <Button
              appearance={completed ? "outline" : "solid"}
              onClick={() => setCompleted(!completed)}
            >
              {completed ? "Reset checklist" : "Approve launch"}
            </Button>
          </CardContent>
        </Card>
        <Card size="lg">
          <CardContent className="space-y-3">
            <Badge variant="success">Together</Badge>
            <h3 className="text-xl font-medium">One shared picture.</h3>
            <p className="text-sm text-muted">
              Keep updates and decisions close to the work.
            </p>
          </CardContent>
        </Card>
        <Card size="lg">
          <CardContent className="space-y-3">
            <Badge variant="primary">Your way</Badge>
            <h3 className="text-xl font-medium">Room for your process.</h3>
            <p className="text-sm text-muted">
              Start with the essentials and adapt as your team grows.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
