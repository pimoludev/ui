
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

import { RangeSlider } from "./range-slider";

function handles(name = "Price") {
  return {
    lower: screen.getByRole("slider", {
      name: `${name} (Minimum)`,
    }),
    upper: screen.getByRole("slider", {
      name: `${name} (Maximum)`,
    }),
  };
}

describe("Pimolu RangeSlider", () => {
  it("renders two native sliders inside a named group", () => {
    render(<RangeSlider label="Price" />);

    const { lower, upper } = handles();

    expect(lower).toHaveAttribute("type", "range");
    expect(upper).toHaveAttribute("type", "range");

    expect(
      screen.getByRole("group", { name: "Price" })
    ).toBeInTheDocument();
  });

  it("defaults to the full range", () => {
    render(<RangeSlider label="Price" min={10} max={90} />);

    const { lower, upper } = handles();

    expect(lower).toHaveValue("10");
    expect(upper).toHaveValue("90");
  });

  it("orders a reversed default pair", () => {
    render(
      <RangeSlider label="Price" defaultValue={[80, 20]} />
    );

    const { lower, upper } = handles();

    expect(lower).toHaveValue("20");
    expect(upper).toHaveValue("80");
  });

  it("supports uncontrolled changes", () => {
    const onValueChange = vi.fn();

    render(
      <RangeSlider
        label="Price"
        defaultValue={[20, 80]}
        onValueChange={onValueChange}
      />
    );

    const { lower } = handles();

    fireEvent.change(lower, {
      target: { value: "40" },
    });

    expect(lower).toHaveValue("40");
    expect(onValueChange).toHaveBeenLastCalledWith([40, 80]);
  });

  it("keeps the lower handle under the upper one", () => {
    const onValueChange = vi.fn();

    render(
      <RangeSlider
        label="Price"
        defaultValue={[20, 80]}
        onValueChange={onValueChange}
      />
    );

    fireEvent.change(handles().lower, {
      target: { value: "90" },
    });

    expect(onValueChange).toHaveBeenLastCalledWith([80, 80]);
  });

  it("keeps the upper handle above the lower one", () => {
    const onValueChange = vi.fn();

    render(
      <RangeSlider
        label="Price"
        defaultValue={[20, 80]}
        onValueChange={onValueChange}
      />
    );

    fireEvent.change(handles().upper, {
      target: { value: "5" },
    });

    expect(onValueChange).toHaveBeenLastCalledWith([20, 20]);
  });

  it("supports controlled values", () => {
    function Example() {
      const [value, setValue] = useState<
        [number, number]
      >([20, 60]);

      return (
        <RangeSlider
          label="Price"
          value={value}
          onValueChange={setValue}
          showValue
        />
      );
    }

    render(<Example />);

    const { upper } = handles();

    fireEvent.change(upper, {
      target: { value: "70" },
    });

    expect(upper).toHaveValue("70");
  });

  it("exposes the selected segment to CSS", () => {
    render(
      <RangeSlider
        label="Price"
        min={0}
        max={200}
        defaultValue={[50, 150]}
      />
    );

    const control = handles()
      .lower.closest(
        ".pimolu-range-slider__control"
      ) as HTMLElement;

    expect(
      control.style.getPropertyValue(
        "--pimolu-range-slider-start"
      )
    ).toBe("25%");

    expect(
      control.style.getPropertyValue(
        "--pimolu-range-slider-end"
      )
    ).toBe("75%");
  });

  it("shows the pair when asked", () => {
    render(
      <RangeSlider
        label="Price"
        defaultValue={[20, 80]}
        showValue
      />
    );

    expect(
      screen.getByText("20 \u2013 80")
    ).toBeInTheDocument();
  });

  it("formats the displayed pair", () => {
    render(
      <RangeSlider
        label="Price"
        defaultValue={[20, 80]}
        showValue
        formatValue={([lower, upper]) =>
          `${lower} € \u2013 ${upper} €`
        }
      />
    );

    expect(
      screen.getByText("20 € \u2013 80 €")
    ).toBeInTheDocument();
  });

  it("connects helper text", () => {
    render(
      <RangeSlider
        label="Price"
        helperText="Choose a bracket."
      />
    );

    const { lower, upper } = handles();

    expect(lower).toHaveAccessibleDescription(
      "Choose a bracket."
    );

    expect(upper).toHaveAccessibleDescription(
      "Choose a bracket."
    );
  });

  it("shows errors accessibly", () => {
    render(
      <RangeSlider
        label="Price"
        helperText="Choose a bracket."
        errorMessage="The bracket is too narrow."
      />
    );

    const { lower, upper } = handles();

    expect(lower).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    expect(upper).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "The bracket is too narrow."
    );

    expect(
      screen.queryByText("Choose a bracket.")
    ).toBeNull();
  });

  it("supports the invalid state without a message", () => {
    render(<RangeSlider label="Price" invalid />);

    const { lower } = handles();

    expect(lower).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("supports the disabled state", () => {
    render(
      <RangeSlider
        label="Price"
        disabled
        defaultValue={[20, 80]}
      />
    );

    const { lower, upper } = handles();

    expect(lower).toBeDisabled();
    expect(upper).toBeDisabled();

    expect(
      lower.closest(".pimolu-range-slider")
    ).toHaveClass("pimolu-range-slider--disabled");
  });

  it("submits both handles", () => {
    render(
      <form aria-label="Filters">
        <RangeSlider
          label="Price"
          name="price"
          defaultValue={[20, 80]}
        />
      </form>
    );

    const form = screen.getByRole("form", {
      name: "Filters",
    }) as HTMLFormElement;

    const data = new FormData(form);

    expect(data.get("priceMin")).toBe("20");
    expect(data.get("priceMax")).toBe("80");
  });

  it("accepts explicit submit names", () => {
    render(
      <form aria-label="Filters">
        <RangeSlider
          label="Price"
          nameMin="from"
          nameMax="to"
          defaultValue={[20, 80]}
        />
      </form>
    );

    const form = screen.getByRole("form", {
      name: "Filters",
    }) as HTMLFormElement;

    const data = new FormData(form);

    expect(data.get("from")).toBe("20");
    expect(data.get("to")).toBe("80");
  });

  it("re-synchronizes the pair on form reset", () => {
    render(
      <form aria-label="Filters">
        <RangeSlider
          label="Price"
          defaultValue={[25, 75]}
          showValue
        />

        <button type="reset">Reset</button>
      </form>
    );

    fireEvent.change(handles().upper, {
      target: { value: "90" },
    });

    expect(
      screen.getByText("25 \u2013 90")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Reset" })
    );

    expect(
      screen.getByText("25 \u2013 75")
    ).toBeInTheDocument();
  });

  it("supports custom size and variant", () => {
    render(
      <RangeSlider
        label="Price"
        size="lg"
        variant="success"
      />
    );

    expect(
      screen
        .getByRole("group", { name: "Price" })
        .closest(".pimolu-range-slider")
    ).toHaveClass(
      "pimolu-range-slider--lg",
      "pimolu-range-slider--success"
    );
  });

  it("forwards its ref to the container", () => {
    const ref = createRef<HTMLDivElement>();

    render(<RangeSlider label="Price" ref={ref} />);

    expect(ref.current).toHaveClass(
      "pimolu-range-slider"
    );

    expect(ref.current).toHaveAttribute("role", "group");
  });
});
