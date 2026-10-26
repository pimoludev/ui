
import {
  afterEach,
  beforeEach,
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

import userEvent from "@testing-library/user-event";

import { Signature } from "./signature";

const DATA_URL =
  "data:image/png;base64,c2lnbmF0dXJl";

const context = {
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
} as unknown as CanvasRenderingContext2D;

beforeEach(() => {
  vi.spyOn(
    HTMLCanvasElement.prototype,
    "getContext"
  ).mockReturnValue(context);

  vi.spyOn(
    HTMLCanvasElement.prototype,
    "toDataURL"
  ).mockReturnValue(DATA_URL);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Pimolu Signature", () => {
  it("clears once on a completed touch release and ignores the compatibility click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Signature defaultValue={DATA_URL} onChange={onChange} />);
    const clear = screen.getByRole("button", { name: "Clear signature" });
    await user.pointer({ keys: "[TouchA>]", target: clear });
    expect(onChange).not.toHaveBeenCalled();
    await user.pointer({ keys: "[/TouchA]", target: clear });
    expect(onChange).toHaveBeenCalledExactlyOnceWith(null);
  });

  it("does not clear when an action gesture is cancelled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Signature defaultValue={DATA_URL} onChange={onChange} />);
    const clear = screen.getByRole("button", { name: "Clear signature" });
    await user.pointer({ keys: "[TouchA>]", target: clear });
    fireEvent.pointerCancel(clear);
    await user.pointer({ keys: "[/TouchA]", target: clear });
    expect(onChange).not.toHaveBeenCalled();
    expect(clear).not.toBeDisabled();
  });

  it("does not clear when a finger moves across an action button", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Signature defaultValue={DATA_URL} onChange={onChange} />);
    const clear = screen.getByRole("button", { name: "Clear signature" });
    await user.pointer({ keys: "[TouchA>]", target: clear, coords: { clientX: 10, clientY: 10 } });
    await user.pointer({ pointerName: "TouchA", target: clear, coords: { clientX: 70, clientY: 60 } });
    await user.pointer({ keys: "[/TouchA]", target: clear });
    expect(onChange).not.toHaveBeenCalled();
    expect(clear).not.toBeDisabled();
  });

  it("undoes only one stroke when a touch release also generates a click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Signature label="Signature" defaultValue={DATA_URL} onChange={onChange} undo />);
    const canvas = screen.getByRole("img", { name: "Signature" });
    for (let i = 0; i < 2; i++) {
      fireEvent.pointerDown(canvas, { clientX: 20, clientY: 20, pointerId: 1 });
      fireEvent.pointerUp(canvas, { clientX: 40, clientY: 30, pointerId: 1 });
    }
    onChange.mockClear();
    const undo = screen.getByRole("button", { name: "Undo last stroke" });
    await user.pointer({ keys: "[TouchA]", target: undo });
    expect(onChange).toHaveBeenCalledExactlyOnceWith(DATA_URL);
    expect(undo).not.toBeDisabled();
  });

  it("renders an accessible pad with a clear action", () => {
    render(
      <Signature
        label="Signature"
        description="Sign inside the box."
      />
    );

    const canvas = screen.getByRole("img", {
      name: "Signature",
    });

    expect(canvas.tagName).toBe("CANVAS");
    expect(canvas).toHaveAttribute("width", "600");
    expect(canvas).toHaveAttribute("height", "200");

    expect(
      screen.getByText("Sign inside the box.")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Clear signature",
      })
    ).toBeDisabled();
  });

  it("draws with pointer events and reports the data URL", () => {
    const onChange = vi.fn();
    const onEnd = vi.fn();

    render(
      <Signature
        label="Signature"
        onChange={onChange}
        onEnd={onEnd}
      />
    );

    const canvas = screen.getByRole("img", {
      name: "Signature",
    });

    fireEvent.pointerDown(canvas, {
      clientX: 40,
      clientY: 60,
      pointerId: 1,
    });

    fireEvent.pointerMove(canvas, {
      clientX: 90,
      clientY: 100,
      pointerId: 1,
    });

    fireEvent.pointerUp(canvas, {
      clientX: 90,
      clientY: 100,
      pointerId: 1,
    });

    expect(onChange).toHaveBeenCalledWith(DATA_URL);
    expect(onEnd).toHaveBeenCalledWith(DATA_URL);

    expect(
      canvas.closest(".pimolu-signature")
    ).toHaveAttribute("data-has-value", "true");

    expect(
      screen.getByRole("button", {
        name: "Clear signature",
      })
    ).not.toBeDisabled();
  });

  it("clears an uncontrolled signature", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Signature
        label="Signature"
        defaultValue={DATA_URL}
        onChange={onChange}
      />
    );

    const clear = screen.getByRole("button", {
      name: "Clear signature",
    });

    expect(clear).not.toBeDisabled();

    await user.click(clear);

    expect(onChange).toHaveBeenCalledWith(null);

    expect(
      screen.getByRole("img", {
        name: "Signature",
      }).closest(".pimolu-signature")
    ).toHaveAttribute("data-has-value", "false");

    expect(clear).toBeDisabled();
    expect(
      screen.getByText("Sign here")
    ).toBeInTheDocument();
  });

  it("displays a controlled value", () => {
    render(
      <Signature
        label="Signature"
        value={DATA_URL}
      />
    );

    const root = screen
      .getByRole("img", { name: "Signature" })
      .closest(".pimolu-signature");

    expect(root).toHaveAttribute(
      "data-has-value",
      "true"
    );

    expect(
      screen.getByRole("button", {
        name: "Clear signature",
      })
    ).not.toBeDisabled();
  });

  it("blocks drawing when disabled", () => {
    const onChange = vi.fn();

    render(
      <Signature
        label="Signature"
        disabled
        onChange={onChange}
      />
    );

    const canvas = screen.getByRole("img", {
      name: "Signature",
    });

    fireEvent.pointerDown(canvas, {
      clientX: 20,
      clientY: 20,
      pointerId: 1,
    });

    fireEvent.pointerUp(canvas, {
      clientX: 20,
      clientY: 20,
      pointerId: 1,
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(canvas).toHaveAttribute(
      "aria-disabled",
      "true"
    );
    expect(canvas).toHaveAttribute("tabindex", "-1");

    expect(
      screen.getByRole("button", {
        name: "Clear signature",
      })
    ).toBeDisabled();
  });

  it("blocks drawing when read-only", () => {
    const onChange = vi.fn();

    render(
      <Signature
        label="Signature"
        defaultValue={DATA_URL}
        readOnly
        undo
        onChange={onChange}
      />
    );

    const canvas = screen.getByRole("img", {
      name: "Signature",
    });

    fireEvent.pointerDown(canvas, {
      clientX: 20,
      clientY: 20,
      pointerId: 1,
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(canvas).toHaveAttribute(
      "data-readonly",
      "true"
    );

    expect(
      screen.getByRole("button", {
        name: "Clear signature",
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Undo last stroke",
      })
    ).toBeDisabled();
  });

  it("undoes the last stroke", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Signature
        label="Signature"
        undo
        onChange={onChange}
      />
    );

    const canvas = screen.getByRole("img", {
      name: "Signature",
    });

    fireEvent.pointerDown(canvas, {
      clientX: 30,
      clientY: 40,
      pointerId: 1,
    });

    fireEvent.pointerUp(canvas, {
      clientX: 60,
      clientY: 70,
      pointerId: 1,
    });

    const undo = screen.getByRole("button", {
      name: "Undo last stroke",
    });

    expect(undo).not.toBeDisabled();

    await user.click(undo);

    expect(onChange).toHaveBeenLastCalledWith(null);

    expect(
      canvas.closest(".pimolu-signature")
    ).toHaveAttribute("data-has-value", "false");
  });
});
