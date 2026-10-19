import { createRef } from "react";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import { EmptyState } from "./empty-state";

describe("Pimolu EmptyState", () => {
  it("renders a semantic section with an h3 heading", () => {
    const { container } = render(
      <EmptyState
        title="No projects yet"
        description="Create your first project to get started."
      />
    );

    const section = container.querySelector("section");

    expect(section).toHaveClass(
      "pimolu-empty-state",
      "pimolu-empty-state--md"
    );

    expect(section).toHaveAttribute(
      "data-size",
      "md"
    );

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "No projects yet",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Create your first project to get started."
      )
    ).toBeInTheDocument();
  });

  it("supports the sm, md and lg sizes", () => {
    const { rerender } = render(
      <EmptyState title="Empty" size="sm" />
    );

    expect(
      screen.getByRole("heading", { level: 3 })
    ).toHaveClass("pimolu-empty-state__title");

    expect(
      screen.getByRole("heading", { level: 3 })
        .closest("section")
    ).toHaveClass("pimolu-empty-state--sm");

    rerender(<EmptyState title="Empty" size="lg" />);

    expect(
      screen.getByRole("heading", { level: 3 })
        .closest("section")
    ).toHaveClass("pimolu-empty-state--lg");
  });

  it("renders a decorative icon and actions", () => {
    render(
      <EmptyState
        title="No results"
        icon={<svg data-testid="icon" />}
        actions={<button type="button">Clear filters</button>}
      />
    );

    expect(
      screen.getByTestId("icon").parentElement
    ).toHaveAttribute("aria-hidden", "true");

    expect(
      screen.getByRole("button", {
        name: "Clear filters",
      })
    ).toBeInTheDocument();
  });

  it("does not render an icon wrapper when no icon is provided", () => {
    const { container } = render(
      <EmptyState title="Nothing here" />
    );

    expect(
      container.querySelector(
        ".pimolu-empty-state__icon"
      )
    ).toBeNull();
  });

  it("labels the section with its heading and exposes refs", () => {
    const ref = createRef<HTMLElement>();

    render(
      <EmptyState
        ref={ref}
        title="Inbox zero"
        className="custom-empty-state"
      />
    );

    const section = ref.current;

    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveClass("custom-empty-state");

    const heading = screen.getByRole("heading", {
      level: 3,
      name: "Inbox zero",
    });

    expect(section).toHaveAttribute(
      "aria-labelledby",
      heading.id
    );
  });
});
