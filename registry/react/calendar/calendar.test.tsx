import {
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { Calendar } from "./calendar";

const TODAY = new Date(2026, 9, 20, 9, 30);
const OCTOBER = new Date(2026, 9, 1);

function day(name: string) {
  return screen.getByRole("gridcell", { name });
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(TODAY);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Pimolu Calendar", () => {
  it("renders a real six-week grid with column headers and today", () => {
    render(
      <Calendar
        defaultMonth={OCTOBER}
        aria-label="Booking date"
      />
    );

    const grid = screen.getByRole("grid", {
      name: "October 2026",
    });

    expect(
      screen.getByRole("group", { name: "Booking date" })
    ).toBeInTheDocument();

    expect(
      within(grid).getAllByRole("columnheader")
    ).toHaveLength(7);

    expect(
      within(grid).getAllByRole("gridcell")
    ).toHaveLength(42);

    expect(
      screen.getByRole("gridcell", {
        name: "Thursday, October 1, 2026",
      })
    ).toHaveTextContent("1");

    const today = day("Tuesday, October 20, 2026");

    expect(today).toHaveAttribute("aria-current", "date");
    expect(today).toHaveAttribute("tabindex", "0");
  });

  it("selects a day with the mouse and reports a local-midnight date", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Calendar
        defaultMonth={OCTOBER}
        onSelect={onSelect}
      />
    );

    await user.click(
      day("Monday, October 12, 2026")
    );

    expect(onSelect).toHaveBeenCalledTimes(1);

    const selected = onSelect.mock.calls[0][0] as Date;

    expect(selected.getFullYear()).toBe(2026);
    expect(selected.getMonth()).toBe(9);
    expect(selected.getDate()).toBe(12);
    expect(selected.getHours()).toBe(0);

    expect(
      day("Monday, October 12, 2026")
    ).toHaveAttribute("aria-selected", "true");
  });

  it("moves a roving tab stop with the arrow keys and selects with Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Calendar
        defaultMonth={OCTOBER}
        selected={new Date(2026, 9, 12)}
        onSelect={onSelect}
      />
    );

    const start = day("Monday, October 12, 2026");

    start.focus();

    expect(start).toHaveFocus();

    await user.keyboard("{ArrowRight}");

    const next = day("Tuesday, October 13, 2026");

    expect(next).toHaveFocus();
    expect(next).toHaveAttribute("tabindex", "0");
    expect(start).toHaveAttribute("tabindex", "-1");

    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenLastCalledWith(
      new Date(2026, 9, 13)
    );

    await user.keyboard("{ArrowRight}");

    expect(
      day("Wednesday, October 14, 2026")
    ).toHaveFocus();

    await user.keyboard(" ");

    expect(onSelect).toHaveBeenLastCalledWith(
      new Date(2026, 9, 14)
    );
  });

  it("navigates months with PageDown and moves focus with the month", async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();

    render(
      <Calendar
        defaultMonth={OCTOBER}
        selected={new Date(2026, 9, 20)}
        onMonthChange={onMonthChange}
      />
    );

    day("Tuesday, October 20, 2026").focus();

    await user.keyboard("{PageDown}");

    expect(
      screen.getByRole("grid", {
        name: "November 2026",
      })
    ).toBeInTheDocument();

    expect(
      day("Friday, November 20, 2026")
    ).toHaveFocus();

    expect(
      onMonthChange.mock.calls[0][0]
    ).toEqual(new Date(2026, 10, 1));
  });

  it("moves to the start and end of the week with Home and End", async () => {
    const user = userEvent.setup();

    render(
      <Calendar
        defaultMonth={OCTOBER}
        selected={new Date(2026, 9, 20)}
      />
    );

    day("Tuesday, October 20, 2026").focus();

    await user.keyboard("{Home}");

    expect(
      day("Sunday, October 18, 2026")
    ).toHaveFocus();

    await user.keyboard("{End}");

    expect(
      day("Saturday, October 24, 2026")
    ).toHaveFocus();
  });

  it("blocks dates outside min/max and the disabledDates list", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Calendar
        defaultMonth={OCTOBER}
        min={new Date(2026, 9, 5)}
        max={new Date(2026, 9, 25)}
        disabledDates={[new Date(2026, 9, 14)]}
        onSelect={onSelect}
      />
    );

    const tooEarly = day("Sunday, October 4, 2026");
    const blocked = day("Wednesday, October 14, 2026");
    const tooLate = day("Monday, October 26, 2026");
    const firstAllowed = day("Monday, October 5, 2026");

    expect(tooEarly).toHaveAttribute("aria-disabled", "true");
    expect(blocked).toHaveAttribute("aria-disabled", "true");
    expect(tooLate).toHaveAttribute("aria-disabled", "true");
    expect(firstAllowed).not.toHaveAttribute(
      "aria-disabled"
    );

    await user.click(tooEarly);
    await user.click(blocked);
    await user.click(tooLate);

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("accepts a predicate for disabledDates", () => {
    render(
      <Calendar
        defaultMonth={OCTOBER}
        disabledDates={(date) => date.getDay() === 0}
      />
    );

    expect(
      day("Sunday, October 11, 2026")
    ).toHaveAttribute("aria-disabled", "true");

    expect(
      day("Monday, October 12, 2026")
    ).not.toHaveAttribute("aria-disabled");
  });

  it("honours weekStartsOn when building the grid", () => {
    render(
      <Calendar
        defaultMonth={OCTOBER}
        weekStartsOn={1}
      />
    );

    const headers = screen.getAllByRole("columnheader");

    expect(headers[0]).toHaveAccessibleName("Monday");

    const cells = screen.getAllByRole("gridcell");

    expect(cells[0]).toHaveAccessibleName(
      "Monday, September 28, 2026"
    );
  });

  it("selects a range in two clicks and starts over on the third", async () => {
    const user = userEvent.setup();
    const onRangeChange = vi.fn();

    render(
      <Calendar
        mode="range"
        defaultMonth={OCTOBER}
        onRangeChange={onRangeChange}
      />
    );

    await user.click(
      day("Monday, October 12, 2026")
    );

    expect(onRangeChange).toHaveBeenLastCalledWith({
      from: new Date(2026, 9, 12),
      to: null,
    });

    expect(
      day("Monday, October 12, 2026")
    ).toHaveAttribute("aria-selected", "true");

    await user.click(
      day("Friday, October 16, 2026")
    );

    expect(onRangeChange).toHaveBeenLastCalledWith({
      from: new Date(2026, 9, 12),
      to: new Date(2026, 9, 16),
    });

    expect(
      day("Monday, October 12, 2026")
    ).toHaveAttribute("data-range-start", "true");

    expect(
      day("Friday, October 16, 2026")
    ).toHaveAttribute("data-range-end", "true");

    expect(
      day("Wednesday, October 14, 2026")
    ).toHaveAttribute("data-in-range", "true");

    expect(
      day("Wednesday, October 14, 2026")
    ).toHaveAttribute("aria-selected", "true");

    await user.click(
      day("Tuesday, October 20, 2026")
    );

    expect(onRangeChange).toHaveBeenLastCalledWith({
      from: new Date(2026, 9, 20),
      to: null,
    });

    expect(
      day("Monday, October 12, 2026")
    ).toHaveAttribute("aria-selected", "false");
  });

  it("formats month and weekday labels with the locale", () => {
    render(
      <Calendar
        defaultMonth={OCTOBER}
        locale="fr-FR"
      />
    );

    expect(
      screen.getByRole("grid", {
        name: "octobre 2026",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", {
        name: "lundi",
      })
    ).toBeInTheDocument();
  });

  it("follows a controlled month and reports navigation", async () => {
    const user = userEvent.setup();

    function Example() {
      const [month, setMonth] = useState(OCTOBER);

      return (
        <>
          <Calendar
            month={month}
            onMonthChange={setMonth}
          />

          <span data-testid="month">{month.getMonth()}</span>
        </>
      );
    }

    render(<Example />);

    expect(
      screen.getByRole("grid", {
        name: "October 2026",
      })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Next month",
      })
    );

    expect(
      screen.getByRole("grid", {
        name: "November 2026",
      })
    ).toBeInTheDocument();

    expect(screen.getByTestId("month")).toHaveTextContent(
      "10"
    );
  });

  it("renders two months and keeps them consecutive when navigating", async () => {
    const user = userEvent.setup();

    render(
      <Calendar
        defaultMonth={OCTOBER}
        numberOfMonths={2}
      />
    );

    expect(
      screen.getByRole("grid", {
        name: "October 2026",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("grid", {
        name: "November 2026",
      })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Next month",
      })
    );

    expect(
      screen.getByRole("grid", {
        name: "November 2026",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("grid", {
        name: "December 2026",
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("grid", {
        name: "October 2026",
      })
    ).toBeNull();
  });
});
