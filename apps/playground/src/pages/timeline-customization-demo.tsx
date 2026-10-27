"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
  TimelineTime
} from "@pimolu/react";

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

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <Card>
            <CardHeader>
              <CardTitle>Order PM-1042</CardTitle>
              <CardDescription>
                Arrives Tuesday, 21 October.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline
                aria-label="Order tracking"
                classNames={{
                  root: "custom-timeline-root",
                  title: "custom-timeline-title"
                }}
              >
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
        </>)
      }
      <style>
        {
          `
.custom-timeline-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-timeline-title {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
