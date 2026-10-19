import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Spacer } from "./spacer";

describe("Pimolu Spacer", () => {
  it("is flexible, hidden and has no fixed size by default", () => {
    render(<Spacer data-testid="spacer" />);

    const spacer = screen.getByTestId("spacer");

    expect(spacer).toHaveClass("pimolu-spacer");
    expect(spacer).not.toHaveClass("pimolu-spacer--fixed");
    expect(spacer).toHaveAttribute("aria-hidden", "true");
    expect(spacer).toHaveAttribute("data-axis", "both");

    expect(
      spacer.style.getPropertyValue("--pimolu-spacer-size")
    ).toBe("");
  });

  it("maps a fixed size token to a layout variable", () => {
    render(
      <Spacer data-testid="spacer" size="lg" />
    );

    const spacer = screen.getByTestId("spacer");

    expect(spacer).toHaveClass("pimolu-spacer--fixed");

    expect(
      spacer.style.getPropertyValue("--pimolu-spacer-size")
    ).toBe("var(--pimolu-spacing-6, 24px)");
  });

  it("accepts numeric sizes and records the occupied axis", () => {
    render(
      <>
        <Spacer data-testid="horizontal" size={2} axis="horizontal" />
        <Spacer data-testid="vertical" size={6} axis="vertical" />
      </>
    );

    expect(
      screen
        .getByTestId("horizontal")
        .style.getPropertyValue("--pimolu-spacer-size")
    ).toBe("var(--pimolu-spacing-2, 8px)");

    expect(screen.getByTestId("horizontal")).toHaveAttribute(
      "data-axis",
      "horizontal"
    );

    expect(screen.getByTestId("vertical")).toHaveAttribute(
      "data-axis",
      "vertical"
    );
  });

  it("stays aria-hidden even when the consumer passes a value", () => {
    render(
      <Spacer
        data-testid="spacer"
        aria-hidden={false}
        role="presentation"
      />
    );

    expect(screen.getByTestId("spacer")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });
});
