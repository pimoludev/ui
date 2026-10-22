"use client";

import { Scheduler } from "@pimolu/react";

export function DemoExample() {
  return <Scheduler
    aria-label="Design studio agenda"
    defaultDate={new Date(2026, 9, 20)}
    defaultView="day"
    minTime={9 * 60}
    maxTime={13 * 60}
    hourHeight={48}
    showCurrentTime={false}
    events={[{
      id: "design-review",
      title: "Design review",
      start: new Date(2026, 9, 20, 10),
      end: new Date(2026, 9, 20, 11),
    }]}
  />;
}
