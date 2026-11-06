"use client";

import { useState } from "react";
import { Badge, Button, Image } from "@pimolu/react";

export function AboutStudioBlock() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="mx-auto max-w-5xl space-y-8 p-6 sm:p-10">
      <div className="grid gap-8 md:grid-cols-2">
        <header className="space-y-5">
          <Badge>ABOUT / STUDIO</Badge>
          <h2 className="font-serif text-3xl sm:text-5xl">
            Small team.
            <br />
            Considered work.
          </h2>
          <p className="text-muted">
            We build places on the internet that feel like the people behind them.
          </p>
        </header>
        <Image
          src="/images/blocks/studio-office.jpg"
          alt="A sunlit creative studio"
          aspectRatio="4 / 3"
          containerStyle={{
            width: "100%",
          }}
        />
      </div>
      <div className="grid gap-6 border-t border-border pt-6 md:grid-cols-2">
        <h3 className="text-2xl">
          Good work starts
          <br />
          with a good question.
        </h3>
        <div className="space-y-4">
          <p className="text-muted">
            An independent studio working across identity, product and digital
            experiences.
          </p>
          <Button
            appearance="outline"
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Less of our story" : "Read our story"}
          </Button>
          {expanded && (
            <p className="text-sm text-muted">
              We started with a shared belief: thoughtful interfaces make complex work
              feel simple. Today we explore ideas through prototypes, conversations and
              careful craft.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
