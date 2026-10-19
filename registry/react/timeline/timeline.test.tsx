import {
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "./timeline";

describe("Pimolu Timeline", () => {
  it("renders an ordered list with item states", () => {
    render(
      <Timeline aria-label="Order tracking">
        <TimelineItem status="complete">
          <TimelineContent>
            <TimelineTitle>Order placed</TimelineTitle>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem status="active">
          <TimelineContent>
            <TimelineTitle>Preparing shipment</TimelineTitle>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineContent>
            <TimelineTitle>Delivered</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    );

    expect(
      screen.getByRole("list", {
        name: "Order tracking",
      })
    ).toHaveClass("pimolu-timeline");

    const items = screen.getAllByRole("listitem");

    expect(items).toHaveLength(3);

    expect(items[0]).toHaveAttribute(
      "data-status",
      "complete"
    );

    expect(items[1]).toHaveAttribute(
      "data-status",
      "active"
    );

    expect(items[1]).toHaveAttribute(
      "aria-current",
      "step"
    );

    expect(items[2]).not.toHaveAttribute(
      "aria-current"
    );
  });

  it("generates a decorative indicator with an icon", () => {
    render(
      <Timeline aria-label="Shipping">
        <TimelineItem
          status="complete"
          icon={<span data-testid="check">ok</span>}
        >
          <TimelineContent>
            <TimelineTitle>Packed</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    );

    const indicator = screen.getByTestId(
      "check"
    ).parentElement;

    expect(indicator).toHaveClass(
      "pimolu-timeline__indicator"
    );

    expect(indicator).toHaveAttribute(
      "aria-hidden",
      "true"
    );

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Packed",
      })
    ).toHaveClass("pimolu-timeline__title");
  });

  it("accepts an explicit indicator and content", () => {
    const { container } = render(
      <Timeline aria-label="Deployments">
        <TimelineItem status="error">
          <TimelineIndicator>
            <span data-testid="alert">!</span>
          </TimelineIndicator>

          <TimelineContent>
            <TimelineTitle as="div">
              Rollback
            </TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    );

    expect(
      container.querySelectorAll(
        ".pimolu-timeline__indicator"
      )
    ).toHaveLength(1);

    expect(
      screen.getByTestId("alert").parentElement
    ).toHaveAttribute("aria-hidden", "true");

    expect(
      screen.getByText(/Error:/)
    ).toHaveClass("pimolu-timeline__sr-only");

    expect(
      screen.getByText("Rollback")
    ).toHaveClass("pimolu-timeline__title");

    expect(
      screen.queryByRole("heading")
    ).toBeNull();
  });

  it("wraps bare children in a content container", () => {
    const { container } = render(
      <Timeline aria-label="Activity">
        <TimelineItem>
          <span>First update</span>
        </TimelineItem>
      </Timeline>
    );

    const content = container.querySelector(
      ".pimolu-timeline__content"
    );

    expect(content).toHaveTextContent("First update");

    expect(
      content?.parentElement
    ).toHaveClass("pimolu-timeline__item");
  });

  it("renders a semantic time with a machine-readable value", () => {
    render(
      <Timeline aria-label="Activity">
        <TimelineItem>
          <TimelineContent>
            <TimelineTitle>Build finished</TimelineTitle>

            <TimelineDescription>
              All checks passed.
            </TimelineDescription>

            <TimelineTime dateTime="2026-10-19T09:15">
              09:15
            </TimelineTime>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    );

    const time = screen
      .getByText("09:15")
      .closest("time");

    expect(time).toHaveAttribute(
      "datetime",
      "2026-10-19T09:15"
    );

    expect(time).toHaveClass(
      "pimolu-timeline__time"
    );

    expect(
      screen.getByText("All checks passed.")
    ).toHaveClass(
      "pimolu-timeline__description"
    );
  });

  it("applies the compact variant and center alignment", () => {
    render(
      <Timeline
        aria-label="Activity"
        variant="compact"
        align="center"
      >
        <TimelineItem>
          <TimelineContent>Entry</TimelineContent>
        </TimelineItem>
      </Timeline>
    );

    expect(
      screen.getByRole("list", {
        name: "Activity",
      })
    ).toHaveClass(
      "pimolu-timeline--compact",
      "pimolu-timeline--align-center"
    );
  });

  it("passes native attributes through to items", () => {
    render(
      <Timeline aria-label="Activity">
        <TimelineItem
          id="deploy-item"
          className="custom-item"
        >
          <TimelineContent>Deployed</TimelineContent>
        </TimelineItem>
      </Timeline>
    );

    expect(
      screen.getByRole("listitem")
    ).toHaveAttribute("id", "deploy-item");

    expect(
      screen.getByRole("listitem")
    ).toHaveClass("custom-item");
  });
});
