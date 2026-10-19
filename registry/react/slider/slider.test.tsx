
import {
  createRef,
  useState,
} from "react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import { Slider } from "./slider";

describe("Pimolu Slider", () => {
  it("renders a native slider with default properties", () => {
    render(<Slider label="Volume" />);

    const slider = screen.getByRole("slider", {
      name: "Volume",
    });

    expect(slider).toHaveAttribute("type", "range");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "100");
    expect(slider).toHaveAttribute("step", "1");

    expect(
      slider.closest(".pimolu-slider")
    ).toHaveClass(
      "pimolu-slider--md",
      "pimolu-slider--primary"
    );
  });

  it("supports uncontrolled changes", () => {
    const onValueChange = vi.fn();

    render(
      <Slider
        label="Volume"
        defaultValue={20}
        onValueChange={onValueChange}
      />
    );

    const slider = screen.getByRole("slider");

    expect(slider).toHaveValue("20");

    fireEvent.change(slider, {
      target: { value: "45" },
    });

    expect(slider).toHaveValue("45");
    expect(onValueChange).toHaveBeenLastCalledWith(45);
  });

  it("supports controlled values", () => {
    function Example() {
      const [value, setValue] = useState(30);

      return (
        <Slider
          label="Volume"
          value={value}
          onValueChange={setValue}
        />
      );
    }

    render(<Example />);

    const slider = screen.getByRole("slider");

    expect(slider).toHaveValue("30");

    fireEvent.change(slider, {
      target: { value: "70" },
    });

    expect(slider).toHaveValue("70");
  });

  it("calls onValueChange with the numeric value", () => {
    const onValueChange = vi.fn();

    render(
      <Slider
        label="Volume"
        defaultValue={10}
        onValueChange={onValueChange}
      />
    );

    fireEvent.change(screen.getByRole("slider"), {
      target: { value: "60" },
    });

    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith(60);
  });

  it("respects custom bounds and step", () => {
    render(
      <Slider
        label="Price"
        min={50}
        max={150}
        step={5}
        defaultValue={100}
      />
    );

    const slider = screen.getByRole("slider");

    expect(slider).toHaveAttribute("min", "50");
    expect(slider).toHaveAttribute("max", "150");
    expect(slider).toHaveAttribute("step", "5");
  });

  it("exposes the fill percentage to CSS", () => {
    render(
      <Slider
        label="Volume"
        min={0}
        max={200}
        defaultValue={50}
      />
    );

    expect(
      screen.getByRole("slider").style.getPropertyValue(
        "--pimolu-slider-progress"
      )
    ).toBe("25%");
  });

  it("shows the value when asked", () => {
    render(
      <Slider label="Volume" defaultValue={42} showValue />
    );

    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("formats the displayed value", () => {
    render(
      <Slider
        label="Opacity"
        defaultValue={75}
        showValue
        formatValue={(value) => `${value}%`}
      />
    );

    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("connects helper text", () => {
    render(
      <Slider
        label="Volume"
        helperText="Adjust the output level."
      />
    );

    expect(
      screen.getByRole("slider")
    ).toHaveAccessibleDescription(
      "Adjust the output level."
    );
  });

  it("shows errors accessibly", () => {
    render(
      <Slider
        label="Volume"
        helperText="Adjust the output level."
        errorMessage="Out of the allowed range."
      />
    );

    const slider = screen.getByRole("slider");

    expect(slider).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Out of the allowed range."
    );

    expect(
      screen.queryByText("Adjust the output level.")
    ).toBeNull();
  });

  it("supports the invalid state without a message", () => {
    render(<Slider label="Volume" invalid />);

    expect(
      screen.getByRole("slider")
    ).toHaveAttribute("aria-invalid", "true");

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("supports disabled state", () => {
    render(
      <Slider label="Volume" disabled defaultValue={10} />
    );

    expect(screen.getByRole("slider")).toBeDisabled();

    expect(
      screen.getByRole("slider").closest(".pimolu-slider")
    ).toHaveClass("pimolu-slider--disabled");
  });

  it("submits its value with FormData", () => {
    render(
      <form aria-label="Settings">
        <Slider
          name="volume"
          label="Volume"
          defaultValue={35}
        />
      </form>
    );

    const form = screen.getByRole("form", {
      name: "Settings",
    }) as HTMLFormElement;

    expect(
      new FormData(form).get("volume")
    ).toBe("35");
  });

  it("re-synchronizes the displayed value on form reset", () => {
    render(
      <form aria-label="Settings">
        <Slider
          label="Volume"
          defaultValue={25}
          showValue
        />

        <button type="reset">Reset</button>
      </form>
    );

    const slider = screen.getByRole("slider");

    fireEvent.change(slider, {
      target: { value: "80" },
    });

    expect(screen.getByText("80")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Reset" })
    );

    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("supports custom size and variant", () => {
    render(
      <Slider
        label="Volume"
        size="lg"
        variant="success"
      />
    );

    expect(
      screen.getByRole("slider").closest(".pimolu-slider")
    ).toHaveClass(
      "pimolu-slider--lg",
      "pimolu-slider--success"
    );
  });

  it("forwards its ref to the native input", () => {
    const ref = createRef<HTMLInputElement>();

    render(<Slider label="Volume" ref={ref} />);

    expect(ref.current?.tagName).toBe("INPUT");
    expect(ref.current).toHaveAttribute("type", "range");
  });
});
