"use client";

import { Button } from "@pimolu/react";

const appearances = [
  "solid",
  "soft",
  "outline",
  "ghost",
  "link",
  "dashed",
  "glass",
  "elevated",
  "glow",
  "text",
] as const;

export function DemoExample() {
  return (
    <div className="flex flex-wrap items-center gap-3 min-w-0">
      {appearances.map((appearance) => (
        <Button key={appearance} appearance={appearance}>
          {appearance}
        </Button>
      ))}
    </div>
  );
}
