import { CustomizationExample } from "./timeline-customization-demo";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10.5L12 3l9 7.5V21H3z" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 8v5M12 17h.01" />
    </svg>
  );
}

export function TimelinePage() {
  return (
    <>
      <PageHeader
        title="Timeline"
        hint="A chronological ordered list with a connecting line, status markers, icons, semantic time elements and a compact density. Styles come from @pimolu/web-styles/timeline.css."
      />

      <Section
        title="Order tracking"
        hint="Completed, active and upcoming entries share one list. The active entry exposes aria-current."
      >
        <Card>
          <CardHeader>
            <CardTitle>Order PM-1042</CardTitle>
            <CardDescription>
              Arrives Tuesday, 21 October.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Timeline aria-label="Order tracking">
              <TimelineItem
                status="complete"
                icon={<CheckIcon />}
              >
                <TimelineContent>
                  <TimelineTitle>
                    Order placed
                  </TimelineTitle>

                  <TimelineDescription>
                    Payment confirmed for the Pro plan.
                  </TimelineDescription>

                  <TimelineTime dateTime="2026-10-17T09:12">
                    17 Oct, 09:12
                  </TimelineTime>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem
                status="complete"
                icon={<CheckIcon />}
              >
                <TimelineContent>
                  <TimelineTitle>
                    Packed in Lyon
                  </TimelineTitle>

                  <TimelineDescription>
                    Two boxes handed to the carrier.
                  </TimelineDescription>

                  <TimelineTime dateTime="2026-10-18T16:40">
                    18 Oct, 16:40
                  </TimelineTime>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem
                status="active"
                icon={<TruckIcon />}
              >
                <TimelineContent>
                  <TimelineTitle>
                    Out for delivery
                  </TimelineTitle>

                  <TimelineDescription>
                    The driver is 4 stops away.
                  </TimelineDescription>

                  <TimelineTime dateTime="2026-10-19T08:05">
                    19 Oct, 08:05
                  </TimelineTime>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem icon={<HomeIcon />}>
                <TimelineContent>
                  <TimelineTitle>
                    Delivered
                  </TimelineTitle>

                  <TimelineDescription>
                    Expected between 10:00 and 12:00.
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Explicit indicator"
        hint="TimelineIndicator and TimelineContent can be composed directly when the entry needs a custom marker or an error state."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Deployment log</CardTitle>
            </CardHeader>

            <CardContent>
              <Timeline aria-label="Deployment log">
                <TimelineItem status="complete">
                  <TimelineIndicator>
                    <CheckIcon />
                  </TimelineIndicator>

                  <TimelineContent>
                    <TimelineTitle>Build passed</TimelineTitle>

                    <TimelineDescription>
                      42 tests, 0 failures.
                    </TimelineDescription>

                    <TimelineTime dateTime="2026-10-19T10:02">
                      10:02
                    </TimelineTime>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem status="error">
                  <TimelineIndicator>
                    <AlertIcon />
                  </TimelineIndicator>

                  <TimelineContent>
                    <TimelineTitle>Smoke test failed</TimelineTitle>

                    <TimelineDescription>
                      The checkout route returned 502.
                    </TimelineDescription>

                    <TimelineTime dateTime="2026-10-19T10:06">
                      10:06
                    </TimelineTime>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem status="active">
                  <TimelineIndicator />

                  <TimelineContent>
                    <TimelineTitle>Rolling back</TimelineTitle>

                    <TimelineDescription>
                      Restoring the previous release.
                    </TimelineDescription>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Centred indicators</CardTitle>

              <CardDescription>
                align="center" centres the marker against
                taller entries.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Timeline
                aria-label="Review history"
                align="center"
              >
                <TimelineItem status="complete">
                  <TimelineContent>
                    <TimelineTitle>
                      Submitted for review
                    </TimelineTitle>

                    <TimelineDescription>
                      Three reviewers were assigned.
                    </TimelineDescription>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem status="active">
                  <TimelineContent>
                    <TimelineTitle>
                      Changes requested
                    </TimelineTitle>

                    <TimelineDescription>
                      Tighten the spacing on the summary
                      card.
                    </TimelineDescription>

                    <TimelineTime dateTime="2026-10-19T11:30">
                      11:30
                    </TimelineTime>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineContent>
                    <TimelineTitle>
                      Ready to merge
                    </TimelineTitle>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Compact activity feed"
        hint="The compact variant tightens spacing and type, with plain markers for entries without a status."
      >
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>
              Everything that happened in the workspace
              today.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Timeline
              aria-label="Activity"
              variant="compact"
            >
              <TimelineItem status="complete">
                <TimelineContent>
                  <TimelineTitle>
                    Ada invited Grace to the workspace
                  </TimelineTitle>

                  <TimelineTime dateTime="2026-10-19T09:14">
                    09:14
                  </TimelineTime>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem status="complete">
                <TimelineContent>
                  <TimelineTitle>
                    Release 2.4.0 was published
                  </TimelineTitle>

                  <TimelineDescription>
                    New Table, Stat, Timeline and Rating
                    components.
                  </TimelineDescription>

                  <TimelineTime dateTime="2026-10-19T10:02">
                    10:02
                  </TimelineTime>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem status="active">
                <TimelineContent>
                  <TimelineTitle>
                    Migration is running
                  </TimelineTitle>

                  <TimelineDescription>
                    8 of 12 collections processed.
                  </TimelineDescription>

                  <TimelineTime dateTime="2026-10-19T10:31">
                    10:31
                  </TimelineTime>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem status="error">
                <TimelineContent>
                  <TimelineTitle>
                    Import rejected
                  </TimelineTitle>

                  <TimelineDescription>
                    Row 214 contains an unknown locale.
                  </TimelineDescription>

                  <TimelineTime dateTime="2026-10-19T10:35">
                    10:35
                  </TimelineTime>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Example"
        hint="Statuses can also carry a badge in the description when the entry needs a short label."
      >
        <Card>
          <CardHeader>
            <CardTitle>Security review</CardTitle>
          </CardHeader>

          <CardContent>
            <Timeline aria-label="Security review">
              <TimelineItem status="complete">
                <TimelineContent>
                  <TimelineTitle>
                    Dependency audit
                  </TimelineTitle>

                  <TimelineDescription>
                    <span className="pg-row">
                      No critical advisories
                      <Badge variant="success">
                        passed
                      </Badge>
                    </span>
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem status="active">
                <TimelineContent>
                  <TimelineTitle>
                    Penetration test
                  </TimelineTitle>

                  <TimelineDescription>
                    <span className="pg-row">
                      Scheduled with the external team
                      <Badge variant="warning">
                        in progress
                      </Badge>
                    </span>
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </CardContent>
        </Card>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
