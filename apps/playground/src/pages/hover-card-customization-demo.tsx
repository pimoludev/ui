"use client";

import { HoverCard, HoverCardTrigger, Button, HoverCardContent } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-row">
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
                <p className="pg-copy">
                  No open or close delay.
                </p>
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
                <p className="pg-copy">
                  Opens after 500 ms and closes after 300 ms.
                </p>
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
    </>
  );
}
