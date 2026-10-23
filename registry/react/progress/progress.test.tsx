
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

import { Progress } from "./progress";

function fill(element: HTMLElement) {
  return element.querySelector(
    ".pimolu-progress__fill"
  ) as HTMLElement;
}

describe("Pimolu Progress", () => {
  it("exposes a determinate progress bar", () => {
    render(<Progress value={40} label="Upload" />);

    const bar = screen.getByRole("progressbar", {
      name: "Upload",
    });

    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuenow", "40");

    expect(
      fill(bar).style.getPropertyValue(
        "--pimolu-progress-value"
      )
    ).toBe("40%");
    expect(fill(bar).style.getPropertyValue("--pimolu-progress-scale")).toBe("0.4");
  });

  it("falls back to aria-label without a visible label", () => {
    render(
      <Progress value={10} aria-label="Indexing" />
    );

    expect(
      screen.getByRole("progressbar", {
        name: "Indexing",
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Indexing")
    ).toBeNull();
  });

  it("is indeterminate without a value", () => {
    render(<Progress label="Loading" />);

    const bar = screen.getByRole("progressbar", {
      name: "Loading",
    });

    expect(bar).not.toHaveAttribute("aria-valuenow");

    expect(
      bar.closest(".pimolu-progress")
    ).toHaveClass("pimolu-progress--indeterminate");
  });

  it("shows the percentage by default", () => {
    render(
      <Progress value={40} label="Upload" showValue />
    );

    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("formats the readout", () => {
    render(
      <Progress
        value={3}
        max={8}
        label="Steps"
        showValue
        formatValue={(value, max) => `${value} of ${max}`}
      />
    );

    expect(screen.getByText("3 of 8")).toBeInTheDocument();
  });

  it("hides the readout when indeterminate", () => {
    render(
      <Progress
        label="Loading"
        showValue
        formatValue={() => "0 of 0"}
      />
    );

    expect(
      screen.queryByText("0 of 0")
    ).toBeNull();
  });

  it("clamps values into the range", () => {
    render(
      <>
        <Progress value={140} label="High" />
        <Progress value={-20} label="Low" />
      </>
    );

    expect(
      screen.getByRole("progressbar", { name: "High" })
    ).toHaveAttribute("aria-valuenow", "100");

    expect(
      screen.getByRole("progressbar", { name: "Low" })
    ).toHaveAttribute("aria-valuenow", "0");
  });

  it("supports a custom maximum", () => {
    render(
      <Progress value={5} max={20} label="Quota" />
    );

    const bar = screen.getByRole("progressbar", {
      name: "Quota",
    });

    expect(bar).toHaveAttribute("aria-valuemax", "20");

    expect(
      fill(bar).style.getPropertyValue(
        "--pimolu-progress-value"
      )
    ).toBe("25%");
  });

  it("survives a zero maximum", () => {
    render(<Progress value={5} max={0} label="Broken" />);

    const bar = screen.getByRole("progressbar", {
      name: "Broken",
    });

    expect(
      fill(bar).style.getPropertyValue(
        "--pimolu-progress-value"
      )
    ).toBe("0%");
  });

  it("supports size and variant", () => {
    render(
      <Progress
        value={30}
        label="Upload"
        size="lg"
        variant="success"
      />
    );

    expect(
      screen
        .getByRole("progressbar", { name: "Upload" })
        .closest(".pimolu-progress")
    ).toHaveClass(
      "pimolu-progress--lg",
      "pimolu-progress--success"
    );
  });

  it("connects a description", () => {
    render(
      <>
        <Progress
          value={30}
          label="Upload"
          aria-describedby="upload-help"
        />

        <p id="upload-help">Three files left.</p>
      </>
    );

    expect(
      screen.getByRole("progressbar", {
        name: "Upload",
      })
    ).toHaveAccessibleDescription("Three files left.");
  });

  it("accepts a spoken value", () => {
    render(
      <Progress
        value={3}
        max={8}
        label="Steps"
        valueLabel="Step 3 of 8"
      />
    );

    expect(
      screen.getByRole("progressbar", {
        name: "Steps",
      })
    ).toHaveAttribute("aria-valuetext", "Step 3 of 8");
  });

  it("forwards its ref and extra attributes", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Progress
        ref={ref}
        value={10}
        label="Upload"
        className="custom"
        data-testid="bar"
      />
    );

    expect(ref.current).toHaveClass(
      "pimolu-progress",
      "custom"
    );

    expect(screen.getByTestId("bar")).toBe(ref.current);
  });
});
