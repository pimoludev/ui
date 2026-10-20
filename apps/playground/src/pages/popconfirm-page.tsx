import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Popconfirm,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

export function PopconfirmPage() {
  const [outcome, setOutcome] = useState(
    "No confirmation resolved yet"
  );

  const [controlledOpen, setControlledOpen] =
    useState(false);

  return (
    <>
      <PageHeader
        title="Popconfirm"
        hint="A small confirmation anchored to its trigger. It reuses Popover for positioning, outside dismissal and focus, starts on Cancel, and returns focus to the trigger when resolved. Escape, an outside click or a second trigger click counts as a cancel. Styles come from @pimolu/web-styles/popconfirm.css."
      />

      <Section
        title="Destructive confirmation"
        hint="The destructive variant colours the icon and the confirming action. Cancel is first in DOM order, so a destructive dialog never opens with focus on the irreversible button."
      >
        <div className="pg-stack">
          <div className="pg-row">
            <Popconfirm
              title="Delete the Atlas project?"
              description="All 24 tasks, 8 files and the project history will be permanently removed."
              variant="destructive"
              confirmLabel="Delete project"
              onConfirm={() =>
                setOutcome("Deleted the Atlas project")
              }
              onCancel={() =>
                setOutcome("Kept the Atlas project")
              }
            >
              <Button appearance="outline">
                Delete project
              </Button>
            </Popconfirm>

            <Badge variant="neutral">{outcome}</Badge>
          </div>

          <p className="pg-copy">
            Press Escape or click outside to cancel; both call
            onCancel as well. The panel closes after the action
            and focus is already back on the trigger.
          </p>
        </div>
      </Section>

      <Section
        title="Custom labels"
        hint="confirmLabel and cancelLabel accept any node, so an action can carry an icon or a translated label."
      >
        <div className="pg-row">
          <Popconfirm
            title="Archive this report?"
            description="You can restore it from the archive at any time."
            confirmLabel="Archive report"
            cancelLabel="Keep editing"
            onConfirm={() =>
              setOutcome("Archived the Q3 report")
            }
            onCancel={() =>
              setOutcome("Report left untouched")
            }
          >
            <Button appearance="soft">Archive report</Button>
          </Popconfirm>

          <Popconfirm
            title="Discard unsaved changes?"
            description="The current draft will be lost."
            variant="destructive"
            confirmLabel={
              <span className="pg-row">
                Discard
              </span>
            }
            onConfirm={() =>
              setOutcome("Discarded the draft")
            }
            onCancel={() =>
              setOutcome("Draft preserved")
            }
          >
            <Button appearance="ghost">
              Discard changes
            </Button>
          </Popconfirm>
        </div>
      </Section>

      <Section
        title="Controlled open state"
        hint="The page owns the open state. The external button opens the confirmation on its trigger without a click on it, which is useful for command palettes or keyboard shortcuts."
      >
        <div className="pg-row">
          <Popconfirm
            title="Publish this release?"
            description="The release notes will be visible to every customer."
            open={controlledOpen}
            onOpenChange={setControlledOpen}
            confirmLabel="Publish"
            onConfirm={() =>
              setOutcome("Published the release")
            }
            onCancel={() =>
              setOutcome("Release left unpublished")
            }
          >
            <Button appearance="outline">
              Publish release
            </Button>
          </Popconfirm>

          <Button
            appearance="ghost"
            onClick={() => setControlledOpen(true)}
          >
            Open from the page
          </Button>

          <Badge variant="primary">
            open: {controlledOpen ? "true" : "false"}
          </Badge>
        </div>
      </Section>

      <Section
        title="Placement and custom icon"
        hint="The panel flips when the preferred side has no room, exactly like Popover. icon replaces the default warning glyph."
      >
        <div className="pg-row">
          <Popconfirm
            placement="top"
            title="Move to the top?"
            description="The panel prefers the top side."
            onConfirm={() => setOutcome("Moved up")}
          >
            <Button size="sm" appearance="soft">
              Top
            </Button>
          </Popconfirm>

          <Popconfirm
            placement="right"
            title="Move to the right?"
            description="The panel prefers the right side."
            onConfirm={() => setOutcome("Moved right")}
          >
            <Button size="sm" appearance="soft">
              Right
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Restart the demo?"
            description="The local demo state will be cleared."
            icon={<span aria-hidden="true">↻</span>}
            confirmLabel="Restart"
            onConfirm={() => setOutcome("Demo restarted")}
          >
            <Button size="sm" appearance="soft">
              Custom icon
            </Button>
          </Popconfirm>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Keyboard and focus</CardTitle>
            <CardDescription>
              The panel is a dialog named by its title. Cancel
              receives the initial focus, Tab stays inside the
              two actions, Escape cancels, and focus returns to
              the trigger.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="pg-meta">
              The trigger keeps its own aria-haspopup and
              aria-expanded state through Popover.
            </p>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
