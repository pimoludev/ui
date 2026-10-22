"use client";

import { Button } from "@pimolu/react";

const sizes = ["xs", "sm", "md", "lg", "xl", "xxl"] as const;

export function DemoExample() {
  return (
    <div className="flex flex-wrap items-center gap-3 min-w-0">
      {sizes.map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  );
}
