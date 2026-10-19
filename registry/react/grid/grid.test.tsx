import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Grid } from "./grid";

describe("Pimolu Grid", () => {
  it("defaults to one column, a 16px gap and no auto track", () => {
    render(<Grid data-testid="grid" />);

    const grid = screen.getByTestId("grid");

    expect(grid).toHaveClass("pimolu-grid");

    expect(
      grid.style.getPropertyValue("--pimolu-grid-gap")
    ).toBe("var(--pimolu-spacing-4, 16px)");

    expect(
      grid.style.getPropertyValue("--pimolu-grid-columns")
    ).toBe("");
  });

  it("maps a column count to fixed equal tracks", () => {
    render(
      <>
        <Grid data-testid="three" columns={3} />
        <Grid data-testid="invalid" columns={0} />
      </>
    );

    expect(
      screen
        .getByTestId("three")
        .style.getPropertyValue("--pimolu-grid-columns")
    ).toBe("repeat(3, minmax(0, 1fr))");

    expect(
      screen
        .getByTestId("invalid")
        .style.getPropertyValue("--pimolu-grid-columns")
    ).toBe("repeat(1, minmax(0, 1fr))");

    expect(
      screen.getByTestId("three")
    ).toHaveAttribute("data-columns", "3");
  });

  it("builds responsive auto-fit and auto-fill tracks", () => {
    render(
      <>
        <Grid
          data-testid="fit"
          columns="auto-fit"
          minItemWidth={220}
        />
        <Grid
          data-testid="fill"
          columns="auto-fill"
          minItemWidth="18rem"
        />
      </>
    );

    expect(screen.getByTestId("fit")).toHaveClass(
      "pimolu-grid--auto-fit"
    );

    expect(
      screen
        .getByTestId("fit")
        .style.getPropertyValue(
          "--pimolu-grid-min-item-width"
        )
    ).toBe("220px");

    expect(screen.getByTestId("fill")).toHaveClass(
      "pimolu-grid--auto-fill"
    );

    expect(
      screen
        .getByTestId("fill")
        .style.getPropertyValue(
          "--pimolu-grid-min-item-width"
        )
    ).toBe("18rem");
  });

  it("applies alignment, justification, gap and full width", () => {
    render(
      <Grid
        data-testid="grid"
        columns="auto-fit"
        gap={6}
        align="center"
        justify="start"
        fullWidth
      />
    );

    const grid = screen.getByTestId("grid");

    expect(grid).toHaveClass(
      "pimolu-grid--align-center",
      "pimolu-grid--justify-start",
      "pimolu-grid--full-width"
    );

    expect(
      grid.style.getPropertyValue("--pimolu-grid-gap")
    ).toBe("var(--pimolu-spacing-6, 24px)");
  });

  it("renders the requested element and forwards its ref", () => {
    const ref = createRef<HTMLElement>();

    render(
      <Grid
        as="ul"
        ref={ref}
        data-testid="grid"
        aria-label="Products"
      />
    );

    expect(screen.getByTestId("grid").tagName).toBe("UL");
    expect(ref.current?.tagName).toBe("UL");

    expect(
      screen.getByRole("list", { name: "Products" })
    ).toBeInTheDocument();
  });
});
