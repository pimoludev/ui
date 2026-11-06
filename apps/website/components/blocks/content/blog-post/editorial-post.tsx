"use client";

import { useState } from "react";
import { Badge, Button, Image } from "@pimolu/react";

export function EditorialPostBlock() {
  const [saved, setSaved] = useState(false);
  return (
    <article className="mx-auto max-w-4xl space-y-8 p-6 sm:p-10">
      <header className="max-w-2xl space-y-5">
        <Badge>SPACES / FIELD NOTES</Badge>
        <h2 className="font-serif text-3xl sm:text-5xl">
          A room for
          <br />
          better ideas.
        </h2>
        <p className="text-sm text-muted">By Studio Journal · 4 minute read</p>
        <Button
          appearance="outline"
          aria-pressed={saved}
          onClick={() => setSaved(!saved)}
        >
          {saved ? "Saved to reading list" : "Save this story"}
        </Button>
      </header>
      <Image
        src="/images/blocks/studio-office.jpg"
        alt="Natural light across a wooden studio interior"
        aspectRatio="16 / 9"
        containerStyle={{
          width: "100%",
        }}
      />
      <div className="mx-auto max-w-2xl space-y-6 text-lg leading-relaxed">
        <p>
          Some spaces ask us to move faster. Others give us permission to think. A
          considered workspace can do both: support the daily routine and leave room for
          the unexpected.
        </p>
        <h3 className="font-serif text-3xl">Start with what you notice.</h3>
        <p>
          Notice the light on your desk, the tools you reach for and the distractions
          you return to. The first useful change is often small: a clearer surface, a
          better place for notes, or a comfortable corner to read.
        </p>
        <blockquote className="border-l-2 border-primary pl-5 font-serif text-2xl">
          Make room for the work you want to do.
        </blockquote>
        <h3 className="font-serif text-3xl">Leave a little space.</h3>
        <p className="text-sm text-muted">
          A studio is never finished. Let it change with the projects and people that
          fill it.
        </p>
      </div>
      <p role="status" className="text-sm text-muted">
        {saved ? "Saved in this local preview only." : "Your reading list is empty."}
      </p>
    </article>
  );
}
