
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

import { Skeleton } from "./skeleton";

describe("Pimolu Skeleton", () => {
  it("renders with default classes", () => {
    render(
      <Skeleton data-testid="skeleton" />
    );

    expect(
      screen.getByTestId("skeleton")
    ).toHaveClass(
      "pimolu-skeleton",
      "pimolu-skeleton--text",
      "pimolu-skeleton--pulse"
    );
  });

  it("is hidden from assistive technology", () => {
    render(
      <Skeleton data-testid="skeleton" />
    );

    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton).toHaveAttribute(
      "aria-hidden",
      "true"
    );

    expect(
      screen.queryByRole("status")
    ).toBeNull();
  });

  it("supports circular shape", () => {
    render(
      <Skeleton
        data-testid="skeleton"
        shape="circular"
      />
    );

    expect(
      screen.getByTestId("skeleton")
    ).toHaveClass(
      "pimolu-skeleton--circular"
    );
  });

  it("supports custom dimensions", () => {
    render(
      <Skeleton
        data-testid="skeleton"
        width={200}
        height={24}
      />
    );

    expect(
      screen.getByTestId("skeleton")
    ).toHaveStyle({
      width: "200px",
      height: "24px",
    });
  });

  it("supports CSS percentage widths", () => {
    render(
      <Skeleton
        data-testid="skeleton"
        width="75%"
        height="1rem"
      />
    );

    // jsdom resolves `rem` against a 16px root when reading computed
    // styles, so the assertion uses the resolved value.
    expect(
      screen.getByTestId("skeleton")
    ).toHaveStyle({
      width: "75%",
      height: "16px",
    });

    expect(
      screen.getByTestId("skeleton").style.width
    ).toBe("75%");
  });

  it("supports wave animation", () => {
    render(
      <Skeleton
        data-testid="skeleton"
        animation="wave"
      />
    );

    expect(
      screen.getByTestId("skeleton")
    ).toHaveClass(
      "pimolu-skeleton--wave"
    );
  });

  it("supports disabled animation", () => {
    render(
      <Skeleton
        data-testid="skeleton"
        animation="none"
      />
    );

    expect(
      screen.getByTestId("skeleton")
    ).toHaveClass(
      "pimolu-skeleton--none"
    );
  });

  it("preserves custom styles", () => {
    render(
      <Skeleton
        data-testid="skeleton"
        width={200}
        style={{
          width: 100,
          marginTop: 12,
        }}
      />
    );

    expect(
      screen.getByTestId("skeleton")
    ).toHaveStyle({
      width: "200px",
      marginTop: "12px",
    });
  });

  it("forwards its ref", () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <Skeleton ref={ref} />
    );

    expect(ref.current?.tagName).toBe("SPAN");

    expect(ref.current).toHaveClass(
      "pimolu-skeleton"
    );
  });

  it("preserves native HTML attributes", () => {
    render(
      <Skeleton
        data-testid="skeleton"
        id="loading-profile"
        title="Placeholder"
        className="custom-skeleton"
      />
    );

    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton).toHaveAttribute(
      "id",
      "loading-profile"
    );

    expect(skeleton).toHaveAttribute(
      "title",
      "Placeholder"
    );

    expect(skeleton).toHaveClass(
      "custom-skeleton"
    );
  });

  it("never becomes a status notification", () => {
    render(
      <section aria-busy="true">
        <Skeleton data-testid="skeleton" />

        <p role="status">
          Loading profile...
        </p>
      </section>
    );

    expect(
      screen.getByRole("status")
    ).toHaveTextContent("Loading profile...");

    expect(
      screen.getByTestId("skeleton")
    ).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });
});
