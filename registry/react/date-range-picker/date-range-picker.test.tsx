import {
  render,
  screen,
  waitFor,
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

import { DateRangePicker } from "./date-range-picker";
import type { PimoluDateRange } from "./date-range-picker.types";

const TODAY = new Date(2026, 9, 20, 9, 30);
const RANGE = {
  from: new Date(2026, 9, 12),
  to: new Date(2026, 9, 18),
};

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

describe("Pimolu DateRangePicker", () => {
  it("opens two consecutive months by default", async () => {
    const user = userEvent.setup();

    render(<DateRangePicker label="Stay dates" />);

    const trigger = screen.getByRole("button", {
      name: "Stay dates",
    });

    expect(trigger).toHaveTextContent("Select date range");
    expect(trigger).toHaveAttribute(
      "aria-haspopup",
      "dialog"
    );

    await user.click(trigger);

    expect(
      screen.getByRole("dialog", {
        name: "Stay dates",
      })
    ).toBeInTheDocument();

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

    expect(
      screen.getByText("Select a start date.")
    ).toBeInTheDocument();
  });

  it("summarises an existing range in the footer", async () => {
    const user = userEvent.setup();

    render(
      <DateRangePicker
        label="Stay dates"
        defaultValue={RANGE}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Stay dates",
      })
    );

    expect(
      screen.getByText("7 days selected")
    ).toBeInTheDocument();
  });

  it("keeps the panel open after the first click and asks for an end date", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateRangePicker
        label="Stay dates"
        onChange={onChange}
      />
    );

    const trigger = screen.getByRole("button", {
      name: "Stay dates",
    });

    await user.click(trigger);
    await user.click(day("Monday, October 12, 2026"));

    expect(onChange).toHaveBeenLastCalledWith({
      from: new Date(2026, 9, 12),
      to: null,
    });

    expect(trigger).toHaveTextContent(
      "From Oct 12, 2026"
    );

    expect(
      screen.getByRole("dialog", {
        name: "Stay dates",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Select an end date.")
    ).toBeInTheDocument();
  });

  it("completes the range, closes and returns focus", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateRangePicker
        label="Stay dates"
        onChange={onChange}
      />
    );

    const trigger = screen.getByRole("button", {
      name: "Stay dates",
    });

    await user.click(trigger);
    await user.click(day("Monday, October 12, 2026"));
    await user.click(day("Sunday, October 18, 2026"));

    expect(onChange).toHaveBeenLastCalledWith({
      from: new Date(2026, 9, 12),
      to: new Date(2026, 9, 18),
    });

    expect(trigger).toHaveTextContent(
      "Oct 12, 2026 – Oct 18, 2026"
    );

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    expect(trigger).toHaveFocus();

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("applies a preset and closes on a complete range", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateRangePicker
        label="Stay dates"
        presets={[
          {
            label: "Last 7 days",
            range: {
              from: new Date(2026, 9, 14),
              to: new Date(2026, 9, 20),
            },
          },
        ]}
        onChange={onChange}
      />
    );

    const trigger = screen.getByRole("button", {
      name: "Stay dates",
    });

    await user.click(trigger);

    await user.click(
      screen.getByRole("button", {
        name: "Last 7 days",
      })
    );

    expect(onChange).toHaveBeenLastCalledWith({
      from: new Date(2026, 9, 14),
      to: new Date(2026, 9, 20),
    });

    expect(trigger).toHaveTextContent(
      "Oct 14, 2026 – Oct 20, 2026"
    );

    expect(trigger).toHaveFocus();
  });

  it("clears the range and keeps focus on the trigger", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateRangePicker
        label="Stay dates"
        defaultValue={RANGE}
        onChange={onChange}
        clearLabel="Clear stay dates"
      />
    );

    const trigger = screen.getByRole("button", {
      name: "Stay dates",
    });

    await user.click(
      screen.getByRole("button", {
        name: "Clear stay dates",
      })
    );

    expect(onChange).toHaveBeenCalledWith({
      from: null,
      to: null,
    });

    expect(trigger).toHaveTextContent(
      "Select date range"
    );

    expect(trigger).toHaveFocus();
  });

  it("follows a controlled range with a single month", async () => {
    const user = userEvent.setup();
    const changes: PimoluDateRange[] = [];

    function Example() {
      const [value, setValue] = useState<PimoluDateRange>({
        from: null,
        to: null,
      });

      return (
        <DateRangePicker
          label="Stay dates"
          value={value}
          numberOfMonths={1}
          onChange={(next) => {
            changes.push(next);
            setValue(next);
          }}
        />
      );
    }

    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Stay dates",
    });

    await user.click(trigger);

    expect(
      screen.getByRole("grid", {
        name: "October 2026",
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("grid", {
        name: "November 2026",
      })
    ).toBeNull();

    await user.click(day("Monday, October 12, 2026"));

    expect(trigger).toHaveTextContent(
      "From Oct 12, 2026"
    );

    await user.click(day("Sunday, October 18, 2026"));

    expect(changes.at(-1)).toEqual({
      from: new Date(2026, 9, 12),
      to: new Date(2026, 9, 18),
    });

    expect(trigger).toHaveTextContent(
      "Oct 12, 2026 – Oct 18, 2026"
    );
  });

  it("passes min, max and disabledDates to the calendar", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateRangePicker
        label="Stay dates"
        min={new Date(2026, 9, 10)}
        max={new Date(2026, 9, 25)}
        disabledDates={[new Date(2026, 9, 14)]}
        onChange={onChange}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Stay dates",
      })
    );

    const tooEarly = day("Friday, October 9, 2026");
    const blocked = day("Wednesday, October 14, 2026");
    const tooLate = day("Monday, October 26, 2026");

    expect(tooEarly).toHaveAttribute(
      "aria-disabled",
      "true"
    );
    expect(blocked).toHaveAttribute(
      "aria-disabled",
      "true"
    );
    expect(tooLate).toHaveAttribute(
      "aria-disabled",
      "true"
    );

    await user.click(tooEarly);
    await user.click(blocked);
    await user.click(tooLate);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();

    render(
      <DateRangePicker
        label="Stay dates"
        defaultValue={RANGE}
      />
    );

    const trigger = screen.getByRole("button", {
      name: "Stay dates",
    });

    await user.click(trigger);

    await user.keyboard("{Escape}");

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    expect(trigger).toHaveFocus();

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("closes on an outside pointerdown", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <DateRangePicker label="Stay dates" />

        <button type="button">Outside</button>
      </div>
    );

    const trigger = screen.getByRole("button", {
      name: "Stay dates",
    });

    await user.click(trigger);

    expect(
      screen.getByRole("dialog")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Outside",
      })
    );

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("respects disabled and read-only states", async () => {
    const user = userEvent.setup();

    const { unmount } = render(
      <DateRangePicker label="Stay dates" disabled />
    );

    const disabledTrigger = screen.getByRole("button", {
      name: "Stay dates",
    });

    expect(disabledTrigger).toBeDisabled();

    await user.click(disabledTrigger);

    expect(screen.queryByRole("dialog")).toBeNull();

    unmount();

    render(
      <DateRangePicker
        label="Stay dates"
        defaultValue={RANGE}
        readOnly
      />
    );

    const readOnlyTrigger = screen.getByRole("button", {
      name: "Stay dates",
    });

    expect(readOnlyTrigger).toHaveAttribute(
      "aria-readonly",
      "true"
    );

    await user.click(readOnlyTrigger);

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("formats the display with the locale and exposes required", () => {
    render(
      <DateRangePicker
        label="Stay dates"
        locale="fr-FR"
        defaultValue={RANGE}
        required
      />
    );

    const formatter = new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const trigger = screen.getByRole("button", {
      name: "Stay dates",
    });

    expect(trigger).toHaveTextContent(
      `${formatter.format(RANGE.from)} – ${formatter.format(
        RANGE.to
      )}`
    );

    expect(trigger).toHaveAttribute(
      "aria-required",
      "true"
    );
  });
});
