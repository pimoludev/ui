"use client";

import { Stack, Text, Grid, Box } from "@pimolu/react";

const columns = [1, 2, 3, 4, 6] as const;

function Cell({
  children,
  tall,
}: {
  children: string;
  tall?: boolean;
}) {
  return (
    <Box
      padding={3}
      background="muted"
      style={tall ? { minHeight: 96 } : undefined}
    >
      <Text size="sm">
        {children}
      </Text>
    </Box>
  );
}

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <Stack gap={4}>
            {
              columns.map((count) => (
                <Stack key={count} gap={2}>
                  <Text size="sm" tone="muted">
                    columns {count}
                  </Text>
                  <Grid
                    columns={count}
                    gap={2}
                    classNames={{ root: "custom-grid-root" }}
                  >
                    {
                      Array.from(
                        { length: count * 2 },
                        (_, index) => (
                          <Cell key={index}>
                            {`cell ${index + 1}`}
                          </Cell>
                        )
                      )
                    }
                  </Grid>
                </Stack>
              ))
            }
          </Stack>
        </>)
      }
      <style>
        {
          `
.custom-grid-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
