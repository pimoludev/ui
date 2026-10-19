import { useState } from "react";

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TimePicker } from "./time-picker";

describe("Pimolu TimePicker", () => {
  it("renders a native time input with its constraints", () => {
    render(
      <TimePicker
        label="Start time"
        defaultValue="09:30"
        min="08:00"
        max="18:00"
        step={900}
      />
    );

    const input = screen.getByLabelText("Start time");

    expect(input).toHaveAttribute("type", "time");
    expect(input).toHaveValue("09:30");
    expect(input).toHaveAttribute("min", "08:00");
    expect(input).toHaveAttribute("max", "18:00");
    expect(input).toHaveAttribute("step", "900");

    expect(
      input.closest(".pimolu-time-picker")
    ).toHaveClass("pimolu-time-picker--md");
  });

  it("updates an uncontrolled value", () => {
    const onValueChange = vi.fn();

    render(
      <TimePicker
        label="Start time"
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByLabelText("Start time");

    fireEvent.change(input, {
      target: { value: "14:45" },
    });

    expect(input).toHaveValue("14:45");
    expect(onValueChange).toHaveBeenLastCalledWith(
      "14:45"
    );
  });

  it("supports controlled values", () => {
    const onValueChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState<
        string | null
      >("08:00");

      return (
        <TimePicker
          label="Pickup"
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
        />
      );
    }

    render(<Controlled />);

    const input = screen.getByLabelText("Pickup");

    expect(input).toHaveValue("08:00");

    fireEvent.change(input, {
      target: { value: "16:20" },
    });

    expect(input).toHaveValue("16:20");
    expect(onValueChange).toHaveBeenLastCalledWith(
      "16:20"
    );
  });

  it("clears the value from the accessible button", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TimePicker
        label="Meeting time"
        defaultValue="10:15"
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByLabelText("Meeting time");

    await user.click(
      screen.getByRole("button", {
        name: "Clear Meeting time",
      })
    );

    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith(null);

    expect(
      screen.queryByRole("button", {
        name: "Clear Meeting time",
      })
    ).toBeNull();
  });

  it("accepts seconds and adjusts the default step", () => {
    render(
      <TimePicker
        label="Exact time"
        withSeconds
        defaultValue="10:15:30"
      />
    );

    const input = screen.getByLabelText("Exact time");

    expect(input).toHaveValue("10:15:30");
    expect(input).toHaveAttribute("step", "1");
    expect(input).toHaveAttribute(
      "data-with-seconds",
      "true"
    );
  });

  it("supports disabled and read-only states", () => {
    const onValueChange = vi.fn();

    render(
      <>
        <TimePicker
          label="Disabled"
          defaultValue="09:00"
          disabled
        />

        <TimePicker
          label="Read only"
          defaultValue="09:00"
          readOnly
          onValueChange={onValueChange}
        />
      </>
    );

    const disabled = screen.getByLabelText("Disabled");
    const readonly = screen.getByLabelText("Read only");

    expect(disabled).toBeDisabled();
    expect(readonly).toHaveAttribute("readonly");

    expect(
      screen.queryByRole("button", {
        name: "Clear Disabled",
      })
    ).toBeNull();

    expect(
      screen.queryByRole("button", {
        name: "Clear Read only",
      })
    ).toBeNull();

    fireEvent.change(readonly, {
      target: { value: "12:00" },
    });

    expect(readonly).toHaveValue("09:00");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("wires helper text and errors", () => {
    render(
      <>
        <TimePicker
          label="With helper"
          helperText="Doors open 15 minutes earlier."
        />

        <TimePicker
          label="With error"
          errorMessage="Choose a time in the future."
        />
      </>
    );

    const helperInput = screen.getByLabelText(
      "With helper"
    );

    const helper = screen.getByText(
      "Doors open 15 minutes earlier."
    );

    expect(helperInput).toHaveAttribute(
      "aria-describedby",
      helper.id
    );

    expect(helper).not.toHaveAttribute(
      "role",
      "alert"
    );

    const errorInput = screen.getByLabelText(
      "With error"
    );

    const error = screen.getByRole("alert");

    expect(errorInput).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    expect(errorInput).toHaveAttribute(
      "aria-describedby",
      error.id
    );

    expect(error).toHaveTextContent(
      "Choose a time in the future."
    );
  });

  it("documents the locale-driven 12/24-hour display", () => {
    render(
      <TimePicker
        label="Departure"
        showFormatHint
      />
    );

    const hint = screen.getByText(
      /12- or 24-hour display/
    );

    expect(hint).toHaveClass(
      "pimolu-time-picker__format-hint"
    );

    expect(
      screen.getByLabelText("Departure")
    ).toHaveAttribute(
      "aria-describedby",
      hint.id
    );
  });
});
