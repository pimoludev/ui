import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Center } from "./center";

describe("Pimolu Center", () => {
  it("renders a flex centering box", () => {
    render(<Center data-testid="center">Centered</Center>);

    const center = screen.getByTestId("center");

    expect(center).toHaveClass("pimolu-center");
    expect(center).toHaveAttribute("data-inline", "false");
    expect(center).toHaveTextContent("Centered");

    expect(
      center.style.getPropertyValue(
        "--pimolu-center-min-height"
      )
    ).toBe("");
  });

  it("supports inline centering and full width", () => {
    render(
      <Center
        data-testid="center"
        inline
        fullWidth
      />
    );

    const center = screen.getByTestId("center");

    expect(center).toHaveClass(
      "pimolu-center--inline",
      "pimolu-center--full-width"
    );

    expect(center).toHaveAttribute("data-inline", "true");
  });

  it("maps minHeight numbers to pixels and keeps strings", () => {
    render(
      <>
        <Center data-testid="numeric" minHeight={240} />
        <Center data-testid="string" minHeight="50vh" />
      </>
    );

    expect(
      screen
        .getByTestId("numeric")
        .style.getPropertyValue(
          "--pimolu-center-min-height"
        )
    ).toBe("240px");

    expect(
      screen
        .getByTestId("string")
        .style.getPropertyValue(
          "--pimolu-center-min-height"
        )
    ).toBe("50vh");
  });

  it("renders the requested element and forwards its ref", () => {
    const ref = createRef<HTMLElement>();

    render(
      <Center
        as="section"
        ref={ref}
        data-testid="center"
        aria-label="Empty state"
      />
    );

    expect(screen.getByTestId("center").tagName).toBe(
      "SECTION"
    );

    expect(ref.current?.tagName).toBe("SECTION");

    expect(
      screen.getByRole("region", {
        name: "Empty state",
      })
    ).toBeInTheDocument();
  });
});
