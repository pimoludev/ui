"use client";

import { Grid, Stack, AspectRatio, Text, Image } from "@pimolu/react";

const ratios = [
  [16 / 9, "16 / 9"],
  [4 / 3, "4 / 3"],
  [1, "1 / 1"],
  [21 / 9, "21 / 9"],
  [2.5, "2.5"],
] as const;

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <Grid columns="auto-fit" minItemWidth={180} gap={4}>
            {
              ratios.map(([ratio, label]) => (<Stack key={label} gap={2}>
                <AspectRatio
                  ratio={ratio}
                  style={{
                    borderRadius: "var(--pimolu-radius-md)",
                    background: "var(--pimolu-muted)",
                  }}
                  classNames={{
                    root: "custom-aspect-ratio-root",
                    content: "custom-aspect-ratio-content"
                  }}
                >
                  <Image
                    src="/images/pimolu-studio.webp"
                    alt={`Pimolu Studio at ${label}`}
                  />
                </AspectRatio>
                <Text size="sm" tone="muted">
                  ratio {label}
                </Text>
              </Stack>))
            }
          </Grid>
        </>)
      }
      <style>
        {
          `
.custom-aspect-ratio-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-aspect-ratio-content {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
