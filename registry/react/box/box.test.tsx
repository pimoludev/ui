import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Box } from "./box";

describe("Pimolu Box", () => {
  it("renders a div with its children", () => {
    render(<Box data-testid="box">Content</Box>);

    const box = screen.getByTestId("box");

    expect(box.tagName).toBe("DIV");
    expect(box).toHaveClass("pimolu-box");
    expect(box).toHaveTextContent("Content");
  });

  it("maps padding, paddingX and paddingY to spacing variables", () => {
    render(
      <Box
        data-testid="box"
        padding={6}
        paddingX="xs"
        paddingY={0}
      />
    );

    const box = screen.getByTestId("box");

    expect(
      box.style.getPropertyValue("--pimolu-box-padding")
    ).toBe("var(--pimolu-spacing-6, 24px)");

    expect(
      box.style.getPropertyValue("--pimolu-box-padding-x")
    ).toBe("var(--pimolu-spacing-1, 4px)");

    expect(
      box.style.getPropertyValue("--pimolu-box-padding-y")
    ).toBe("var(--pimolu-spacing-0, 0px)");
  });

  it("lets padding win over its p alias", () => {
    render(
      <Box
        data-testid="box"
        padding={2}
        p={6}
        px={1}
        paddingX={3}
      />
    );

    const box = screen.getByTestId("box");

    expect(
      box.style.getPropertyValue("--pimolu-box-padding")
    ).toBe("var(--pimolu-spacing-2, 8px)");

    expect(
      box.style.getPropertyValue("--pimolu-box-padding-x")
    ).toBe("var(--pimolu-spacing-3, 12px)");
  });

  it("applies semantic surfaces and full width", () => {
    render(
      <Box
        data-testid="box"
        background="muted"
        fullWidth
      />
    );

    expect(screen.getByTestId("box")).toHaveClass(
      "pimolu-box--bg-muted",
      "pimolu-box--full-width"
    );
  });

  it("renders the requested element and forwards its ref", () => {
    const ref = createRef<HTMLElement>();

    render(
      <Box
        as="section"
        ref={ref}
        aria-label="Summary"
        id="summary"
      >
        Summary
      </Box>
    );

    expect(
      screen.getByRole("region", { name: "Summary" })
    ).toBeInTheDocument();

    expect(ref.current?.tagName).toBe("SECTION");
    expect(ref.current).toHaveAttribute("id", "summary");
  });
});
