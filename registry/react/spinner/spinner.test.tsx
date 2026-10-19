
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

import userEvent from "@testing-library/user-event";

import { Spinner } from "./spinner";

describe("Pimolu Spinner", () => {
  it("renders with default properties", () => {
    render(<Spinner />);

    const spinner = screen.getByRole("status");

    expect(spinner).toHaveClass(
      "pimolu-spinner",
      "pimolu-spinner--circular",
      "pimolu-spinner--md",
      "pimolu-spinner--inherit"
    );

    expect(spinner).toHaveTextContent("Loading...");
  });

  it("supports custom accessible labels", () => {
    render(
      <Spinner label="Chargement du profil..." />
    );

    expect(
      screen.getByRole("status")
    ).toHaveTextContent(
      "Chargement du profil..."
    );
  });

  it("supports decorative mode", () => {
    render(
      <Spinner decorative data-testid="spinner" />
    );

    const spinner = screen.getByTestId("spinner");

    expect(spinner).toHaveAttribute(
      "aria-hidden",
      "true"
    );

    expect(
      screen.queryByRole("status")
    ).toBeNull();

    expect(
      spinner.querySelector(".pimolu-spinner__label")
    ).toBeNull();
  });

  it("renders circular SVG elements", () => {
    render(
      <Spinner
        appearance="circular"
        data-testid="spinner"
      />
    );

    const spinner = screen.getByTestId("spinner");

    expect(
      spinner.querySelectorAll("svg circle")
    ).toHaveLength(2);
  });

  it("renders three dots", () => {
    render(
      <Spinner
        appearance="dots"
        data-testid="spinner"
      />
    );

    const spinner = screen.getByTestId("spinner");

    expect(
      spinner.querySelectorAll(".pimolu-spinner__dot")
    ).toHaveLength(3);

    expect(
      spinner.querySelector("svg")
    ).toBeNull();
  });

  it("supports arc appearance", () => {
    render(
      <Spinner
        appearance="arc"
        data-testid="spinner"
      />
    );

    const spinner = screen.getByTestId("spinner");

    expect(spinner).toHaveClass(
      "pimolu-spinner--arc"
    );

    expect(
      spinner.querySelector(".pimolu-spinner__indicator")
    ).toBeInTheDocument();
  });

  it("supports semantic variants and sizes", () => {
    render(
      <Spinner
        appearance="dots"
        size="xl"
        variant="success"
        data-testid="spinner"
      />
    );

    expect(
      screen.getByTestId("spinner")
    ).toHaveClass(
      "pimolu-spinner--dots",
      "pimolu-spinner--xl",
      "pimolu-spinner--success"
    );
  });

  it("forwards its ref", () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <Spinner ref={ref} />
    );

    expect(ref.current?.tagName).toBe("SPAN");

    expect(ref.current).toHaveClass(
      "pimolu-spinner"
    );
  });

  it("preserves native HTML attributes", () => {
    render(
      <Spinner
        data-testid="spinner"
        id="loading-users"
        title="Loading users"
        className="custom-spinner"
      />
    );

    const spinner = screen.getByTestId("spinner");

    expect(spinner).toHaveAttribute(
      "id",
      "loading-users"
    );

    expect(spinner).toHaveAttribute(
      "title",
      "Loading users"
    );

    expect(spinner).toHaveClass(
      "custom-spinner"
    );
  });

  it("does not interrupt keyboard navigation", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button>Previous</button>

        <Spinner />

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
});
