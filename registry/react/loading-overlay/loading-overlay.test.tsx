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

import { LoadingOverlay } from "./loading-overlay";

describe("Pimolu LoadingOverlay", () => {
  it("shows a loading state by default", () => {
    render(
      <LoadingOverlay data-testid="overlay">
        <p>Dashboard</p>
      </LoadingOverlay>
    );

    const overlay = screen.getByTestId("overlay");

    expect(overlay).toHaveAttribute("aria-busy", "true");
    expect(overlay).toHaveAttribute(
      "data-loading",
      "true"
    );

    const status = screen.getByRole("status");

    expect(status).toHaveTextContent("Loading");
    expect(status).toHaveClass(
      "pimolu-loading-overlay__overlay"
    );
  });

  it("supports a custom label and description", () => {
    render(
      <LoadingOverlay
        label="Importing contacts"
        description="This can take a few seconds."
      />
    );

    expect(
      screen.getByRole("status")
    ).toHaveTextContent("Importing contacts");

    expect(
      screen.getByText(
        "This can take a few seconds."
      )
    ).toBeInTheDocument();
  });

  it("renders a single decorative spinner, not a second live region", () => {
    render(<LoadingOverlay />);

    const status = screen.getByRole("status");
    const spinner = status.querySelector(
      ".pimolu-spinner"
    );

    expect(spinner).toHaveAttribute(
      "aria-hidden",
      "true"
    );

    expect(
      spinner?.querySelector(".pimolu-spinner__label")
    ).toBeNull();
  });

  it("makes the covered content inert while loading and restores it after", () => {
    const { rerender } = render(
      <LoadingOverlay>
        <button type="button">Checkout</button>
      </LoadingOverlay>
    );

    const content = screen
      .getByRole("button", {
        name: "Checkout",
        hidden: true,
      })
      .parentElement;

    expect(content).toHaveAttribute("inert");
    expect(content).toHaveAttribute(
      "aria-hidden",
      "true"
    );

    rerender(
      <LoadingOverlay loading={false}>
        <button type="button">Checkout</button>
      </LoadingOverlay>
    );

    expect(
      screen.getByRole("button", { name: "Checkout" })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("status")
    ).toBeNull();

    const restored = screen.getByRole("button", {
      name: "Checkout",
    }).parentElement;

    expect(restored).not.toHaveAttribute("inert");
    expect(restored).not.toHaveAttribute(
      "aria-hidden"
    );
  });

  it("applies the blur and fullscreen modifiers", () => {
    render(
      <LoadingOverlay
        data-testid="overlay"
        blur
        fullscreen
      />
    );

    expect(screen.getByTestId("overlay")).toHaveClass(
      "pimolu-loading-overlay--blur",
      "pimolu-loading-overlay--fullscreen"
    );
  });

  it("forwards its ref and accepts native attributes", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <LoadingOverlay
        ref={ref}
        id="saving"
        className="custom-overlay"
        label="Saving"
      />
    );

    expect(ref.current?.tagName).toBe("DIV");
    expect(ref.current).toHaveAttribute("id", "saving");
    expect(ref.current).toHaveClass(
      "pimolu-loading-overlay",
      "custom-overlay"
    );
  });
});
