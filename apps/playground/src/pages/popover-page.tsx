import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Popover,
} from "@pimolu/react";

import { popoverPaddings } from "../demo-data";
import { PageHeader, Section } from "../section";

const filterOptions = [
  "Design tokens",
  "Components",
  "Playground",
];

function FilterPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([
    "Components",
  ]);

  function toggle(option: string, checked: boolean) {
    setSelected((current) =>
      checked
        ? [...current, option]
        : current.filter((item) => item !== option)
    );
  }

  return (
    <Popover
      label="Filter the component list"
      open={isOpen}
      onOpenChange={setIsOpen}
      content={
        <div className="pg-stack">
          <div>
            <p className="pg-popover-title">Filter</p>
            <p className="pg-popover-hint">
              The panel stays open while you choose, because the
              open state is controlled by the page.
            </p>
          </div>

          <div className="pg-stack">
            {filterOptions.map((option) => (
              <Checkbox
                key={option}
                label={option}
                checked={selected.includes(option)}
                onCheckedChange={(checked) =>
                  toggle(option, checked)
                }
              />
            ))}
          </div>

          <div className="pg-row pg-row--between">
            <Button
              size="sm"
              appearance="ghost"
              onClick={() => setSelected([])}
            >
              Reset
            </Button>

            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Apply
            </Button>
          </div>
        </div>
      }
    >
      <Button appearance="outline">
        <span className="pg-row">
          Filter
          <Badge size="sm" variant="primary">
            {selected.length}
          </Badge>
        </span>
      </Button>
    </Popover>
  );
}

function ActionPopover() {
  const [lastAction, setLastAction] = useState("none");

  return (
    <div className="pg-row">
      <Popover
        label="Row actions"
        closeOnSelect
        padding="sm"
        content={
          <div className="pg-stack">
            {["Duplicate", "Rename", "Archive"].map(
              (action) => (
                <Button
                  key={action}
                  size="sm"
                  appearance="ghost"
                  fullWidth
                  onClick={() => setLastAction(action)}
                >
                  {action}
                </Button>
              )
            )}
          </div>
        }
      >
        <Button appearance="outline">Actions</Button>
      </Popover>

      <span className="pg-meta">
        Last action: {lastAction}
      </span>
    </div>
  );
}

function DefaultOpenPopover() {
  const [mounted, setMounted] = useState(false);

  return (
    <div className="pg-row">
      <Button
        size="sm"
        appearance="ghost"
        disabled={mounted}
        onClick={() => setMounted(true)}
      >
        Mount with defaultOpen
      </Button>

      {mounted && (
        <Popover
          defaultOpen
          labelledBy="popover-default-open-title"
          className="pg-popover-accent"
          content={
            <div className="pg-stack">
              <p
                id="popover-default-open-title"
                className="pg-popover-title"
              >
                Already open
              </p>

              <p className="pg-popover-copy">
                The component mounted with the panel open. An
                outside click, Escape or focus leaving closes it;
                the trigger opens it again.
              </p>

              <Button size="sm" appearance="soft">
                A panel action
              </Button>
            </div>
          }
        >
          <Button appearance="outline">Default open</Button>
        </Popover>
      )}
    </div>
  );
}

export function PopoverPage() {
  return (
    <>
      <PageHeader
        title="Popover"
        hint="A panel anchored to the element that opens it. It closes on an outside click, on Escape or when focus leaves; Escape also returns focus to the trigger. It renders through the shared portal and flips side when the viewport has no room. Styles come from @pimolu/web-styles/popover.css."
      />

      <Section
        title="Placement"
        hint="Four sides, with an automatic flip when the preferred side has no room. offset controls the distance from the trigger."
      >
        <div className="pg-row">
          <Popover
            label="Placement"
            placement="top"
            content={
              <p className="pg-popover-copy">
                Above the trigger.
              </p>
            }
          >
            <Button appearance="outline">Top</Button>
          </Popover>

          <Popover
            label="Placement"
            placement="bottom"
            content={
              <p className="pg-popover-copy">
                Below the trigger.
              </p>
            }
          >
            <Button appearance="outline">Bottom</Button>
          </Popover>

          <Popover
            label="Placement"
            placement="left"
            offset={16}
            content={
              <p className="pg-popover-copy">
                On the left, 16px away.
              </p>
            }
          >
            <Button appearance="outline">Left</Button>
          </Popover>

          <Popover
            label="Placement"
            placement="right"
            content={
              <p className="pg-popover-copy">
                On the right.
              </p>
            }
          >
            <Button appearance="outline">Right</Button>
          </Popover>
        </div>
      </Section>

      <Section
        title="Padding"
        hint="Enumerated from popoverVariantMap: none for an edge-to-edge list, sm to lg for panels with content."
      >
        <div className="pg-row">
          {popoverPaddings.map((padding) => (
            <Popover
              key={padding}
              label={`Padding ${padding}`}
              padding={padding}
              content={
                <p className="pg-popover-copy">
                  Padding: {padding}
                </p>
              }
            >
              <Button size="sm" appearance="soft">
                {padding}
              </Button>
            </Popover>
          ))}
        </div>
      </Section>

      <Section
        title="Width"
        hint="matchWidth aligns the panel with the trigger instead of centring it; useful for a field and its suggestions."
      >
        <div className="pg-row">
          <Popover
            label="Search the documentation"
            matchWidth
            offset={6}
            content={
              <div className="pg-stack">
                <Input
                  label="Search"
                  placeholder="Component, token, theme..."
                />

                <p className="pg-popover-hint">
                  Focus lands in the first field when the panel
                  opens.
                </p>
              </div>
            }
          >
            <Button
              appearance="outline"
              className="pg-popover-trigger"
            >
              Search components
            </Button>
          </Popover>

          <Popover
            label="Natural width"
            content={
              <p className="pg-popover-copy">
                The panel keeps its natural width.
              </p>
            }
          >
            <Button appearance="outline">
              Natural width
            </Button>
          </Popover>
        </div>
      </Section>

      <Section
        title="States"
        hint="A controlled panel, a disabled trigger and a panel that closes after an action."
      >
        <div className="pg-row">
          <FilterPopover />

          <ActionPopover />

          <Popover
            label="Unavailable"
            disabled
            content={
              <p className="pg-popover-copy">
                Never shown.
              </p>
            }
          >
            <Button appearance="outline">Disabled</Button>
          </Popover>
        </div>
      </Section>

      <Section
        title="Default open"
        hint="Click Mount: the component is created with defaultOpen, so its panel is open on the very first render. labelledBy takes the name from a heading inside the panel, and className adds a demo accent."
      >
        <DefaultOpenPopover />
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Share a link</CardTitle>
              <CardDescription>
                A small form inside a panel; matchWidth keeps it
                aligned with the trigger.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Popover
                label="Share this page"
                matchWidth
                content={
                  <div className="pg-stack">
                    <Input
                      label="Link"
                      defaultValue="https://pimolu.dev/components/popover"
                      readOnly
                    />

                    <div className="pg-row">
                      <Button size="sm">
                        Copy link
                      </Button>

                      <Button
                        size="sm"
                        appearance="ghost"
                      >
                        Email
                      </Button>
                    </div>
                  </div>
                }
              >
                <Button appearance="outline" fullWidth>
                  Share
                </Button>
              </Popover>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Long content</CardTitle>
              <CardDescription>
                The panel is capped in height and scrolls inside
                instead of leaving the screen.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Popover
                label="Release notes"
                matchWidth
                content={
                  <div className="pg-stack">
                    <p className="pg-popover-title">
                      What&apos;s new
                    </p>

                    {[
                      "Popover joins the library.",
                      "Density is now a provider axis.",
                      "Brand colour reaches every component.",
                      "Theme audits cover the new presets.",
                      "The playground gains a page per family.",
                      "Focus rings follow the preset.",
                      "Tokens rebuild on install.",
                      "Reduced motion disables the exit phase.",
                      "Forced colours keep a visible border.",
                      "Popovers flip when space runs out.",
                    ].map((item) => (
                      <p
                        key={item}
                        className="pg-popover-copy"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                }
              >
                <Button appearance="outline" fullWidth>
                  Release notes
                </Button>
              </Popover>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Escape and focus</CardTitle>
              <CardDescription>
                The trigger announces the dialog state, focus moves
                into the panel, and Escape returns it to the
                trigger.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-row">
                <Popover
                  label="Keyboard help"
                  closeOnSelect
                  content={
                    <div className="pg-stack">
                      <p className="pg-popover-title">
                        Keyboard
                      </p>

                      <p className="pg-popover-copy">
                        Tab moves through the panel. Escape closes
                        it and puts focus back on this trigger.
                      </p>

                      <Button size="sm" appearance="soft">
                        Got it
                      </Button>
                    </div>
                  }
                >
                  <Button appearance="outline">
                    Open with the keyboard
                  </Button>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
