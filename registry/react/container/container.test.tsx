import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Container } from "./container";

describe("Pimolu Container", () => {
  it("renders a centered lg container with a 16px gutter", () => {
    render(<Container data-testid="container" />);

    const container = screen.getByTestId("container");

    expect(container).toHaveClass(
      "pimolu-container",
      "pimolu-container--lg"
    );

    expect(
      container.style.getPropertyValue(
        "--pimolu-container-padding"
      )
    ).toBe("var(--pimolu-spacing-4, 16px)");

    expect(container).toHaveAttribute(
      "data-max-width",
      "lg"
    );
  });

  it("supports every max width step", () => {
    render(
      <>
        <Container data-testid="sm" maxWidth="sm" />
        <Container data-testid="md" maxWidth="md" />
        <Container data-testid="xl" maxWidth="xl" />
        <Container data-testid="2xl" maxWidth="2xl" />
        <Container data-testid="full" maxWidth="full" />
      </>
    );

    expect(screen.getByTestId("sm")).toHaveClass(
      "pimolu-container--sm"
    );

    expect(screen.getByTestId("md")).toHaveClass(
      "pimolu-container--md"
    );

    expect(screen.getByTestId("xl")).toHaveClass(
      "pimolu-container--xl"
    );

    expect(screen.getByTestId("2xl")).toHaveClass(
      "pimolu-container--2xl"
    );

    expect(screen.getByTestId("full")).toHaveClass(
      "pimolu-container--full"
    );
  });

  it("can opt out of centering and opt into a token gutter", () => {
    render(
      <Container
        data-testid="container"
        centered={false}
        padding="lg"
      />
    );

    const container = screen.getByTestId("container");

    expect(container).toHaveClass(
      "pimolu-container--start"
    );

    expect(
      container.style.getPropertyValue(
        "--pimolu-container-padding"
      )
    ).toBe("var(--pimolu-spacing-6, 24px)");
  });

  it("renders the requested element and forwards its ref", () => {
    const ref = createRef<HTMLElement>();

    render(
      <Container
        as="main"
        ref={ref}
        data-testid="container"
        aria-label="Article"
      >
        Body
      </Container>
    );

    expect(screen.getByTestId("container").tagName).toBe(
      "MAIN"
    );

    expect(ref.current?.tagName).toBe("MAIN");

    expect(
      screen.getByRole("main", { name: "Article" })
    ).toBeInTheDocument();
  });
});
