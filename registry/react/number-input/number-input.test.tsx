import { useState } from "react";

import {
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NumberInput } from "./number-input";

describe("Pimolu NumberInput", () => {
  it("renders a labelled text input with the default value", () => {
    render(
      <NumberInput
        label="Quantity"
        defaultValue={3}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Quantity",
    });

    expect(input).toHaveValue("3");
    expect(input).toHaveAttribute(
      "inputmode",
      "decimal"
    );
    expect(input).toHaveAttribute("type", "text");

    expect(
      input.closest(".pimolu-number-input")
    ).toHaveClass("pimolu-number-input--md");
  });

  it("rounds typed and stepped values to the precision", async () => {
    const user = userEvent.setup();

    render(
      <NumberInput
        label="Price"
        defaultValue={1.25}
        step={0.01}
        precision={2}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Price",
    });

    expect(input).toHaveValue("1.25");

    await user.click(
      screen.getByRole("button", {
        name: "Increase Price",
      })
    );

    expect(input).toHaveValue("1.26");
  });

  it("supports controlled values", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState<number | null>(
        null
      );

      return (
        <NumberInput
          label="Seats"
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
        />
      );
    }

    render(<Controlled />);

    const input = screen.getByRole("textbox", {
      name: "Seats",
    });

    await user.type(input, "12");

    expect(input).toHaveValue("12");
    expect(onValueChange).toHaveBeenLastCalledWith(12);
  });

  it("increments and decrements with the steppers", async () => {
    const user = userEvent.setup();

    render(
      <NumberInput
        label="Guests"
        defaultValue={4}
        min={0}
        max={10}
        step={2}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Guests",
    });

    const increase = screen.getByRole("button", {
      name: "Increase Guests",
    });

    const decrease = screen.getByRole("button", {
      name: "Decrease Guests",
    });

    await user.click(increase);
    expect(input).toHaveValue("6");
    expect(input).toHaveFocus();

    await user.click(decrease);
    expect(input).toHaveValue("4");

    await user.click(increase);
    await user.click(increase);
    await user.click(increase);

    expect(input).toHaveValue("10");
    expect(increase).toBeDisabled();

    await user.click(decrease);
    await user.click(decrease);
    await user.click(decrease);
    await user.click(decrease);
    await user.click(decrease);

    expect(input).toHaveValue("0");
    expect(decrease).toBeDisabled();
  });

  it("supports Arrow, Page, Home and End keys", async () => {
    const user = userEvent.setup();

    render(
      <NumberInput
        label="Amount"
        defaultValue={5}
        min={0}
        max={100}
        step={2}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Amount",
    });

    input.focus();

    await user.keyboard("{ArrowUp}");
    expect(input).toHaveValue("7");

    await user.keyboard("{PageUp}");
    expect(input).toHaveValue("27");

    await user.keyboard("{Home}");
    expect(input).toHaveValue("0");

    await user.keyboard("{End}");
    expect(input).toHaveValue("100");

    await user.keyboard("{ArrowDown}");
    expect(input).toHaveValue("98");
  });

  it("clamps on blur and emits null when cleared", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <NumberInput
        label="Discount"
        min={0}
        max={50}
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Discount",
    });

    await user.type(input, "75");
    await user.tab();

    expect(input).toHaveValue("50");
    expect(onValueChange).toHaveBeenLastCalledWith(50);

    await user.clear(input);

    expect(input).toHaveValue("");
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("supports disabled and read-only states", async () => {
    const user = userEvent.setup();

    render(
      <>
        <NumberInput
          label="Disabled"
          defaultValue={5}
          disabled
        />

        <NumberInput
          label="Read only"
          defaultValue={8}
          readOnly
        />
      </>
    );

    const disabled = screen.getByRole("textbox", {
      name: "Disabled",
    });

    const readonly = screen.getByRole("textbox", {
      name: "Read only",
    });

    expect(disabled).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Increase Disabled",
      })
    ).toBeDisabled();

    expect(readonly).toHaveAttribute("readonly");

    await user.type(readonly, "123");

    expect(readonly).toHaveValue("8");
  });

  it("exposes affixes, native attributes and error wiring", () => {
    render(
      <NumberInput
        label="Budget"
        name="budget"
        required
        prefix="$"
        suffix="USD"
        errorMessage="Budget must be positive."
      />
    );

    const input = screen.getByRole("textbox", {
      name: /^Budget/,
    });

    const error = screen.getByRole("alert");

    expect(input).toHaveAttribute("name", "budget");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    expect(input).toHaveAttribute(
      "aria-describedby",
      error.id
    );

    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(error).toHaveTextContent(
      "Budget must be positive."
    );
  });
});
