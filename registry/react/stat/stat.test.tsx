import { createRef } from "react";

import {
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Stat } from "./stat";

describe("Pimolu Stat", () => {
  it("renders a labelled metric group", () => {
    render(
      <Stat
        label="Monthly revenue"
        value="$48,200"
        description="Billed this month"
        icon={<span data-testid="icon">$</span>}
      />
    );

    const stat = screen.getByRole("group", {
      name: "Monthly revenue",
    });

    expect(stat).toHaveClass(
      "pimolu-stat",
      "pimolu-stat--md"
    );

    expect(stat).toHaveTextContent("$48,200");
    expect(stat).toHaveTextContent("Billed this month");

    expect(
      screen.getByTestId("icon").parentElement
    ).toHaveAttribute("aria-hidden", "true");
  });

  it("renders an upward delta with a hidden direction label", () => {
    render(
      <Stat
        label="Active users"
        value="12,840"
        delta="+8.2%"
        trend="up"
      />
    );

    expect(
      screen.getByRole("group", {
        name: "Active users",
      })
    ).toHaveAttribute("data-trend", "up");

    const delta = screen
      .getByText("+8.2%")
      .closest(".pimolu-stat__delta");

    expect(delta).toHaveAttribute("data-trend", "up");

    expect(
      screen.getByText(/Increased/)
    ).toHaveClass("pimolu-stat__sr-only");

    expect(
      delta?.querySelector(
        ".pimolu-stat__trend-icon"
      )
    ).toHaveAttribute("aria-hidden", "true");
  });

  it("describes downward and neutral changes", () => {
    const { rerender } = render(
      <Stat
        label="Churn"
        value="2.1%"
        delta="-0.4%"
        trend="down"
      />
    );

    expect(
      screen.getByText(/Decreased/)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("group", {
        name: "Churn",
      })
    ).toHaveAttribute("data-trend", "down");

    rerender(
      <Stat
        label="Churn"
        value="2.1%"
        delta="0.0%"
        trend="neutral"
      />
    );

    expect(
      screen.getByText(/No change/)
    ).toBeInTheDocument();
  });

  it("does not add trend metadata without a delta", () => {
    render(
      <Stat label="Open tickets" value={0} />
    );

    const stat = screen.getByRole("group", {
      name: "Open tickets",
    });

    expect(stat).not.toHaveAttribute("data-trend");

    expect(stat).toHaveTextContent("0");
  });

  it("applies the size axis", () => {
    render(
      <Stat
        label="Conversion"
        value="3.8%"
        size="lg"
      />
    );

    expect(
      screen.getByRole("group", {
        name: "Conversion",
      })
    ).toHaveClass("pimolu-stat--lg");
  });

  it("forwards its ref and preserves native attributes", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Stat
        ref={ref}
        label="Latency"
        value="120 ms"
        id="latency-stat"
        className="custom-stat"
      />
    );

    expect(ref.current?.tagName).toBe("DIV");
    expect(ref.current).toHaveClass("custom-stat");

    expect(ref.current).toHaveAttribute(
      "id",
      "latency-stat"
    );
  });
});
