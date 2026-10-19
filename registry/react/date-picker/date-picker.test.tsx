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

import { DatePicker } from "./date-picker";

const TODAY = new Date(2026, 9, 20, 9, 30);

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

describe("Pimolu DatePicker", () => {
  it("renders an accessible trigger with a placeholder", () => {
    render(<DatePicker label="Check-in date" />);

    const trigger = screen.getByRole("button", {
      name: "Check-in date",
    });

    expect(trigger).toHaveTextContent("Select date");
    expect(trigger).toHaveAttribute(
      "aria-haspopup",
      "dialog"
    );
    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(trigger).not.toHaveAttribute("aria-controls");
  });

  it("opens the calendar and focuses the selected day", async () => {
    const user = userEvent.setup();

    render(
      <DatePicker
        label="Check-in date"
        defaultValue={new Date(2026, 9, 12)}
      />
    );

    const trigger = screen.getByRole("button", {
      name: "Check-in date",
    });

    await user.click(trigger);

    const dialog = screen.getByRole("dialog", {
      name: "Check-in date",
    });

    expect(
      screen.getByRole("grid", {
        name: "October 2026",
      })
    ).toBeInTheDocument();

    expect(
      day("Monday, October 12, 2026")
    ).toHaveFocus();

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    expect(trigger).toHaveAttribute(
      "aria-controls",
      dialog.id
    );
  });

  it("selects a day, formats it, closes and returns focus", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DatePicker
        label="Check-in date"
        defaultValue={new Date(2026, 9, 12)}
        onChange={onChange}
      />
    );

    const trigger = screen.getByRole("button", {
      name: "Check-in date",
    });

    await user.click(trigger);
    await user.click(day("Thursday, October 15, 2026"));

    expect(onChange).toHaveBeenCalledWith(
      new Date(2026, 9, 15)
    );

    expect(trigger).toHaveTextContent(
      "October 15, 2026"
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

  it("follows a controlled value", async () => {
    const user = userEvent.setup();

    function Example() {
      const [value, setValue] = useState<Date | null>(
        new Date(2026, 9, 12)
      );

      return (
        <DatePicker
          label="Check-in date"
          value={value}
          onChange={setValue}
        />
      );
    }

    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Check-in date",
    });

    expect(trigger).toHaveTextContent(
      "October 12, 2026"
    );

    await user.click(trigger);
    await user.click(day("Thursday, October 15, 2026"));

    expect(trigger).toHaveTextContent(
      "October 15, 2026"
    );
  });

  it("clears the value and keeps focus on the trigger", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DatePicker
        label="Check-in date"
        defaultValue={new Date(2026, 9, 12)}
        onChange={onChange}
        clearLabel="Clear check-in"
      />
    );

    const trigger = screen.getByRole("button", {
      name: "Check-in date",
    });

    await user.click(
      screen.getByRole("button", {
        name: "Clear check-in",
      })
    );

    expect(onChange).toHaveBeenCalledWith(null);
    expect(trigger).toHaveTextContent("Select date");
    expect(trigger).toHaveFocus();
  });

  it("passes min, max and disabledDates to the calendar", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DatePicker
        label="Check-in date"
        min={new Date(2026, 9, 10)}
        max={new Date(2026, 9, 20)}
        disabledDates={[new Date(2026, 9, 14)]}
        onChange={onChange}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Check-in date",
      })
    );

    const tooEarly = day("Friday, October 9, 2026");
    const blocked = day("Wednesday, October 14, 2026");
    const tooLate = day("Wednesday, October 21, 2026");

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

    expect(
      screen.getByRole("dialog", {
        name: "Check-in date",
      })
    ).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();

    render(
      <DatePicker
        label="Check-in date"
        defaultValue={new Date(2026, 9, 12)}
      />
    );

    const trigger = screen.getByRole("button", {
      name: "Check-in date",
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
        <DatePicker label="Check-in date" />

        <button type="button">Outside</button>
      </div>
    );

    const trigger = screen.getByRole("button", {
      name: "Check-in date",
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

  it("never opens when disabled", async () => {
    const user = userEvent.setup();

    render(<DatePicker label="Check-in date" disabled />);

    const trigger = screen.getByRole("button", {
      name: "Check-in date",
    });

    expect(trigger).toBeDisabled();

    await user.click(trigger);

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("does not open when read-only", async () => {
    const user = userEvent.setup();

    render(
      <DatePicker
        label="Check-in date"
        defaultValue={new Date(2026, 9, 12)}
        readOnly
      />
    );

    const trigger = screen.getByRole("button", {
      name: "Check-in date",
    });

    expect(trigger).toHaveAttribute(
      "aria-readonly",
      "true"
    );

    await user.click(trigger);

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("formats with the locale and exposes its required state", () => {
    render(
      <DatePicker
        label="Check-in date"
        locale="fr-FR"
        defaultValue={new Date(2026, 9, 12)}
        required
      />
    );

    const trigger = screen.getByRole("button", {
      name: "Check-in date",
    });

    expect(trigger).toHaveTextContent(
      "12 octobre 2026"
    );

    expect(trigger).toHaveAttribute(
      "aria-required",
      "true"
    );

    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
