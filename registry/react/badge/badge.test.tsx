
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

import { Badge } from "./badge";

describe("Pimolu Badge", () => {
  it("renders its content", () => {
    render(<Badge>Active</Badge>);

    expect(
      screen.getByText("Active")
    ).toBeInTheDocument();
  });

  it("applies default classes", () => {
    render(
      <Badge data-testid="badge">
        Default
      </Badge>
    );

    expect(screen.getByTestId("badge")).toHaveClass(
      "pimolu-badge",
      "pimolu-badge--neutral",
      "pimolu-badge--soft",
      "pimolu-badge--md",
      "pimolu-badge--radius-md"
    );
  });

  it("supports custom variants and appearances", () => {
    render(
      <Badge
        data-testid="badge"
        variant="success"
        appearance="solid"
        size="lg"
        radius="full"
      >
        Online
      </Badge>
    );

    expect(screen.getByTestId("badge")).toHaveClass(
      "pimolu-badge--success",
      "pimolu-badge--solid",
      "pimolu-badge--lg",
      "pimolu-badge--radius-full"
    );
  });

  it("renders a decorative status dot", () => {
    render(
      <Badge data-testid="badge" dot>
        Online
      </Badge>
    );

    const badge = screen.getByTestId("badge");

    const dot = badge.querySelector(
      ".pimolu-badge__dot"
    );

    expect(dot).toHaveAttribute(
      "aria-hidden",
      "true"
    );

    expect(badge).toHaveTextContent("Online");
  });

  it("renders decorative icons", () => {
    render(
      <Badge
        startIcon={<span data-testid="start">★</span>}
        endIcon={<span data-testid="end">✓</span>}
      >
        Verified
      </Badge>
    );

    expect(
      screen.getByTestId("start").parentElement
    ).toHaveAttribute("aria-hidden", "true");

    expect(
      screen.getByTestId("end").parentElement
    ).toHaveAttribute("aria-hidden", "true");
  });

  it("supports numeric zero", () => {
    render(<Badge>{0}</Badge>);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("forwards its ref", () => {
    const ref = createRef<HTMLSpanElement>();

    render(<Badge ref={ref}>Status</Badge>);

    expect(ref.current?.tagName).toBe("SPAN");
    expect(ref.current).toHaveClass("pimolu-badge");
  });

  it("preserves native HTML attributes", () => {
    render(
      <Badge
        data-testid="badge"
        id="user-status"
        title="Account status"
        className="custom-badge"
      >
        Verified
      </Badge>
    );

    const badge = screen.getByTestId("badge");

    expect(badge).toHaveAttribute(
      "id",
      "user-status"
    );

    expect(badge).toHaveAttribute(
      "title",
      "Account status"
    );

    expect(badge).toHaveClass("custom-badge");
  });

  it("does not create an implicit live region", () => {
    render(<Badge>Online</Badge>);

    expect(screen.queryByRole("status")).toBeNull();
  });
});
