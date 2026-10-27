"use client";

import { Paragraph, Code } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <Paragraph>
            Install components with <Code classNames={{ root: "custom-code-root" }}>pnpm add @pimolu/react @pimolu/web-styles</Code>,
            then import <Code classNames={{ root: "custom-code-root" }}>@pimolu/web-styles/layered.css</Code> in your stylesheet.
          </Paragraph>
        </>)
      }
      <style>
        {
          `
.custom-code-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
