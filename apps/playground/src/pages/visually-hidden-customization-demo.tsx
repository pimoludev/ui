"use client";

import { HStack, Button, VisuallyHidden, Badge } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <HStack gap={3} align="center" wrap>
            <Button iconOnly>
              <span aria-hidden="true">×</span>
              <VisuallyHidden classNames={{ root: "custom-visually-hidden-root" }}>Close dialog</VisuallyHidden>
            </Button>
            <Button iconOnly appearance="outline">
              <span aria-hidden="true">⌕</span>
              <VisuallyHidden classNames={{ root: "custom-visually-hidden-root" }}>Search the documentation</VisuallyHidden>
            </Button>
            <HStack gap={2} align="center">
              <Badge variant="secondary">3 new</Badge>
              <VisuallyHidden classNames={{ root: "custom-visually-hidden-root" }}>
                three unread notifications
              </VisuallyHidden>
            </HStack>
          </HStack>
        </>)
      }
      <style>
        {
          `
.custom-visually-hidden-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
