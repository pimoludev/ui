"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <Accordion
            type="single"
            defaultValue="one"
            collapsible
            classNames={{
              root: "custom-accordion-root",
              label: "custom-accordion-label"
            }}
          >
            <AccordionItem value="one">
              <AccordionTrigger>What is Pimolu UI?</AccordionTrigger>
              <AccordionContent>
                A cross-platform design system with shared tokens, CSS and React
                components.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="two">
              <AccordionTrigger>Can I use it without React?</AccordionTrigger>
              <AccordionContent>
                The tokens and web styles are framework-agnostic; the React
                registry is the current implementation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="three" disabled>
              <AccordionTrigger>Disabled item</AccordionTrigger>
              <AccordionContent>This content cannot be opened.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </>)
      }
      <style>
        {
          `
.custom-accordion-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-accordion-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
