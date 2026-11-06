"use client";

import { useState } from "react";
import { Badge, Button, Card, Avatar } from "@pimolu/react";

export function CompactLivePurchaseBlock() {
  const [message, setMessage] = useState("");
  const events = [
    {
      name: "Maya",
      item: "Studio Headphones",
      place: "Paris",
    },
    {
      name: "Noah",
      item: "Orbit Print",
      place: "Berlin",
    },
    {
      name: "Alex",
      item: "Studio Limited",
      place: "Lyon",
    },
  ];
  const [index, setIndex] = useState(0);
  const [, setHistory] = useState([events[0]]);
  const [paused, setPaused] = useState(false);
  function next() {
    const nextIndex = (index + 1) % events.length;
    setIndex(nextIndex);
    setHistory((rows) => [events[nextIndex], ...rows].slice(0, 4));
    setMessage("A simulated purchase was added. No real transaction occurred.");
  }
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Simulated purchases
        </h2>
      </header>
      <Card className="space-y-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant={paused ? "neutral" : "success"}>
            {paused ? "Paused" : "Demo stream"}
          </Badge>
          <Button
            appearance="outline"
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
          >
            {paused ? "Resume demo" : "Pause demo"}
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Avatar name={events[index].name} />
          <div className="space-y-1">
            <h3 className="font-medium">
              {events[index].name + " chose " + events[index].item}
            </h3>
            <p className="text-sm text-muted">
              {events[index].place + " / simulated event"}
            </p>
          </div>
        </div>
        <Button disabled={paused} onClick={next}>
          Generate sample event
        </Button>
      </Card>

      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
