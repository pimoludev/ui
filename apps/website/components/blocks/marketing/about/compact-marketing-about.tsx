"use client";

import { useState } from "react";
import { Button, Card, Image, Avatar } from "@pimolu/react";

export function CompactMarketingAboutBlock() {
  const [message] = useState("");
  const [active, setActive] = useState("Design");
  const disciplines = {
    Design: "We make room for clarity, thoughtful hierarchy and useful details.",
    Engineering: "We build accessible interactions and maintainable foundations.",
    Community: "We learn from the people who use the things we make.",
  };
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">About</h2>
      </header>
      <div className="space-y-7">
        <div className="grid gap-7 md:grid-cols-2">
          <Image
            src="/images/blocks/studio-office.jpg"
            alt="Creative studio workspace"
            aspectRatio="4 / 3"
            containerStyle={{
              width: "100%",
            }}
          />
          <div className="space-y-5">
            <h3 className="font-serif text-3xl">
              A small studio.
              <br />A shared point of view.
            </h3>
            <p className="text-muted">
              Working at the intersection of design and engineering.
            </p>
            <div className="flex gap-3">
              <Avatar name="Maya Chen" />
              <Avatar name="Noah Dubois" />
              <Avatar name="Robin Lee" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.keys(disciplines).map((x) => (
            <Button
              key={x}
              appearance={active === x ? "solid" : "outline"}
              aria-pressed={active === x}
              onClick={() => setActive(x)}
            >
              {x}
            </Button>
          ))}
        </div>
        <Card className="p-6">
          <p>{disciplines[active as keyof typeof disciplines]}</p>
        </Card>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
