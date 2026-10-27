"use client";

import { Tooltip, Button, Badge } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-row">
            <Tooltip
              content="Above the trigger"
              placement="top"
              arrow
              classNames={{
                root: "custom-tooltip-root"
              }}
            >
              <Button appearance="outline">Top</Button>
            </Tooltip>
            <Tooltip
              content="Below the trigger"
              placement="bottom"
              classNames={{
                root: "custom-tooltip-root"
              }}
            >
              <Button appearance="outline">Bottom</Button>
            </Tooltip>
            <Tooltip
              content="On the left"
              placement="left"
              arrow
              classNames={{
                root: "custom-tooltip-root"
              }}
            >
              <Button appearance="outline">Left</Button>
            </Tooltip>
            <Tooltip
              content="On the right"
              placement="right"
              classNames={{
                root: "custom-tooltip-root"
              }}
            >
              <Button appearance="outline">Right</Button>
            </Tooltip>
            <Tooltip
              content="Any element can be the trigger"
              arrow
              classNames={{
                root: "custom-tooltip-root"
              }}
            >
              <Badge variant="primary">Badge trigger</Badge>
            </Tooltip>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-tooltip-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
