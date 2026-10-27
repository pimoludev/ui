"use client";

import { Popover, Button } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-row">
            <Popover
              label="Placement"
              placement="top"
              content={
                <p className="pg-popover-copy">
                  Above the trigger.
                </p>
              }
              classNames={{ root: "custom-popover-root" }}
            >
              <Button appearance="outline">Top</Button>
            </Popover>
            <Popover
              label="Placement"
              placement="bottom"
              content={
                <p className="pg-popover-copy">
                  Below the trigger.
                </p>
              }
              classNames={{ root: "custom-popover-root" }}
            >
              <Button appearance="outline">Bottom</Button>
            </Popover>
            <Popover
              label="Placement"
              placement="left"
              offset={16}
              content={
                <p className="pg-popover-copy">
                  On the left, 16px away.
                </p>
              }
              classNames={{ root: "custom-popover-root" }}
            >
              <Button appearance="outline">Left</Button>
            </Popover>
            <Popover
              label="Placement"
              placement="right"
              content={
                <p className="pg-popover-copy">
                  On the right.
                </p>
              }
              classNames={{ root: "custom-popover-root" }}
            >
              <Button appearance="outline">Right</Button>
            </Popover>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-popover-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
