"use client";

import { Resizable } from "@pimolu/react";

const files = [
  "tokens.json",
  "themes.json",
  "button.css",
  "carousel.css",
  "resizable.css",
  "virtual-list.css",
];
const splitFrame = {
  border: "1px solid var(--pimolu-border)",
  borderRadius: "var(--pimolu-radius-lg)",
  overflow: "hidden",
  background: "var(--pimolu-background)",
} as const;

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <Resizable
            aria-label="Editor layout"
            paneClassName="min-w-0 rounded-lg border border-border p-6"
            style={{
              ...splitFrame,
              height: 320
            }}
            defaultSizes={[
              32,
              68
            ]}
            classNames={{
              root: "custom-resizable-root"
            }}
          >
            <div className="grid gap-5 min-w-0">
              <span className="text-sm text-muted leading-relaxed">FILES</span>
              {
                files.map((file, index) => (<div
                  key={file}
                  className="flex flex-wrap items-center gap-3 min-w-0 justify-between"
                >
                  <span>{file}</span>
                  <span className="text-sm text-muted leading-relaxed">
                    {index === 1 ? "edited" : ""}
                  </span>
                </div>))
              }
            </div>
            <pre
              style={{
                margin: 0,
                fontFamily: "ui-monospace, monospace",
                fontSize: 12,
                lineHeight: 1.7,
              }}
            >
              {
                (
                  "{\n  \"primary\": \"{color.indigo.600}\",\n  \"surface\": " +
                  "\"{color.neutral.50}\",\n  \"surface-foreground\": " +
                  "\"{color.neutral.900}\",\n  \"focus-ring\": " +
                  "\"{color.indigo.500}\"\n}\n\n/* The preview grows with its pane;\n   " +
                  "the separator never changes the theme. */"
                )
              }
            </pre>
          </Resizable>
        </>)
      }
      <style>
        {
          `
.custom-resizable-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
