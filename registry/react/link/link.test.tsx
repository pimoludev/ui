import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { Link } from "./link";

describe("Pimolu Link", () => {
  it("renders an anchor with its href", () => {
    render(<Link href="/docs">Read the docs</Link>);

    expect(
      screen.getByRole("link", { name: "Read the docs" })
    ).toHaveAttribute("href", "/docs");
  });

  it("applies the colour and underline axes", () => {
    render(
      <Link
        href="/docs"
        variant="muted"
        underline="always"
      >
        Read the docs
      </Link>
    );

    expect(
      screen.getByRole("link", { name: "Read the docs" })
    ).toHaveClass(
      "pimolu-link",
      "pimolu-link--muted",
      "pimolu-link--underline-always"
    );
  });

  it("opens external links safely and marks them", () => {
    render(
      <Link href="https://example.com" external>
        Example
      </Link>
    );

    const link = screen.getByRole("link", {
      name: /Example/,
    });

    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );

    expect(
      link.querySelector(".pimolu-link__external")
    ).not.toBeNull();
  });

  it("hides the external icon when asked", () => {
    render(
      <Link
        href="https://example.com"
        external
        showExternalIcon={false}
      >
        Example
      </Link>
    );

    expect(
      screen
        .getByRole("link")
        .querySelector(".pimolu-link__external")
    ).toBeNull();
  });

  it("does not navigate when disabled", () => {
    const onClick = vi.fn();

    render(
      <Link
        href="/docs"
        disabled
        onClick={onClick}
      >
        Read the docs
      </Link>
    );

    const link = screen.getByRole("link", {
      name: "Read the docs",
    });

    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute(
      "aria-disabled",
      "true"
    );

    fireEvent.click(link);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps the click handler on an enabled link", () => {
    const onClick = vi.fn();

    render(
      <Link href="#docs" onClick={onClick}>
        Read the docs
      </Link>
    );

    fireEvent.click(
      screen.getByRole("link", { name: "Read the docs" })
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards a ref to the anchor", () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <Link ref={ref} href="/docs">
        Read the docs
      </Link>
    );

    expect(ref.current).toBe(
      screen.getByRole("link", { name: "Read the docs" })
    );
  });
});
