import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Label } from "./label";

describe("Pimolu Label", () => {
  it("renders a native label tied to its control", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>
    );

    expect(
      screen.getByText("Email").tagName
    ).toBe("LABEL");

    expect(
      screen.getByText("Email")
    ).toHaveAttribute("for", "email");

    expect(
      screen.getByRole("textbox", { name: "Email" })
    ).toBeInTheDocument();
  });

  it("appends a hidden required asterisk", () => {
    render(<Label required>Email</Label>);

    const label = screen.getByText("Email", {
      exact: false,
    });

    expect(label).toHaveTextContent("Email*");

    expect(
      label.querySelector(".pimolu-label__required")
    ).toHaveAttribute("aria-hidden", "true");
  });

  it("shows an optional hint", () => {
    render(
      <Label optional optionalLabel="Facultatif">
        Phone
      </Label>
    );

    expect(
      screen.getByText("Phone", { exact: false })
    ).toHaveTextContent("PhoneFacultatif");
  });

  it("applies size and disabled state", () => {
    render(
      <Label size="lg" disabled>
        Email
      </Label>
    );

    const label = screen.getByText("Email");

    expect(label).toHaveClass(
      "pimolu-label",
      "pimolu-label--lg"
    );

    expect(label).toHaveAttribute(
      "data-disabled",
      "true"
    );
  });

  it("forwards a ref to the label", () => {
    const ref = createRef<HTMLLabelElement>();

    render(<Label ref={ref}>Email</Label>);

    expect(ref.current).toBe(screen.getByText("Email"));
  });
});
