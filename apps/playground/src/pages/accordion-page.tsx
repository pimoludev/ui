import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@pimolu/react";

import { accordionVariants } from "../demo-data";
import { PageHeader, Section } from "../section";

function ControlledAccordion() {
  const [value, setValue] = useState<string | undefined>(
    "tokens"
  );

  return (
    <div className="pg-stack">
      <Badge variant="primary">
        {value ?? "closed"}
      </Badge>

      <Accordion
        type="single"
        collapsible
        value={value}
        onValueChange={setValue}
      >
        <AccordionItem value="tokens">
          <AccordionTrigger>Design tokens</AccordionTrigger>
          <AccordionContent>
            Colours, spacing, radius and type are generated
            from one token pipeline.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="themes">
          <AccordionTrigger>Themes and presets</AccordionTrigger>
          <AccordionContent>
            Light, dark and six visual presets share the same
            semantic variables.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function AccordionPage() {
  return (
    <>
      <PageHeader
        title="Accordion"
        hint="Collapsible sections with single or multiple open items, optional collapse, three visual treatments, arrow-key navigation and animated content. Styles come from @pimolu/web-styles/accordion.css."
      />

      <Section
        title="Single"
        hint="One item at a time; collapsible lets the open item close again."
      >
        <Accordion type="single" defaultValue="one" collapsible>
          <AccordionItem value="one">
            <AccordionTrigger>
              What is Pimolu UI?
            </AccordionTrigger>

            <AccordionContent>
              A cross-platform design system with shared tokens,
              CSS and React components.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="two">
            <AccordionTrigger>
              Can I use it without React?
            </AccordionTrigger>

            <AccordionContent>
              The tokens and web styles are framework-agnostic;
              the React registry is the current implementation.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="three" disabled>
            <AccordionTrigger>
              Disabled item
            </AccordionTrigger>

            <AccordionContent>
              This content cannot be opened.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section
        title="Multiple"
        hint="Any number of sections can stay open."
      >
        <Accordion
          type="multiple"
          defaultValue={["one", "two"]}
        >
          <AccordionItem value="one">
            <AccordionTrigger>Tokens</AccordionTrigger>
            <AccordionContent>
              Primitives and semantic aliases.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="two">
            <AccordionTrigger>Themes</AccordionTrigger>
            <AccordionContent>
              Light, dark and six presets.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="three">
            <AccordionTrigger>Components</AccordionTrigger>
            <AccordionContent>
              React, CSS and playground pages.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section
        title="Variants"
        hint="Enumerated from accordionVariantMap: default, separated and ghost."
      >
        <div className="pg-grid pg-grid--start">
          {accordionVariants.map((variant) => (
            <Card key={variant}>
              <CardHeader>
                <CardTitle>{variant}</CardTitle>

                <CardDescription>
                  The same items with the {variant} treatment.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Accordion
                  type="single"
                  defaultValue="one"
                  variant={variant}
                >
                  <AccordionItem value="one">
                    <AccordionTrigger>
                      First section
                    </AccordionTrigger>

                    <AccordionContent>
                      A short answer for the first section.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="two">
                    <AccordionTrigger>
                      Second section
                    </AccordionTrigger>

                    <AccordionContent>
                      A short answer for the second section.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Controlled"
        hint="value and onValueChange keep the open section in the page; collapsible allows closing it."
      >
        <ControlledAccordion />
      </Section>
    </>
  );
}
