import { createRef, type ReactNode } from "react";

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { Resizable } from "./resizable";

function panes(): [ReactNode, ReactNode] {
  return [
    <div key="start">Files</div>,
    <div key="end">Preview</div>,
  ];
}

function mockRect(
  width: number,
  height: number
) {
  return {
    width,
    height,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect;
}

describe("Pimolu Resizable", () => {
  it("renders two panes and an accessible separator", () => {
    const { container } = render(
      <Resizable>
        <div>Files</div>
        <div>Preview</div>
      </Resizable>
    );

    const root = container.firstElementChild;

    expect(root).toHaveClass("pimolu-resizable");
    expect(root).toHaveAttribute(
      "data-orientation",
      "horizontal"
    );

    expect(screen.getByText("Files")).toBeInTheDocument();
    expect(screen.getByText("Preview")).toBeInTheDocument();

    const separator = screen.getByRole("separator", {
      name: "Resize panels",
    });

    expect(separator).toHaveAttribute("tabindex", "0");
    expect(separator).toHaveAttribute(
      "aria-orientation",
      "vertical"
    );

    expect(separator).toHaveAttribute(
      "aria-valuemin",
      "10"
    );

    expect(separator).toHaveAttribute(
      "aria-valuemax",
      "90"
    );

    expect(separator).toHaveAttribute(
      "aria-valuenow",
      "50"
    );

    expect(separator).toHaveAttribute(
      "aria-valuetext",
      "50% / 50%"
    );
  });

  it("supports a controlled value without moving the panes itself", () => {
    const onSizesChange = vi.fn();

    const { rerender } = render(
      <Resizable
        sizes={[30, 70]}
        onSizesChange={onSizesChange}
      >
        {panes()}
      </Resizable>
    );

    const separator = screen.getByRole("separator");

    expect(separator).toHaveAttribute(
      "aria-valuenow",
      "30"
    );

    fireEvent.keyDown(separator, {
      key: "ArrowRight",
    });

    expect(onSizesChange).toHaveBeenLastCalledWith([
      31, 69,
    ]);

    expect(separator).toHaveAttribute(
      "aria-valuenow",
      "30"
    );

    rerender(
      <Resizable
        sizes={[31, 69]}
        onSizesChange={onSizesChange}
      >
        {panes()}
      </Resizable>
    );

    expect(
      screen.getByRole("separator")
    ).toHaveAttribute("aria-valuenow", "31");
  });

  it("changes sizes with the arrow keys, Home and End", () => {
    const onSizesChange = vi.fn();

    render(
      <Resizable onSizesChange={onSizesChange}>
        {panes()}
      </Resizable>
    );

    const separator = screen.getByRole("separator");

    fireEvent.keyDown(separator, {
      key: "ArrowRight",
    });

    expect(onSizesChange).toHaveBeenLastCalledWith([
      51, 49,
    ]);

    fireEvent.keyDown(separator, {
      key: "ArrowLeft",
    });

    expect(onSizesChange).toHaveBeenLastCalledWith([
      50, 50,
    ]);

    fireEvent.keyDown(separator, { key: "Home" });

    expect(onSizesChange).toHaveBeenLastCalledWith([
      10, 90,
    ]);

    fireEvent.keyDown(separator, { key: "End" });

    expect(onSizesChange).toHaveBeenLastCalledWith([
      90, 10,
    ]);
  });

  it("respects independent minimum sizes", () => {
    const onSizesChange = vi.fn();

    render(
      <Resizable
        minSize={[20, 30]}
        onSizesChange={onSizesChange}
      >
        {panes()}
      </Resizable>
    );

    const separator = screen.getByRole("separator");

    expect(separator).toHaveAttribute(
      "aria-valuemin",
      "20"
    );

    expect(separator).toHaveAttribute(
      "aria-valuemax",
      "70"
    );

    fireEvent.keyDown(separator, { key: "Home" });
    expect(onSizesChange).toHaveBeenLastCalledWith([
      20, 80,
    ]);

    fireEvent.keyDown(separator, { key: "End" });
    expect(onSizesChange).toHaveBeenLastCalledWith([
      70, 30,
    ]);
  });

  it("uses the perpendicular orientation on a vertical split", () => {
    const onSizesChange = vi.fn();

    const { container } = render(
      <Resizable
        orientation="vertical"
        onSizesChange={onSizesChange}
      >
        {panes()}
      </Resizable>
    );

    expect(container.firstElementChild).toHaveAttribute(
      "data-orientation",
      "vertical"
    );

    const separator = screen.getByRole("separator");

    expect(separator).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    );

    fireEvent.keyDown(separator, {
      key: "ArrowDown",
    });

    expect(onSizesChange).toHaveBeenLastCalledWith([
      51, 49,
    ]);

    fireEvent.keyDown(separator, {
      key: "ArrowUp",
    });

    expect(onSizesChange).toHaveBeenLastCalledWith([
      50, 50,
    ]);
  });

  it("follows a pointer drag", () => {
    const onSizesChange = vi.fn();

    const { container } = render(
      <Resizable onSizesChange={onSizesChange}>
        {panes()}
      </Resizable>
    );

    const root = container.firstElementChild as HTMLElement;

    vi.spyOn(
      root,
      "getBoundingClientRect"
    ).mockReturnValue(mockRect(400, 200));

    const separator = screen.getByRole("separator");

    fireEvent.pointerDown(separator, {
      pointerId: 1,
      clientX: 200,
      button: 0,
    });

    expect(root).toHaveAttribute(
      "data-dragging",
      "true"
    );

    fireEvent.pointerMove(separator, {
      pointerId: 1,
      clientX: 300,
    });

    expect(onSizesChange).toHaveBeenLastCalledWith([
      75, 25,
    ]);

    fireEvent.pointerUp(separator, {
      pointerId: 1,
      clientX: 300,
    });

    expect(root).toHaveAttribute(
      "data-dragging",
      "false"
    );
  });

  it("restores the default sizes on double click", () => {
    const onReset = vi.fn();

    render(
      <Resizable onReset={onReset}>
        {panes()}
      </Resizable>
    );

    const separator = screen.getByRole("separator");

    fireEvent.keyDown(separator, {
      key: "ArrowRight",
    });

    expect(separator).toHaveAttribute(
      "aria-valuenow",
      "51"
    );

    fireEvent.doubleClick(separator);

    expect(separator).toHaveAttribute(
      "aria-valuenow",
      "50"
    );

    expect(onReset).toHaveBeenLastCalledWith([50, 50]);
  });

  it("disables interaction and forwards the ref", () => {
    const ref = createRef<HTMLDivElement>();
    const onSizesChange = vi.fn();

    render(
      <Resizable
        ref={ref}
        disabled
        onSizesChange={onSizesChange}
        className="custom-split"
      >
        {panes()}
      </Resizable>
    );

    const separator = screen.getByRole("separator");

    expect(separator).toHaveAttribute("tabindex", "-1");
    expect(separator).toHaveAttribute(
      "aria-disabled",
      "true"
    );

    fireEvent.keyDown(separator, {
      key: "ArrowRight",
    });

    expect(onSizesChange).not.toHaveBeenCalled();
    expect(ref.current).toHaveClass(
      "pimolu-resizable",
      "custom-split"
    );
  });
});
