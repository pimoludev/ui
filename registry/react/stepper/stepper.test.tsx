import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Stepper, StepperItem } from "./stepper";

function Example(
  props: {
    activeStep?: number;
    defaultActiveStep?: number;
    clickable?: boolean;
    onStepChange?: (step: number) => void;
    orientation?: "horizontal" | "vertical";
  } = {}
) {
  return (
    <Stepper
      aria-label="Checkout"
      activeStep={props.activeStep}
      defaultActiveStep={props.defaultActiveStep}
      clickable={props.clickable}
      onStepChange={props.onStepChange}
      orientation={props.orientation}
    >
      <StepperItem
        step={1}
        title="Account"
        description="Create an account"
      />

      <StepperItem
        step={2}
        title="Shipping"
        description="Where to send it"
      />

      <StepperItem
        step={3}
        title="Payment"
        description="Card details"
      />
    </Stepper>
  );
}

describe("Pimolu Stepper", () => {
  it("renders completed, active and upcoming steps", () => {
    render(<Example defaultActiveStep={2} />);

    expect(
      screen.getByRole("list", { name: "Checkout" })
    ).toBeInTheDocument();

    const account = screen
      .getByText("Account")
      .closest("li");

    const shipping = screen
      .getByText("Shipping")
      .closest("li");

    const payment = screen
      .getByText("Payment")
      .closest("li");

    expect(account).toHaveAttribute(
      "data-state",
      "complete"
    );

    expect(shipping).toHaveAttribute(
      "data-state",
      "active"
    );

    expect(shipping).toHaveAttribute(
      "aria-current",
      "step"
    );

    expect(payment).toHaveAttribute(
      "data-state",
      "upcoming"
    );
  });

  it("changes step on click when clickable", () => {
    const onStepChange = vi.fn();

    render(
      <Example
        defaultActiveStep={1}
        clickable
        onStepChange={onStepChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /Payment/,
      })
    );

    expect(onStepChange).toHaveBeenCalledWith(3);

    expect(
      screen.getByText("Payment").closest("li")
    ).toHaveAttribute("data-state", "active");
  });

  it("does not render buttons when not clickable", () => {
    render(<Example />);

    expect(
      screen.queryByRole("button", {
        name: /Payment/,
      })
    ).toBeNull();
  });

  it("follows the activeStep prop when controlled", () => {
    const { rerender } = render(
      <Example activeStep={1} />
    );

    expect(
      screen.getByText("Account").closest("li")
    ).toHaveAttribute("data-state", "active");

    rerender(<Example activeStep={3} />);

    expect(
      screen.getByText("Payment").closest("li")
    ).toHaveAttribute("data-state", "active");
  });

  it("disables one step", () => {
    render(
      <Stepper
        aria-label="Checkout"
        defaultActiveStep={1}
        clickable
      >
        <StepperItem step={1} title="Account" />

        <StepperItem step={2} title="Shipping" disabled />
      </Stepper>
    );

    expect(
      screen.getByText("Shipping").closest("li")
    ).toHaveAttribute("data-state", "disabled");

    expect(
      screen.queryByRole("button", {
        name: /Shipping/,
      })
    ).toBeNull();
  });

  it("marks the vertical orientation", () => {
    render(<Example orientation="vertical" />);

    expect(
      screen.getByRole("list", { name: "Checkout" })
    ).toHaveClass("pimolu-stepper--vertical");
  });
});
