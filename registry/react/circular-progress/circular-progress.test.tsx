
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

import { CircularProgress } from "./circular-progress";

function indicator(element: HTMLElement) {
  return element.querySelector(
    ".pimolu-circular-progress__indicator"
  ) as SVGElement;
}

describe("Pimolu CircularProgress", () => {
  it("keeps invalid ranges finite and marks empty and completed rings", () => {
    const { rerender } = render(<CircularProgress label="Import" value={50} max={Infinity} showValue />);
    const gauge = screen.getByRole("progressbar");
    expect(gauge).toHaveAttribute("aria-valuemax", "100");
    expect(gauge).toHaveAttribute("aria-valuenow", "0");
    expect(gauge).toHaveAttribute("data-empty", "true");
    expect(screen.getByText("0%")).toHaveAttribute("title", "0%");
    rerender(<CircularProgress label="Import" value={200} />);
    expect(gauge).toHaveAttribute("data-complete", "true");
    expect(gauge).not.toHaveAttribute("data-empty");
  });
  it("exposes a determinate gauge", () => {
    render(<CircularProgress value={40} label="Upload" />);

    const gauge = screen.getByRole("progressbar", {
      name: "Upload",
    });

    expect(gauge).toHaveAttribute("aria-valuemin", "0");
    expect(gauge).toHaveAttribute("aria-valuemax", "100");
    expect(gauge).toHaveAttribute("aria-valuenow", "40");
  });

  it("draws the indicator as a percentage of the circle", () => {
    render(<CircularProgress value={25} label="Upload" />);

    const shape = indicator(
      screen.getByRole("progressbar", {
        name: "Upload",
      })
    );

    expect(shape).toHaveAttribute("pathLength", "100");

    expect(
      shape.style.getPropertyValue(
        "--pimolu-circular-progress-offset"
      )
    ).toBe("75");
  });

  it("is indeterminate without a value", () => {
    render(<CircularProgress label="Loading" />);

    const gauge = screen.getByRole("progressbar", {
      name: "Loading",
    });

    expect(gauge).not.toHaveAttribute("aria-valuenow");

    expect(gauge).toHaveClass(
      "pimolu-circular-progress--indeterminate"
    );
  });

  it("supports aria-label without a label", () => {
    render(
      <CircularProgress value={10} aria-label="Indexing" />
    );

    expect(
      screen.getByRole("progressbar", {
        name: "Indexing",
      })
    ).toBeInTheDocument();
  });

  it("shows the percentage in the middle", () => {
    render(
      <CircularProgress value={40} label="Upload" showValue />
    );

    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("formats the readout", () => {
    render(
      <CircularProgress
        value={3}
        max={8}
        label="Steps"
        showValue
        formatValue={(value, max) => `${value}/${max}`}
      />
    );

    expect(screen.getByText("3/8")).toBeInTheDocument();
  });

  it("hides the readout when indeterminate", () => {
    render(
      <CircularProgress
        label="Loading"
        showValue
        formatValue={() => "0/0"}
      />
    );

    expect(screen.queryByText("0/0")).toBeNull();
  });

  it("clamps values into the range", () => {
    render(
      <>
        <CircularProgress value={140} label="High" />
        <CircularProgress value={-20} label="Low" />
      </>
    );

    expect(
      screen.getByRole("progressbar", { name: "High" })
    ).toHaveAttribute("aria-valuenow", "100");

    expect(
      screen.getByRole("progressbar", { name: "Low" })
    ).toHaveAttribute("aria-valuenow", "0");
  });

  it("survives a zero maximum", () => {
    render(
      <CircularProgress value={5} max={0} label="Broken" />
    );

    expect(
      indicator(
        screen.getByRole("progressbar", {
          name: "Broken",
        })
      ).style.getPropertyValue(
        "--pimolu-circular-progress-offset"
      )
    ).toBe("100");
  });

  it("supports size and variant", () => {
    render(
      <CircularProgress
        value={30}
        label="Upload"
        size="lg"
        variant="success"
      />
    );

    expect(
      screen.getByRole("progressbar", { name: "Upload" })
    ).toHaveClass(
      "pimolu-circular-progress--lg",
      "pimolu-circular-progress--success"
    );
  });

  it("hides the decorative svg from assistive technology", () => {
    render(<CircularProgress value={30} label="Upload" />);

    expect(
      screen
        .getByRole("progressbar", { name: "Upload" })
        .querySelector("svg")
    ).toHaveAttribute("aria-hidden", "true");
  });

  it("connects a description and a spoken value", () => {
    render(
      <>
        <CircularProgress
          value={3}
          max={8}
          label="Steps"
          valueLabel="Step 3 of 8"
          aria-describedby="steps-help"
        />

        <p id="steps-help">Five steps left.</p>
      </>
    );

    const gauge = screen.getByRole("progressbar", {
      name: "Steps",
    });

    expect(gauge).toHaveAttribute(
      "aria-valuetext",
      "Step 3 of 8"
    );

    expect(gauge).toHaveAccessibleDescription(
      "Five steps left."
    );
  });

  it("forwards its ref and extra attributes", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <CircularProgress
        ref={ref}
        value={10}
        label="Upload"
        className="custom"
        data-testid="gauge"
      />
    );

    expect(ref.current).toHaveClass(
      "pimolu-circular-progress",
      "custom"
    );

    expect(screen.getByTestId("gauge")).toBe(ref.current);
  });
});
