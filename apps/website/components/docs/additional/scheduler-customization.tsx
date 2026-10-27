"use client";

import { Scheduler, type PimoluSchedulerEvent } from "@pimolu/react";

const DEMO_WEEK = new Date(2026, 9, 20);
const teamEvents: PimoluSchedulerEvent[] = [
  {
    id: "standup",
    title: "Team stand-up",
    start: new Date(2026, 9, 19, 9, 0),
    end: new Date(2026, 9, 19, 9, 30),
    color: "#0ea5e9",
  },
  {
    id: "design-review",
    title: "Design review",
    start: new Date(2026, 9, 20, 10, 0),
    end: new Date(2026, 9, 20, 11, 30),
    color: "#4f46e5",
  },
  {
    id: "customer-call",
    title: "Customer call",
    start: new Date(2026, 9, 20, 10, 30),
    end: new Date(2026, 9, 20, 11, 45),
    color: "#d97706",
  },
  {
    id: "planning",
    title: "Sprint planning",
    start: new Date(2026, 9, 21, 14, 0),
    end: new Date(2026, 9, 21, 15, 30),
    color: "#16a34a",
  },
  {
    id: "release",
    title: "Release window",
    start: new Date(2026, 9, 22),
    end: new Date(2026, 9, 23),
    color: "#dc2626",
    allDay: true,
  },
  {
    id: "retro",
    title: "Sprint retro",
    start: new Date(2026, 9, 23, 16, 0),
    end: new Date(2026, 9, 23, 17, 0),
    color: "#7c3aed",
  },
];

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <Scheduler
            events={teamEvents}
            defaultDate={DEMO_WEEK}
            defaultView="day"
            showCurrentTime={false}
            aria-label="Read-only team day"
            classNames={{
              root: "custom-scheduler-root",
              title: "custom-scheduler-title"
            }}
          />
        </>)
      }
      <style>
        {
          `
.custom-scheduler-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-scheduler-title {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
