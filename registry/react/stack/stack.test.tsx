import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { HStack, Stack, VStack } from "./stack";

describe("Pimolu Stack", () => {
  it("is a column with the default gap", () => {
    render(<Stack data-testid="stack" />);

    const stack = screen.getByTestId("stack");

    expect(stack).toHaveClass("pimolu-stack");
    expect(stack).toHaveAttribute("data-direction", "column");

    expect(
      stack.style.getPropertyValue("--pimolu-stack-gap")
    ).toBe("var(--pimolu-spacing-3, 12px)");
  });

  it("applies direction, alignment, justification, wrap and width", () => {
    render(
      <Stack
        data-testid="stack"
        direction="row"
        gap={0}
        align="center"
        justify="between"
        wrap
        fullWidth
      />
    );

    const stack = screen.getByTestId("stack");

    expect(stack).toHaveClass(
      "pimolu-stack--row",
      "pimolu-stack--align-center",
      "pimolu-stack--justify-between",
      "pimolu-stack--wrap",
      "pimolu-stack--full-width"
    );

    expect(stack).toHaveAttribute("data-direction", "row");

    expect(
      stack.style.getPropertyValue("--pimolu-stack-gap")
    ).toBe("var(--pimolu-spacing-0, 0px)");
  });

  it("accepts token aliases for the gap", () => {
    render(
      <>
        <Stack data-testid="sm" gap="sm" />
        <Stack data-testid="xl" gap="xl" />
        <Stack data-testid="three-xl" gap="3xl" />
      </>
    );

    expect(
      screen
        .getByTestId("sm")
        .style.getPropertyValue("--pimolu-stack-gap")
    ).toBe("var(--pimolu-spacing-2, 8px)");

    expect(
      screen
        .getByTestId("xl")
        .style.getPropertyValue("--pimolu-stack-gap")
    ).toBe("var(--pimolu-spacing-8, 32px)");

    expect(
      screen
        .getByTestId("three-xl")
        .style.getPropertyValue("--pimolu-stack-gap")
    ).toBe("var(--pimolu-spacing-12, 48px)");
  });

  it("exposes HStack and VStack as fixed-direction wrappers", () => {
    render(
      <>
        <HStack data-testid="row" />
        <VStack data-testid="column" />
      </>
    );

    expect(screen.getByTestId("row")).toHaveClass(
      "pimolu-stack--row"
    );

    expect(screen.getByTestId("row")).toHaveAttribute(
      "data-direction",
      "row"
    );

    expect(
      screen.getByTestId("column")
    ).not.toHaveClass("pimolu-stack--row");

    expect(screen.getByTestId("column")).toHaveAttribute(
      "data-direction",
      "column"
    );
  });

  it("renders a semantic element and preserves native attributes", () => {
    render(
      <Stack
        as="nav"
        data-testid="stack"
        aria-label="Primary"
        className="custom-stack"
      />
    );

    const stack = screen.getByTestId("stack");

    expect(stack.tagName).toBe("NAV");
    expect(stack).toHaveClass("custom-stack");

    expect(
      screen.getByRole("navigation", {
        name: "Primary",
      })
    ).toBeInTheDocument();
  });
});
