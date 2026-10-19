import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Command,
  CommandPalette,
  Kbd,
  toast,
  type PimoluCommandItem,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const items: PimoluCommandItem[] = [
  {
    id: "new-project",
    label: "New project",
    group: "Create",
    keywords: ["start", "init"],
    shortcut: "N",
  },
  {
    id: "new-component",
    label: "New component",
    group: "Create",
    keywords: ["react", "registry"],
  },
  {
    id: "open-settings",
    label: "Open settings",
    group: "Navigate",
    keywords: ["preferences", "theme"],
    shortcut: "⌘,",
  },
  {
    id: "open-docs",
    label: "Open documentation",
    group: "Navigate",
    keywords: ["help", "guide"],
  },
  {
    id: "copy-link",
    label: "Copy project link",
    group: "Actions",
    keywords: ["share", "url"],
  },
  {
    id: "archive",
    label: "Archive project",
    group: "Actions",
    keywords: ["hide", "close"],
    disabled: true,
  },
];

export function CommandPage() {
  const [selected, setSelected] = useState("none");
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Command"
        hint="A searchable, keyboard-first list of commands. Command filters by label and keywords, keeps the focus in the search field and exposes the active option through aria-activedescendant. CommandPalette wraps the same component in the Dialog modal. Styles come from @pimolu/web-styles/command.css."
      />

      <Section
        title="Inline command"
        hint="Type to filter, then use ArrowUp/Down and Enter."
      >
        <div className="pg-stack">
          <Command
            items={items}
            aria-label="Project commands"
            onSelect={(item) => setSelected(item.label)}
          />

          <div className="pg-row">
            <Badge variant="neutral">selected: {selected}</Badge>
          </div>
        </div>
      </Section>

      <Section
        title="Palette"
        hint="A modal command list. The shortcut opens it with Cmd/Ctrl+K; no trigger is required."
      >
        <div className="pg-row">
          <Button onClick={() => setPaletteOpen(true)}>
            Open command palette
          </Button>

          <span className="pg-muted">
            or press <Kbd>⌘</Kbd> <Kbd>K</Kbd>
          </span>
        </div>

        <CommandPalette
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
          items={items}
          label="Command palette"
          shortcut="k"
          onSelect={(item) => {
            setSelected(item.label);
            toast({
              title: item.label,
              description: "Command selected.",
            });
          }}
        />
      </Section>

      <Section
        title="Examples"
        hint="The list is data-driven, so the same items feed the inline and modal versions."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Grouping</CardTitle>
              <CardDescription>
                Commands are grouped by their group field and
                filtered case-insensitively.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="pg-copy">
                A disabled command stays visible but is skipped by
                the keyboard.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selection</CardTitle>
              <CardDescription>
                The item's own onSelect runs before the shared
                onSelect callback.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-row">
                <Badge variant="neutral">
                  last command: {selected}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
