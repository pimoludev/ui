import {
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { Scheduler } from "./scheduler";
import type { PimoluSchedulerEvent } from "./scheduler.types";

const TODAY = new Date(2026, 9, 20, 10, 15);
const WEEK_START = new Date(2026, 9, 18);
const TUESDAY = new Date(2026, 9, 20);

const events: PimoluSchedulerEvent[] = [
  {
    id: "design-review",
    title: "Design review",
    start: new Date(2026, 9, 20, 9, 0),
    end: new Date(2026, 9, 20, 10, 30),
    color: "#4f46e5",
  },
  {
    id: "standup",
    title: "Team stand-up",
    start: new Date(2026, 9, 19, 9, 0),
    end: new Date(2026, 9, 19, 9, 30),
  },
];

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(TODAY);
});

afterEach(() => {
  vi.useRealTimers();
});

function gridHeader(name: string) {
  return screen.getByRole("columnheader", { name });
}

describe("Pimolu Scheduler", () => {
  it("bounds the timetable and exposes a compact short event with its complete time in the title", () => {
    const { container } = render(<Scheduler events={events} defaultDate={TUESDAY} maxHeight={420} />);
    expect(container.querySelector(".pimolu-scheduler__scroll")).toHaveStyle({ maxHeight: "420px" });
    const event = screen.getByRole("button", { name: /Team stand-up,.*9:00.*9:30/ });
    expect(event).toHaveAttribute("data-compact", "true");
    expect(event.getAttribute("title")).toMatch(/9:00.*9:30/);
  });
  it("renders a full week with day headers and an hourly grid", () => {
    render(
      <Scheduler
        events={[]}
        defaultDate={TUESDAY}
        aria-label="Team schedule"
      />
    );

    const grid = screen.getByRole("grid", {
      name: "Team schedule",
    });

    expect(
      within(grid).getAllByRole("columnheader")
    ).toHaveLength(8);

    expect(
      gridHeader("Sunday, October 18, 2026")
    ).toBeInTheDocument();

    expect(
      gridHeader("Saturday, October 24, 2026")
    ).toBeInTheDocument();

    expect(
      within(grid).getAllByRole("rowheader")
    ).toHaveLength(25);

    expect(
      gridHeader("Tuesday, October 20, 2026")
    ).toHaveAttribute("aria-current", "date");

    expect(
      screen.getByRole("status")
    ).toHaveTextContent("No events scheduled.");
  });

  it("renders timed events with an accessible time label and reports clicks", async () => {
    const user = userEvent.setup();
    const onEventClick = vi.fn();

    render(
      <Scheduler
        events={events}
        defaultDate={TUESDAY}
        onEventClick={onEventClick}
      />
    );

    const button = screen.getByRole("button", {
      name: /Design review, Tuesday, October 20, 2026, 9:00 AM to 10:30 AM/,
    });

    expect(button).toHaveTextContent("Design review");
    expect(button).toHaveTextContent("9:00 AM – 10:30 AM");

    await user.click(button);

    expect(onEventClick).toHaveBeenCalledTimes(1);
    expect(onEventClick).toHaveBeenCalledWith(events[0]);
  });

  it("navigates between weeks and reacts to the Today button", async () => {
    const user = userEvent.setup();
    const onDateChange = vi.fn();

    render(
      <Scheduler
        events={[]}
        defaultDate={TUESDAY}
        onDateChange={onDateChange}
      />
    );

    expect(
      screen.getByText("Oct 18 – 24, 2026")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Previous week",
      })
    );

    expect(
      onDateChange.mock.calls[0][0]
    ).toBeInstanceOf(Date);
    expect(
      onDateChange.mock.calls[0][0].getDate()
    ).toBe(13);
    expect(
      screen.getByText("Oct 11 – 17, 2026")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Next week",
      })
    );

    expect(
      screen.getByText("Oct 18 – 24, 2026")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Today" })
    );

    expect(
      onDateChange.mock.lastCall?.[0].getDate()
    ).toBe(20);
  });

  it("keeps a controlled date fixed while still reporting navigation", async () => {
    const user = userEvent.setup();
    const onDateChange = vi.fn();

    render(
      <Scheduler
        events={[]}
        date={TUESDAY}
        onDateChange={onDateChange}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Next week",
      })
    );

    expect(onDateChange).toHaveBeenCalledTimes(1);
    expect(
      onDateChange.mock.calls[0][0].getDate()
    ).toBe(27);
    expect(
      screen.getByText("Oct 18 – 24, 2026")
    ).toBeInTheDocument();
  });

  it("renders all-day events in a dedicated row", async () => {
    const user = userEvent.setup();
    const onEventClick = vi.fn();

    const allDay: PimoluSchedulerEvent[] = [
      {
        id: "offsite",
        title: "Company offsite",
        start: new Date(2026, 9, 19),
        end: new Date(2026, 9, 21),
        allDay: true,
      },
    ];

    render(
      <Scheduler
        events={allDay}
        defaultDate={TUESDAY}
        onEventClick={onEventClick}
      />
    );

    const buttons = screen.getAllByRole("button", {
      name: /Company offsite, all day/,
    });

    expect(buttons).toHaveLength(2);
    expect(
      screen.getByRole("rowheader", {
        name: "All day",
      })
    ).toBeInTheDocument();

    await user.click(buttons[0]);

    expect(onEventClick).toHaveBeenCalledWith(
      allDay[0]
    );
  });

  it("reports slot payloads and honours min and max time", async () => {
    const user = userEvent.setup();
    const onSlotClick = vi.fn();

    render(
      <Scheduler
        events={[]}
        defaultDate={TUESDAY}
        minTime={9 * 60}
        maxTime={17 * 60}
        onSlotClick={onSlotClick}
      />
    );

    expect(
      screen.queryByRole("rowheader", {
        name: "8 AM",
      })
    ).not.toBeInTheDocument();

    const slot = screen.getByRole("button", {
      name: /Add event on Monday, October 19, 2026 at 9:00 AM/,
    });

    await user.click(slot);

    const payload = onSlotClick.mock
      .calls[0][0] as {
      date: Date;
      start: Date;
      end: Date;
    };

    expect(payload.date.getFullYear()).toBe(2026);
    expect(payload.date.getMonth()).toBe(9);
    expect(payload.date.getDate()).toBe(19);
    expect(payload.date.getHours()).toBe(0);

    expect(payload.start.getHours()).toBe(9);
    expect(payload.end.getHours()).toBe(10);
  });

  it("formats labels with the locale and starts the week on the requested day", () => {
    const expectedFirstDay =
      new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(2026, 9, 19));

    render(
      <Scheduler
        events={[]}
        defaultDate={TUESDAY}
        weekStartsOn={1}
        locale="fr-FR"
      />
    );

    const firstDay = gridHeader(expectedFirstDay);

    expect(firstDay).toBeInTheDocument();
    expect(
      within(firstDay).getByText("lun.")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/19 – 25, 2026/)
    ).toBeInTheDocument();
  });

  it("lays overlapping events out in separate lanes", () => {
    const overlapping: PimoluSchedulerEvent[] = [
      {
        id: "a",
        title: "Roadmap review",
        start: new Date(2026, 9, 20, 9),
        end: new Date(2026, 9, 20, 11),
      },
      {
        id: "b",
        title: "Customer call",
        start: new Date(2026, 9, 20, 10),
        end: new Date(2026, 9, 20, 12),
      },
    ];

    render(
      <Scheduler
        events={overlapping}
        defaultDate={TUESDAY}
      />
    );

    const first = screen.getByRole("button", {
      name: /Roadmap review/,
    });

    const second = screen.getByRole("button", {
      name: /Customer call/,
    });

    expect(first).toHaveAttribute("data-lanes", "2");
    expect(second).toHaveAttribute("data-lanes", "2");
    expect(first).toHaveAttribute("data-lane", "0");
    expect(second).toHaveAttribute("data-lane", "1");
    expect(first).toHaveStyle({ width: "50%" });
    expect(second).toHaveStyle({ width: "50%" });
  });

  it("shows the current-time indicator only when enabled", () => {
    const { container, rerender } = render(
      <Scheduler
        events={[]}
        defaultDate={TUESDAY}
      />
    );

    expect(
      container.querySelector(
        '[data-current-time="true"]'
      )
    ).not.toBeNull();

    rerender(
      <Scheduler
        events={[]}
        defaultDate={TUESDAY}
        showCurrentTime={false}
      />
    );

    expect(
      container.querySelector(
        '[data-current-time="true"]'
      )
    ).toBeNull();
  });

  it("switches to a single day view", async () => {
    const user = userEvent.setup();
    const onViewChange = vi.fn();

    render(
      <Scheduler
        events={events}
        defaultDate={TUESDAY}
        onViewChange={onViewChange}
      />
    );

    await user.click(
      screen.getByRole("radio", { name: "Day" })
    );

    expect(onViewChange).toHaveBeenCalledWith("day");
    expect(
      screen.getAllByRole("columnheader")
    ).toHaveLength(2);
    expect(
      screen.getByText("Tuesday, October 20, 2026")
    ).toBeInTheDocument();
  });
  it("has one grid tab stop and supports arrows, boundaries, activation and cell actions", async () => {
    const user = userEvent.setup();
    const onSlotClick = vi.fn();
    render(<Scheduler events={events} defaultDate={TUESDAY} minTime={8 * 60} maxTime={12 * 60} onSlotClick={onSlotClick} />);
    const grid = screen.getByRole("grid");
    expect(grid.querySelectorAll('[tabindex="0"]')).toHaveLength(1);
    const initial = grid.querySelector<HTMLElement>('[tabindex="0"]')!;
    initial.focus();
    await user.keyboard("{ArrowRight}{ArrowDown}");
    expect(document.activeElement).toHaveAttribute("data-scheduler-row", "2");
    expect(document.activeElement).toHaveAttribute("data-scheduler-column", "1");
    await user.keyboard("{Enter}");
    expect(onSlotClick).toHaveBeenCalledOnce();
    await user.keyboard("{F2}");
    expect(document.activeElement?.tagName).toBe("BUTTON");
    await user.tab({ shift: true });
    expect(document.activeElement).toHaveAttribute("role", "gridcell");
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toHaveAttribute("data-scheduler-column", "2");
    await user.keyboard("{F2}");
    await user.keyboard("{Escape}");
    expect(document.activeElement).toHaveAttribute("role", "gridcell");
    await user.keyboard("{Control>}{End}{/Control}");
    expect(document.activeElement).toHaveAttribute("data-scheduler-row", "4");
    expect(document.activeElement).toHaveAttribute("data-scheduler-column", "6");
    await user.keyboard("{ArrowRight}{ArrowDown}");
    expect(document.activeElement).toHaveAttribute("data-scheduler-column", "6");
    await user.keyboard("{Control>}{Home}{/Control}");
    expect(document.activeElement).toHaveAttribute("data-scheduler-row", "0");
    expect(document.activeElement).toHaveAttribute("data-scheduler-column", "0");
  });

  it("keeps a single valid cell after switching view and supports a read-only day", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Scheduler events={[]} defaultDate={TUESDAY} minTime={8 * 60} maxTime={10 * 60} />);
    const grid = screen.getByRole("grid");
    (grid.querySelector('[tabindex="0"]') as HTMLElement).focus();
    await user.keyboard("{End}");
    rerender(<Scheduler events={[]} defaultDate={TUESDAY} view="day" minTime={8 * 60} maxTime={10 * 60} />);
    expect(grid.querySelectorAll('[tabindex="0"]')).toHaveLength(1);
    (grid.querySelector('[tabindex="0"]') as HTMLElement).focus();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveAttribute("data-scheduler-column", "0");
    expect(document.activeElement).toHaveAttribute("data-scheduler-row", "2");
  });

});
