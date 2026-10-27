"use client";

import { Text } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">xs</span>
              <Text size="xs" classNames={{ root: "custom-typography-root" }}>The quick brown fox jumps over the lazy dog.</Text>
            </div>
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">sm</span>
              <Text size="sm" classNames={{ root: "custom-typography-root" }}>The quick brown fox jumps over the lazy dog.</Text>
            </div>
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">md</span>
              <Text size="md" classNames={{ root: "custom-typography-root" }}>The quick brown fox jumps over the lazy dog.</Text>
            </div>
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">lg</span>
              <Text size="lg" classNames={{ root: "custom-typography-root" }}>The quick brown fox jumps over the lazy dog.</Text>
            </div>
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">xl</span>
              <Text size="xl" classNames={{ root: "custom-typography-root" }}>The quick brown fox jumps over the lazy dog.</Text>
            </div>
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">2xl</span>
              <Text size="2xl" classNames={{ root: "custom-typography-root" }}>The quick brown fox jumps over the lazy dog.</Text>
            </div>
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">3xl</span>
              <Text size="3xl" classNames={{ root: "custom-typography-root" }}>The quick brown fox jumps over the lazy dog.</Text>
            </div>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-typography-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
