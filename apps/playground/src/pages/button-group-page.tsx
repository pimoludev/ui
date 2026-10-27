import { CustomizationExample } from "./button-group-customization-demo";
import type { ReactNode } from "react";

import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function FormatButton({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Button
      iconOnly
      appearance="outline"
      aria-label={label}
      startIcon={<span>{children}</span>}
    />
  );
}

export function ButtonGroupPage() {
  return (
    <>
      <PageHeader
        title="ButtonGroup"
        hint="Groups existing buttons into one control. Attached mode collapses inner borders and radii, keeps a single visible focus ring and supports a separator between logical sections."
      />

      <Section
        title="Attached"
        hint="The default: adjacent buttons share their borders and only the outer corners stay rounded."
      >
        <div className="pg-row">
          <ButtonGroup aria-label="Text formatting">
            <FormatButton label="Bold">B</FormatButton>
            <FormatButton label="Italic">I</FormatButton>
            <FormatButton label="Underline">U</FormatButton>
          </ButtonGroup>

          <ButtonGroup aria-label="Alignment">
            <FormatButton label="Align left">⇤</FormatButton>
            <FormatButton label="Align center">↔</FormatButton>
            <FormatButton label="Align right">⇥</FormatButton>
          </ButtonGroup>
        </div>
      </Section>

      <Section
        title="Separators"
        hint="A separator marks a boundary between action families without breaking the attached layout."
      >
        <ButtonGroup aria-label="History and formatting">
          <FormatButton label="Undo">↶</FormatButton>
          <FormatButton label="Redo">↷</FormatButton>

          <ButtonGroupSeparator />

          <FormatButton label="Bold">B</FormatButton>
          <FormatButton label="Italic">I</FormatButton>

          <ButtonGroupSeparator />

          <FormatButton label="Insert link">🔗</FormatButton>
        </ButtonGroup>
      </Section>

      <Section
        title="Orientation"
        hint="Vertical groups stack full-width buttons; the separator becomes a horizontal rule."
      >
        <div className="pg-row">
          <ButtonGroup
            orientation="vertical"
            aria-label="View mode"
          >
            <Button
              appearance="outline"
              startIcon={<span>☰</span>}
            >
              List
            </Button>

            <Button
              appearance="outline"
              startIcon={<span>▦</span>}
            >
              Grid
            </Button>

            <ButtonGroupSeparator />

            <Button
              appearance="outline"
              startIcon={<span>⌘</span>}
            >
              Board
            </Button>
          </ButtonGroup>

          <ButtonGroup
            orientation="vertical"
            aria-label="Density"
          >
            <Button size="sm" appearance="soft">
              Compact
            </Button>
            <Button size="sm" appearance="soft">
              Comfortable
            </Button>
            <Button size="sm" appearance="soft">
              Spacious
            </Button>
          </ButtonGroup>
        </div>
      </Section>

      <Section
        title="Detached"
        hint="Set attached={false} to restore the normal gap between buttons while keeping the group semantics."
      >
        <ButtonGroup
          attached={false}
          aria-label="Document actions"
        >
          <Button appearance="ghost">Cancel</Button>
          <Button appearance="outline">Save draft</Button>
          <Button variant="primary">Publish</Button>
        </ButtonGroup>
      </Section>

      <Section
        title="Example: editor toolbar"
        hint="Mixed icon and text groups inside the same toolbar, with a quiet secondary block."
      >
        <div className="pg-panel">
          <div className="pg-row pg-row--between pg-example-actions">
            <div>
              <strong>Design tokens</strong>
              <p className="pg-meta">
                Draft · edited 2 minutes ago
              </p>
            </div>

            <div className="pg-row">
              <ButtonGroup aria-label="Text formatting">
                <FormatButton label="Bold">B</FormatButton>
                <FormatButton label="Italic">I</FormatButton>
                <FormatButton label="Underline">U</FormatButton>
              </ButtonGroup>

              <ButtonGroup
                attached={false}
                aria-label="Publishing"
              >
                <Button appearance="ghost">
                  Preview
                </Button>
                <Button variant="primary">Publish</Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
