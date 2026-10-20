import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PhoneInput } from "./phone-input";

describe("Pimolu PhoneInput", () => {
  it("formats a national number and emits E.164", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <PhoneInput
        label="Phone"
        defaultCountry="US"
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Phone",
    });

    await user.type(input, "4155551234");

    expect(input).toHaveValue("(415) 555-1234");
    expect(onValueChange).toHaveBeenLastCalledWith(
      "+14155551234"
    );
  });

  it("detects the country of an international value", () => {
    render(
      <PhoneInput
        label="Téléphone"
        value="+33612345678"
        onValueChange={() => {}}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Téléphone",
    });

    expect(input).toHaveValue("6 12 34 56 78");

    expect(
      screen.getByRole("combobox", { name: "Country" })
    ).toHaveValue("FR");
  });

  it("formats an uncontrolled national default value", () => {
    render(
      <PhoneInput
        label="Phone"
        defaultCountry="US"
        defaultValue="4155551234"
      />
    );

    expect(
      screen.getByRole("textbox", { name: "Phone" })
    ).toHaveValue("(415) 555-1234");
  });

  it("switches country and re-emits the number with the new dial code", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onCountryChange = vi.fn();

    render(
      <PhoneInput
        label="Phone"
        defaultCountry="US"
        onValueChange={onValueChange}
        onCountryChange={onCountryChange}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Phone",
    });

    await user.type(input, "415555123");

    const select = screen.getByRole("combobox", {
      name: "Country",
    });

    await user.selectOptions(select, "FR");

    expect(onCountryChange).toHaveBeenCalledWith(
      expect.objectContaining({
        code: "FR",
        dialCode: "33",
      })
    );

    expect(onValueChange).toHaveBeenLastCalledWith(
      "+33415555123"
    );

    expect(input).toHaveValue("4 15 55 51 23");

    expect(
      screen.getByText("+33", { exact: true })
    ).toBeInTheDocument();
  });

  it("accepts a custom country list", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <PhoneInput
        label="Example"
        countries={[
          {
            code: "XX",
            name: "Example",
            dialCode: "999",
            pattern: "999 999",
          },
        ]}
        defaultCountry="XX"
        onValueChange={onValueChange}
      />
    );

    await user.type(
      screen.getByRole("textbox", { name: "Example" }),
      "123456"
    );

    expect(
      screen.getByRole("textbox", { name: "Example" })
    ).toHaveValue("123 456");

    expect(onValueChange).toHaveBeenLastCalledWith(
      "+999123456"
    );
  });

  it("wires the label, error and invalid state", () => {
    render(
      <PhoneInput
        label="Phone"
        errorMessage="Enter a valid phone number."
        helperText="Include the area code."
        required
      />
    );

    const input = screen.getByRole("textbox", {
      name: /Phone/,
    });

    const alert = screen.getByRole("alert");

    expect(alert).toHaveTextContent(
      "Enter a valid phone number."
    );

    expect(input).toBeRequired();
    expect(input).toHaveAttribute("type", "tel");
    expect(input).toHaveAttribute("inputmode", "tel");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-describedby",
      alert.id
    );

    expect(
      screen.getByRole("combobox", { name: "Country" })
    ).toBeInTheDocument();
  });

  it("disables both controls", () => {
    render(
      <PhoneInput
        label="Phone"
        defaultValue="+14155551234"
        disabled
      />
    );

    expect(
      screen.getByRole("textbox", { name: "Phone" })
    ).toBeDisabled();

    expect(
      screen.getByRole("combobox", { name: "Country" })
    ).toBeDisabled();
  });
});
