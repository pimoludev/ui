"use client";

import { Stack, Flex, Box, Text, Spacer, VStack } from "@pimolu/react";

function Pill({ children, }: {
  children: string;
}) {
  return (
    <Box padding={2} paddingX={3} background="muted">
      <Text size="sm">
        {children}
      </Text>
    </Box>
  );
}

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <Stack gap={4}>
            <Flex gap={2} align="center" fullWidth>
              <Pill>Brand</Pill>
              <Spacer classNames={{ root: "custom-spacer-root" }} />
              <Pill>Actions</Pill>
            </Flex>
            <Flex gap={2} align="center" fullWidth>
              <Pill>Left</Pill>
              <Spacer classNames={{ root: "custom-spacer-root" }} />
              <Pill>Center</Pill>
              <Spacer classNames={{ root: "custom-spacer-root" }} />
              <Pill>Right</Pill>
            </Flex>
            <VStack gap={2} style={{ minHeight: 160 }}>
              <Pill>Top</Pill>
              <Spacer classNames={{ root: "custom-spacer-root" }} />
              <Pill>Bottom</Pill>
            </VStack>
          </Stack>
        </>)
      }
      <style>
        {
          `
.custom-spacer-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
