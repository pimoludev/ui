"use client";

import { HStack, Box, Text } from "@pimolu/react";

const paddings = [0, 1, 2, 3, 4, 6, 8, 12] as const;

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <HStack gap={2} wrap align="start" className="grid gap-4">
            {
              paddings.map((padding) => (<Box
                key={padding}
                padding={padding}
                background="muted"
                classNames={{
                  root: "custom-box-root"
                }}
              >
                <Text size="sm">
                  {padding}
                </Text>
              </Box>))
            }
          </HStack>
        </>)
      }
      <style>
        {
          `
.custom-box-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
