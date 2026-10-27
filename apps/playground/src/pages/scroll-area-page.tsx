import { CustomizationExample } from "./scroll-area-customization-demo";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ScrollArea,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const items = Array.from({ length: 14 }, (_, index) => ({
  title: `Release ${14 - index}`,
  meta: `2026-10-${String(19 - index).padStart(2, "0")}`,
}));

export function ScrollAreaPage() {
  return (
    <>
      <PageHeader
        title="ScrollArea"
        hint="A focusable scroll viewport with a thinner scrollbar, vertical, horizontal or both directions, and an optional maximum height. The content stays native: wheel, touch and keyboard scrolling keep working. Styles come from @pimolu/web-styles/scroll-area.css."
      />

      <Section
        title="Vertical"
        hint="maxHeight caps the viewport; the page itself does not grow."
      >
        <Card>
          <CardHeader>
            <CardTitle>Releases</CardTitle>
            <CardDescription>
              Fourteen rows in a 260px viewport.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ScrollArea maxHeight={260}>
              <div className="pg-stack">
                {items.map((item) => (
                  <div
                    key={item.title}
                    className="pg-row pg-row--between"
                  >
                    <span>{item.title}</span>
                    <span className="pg-meta">{item.meta}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Horizontal"
        hint="The viewport scrolls sideways; the content keeps its natural width."
      >
        <ScrollArea
          orientation="horizontal"
          className="pg-scroll-horizontal-demo"
        >
          <div className="pg-scroll-horizontal">
            {[
              "Design tokens",
              "Themes",
              "Components",
              "Playground",
              "Typography",
              "Forms",
              "Navigation",
              "Feedback",
            ].map((label) => (
              <Badge key={label} variant="secondary">
                {label}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </Section>

      <Section
        title="Both"
        hint="A wide table can scroll in both directions inside a bounded height."
      >
        <ScrollArea orientation="both" maxHeight={240}>
          <div className="pg-scroll-table">
            {Array.from({ length: 10 }, (_, row) => (
              <div key={row} className="pg-scroll-table__row">
                {Array.from({ length: 8 }, (_, column) => (
                  <span key={column}>
                    R{row + 1} · C{column + 1}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
