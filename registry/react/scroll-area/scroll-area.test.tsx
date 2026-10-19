import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScrollArea } from "./scroll-area";

describe("Pimolu ScrollArea", () => {
  it("renders a focusable viewport with its content", () => {
    render(
      <ScrollArea aria-label="Activity">
        <p>First item</p>
        <p>Second item</p>
      </ScrollArea>
    );

    const viewport = screen.getByLabelText("Activity");

    expect(viewport).toHaveClass(
      "pimolu-scroll-area__viewport"
    );

    expect(viewport).toHaveAttribute("tabindex", "0");
    expect(viewport).toHaveTextContent("First item");
    expect(viewport).toHaveTextContent("Second item");
  });

  it("applies the orientation and maxHeight", () => {
    const { container } = render(
      <ScrollArea orientation="both" maxHeight={240}>
        Content
      </ScrollArea>
    );

    const root = container.firstElementChild;

    expect(root).toHaveAttribute(
      "data-orientation",
      "both"
    );

    expect(
      screen.getByText("Content")
    ).toHaveStyle({ maxHeight: "240px" });
  });

  it("accepts a class on the viewport", () => {
    render(
      <ScrollArea
        viewportClassName="custom-viewport"
        className="custom-root"
      >
        Content
      </ScrollArea>
    );

    expect(
      screen.getByText("Content")
    ).toHaveClass("custom-viewport");

    expect(
      screen.getByText("Content").parentElement
    ).toHaveClass("custom-root");
  });
});
