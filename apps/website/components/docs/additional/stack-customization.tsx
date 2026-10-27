"use client";

import { Stack, Text, Box } from "@pimolu/react";

function Block({ children, }: {
  children: string;
}) {
  return (
    <Box padding={3} background="muted">
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
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0"
          >
            <Stack gap={2} classNames={{ root: "custom-stack-root" }}>
              <Text size="sm" tone="muted">column</Text>
              <Stack gap={2} classNames={{ root: "custom-stack-root" }}>
                <Block>One</Block>
                <Block>Two</Block>
                <Block>Three</Block>
              </Stack>
            </Stack>
            <Stack gap={2} classNames={{ root: "custom-stack-root" }}>
              <Text size="sm" tone="muted">row</Text>
              <Stack direction="row" gap={2} classNames={{ root: "custom-stack-root" }}>
                <Block>One</Block>
                <Block>Two</Block>
                <Block>Three</Block>
              </Stack>
            </Stack>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-stack-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
