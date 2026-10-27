"use client";

import { CodeBlock } from "@pimolu/react";

const welcomeSnippet = (
  "import { Button } from \"@pimolu/react\";\n\nexport function " +
  "Welcome() {\n  return (\n    <Button appearance=\"solid\">\n      " +
  "Start building\n    </Button>\n  );\n}"
);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <CodeBlock
            code={welcomeSnippet}
            language="tsx"
            filename="welcome.tsx"
            showLineNumbers
            highlightLines={[3, 4, 5]}
            classNames={{
              root: "custom-code-block-root",
              header: "custom-code-block-header"
            }}
          />
        </>)
      }
      <style>
        {
          `
.custom-code-block-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-code-block-header {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
