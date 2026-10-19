
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Badge } from "./badge";

describe("Pimolu Badge — Quality", () => {
  it("preserves very long labels", () => {
    const text = "pimolu-component-version-".repeat(12);

    render(
      <Badge data-testid="badge">
        {text}
      </Badge>
    );

    const badge = screen.getByTestId("badge");
    const label = badge.querySelector(
      ".pimolu-badge__label"
    );

    expect(label).toHaveTextContent(text);
  });

  it("keeps the status dot decorative when text exists", () => {
    render(
      <Badge variant="success" dot>
        Online
      </Badge>
    );

    const badge = screen.getByText("Online")
      .closest(".pimolu-badge");

    const dot = badge?.querySelector(
      ".pimolu-badge__dot"
    );

    expect(dot).toHaveAttribute(
      "aria-hidden",
      "true"
    );

    expect(badge).toHaveTextContent("Online");
  });

  it("supports an accessible dot-only badge", () => {
    render(
      <Badge
        variant="success"
        dot
        role="img"
        aria-label="Online"
      />
    );

    const badge = screen.getByRole("img", {
      name: "Online",
    });

    expect(badge).toHaveClass(
      "pimolu-badge--success"
    );
  });

  it("supports an accessible icon-only badge", () => {
    render(
      <Badge
        role="img"
        aria-label="Verified"
        startIcon={<span>✓</span>}
      />
    );

    const badge = screen.getByRole("img", {
      name: "Verified",
    });

    expect(
      badge.querySelector(".pimolu-badge__start-icon")
    ).toHaveAttribute("aria-hidden", "true");
  });

  it("does not become interactive by default", () => {
    render(
      <Badge data-testid="badge">
        Active
      </Badge>
    );

    const badge = screen.getByTestId("badge");

    expect(badge.tagName).toBe("SPAN");
    expect(badge).not.toHaveAttribute("tabindex");

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("does not interrupt keyboard navigation", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button>Previous</button>

        <Badge variant="primary">
          Information
        </Badge>

        <button>Next</button>
      </>
    );

    await user.tab();

    expect(
      screen.getByRole("button", {
        name: "Previous",
      })
    ).toHaveFocus();

    await user.tab();

    expect(
      screen.getByRole("button", {
        name: "Next",
      })
    ).toHaveFocus();
  });

  it("does not announce itself as a live status", () => {
    render(
      <Badge variant="warning" dot>
        Pending
      </Badge>
    );

    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
