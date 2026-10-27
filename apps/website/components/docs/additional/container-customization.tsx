"use client";

import { Stack, Container, Box, Text } from "@pimolu/react";

const maxWidths = [
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "full",
] as const;

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <Stack gap={3}>
            {
              maxWidths.map((maxWidth) => (<Container
                key={maxWidth}
                maxWidth={maxWidth}
                padding={2}
                classNames={{
                  root: "custom-container-root"
                }}
              >
                <Box padding={3} background="muted">
                  <Text size="sm">
                    maxWidth {maxWidth}
                  </Text>
                </Box>
              </Container>))
            }
          </Stack>
        </>)
      }
      <style>
        {
          `
.custom-container-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
