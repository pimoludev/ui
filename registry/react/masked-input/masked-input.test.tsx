import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MaskedInput } from "./masked-input";

describe("Pimolu MaskedInput", () => {
  it("formats digits with the mask while typing", async () => {
    const user = userEvent.setup();

    render(
      <MaskedInput
        label="Phone"
        mask="(999) 999-9999"
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Phone",
    });

    await user.type(input, "4155551234");

    expect(input).toHaveValue("(415) 555-1234");
  });

  it("supports letter and alphanumeric tokens", async () => {
    const user = userEvent.setup();

    render(
      <MaskedInput label="Code" mask="aa-999" />
    );

    const input = screen.getByRole("textbox", {
      name: "Code",
    });

    await user.type(input, "ab123");

    expect(input).toHaveValue("ab-123");
    expect(input).toHaveAttribute("inputmode", "text");

    expect(
      screen.getByRole("textbox", { name: "Code" })
    ).toHaveAttribute("type", "text");
  });

  it("reports the formatted value through onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <MaskedInput
        label="Phone"
        mask="(999) 999-9999"
        onValueChange={onValueChange}
      />
    );

    await user.type(
      screen.getByRole("textbox", { name: "Phone" }),
      "415"
    );

    expect(onValueChange).toHaveBeenLastCalledWith(
      "(415"
    );

    await user.type(
      screen.getByRole("textbox", { name: "Phone" }),
      "5551234"
    );

    expect(onValueChange).toHaveBeenLastCalledWith(
      "(415) 555-1234"
    );
  });

  it("formats a controlled value", () => {
    render(
      <MaskedInput
        label="Phone"
        mask="(999) 999-9999"
        value="4155551234"
        onValueChange={() => {}}
      />
    );

    expect(
      screen.getByRole("textbox", { name: "Phone" })
    ).toHaveValue("(415) 555-1234");
  });

  it("accepts a pasted value and keeps the caret at the end", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <MaskedInput
        label="Phone"
        mask="(999) 999-9999"
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Phone",
    }) as HTMLInputElement;

    await user.click(input);
    await user.paste("(415) 555-1234");

    expect(input).toHaveValue("(415) 555-1234");

    expect(onValueChange).toHaveBeenLastCalledWith(
      "(415) 555-1234"
    );

    expect(input.selectionStart).toBe(
      "(415) 555-1234".length
    );
  });

  it("positions the caret after the typed mask prefix", async () => {
    const user = userEvent.setup();

    render(
      <MaskedInput
        label="Phone"
        mask="(999) 999-9999"
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Phone",
    }) as HTMLInputElement;

    await user.type(input, "415");

    expect(input).toHaveValue("(415");
    expect(input.selectionStart).toBe(4);
  });

  it("ignores characters that do not match the mask", async () => {
    const user = userEvent.setup();

    render(
      <MaskedInput label="Code" mask="999" />
    );

    const input = screen.getByRole("textbox", {
      name: "Code",
    });

    await user.type(input, "1a2b3");

    expect(input).toHaveValue("123");
  });

  it("wires the label, error and invalid state", () => {
    render(
      <MaskedInput
        label="Phone"
        mask="(999) 999-9999"
        errorMessage="Enter a complete number."
        required
      />
    );

    const input = screen.getByRole("textbox", {
      name: /Phone/,
    });

    const alert = screen.getByRole("alert");

    expect(alert).toHaveTextContent(
      "Enter a complete number."
    );
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-describedby",
      alert.id
    );
  });

  it("disables the native control", () => {
    render(
      <MaskedInput
        label="Phone"
        mask="(999) 999-9999"
        defaultValue="4155551234"
        disabled
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Phone",
    });

    expect(input).toBeDisabled();
    expect(input).toHaveValue("(415) 555-1234");
  });
});
