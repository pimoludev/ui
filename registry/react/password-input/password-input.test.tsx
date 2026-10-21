import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PasswordInput } from "./password-input";

describe("Pimolu PasswordInput", () => {
  it("associates its label and starts hidden", () => {
    render(
      <PasswordInput
        label="Password"
        placeholder="••••••••"
        autoComplete="current-password"
      />
    );

    const input = screen.getByLabelText("Password");

    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute(
      "placeholder",
      "••••••••"
    );
    expect(input).toHaveAttribute(
      "autocomplete",
      "current-password"
    );

    expect(
      screen.getByRole("button", {
        name: "Show password",
      })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("accepts uncontrolled input and reports every value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <PasswordInput
        label="Password"
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByLabelText("Password");

    await user.type(input, "secret");

    expect(input).toHaveValue("secret");
    expect(onValueChange).toHaveBeenCalledTimes(6);
    expect(onValueChange).toHaveBeenLastCalledWith(
      "secret"
    );
  });

  it("supports controlled values", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = useState("");

      return (
        <PasswordInput
          label="Password"
          value={value}
          onValueChange={setValue}
        />
      );
    }

    render(<Controlled />);

    const input = screen.getByLabelText("Password");

    await user.type(input, "pimolu");

    expect(input).toHaveValue("pimolu");
  });

  it("toggles visibility without changing the value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <PasswordInput
        label="Password"
        defaultValue="Secret123"
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByLabelText("Password");
    const toggle = screen.getByRole("button", {
      name: "Show password",
    });

    await user.click(toggle);

    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveValue("Secret123");
    expect(onValueChange).not.toHaveBeenCalled();

    expect(toggle).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    expect(toggle).toHaveAccessibleName("Hide password");

    await user.click(toggle);

    expect(input).toHaveAttribute("type", "password");
    expect(toggle).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(toggle).toHaveAccessibleName("Show password");
  });

  it("preserves the caret when toggling", async () => {
    const user = userEvent.setup();

    render(
      <PasswordInput
        label="Password"
        defaultValue="Secret123"
      />
    );

    const input = screen.getByLabelText(
      "Password"
    ) as HTMLInputElement;

    input.focus();
    input.setSelectionRange(2, 5);

    await user.click(
      screen.getByRole("button", {
        name: "Show password",
      })
    );

    expect(input).toHaveAttribute("type", "text");
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(5);
  });

  it("connects description and error messages", () => {
    const { rerender } = render(
      <PasswordInput
        label="Password"
        description="At least 12 characters."
      />
    );

    const input = screen.getByLabelText("Password");

    expect(input).toHaveAttribute(
      "aria-describedby",
      screen.getByText("At least 12 characters.").id
    );

    expect(
      screen.queryByRole("alert")
    ).toBeNull();

    rerender(
      <PasswordInput
        label="Password"
        description="At least 12 characters."
        error="Too short."
      />
    );

    const error = screen.getByRole("alert");

    expect(error).toHaveTextContent("Too short.");
    expect(input).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    expect(input).toHaveAttribute(
      "aria-describedby",
      error.id
    );

    expect(
      screen.queryByText("At least 12 characters.")
    ).toBeNull();
  });

  it("supports disabled and read-only states", async () => {
    const user = userEvent.setup();

    render(
      <>
        <PasswordInput label="Disabled" disabled />
        <PasswordInput
          label="Read only"
          readOnly
          defaultValue="pimolu"
        />
      </>
    );

    const disabled = screen.getByLabelText("Disabled");
    const readonly = screen.getByLabelText("Read only");

    expect(disabled).toBeDisabled();

    expect(
      screen.getAllByRole("button", {
        name: "Show password",
      })[0]
    ).toBeDisabled();

    expect(readonly).toHaveAttribute("readonly");

    await user.type(readonly, "123");

    expect(readonly).toHaveValue("pimolu");

    expect(
      screen.getAllByRole("button", {
        name: "Show password",
      })[1]
    ).toBeEnabled();
  });

  it("accepts custom toggle labels, sizes and a ref", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();

    render(
      <PasswordInput
        ref={ref}
        label="PIN"
        size="lg"
        showLabel="Afficher le mot de passe"
        hideLabel="Masquer le mot de passe"
        fullWidth
      />
    );

    const input = screen.getByLabelText("PIN");

    expect(ref.current).toBe(input);

    expect(
      input.closest(".pimolu-password-input")
    ).toHaveClass(
      "pimolu-input--lg",
      "pimolu-password-input--lg",
      "pimolu-input--full-width"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Afficher le mot de passe",
      })
    );

    expect(
      screen.getByRole("button", {
        name: "Masquer le mot de passe",
      })
    ).toBeInTheDocument();
  });
});
