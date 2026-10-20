import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CurrencyInput } from "./currency-input";

describe("Pimolu CurrencyInput", () => {
  it("formats the initial value with the currency", () => {
    render(
      <CurrencyInput
        label="Price"
        defaultValue={1234.5}
      />
    );

    expect(
      screen.getByRole("textbox", { name: "Price" })
    ).toHaveValue("$1,234.50");
  });

  it("respects the locale and currency", () => {
    render(
      <CurrencyInput
        label="Montant"
        currency="EUR"
        locale="fr-FR"
        value={99.9}
        onValueChange={() => {}}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Montant",
    }) as HTMLInputElement;

    expect(input.value).toContain("99,90");
    expect(input.value).toContain("€");
  });

  it("shows raw digits while focused and formats on blur", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <CurrencyInput
        label="Price"
        defaultValue={1234.5}
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Price",
    });

    await user.click(input);

    expect(input).toHaveValue("1234.5");

    await user.clear(input);
    await user.type(input, "2500.75");

    expect(input).toHaveValue("2500.75");

    expect(onValueChange).toHaveBeenLastCalledWith(
      2500.75
    );

    await user.tab();

    expect(input).toHaveValue("$2,500.75");
  });

  it("reports null when the field is emptied", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <CurrencyInput
        label="Price"
        defaultValue={42}
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Price",
    });

    await user.click(input);
    await user.clear(input);

    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("clamps min and max on blur", async () => {
    const user = userEvent.setup();
    const onMin = vi.fn();
    const onMax = vi.fn();

    const { unmount } = render(
      <CurrencyInput
        label="Minimum"
        defaultValue={5}
        min={10}
        onValueChange={onMin}
      />
    );

    await user.click(
      screen.getByRole("textbox", { name: "Minimum" })
    );
    await user.tab();

    expect(onMin).toHaveBeenLastCalledWith(10);
    expect(
      screen.getByRole("textbox", { name: "Minimum" })
    ).toHaveValue("$10.00");

    unmount();

    render(
      <CurrencyInput
        label="Maximum"
        defaultValue={500}
        max={100}
        onValueChange={onMax}
      />
    );

    await user.click(
      screen.getByRole("textbox", { name: "Maximum" })
    );
    await user.tab();

    expect(onMax).toHaveBeenLastCalledWith(100);
    expect(
      screen.getByRole("textbox", { name: "Maximum" })
    ).toHaveValue("$100.00");
  });

  it("supports negative values only when allowed", async () => {
    const user = userEvent.setup();
    const onNegative = vi.fn();
    const onPositive = vi.fn();

    const { unmount } = render(
      <CurrencyInput
        label="Refund"
        allowNegative
        defaultValue={-12.5}
        onValueChange={onNegative}
      />
    );

    const refund = screen.getByRole("textbox", {
      name: "Refund",
    });

    expect(refund).toHaveValue("-$12.50");

    await user.click(refund);
    expect(refund).toHaveValue("-12.5");
    await user.tab();

    expect(refund).toHaveValue("-$12.50");
    expect(onNegative).not.toHaveBeenCalled();

    unmount();

    render(
      <CurrencyInput
        label="Donation"
        onValueChange={onPositive}
      />
    );

    const donation = screen.getByRole("textbox", {
      name: "Donation",
    });

    await user.click(donation);
    await user.type(donation, "-12.5");

    expect(onPositive).toHaveBeenLastCalledWith(12.5);

    await user.tab();

    expect(donation).toHaveValue("$12.50");
  });

  it("rounds to the requested number of decimals", () => {
    render(
      <CurrencyInput
        label="Rounded"
        decimals={0}
        defaultValue={1234.56}
      />
    );

    expect(
      screen.getByRole("textbox", { name: "Rounded" })
    ).toHaveValue("$1,235");
  });

  it("parses a pasted formatted amount", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <CurrencyInput
        label="Price"
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Price",
    });

    await user.click(input);
    await user.paste("$1,234.56");

    expect(onValueChange).toHaveBeenLastCalledWith(
      1234.56
    );

    await user.tab();

    expect(input).toHaveValue("$1,234.56");
  });

  it("wires the label, error and invalid state", () => {
    render(
      <CurrencyInput
        label="Price"
        errorMessage="Enter a positive amount."
        required
        invalid
      />
    );

    const input = screen.getByRole("textbox", {
      name: /Price/,
    });

    const alert = screen.getByRole("alert");

    expect(alert).toHaveTextContent(
      "Enter a positive amount."
    );
    expect(input).toBeRequired();
    expect(input).toHaveAttribute(
      "inputmode",
      "decimal"
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-describedby",
      alert.id
    );
  });

  it("disables the native control", () => {
    render(
      <CurrencyInput
        label="Price"
        defaultValue={20}
        disabled
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Price",
    });

    expect(input).toBeDisabled();
    expect(input).toHaveValue("$20.00");
  });
});
