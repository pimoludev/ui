"use client";

import { HoverCard, HoverCardTrigger, Button, HoverCardContent } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <HoverCard openDelay={0} closeDelay={0}>
              <HoverCardTrigger>
                <Button appearance="outline">Immediate</Button>
              </HoverCardTrigger>
              <HoverCardContent
                label="Immediate card"
                classNames={{
                  root: "custom-hover-card-root"
                }}
              >
                <p className="max-w-prose leading-relaxed">No open or close delay.</p>
              </HoverCardContent>
            </HoverCard>
            <HoverCard openDelay={500} closeDelay={300}>
              <HoverCardTrigger>
                <Button appearance="outline">Deliberate</Button>
              </HoverCardTrigger>
              <HoverCardContent
                label="Deliberate card"
                classNames={{
                  root: "custom-hover-card-root"
                }}
              >
                <p className="max-w-prose leading-relaxed">Opens after 500 ms and closes after 300 ms.</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-hover-card-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
