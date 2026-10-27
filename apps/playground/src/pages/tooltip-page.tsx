import { CustomizationExample } from "./tooltip-customization-demo";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tooltip,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

export function TooltipPage() {
  return (
    <>
      <PageHeader
        title="Tooltip"
        hint="A short description attached to the element it points at. It opens on hover or keyboard focus, closes on Escape, and is rendered through the shared portal so it is never clipped. Styles come from @pimolu/web-styles/tooltip.css."
      />

      <Section
        title="Placement"
        hint="Four sides, a caret, and an automatic flip when the preferred side has no room."
      >
        <div className="pg-row">
          <Tooltip content="Above the trigger" placement="top" arrow>
            <Button appearance="outline">Top</Button>
          </Tooltip>

          <Tooltip content="Below the trigger" placement="bottom">
            <Button appearance="outline">Bottom</Button>
          </Tooltip>

          <Tooltip content="On the left" placement="left" arrow>
            <Button appearance="outline">Left</Button>
          </Tooltip>

          <Tooltip content="On the right" placement="right">
            <Button appearance="outline">Right</Button>
          </Tooltip>

          <Tooltip content="Any element can be the trigger" arrow>
            <Badge variant="primary">Badge trigger</Badge>
          </Tooltip>
        </div>
      </Section>

      <Section
        title="Timing"
        hint="delay is in milliseconds; disabled never opens."
      >
        <div className="pg-row">
          <Tooltip content="No delay at all" delay={0}>
            <Button appearance="soft">delay 0</Button>
          </Tooltip>

          <Tooltip content="Two seconds to read the label" delay={2000}>
            <Button appearance="soft">delay 2000</Button>
          </Tooltip>

          <Tooltip content="Never shown" disabled>
            <Button appearance="soft">disabled</Button>
          </Tooltip>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Truncated label</CardTitle>
              <CardDescription>
                The full value lives in the tooltip, the trigger stays
                a single line.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-row">
                <span className="pg-meta">
                  build/artifacts/2026-10-19/
                </span>

                <Tooltip content="build/artifacts/2026-10-19/pimolu-web-styles-0.1.0.tgz">
                  <Button size="sm" appearance="ghost">
                    .tgz
                  </Button>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keyboard shortcut</CardTitle>
              <CardDescription>
                The description is wired through aria-describedby only
                while the bubble is open.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-row">
                <Tooltip content="Search everything (⌘ K)" arrow>
                  <Button>Search</Button>
                </Tooltip>

                <span className="pg-meta">focus it with Tab</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Icon-only action</CardTitle>
              <CardDescription>
                When the button has no text, the tooltip names it —
                but the title stays outside the tooltip for screen
                readers that never open it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-row">
                <Tooltip content="Copy to clipboard">
                  <Button
                    size="sm"
                    appearance="outline"
                    aria-label="Copy to clipboard"
                  >
                    ⎘
                  </Button>
                </Tooltip>

                <Tooltip content="Delete permanently">
                  <Button
                    size="sm"
                    variant="danger"
                    aria-label="Delete permanently"
                  >
                    ✕
                  </Button>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>In a scrollable list</CardTitle>
              <CardDescription>
                The bubble sits in a portal with fixed coordinates,
                so an ancestor with overflow: hidden cannot clip it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-scroll-demo">
                {[
                  "Design tokens",
                  "Themes and presets",
                  "Components",
                  "Playground",
                ].map((item) => (
                  <Tooltip key={item} content={`Open ${item}`}>
                    <Button size="sm" appearance="ghost">
                      {item}
                    </Button>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
