"use client";

import { useState } from "react";
import { Button, Card, Avatar } from "@pimolu/react";

export function StudioLivePurchaseBlock() {
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
      <Card className="mx-auto max-w-lg space-y-5 border-l-4 border-primary p-6">
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
        <Button appearance="outline" onClick={next}>
          Simulate next purchase
        </Button>
      </Card>

      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
