import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Flex } from "./flex";

describe("Pimolu Flex", () => {
  it("is a row with no gap by default", () => {
    render(<Flex data-testid="flex" />);

    const flex = screen.getByTestId("flex");

    expect(flex).toHaveClass("pimolu-flex");
    expect(flex).toHaveAttribute("data-direction", "row");

    expect(
      flex.style.getPropertyValue("--pimolu-flex-gap")
    ).toBe("var(--pimolu-spacing-0, 0px)");
  });

  it("applies direction, alignment, justification and wrapping", () => {
    render(
      <Flex
        data-testid="flex"
        direction="column-reverse"
        align="end"
        justify="evenly"
        wrap
        gap="lg"
        fullWidth
      />
    );

    const flex = screen.getByTestId("flex");

    expect(flex).toHaveClass(
      "pimolu-flex--column-reverse",
      "pimolu-flex--align-end",
      "pimolu-flex--justify-evenly",
      "pimolu-flex--wrap",
      "pimolu-flex--full-width"
    );

    expect(
      flex.style.getPropertyValue("--pimolu-flex-gap")
    ).toBe("var(--pimolu-spacing-6, 24px)");
  });

  it("maps grow, shrink and basis to layout variables", () => {
    render(
      <>
        <Flex
          data-testid="numeric"
          grow={2}
          shrink={0}
          basis={240}
        />
        <Flex data-testid="string" basis="12rem" />
      </>
    );

    const numeric = screen.getByTestId("numeric");

    expect(
      numeric.style.getPropertyValue("--pimolu-flex-grow")
    ).toBe("2");

    expect(
      numeric.style.getPropertyValue("--pimolu-flex-shrink")
    ).toBe("0");

    expect(
      numeric.style.getPropertyValue("--pimolu-flex-basis")
    ).toBe("240px");

    expect(
      screen
        .getByTestId("string")
        .style.getPropertyValue("--pimolu-flex-basis")
    ).toBe("12rem");
  });

  it("renders the requested element and forwards its ref", () => {
    const ref = createRef<HTMLElement>();

    render(
      <Flex
        as="ul"
        ref={ref}
        data-testid="flex"
        aria-label="Results"
      >
        <li>One</li>
        <li>Two</li>
      </Flex>
    );

    expect(screen.getByTestId("flex").tagName).toBe("UL");
    expect(ref.current?.tagName).toBe("UL");
    expect(
      screen.getByRole("list", { name: "Results" })
    ).toBeInTheDocument();
  });
});
