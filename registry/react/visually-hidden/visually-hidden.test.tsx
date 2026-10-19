import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { VisuallyHidden } from "./visually-hidden";

describe("Pimolu VisuallyHidden", () => {
  it("renders a span with the clip class and no tab stop", () => {
    render(
      <VisuallyHidden data-testid="hidden">
        Loading
      </VisuallyHidden>
    );

    const hidden = screen.getByTestId("hidden");

    expect(hidden.tagName).toBe("SPAN");

    expect(hidden).toHaveClass(
      "pimolu-visually-hidden"
    );

    expect(hidden).toHaveAttribute(
      "data-focusable",
      "false"
    );

    expect(hidden).not.toHaveAttribute("tabindex");
    expect(hidden).toHaveTextContent("Loading");
  });

  it("makes focusable content a tab stop for skip links", () => {
    render(
      <VisuallyHidden
        data-testid="hidden"
        as="a"
        href="#main-content"
        focusable
      >
        Skip to content
      </VisuallyHidden>
    );

    const hidden = screen.getByTestId("hidden");

    expect(hidden.tagName).toBe("A");
    expect(hidden).toHaveAttribute("href", "#main-content");

    expect(hidden).toHaveClass(
      "pimolu-visually-hidden--focusable"
    );

    expect(hidden).toHaveAttribute("tabindex", "0");

    expect(hidden).toHaveAttribute(
      "data-focusable",
      "true"
    );
  });

  it("keeps an explicit tab index and renders the requested element", () => {
    const ref = createRef<HTMLElement>();

    render(
      <VisuallyHidden
        as="div"
        ref={ref}
        data-testid="hidden"
        focusable
        tabIndex={-1}
        aria-live="polite"
      />
    );

    const hidden = screen.getByTestId("hidden");

    expect(hidden.tagName).toBe("DIV");
    expect(hidden).toHaveAttribute("tabindex", "-1");

    expect(hidden).toHaveAttribute(
      "aria-live",
      "polite"
    );

    expect(ref.current?.tagName).toBe("DIV");
  });
});
