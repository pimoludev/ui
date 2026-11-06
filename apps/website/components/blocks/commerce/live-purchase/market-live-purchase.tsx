"use client";

import { useState } from "react";
import { Button, Card, Avatar } from "@pimolu/react";

export function MarketLivePurchaseBlock() {
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
  const [history, setHistory] = useState([events[0]]);
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
      <div className="grid gap-7 md:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <h3 className="font-serif text-3xl">A little activity.</h3>

          <Button onClick={next}>Add sample purchase</Button>
        </div>
        <div className="space-y-3">
          {history.map((e, i) => (
            <Card key={i} className="flex items-center gap-4 p-5">
              <Avatar name={e.name} />
              <div>
                <h3>{e.item}</h3>
                <p className="text-sm text-muted">
                  {e.name + " / " + e.place + " / simulated"}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
