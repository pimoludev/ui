"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  Button,
  DropdownMenuContent,
  DropdownMenuItem
} from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button appearance="outline">Start aligned</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                classNames={{
                  root: "custom-dropdown-menu-root",
                  item: "custom-dropdown-menu-item"
                }}
              >
                <DropdownMenuItem>One</DropdownMenuItem>
                <DropdownMenuItem>Two</DropdownMenuItem>
                <DropdownMenuItem>Three</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button appearance="outline">End aligned</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                classNames={{
                  root: "custom-dropdown-menu-root",
                  item: "custom-dropdown-menu-item"
                }}
              >
                <DropdownMenuItem>One</DropdownMenuItem>
                <DropdownMenuItem>Two</DropdownMenuItem>
                <DropdownMenuItem>Three</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-dropdown-menu-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-dropdown-menu-item {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
