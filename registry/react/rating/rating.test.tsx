import { createRef } from "react";

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Rating } from "./rating";

describe("Pimolu Rating", () => {
  it("renders a five-star radiogroup by default", () => {
    render(<Rating />);

    const group = screen.getByRole("radiogroup", {
      name: "Rating",
    });

    expect(group).toHaveClass(
      "pimolu-rating",
      "pimolu-rating--md"
    );

    const stars = screen.getAllByRole("radio");

    expect(stars).toHaveLength(5);

    expect(
      screen.getByRole("radio", {
        name: "1 star",
      })
    ).toHaveAttribute("tabindex", "0");

    expect(
      screen.getByRole("radio", {
        name: "5 stars",
      })
    ).toHaveAttribute("tabindex", "-1");

    stars.forEach((star) => {
      expect(star).toHaveAttribute(
        "aria-checked",
        "false"
      );
    });
  });

  it("selects a value on click when uncontrolled", () => {
    const onValueChange = vi.fn();

    render(
      <Rating
        defaultValue={2}
        onValueChange={onValueChange}
      />
    );

    expect(
      screen.getByRole("radio", {
        name: "2 stars",
      })
    ).toHaveAttribute("aria-checked", "true");

    fireEvent.click(
      screen.getByRole("radio", {
        name: "4 stars",
      })
    );

    expect(
      screen.getByRole("radio", {
        name: "4 stars",
      })
    ).toHaveAttribute("aria-checked", "true");

    expect(onValueChange).toHaveBeenCalledWith(4);

    fireEvent.click(
      screen.getByRole("radio", {
        name: "4 stars",
      })
    );

    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("follows the value prop when controlled", () => {
    const onValueChange = vi.fn();

    const { rerender } = render(
      <Rating
        value={2}
        onValueChange={onValueChange}
      />
    );

    fireEvent.click(
      screen.getByRole("radio", {
        name: "4 stars",
      })
    );

    expect(onValueChange).toHaveBeenCalledWith(4);

    expect(
      screen.getByRole("radio", {
        name: "2 stars",
      })
    ).toHaveAttribute("aria-checked", "true");

    rerender(
      <Rating
        value={4}
        onValueChange={onValueChange}
      />
    );

    expect(
      screen.getByRole("radio", {
        name: "4 stars",
      })
    ).toHaveAttribute("aria-checked", "true");
  });

  it("clears the rating when the current value is clicked", () => {
    const onValueChange = vi.fn();

    render(
      <Rating
        defaultValue={3}
        allowClear
        onValueChange={onValueChange}
      />
    );

    const third = screen.getByRole("radio", {
      name: "3 stars",
    });

    fireEvent.click(third);

    expect(onValueChange).toHaveBeenLastCalledWith(0);

    expect(
      screen.getByRole("radio", {
        name: "1 star",
      })
    ).toHaveAttribute("tabindex", "0");

    expect(
      screen.getByRole("radio", {
        name: "3 stars",
      })
    ).toHaveAttribute("aria-checked", "false");
  });

  it("moves and selects with the arrow, Home and End keys", () => {
    render(<Rating defaultValue={2} />);

    const first = screen.getByRole("radio", {
      name: "1 star",
    });

    const second = screen.getByRole("radio", {
      name: "2 stars",
    });

    const third = screen.getByRole("radio", {
      name: "3 stars",
    });

    second.focus();

    fireEvent.keyDown(second, {
      key: "ArrowRight",
    });

    expect(third).toHaveFocus();
    expect(third).toHaveAttribute(
      "aria-checked",
      "true"
    );

    fireEvent.keyDown(third, { key: "End" });

    expect(
      screen.getByRole("radio", {
        name: "5 stars",
      })
    ).toHaveFocus();

    expect(
      screen.getByRole("radio", {
        name: "5 stars",
      })
    ).toHaveAttribute("aria-checked", "true");

    fireEvent.keyDown(
      screen.getByRole("radio", {
        name: "5 stars",
      }),
      { key: "Home" }
    );

    expect(first).toHaveFocus();
    expect(first).toHaveAttribute(
      "aria-checked",
      "true"
    );

    fireEvent.keyDown(first, {
      key: "ArrowLeft",
    });

    expect(first).toHaveFocus();
  });

  it("clears with the keyboard when allowClear is set", () => {
    render(<Rating defaultValue={3} allowClear />);

    const third = screen.getByRole("radio", {
      name: "3 stars",
    });

    third.focus();

    fireEvent.keyDown(third, { key: " " });

    expect(third).toHaveAttribute(
      "aria-checked",
      "false"
    );

    expect(
      screen.getByRole("radio", {
        name: "1 star",
      })
    ).toHaveAttribute("tabindex", "0");
  });

  it("is read-only without removing the rating semantics", () => {
    const onValueChange = vi.fn();

    render(
      <Rating
        value={4}
        readOnly
        onValueChange={onValueChange}
      />
    );

    const group = screen.getByRole("radiogroup", {
      name: "Rating",
    });

    expect(group).toHaveAttribute(
      "aria-readonly",
      "true"
    );

    expect(group).toHaveClass(
      "pimolu-rating--readonly"
    );

    fireEvent.click(
      screen.getByRole("radio", {
        name: "2 stars",
      })
    );

    expect(onValueChange).not.toHaveBeenCalled();

    expect(
      screen.getByRole("radio", {
        name: "4 stars",
      })
    ).toHaveAttribute("aria-checked", "true");
  });

  it("disables every star and exposes the group state", () => {
    render(<Rating defaultValue={2} disabled />);

    const group = screen.getByRole("radiogroup", {
      name: "Rating",
    });

    expect(group).toHaveAttribute(
      "aria-disabled",
      "true"
    );

    expect(group).toHaveClass(
      "pimolu-rating--disabled"
    );

    screen.getAllByRole("radio").forEach((star) => {
      expect(star).toBeDisabled();
    });
  });

  it("supports a visible label, a custom max and custom labels", () => {
    render(
      <Rating
        label="Product rating"
        max={3}
        defaultValue={1}
        size="lg"
        getLabel={(value) =>
          `Rate ${value} of 3`
        }
      />
    );

    const group = screen.getByRole("radiogroup", {
      name: "Product rating",
    });

    expect(group).toHaveClass(
      "pimolu-rating--lg"
    );

    expect(
      screen.getAllByRole("radio")
    ).toHaveLength(3);

    expect(
      screen.getByRole("radio", {
        name: "Rate 2 of 3",
      })
    ).toBeInTheDocument();
  });

  it("forwards its ref and keeps native attributes", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Rating
        ref={ref}
        aria-label="Overall rating"
        aria-describedby="rating-help"
        className="custom-rating"
      />
    );

    expect(ref.current?.tagName).toBe("DIV");

    expect(ref.current).toHaveClass("custom-rating");

    expect(ref.current).toHaveAttribute(
      "aria-describedby",
      "rating-help"
    );

    expect(
      screen.getByRole("radiogroup", {
        name: "Overall rating",
      })
    ).toBeInTheDocument();
  });
});
