"use client";

import { Center, Box, Stack, Text } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <Center minHeight={200} classNames={{ root: "custom-center-root" }}>
            <Box
              padding={4}
              background="surface"
              style={{ maxWidth: 320 }}
            >
              <Stack gap={2}>
                <Text weight="medium">
                  Centered on both axes
                </Text>
                <Text size="sm" tone="muted">
                  Horizontal because justify-content is center, vertical because
                  min-height is 200px.
                </Text>
              </Stack>
            </Box>
          </Center>
        </>)
      }
      <style>
        {
          `
.custom-center-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
