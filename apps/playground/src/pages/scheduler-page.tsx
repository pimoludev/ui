import { useState } from "react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Scheduler,
  type PimoluSchedulerEvent,
  type PimoluSchedulerSlot,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

/* =========================================
   DEMO DATA
========================================= */

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

const timeFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatTimeRange(event: PimoluSchedulerEvent) {
  if (event.allDay) {
    return "All day";
  }

  return `${timeFormat.format(event.start)} – ${timeFormat.format(event.end)}`;
}

/* =========================================
   EXAMPLES
========================================= */

function WeekSchedulerExample() {
  const [date, setDate] = useState(DEMO_WEEK);
  const [selected, setSelected] =
    useState<PimoluSchedulerEvent | null>(
      teamEvents[1]
    );
  const [lastSlot, setLastSlot] =
    useState<PimoluSchedulerSlot | null>(null);

  return (
    <div className="pg-stack">
      <Scheduler
        aria-label="Product team week"
        events={teamEvents}
        date={date}
        onDateChange={setDate}
        onEventClick={setSelected}
        onSlotClick={setLastSlot}
        weekStartsOn={1}
        minTime={8 * 60}
        maxTime={19 * 60}
      />

      <div className="pg-grid pg-grid--two">
        <Card>
          <CardHeader>
            <CardTitle>
              {selected?.title ?? "Select an event"}
            </CardTitle>
            <CardDescription>
              {selected
                ? formatTimeRange(selected)
                : "Click an event to inspect its details."}
            </CardDescription>
          </CardHeader>

          <CardContent className="pg-stack">
            {selected ? (
              <>
                <div className="pg-row">
                  <Badge variant="neutral">
                    {selected.allDay
                      ? "All day"
                      : "Timed event"}
                  </Badge>
                  <Badge variant="primary">
                    {selected.id}
                  </Badge>
                </div>

                <p className="pg-muted">
                  The event button carries its weekday,
                  date and time range as an accessible
                  label. Overlapping events share the day
                  column without covering each other.
                </p>
              </>
            ) : (
              <p className="pg-muted">
                No event selected yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create from a slot</CardTitle>
            <CardDescription>
              Click an empty hour to receive a slot
              payload.
            </CardDescription>
          </CardHeader>

          <CardContent className="pg-stack">
            {lastSlot ? (
              <>
                <p className="pg-muted">
                  {new Intl.DateTimeFormat("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  }).format(lastSlot.date)}
                </p>

                <p>
                  {new Intl.DateTimeFormat("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  }).format(lastSlot.start)}{" "}
                  –{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  }).format(lastSlot.end)}
                </p>
              </>
            ) : (
              <p className="pg-muted">
                No slot selected. The handler receives
                the local date, the slot start and its
                end.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DaySchedulerExample() {
  const [date, setDate] = useState(
    new Date(2026, 9, 20)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Single day, trimmed hours</CardTitle>
        <CardDescription>
          Day view with minTime and maxTime narrowed to
          working hours.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Scheduler
          aria-label="Tuesday agenda"
          events={teamEvents}
          date={date}
          defaultView="day"
          onDateChange={setDate}
          weekStartsOn={1}
          minTime={8 * 60}
          maxTime={19 * 60}
          hourHeight={64}
        />
      </CardContent>
    </Card>
  );
}

/* =========================================
   PAGE
========================================= */

export function SchedulerPage() {
  return (
    <>
      <PageHeader
        title="Scheduler"
        hint="Week and day calendar with an hourly axis, all-day events, overlap lanes and accessible navigation."
      />

      <Section
        title="Week view"
        hint="Controlled date, event selection and slot clicks. Overlaps are laid out in lanes."
      >
        <WeekSchedulerExample />
      </Section>

      <Section title="Keyboard navigation" hint="Tab enters one cell. Arrow keys move across days and hours; Home/End reach row edges. F2 enters cell actions and Escape returns to the cell."><DaySchedulerExample /></Section>
      <Section title="Read-only schedule" hint="Cells remain keyboard navigable even without an add-event handler."><Scheduler events={teamEvents} defaultDate={DEMO_WEEK} defaultView="day" showCurrentTime={false} aria-label="Read-only team day" /></Section>
      <Section
        title="Day view"
        hint="The same component with a one-day window and a shorter hour range."
      >
        <DaySchedulerExample />
      </Section>
    </>
  );
}
