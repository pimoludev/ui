"use client";

import { Stack, Text, Flex, Box } from "@pimolu/react";

function Block({
  children,
  grow,
}: {
  children: string;
  grow?: boolean;
}) {
  return (
    <Flex
      grow={grow ? 1 : undefined}
      basis={grow ? 0 : undefined}
      style={{ minWidth: 0 }}
      classNames={{ root: "custom-flex-root" }}
    >
      <Box
        padding={3}
        background="muted"
        fullWidth
      >
        <Text size="sm">
          {children}
        </Text>
      </Box>
    </Flex>
  );
}

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid pg-grid--two">
            {
              (
                [
                  "row",
                  "row-reverse",
                  "column",
                  "column-reverse",
                ] as const
              ).map((direction) => (
                <Stack key={direction} gap={2}>
                  <Text size="sm" tone="muted">
                    {direction}
                  </Text>
                  <Flex
                    direction={direction}
                    gap={1}
                    style={{ minHeight: 72 }}
                    classNames={{ root: "custom-flex-root" }}
                  >
                    <Block>One</Block>
                    <Block>Two</Block>
                    <Block>Three</Block>
                  </Flex>
                </Stack>
              ))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-flex-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
