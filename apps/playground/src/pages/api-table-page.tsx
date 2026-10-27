import { CustomizationExample } from "./api-table-customization-demo";
import { ApiTable } from "@pimolu/react";

import { PageHeader, Section } from "../section";

const buttonRows = [
  {
    name: "variant",
    type: '"primary" | "secondary" | "danger"',
    default: '"primary"',
    description:
      "Semantic colour of the action. It maps to the same token in every preset.",
  },
  {
    name: "appearance",
    type: '"solid" | "soft" | "outline" | "ghost" | "glass"',
    default: '"solid"',
    description:
      "Visual weight of the button without changing its meaning.",
  },
  {
    name: "size",
    type: '"xs" | "sm" | "md" | "lg" | "xl" | "xxl"',
    default: '"md"',
    description:
      "Control height and horizontal padding. md matches the default form controls.",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description:
      "Visible label. Provide an aria-label instead when the button is icon-only.",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description:
      "Shows a spinner, disables the control and sets aria-busy.",
  },
  {
    name: "startIcon",
    type: "ReactNode",
    description:
      "Decorative icon rendered before the label; it is hidden from assistive technology.",
  },
  {
    name: "onClick",
    type: "(event: MouseEvent) => void",
    description:
      "Native click handler. The button does not intercept the event.",
  },
  {
    name: "fullWidth",
    type: "boolean",
    default: "false",
    description:
      "Stretches the button to the inline size of its container.",
  },
  {
    name: "iconOnly",
    type: "boolean",
    default: "false",
    deprecated: true,
    description:
      "Use the icon-only variant instead. The prop remains for one major version.",
  },
];

const tocRows = [
  {
    name: "id",
    type: "string",
    required: true,
    description:
      "Id of the heading the entry points to. It must match the heading id exactly.",
  },
  {
    name: "label",
    type: "ReactNode",
    required: true,
    description:
      "Visible entry label, usually the heading text.",
  },
  {
    name: "level",
    type: "2 | 3",
    default: "2",
    description:
      "Level 3 entries are nested inside the preceding level 2 entry.",
  },
];

const deprecatedRows = [
  {
    name: "appearance=\"filled\"",
    type: "string",
    deprecated: true,
    description:
      "Replaced by appearance=\"solid\" in 1.0. The old value still works until 2.0.",
  },
  {
    name: "rounded",
    type: "boolean",
    deprecated: true,
    description:
      "Use radius=\"full\" instead; the boolean does not compose with the other radii.",
  },
];

export function ApiTablePage() {
  return (
    <>
      <PageHeader
        title="ApiTable"
        hint="A data-driven API reference table. Names, types and defaults are rendered as code, required and deprecated props get a badge, the table keeps a real caption and column headers, and the narrow layout scrolls horizontally. Styles come from @pimolu/web-styles/api-table.css."
      />

      <Section
        title="Component props"
        hint="A complete reference for Button. The caption names the table for assistive technology even when the optional title is absent."
      >
        <div className="pg-panel">
          <ApiTable
            title="Button"
            caption="Every prop accepted by Button, with its type and default value."
            rows={buttonRows}
          />
        </div>
      </Section>

      <Section
        title="Compact reference"
        hint="density sm tightens the row padding for a reference that sits next to other content."
      >
        <div className="pg-panel">
          <ApiTable
            density="sm"
            title="TableOfContentsItem"
            caption="Shape of one table-of-contents entry."
            rows={tocRows}
          />
        </div>
      </Section>

      <Section
        title="Deprecated props"
        hint="Deprecated rows keep their description and receive a badge; the name is struck through so the migration is visible in a diff."
      >
        <div className="pg-panel">
          <ApiTable
            density="md"
            title="Legacy Button API"
            caption="Values scheduled for removal in the next major version."
            rows={deprecatedRows}
          />
        </div>
      </Section>

      <Section
        title="Empty reference"
        hint="An empty rows array renders a single full-width cell instead of an empty table body."
      >
        <div className="pg-panel">
          <ApiTable
            title="No props yet"
            caption="This component does not expose any public prop."
            rows={[]}
            emptyMessage="This component has no public props."
          />
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
