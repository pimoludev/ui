
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import { Watermark } from "./watermark";

const LOGO =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>";

describe("Pimolu Watermark", () => {
  it("renders its content above the watermark", () => {
    render(
      <Watermark text="Confidential">
        <p>Invoice 2026-042</p>
      </Watermark>
    );

    expect(
      screen.getByText("Invoice 2026-042")
    ).toBeInTheDocument();

    const layer = document.querySelector(
      ".pimolu-watermark__layer"
    );

    expect(layer).not.toBeNull();
    expect(layer).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    expect(layer).toHaveStyle({
      pointerEvents: "none",
    });
  });

  it("builds a repeated text tile", () => {
    const { container } = render(
      <Watermark text="Confidential" gap={40}>
        <p>Draft</p>
      </Watermark>
    );

    const layer = container.querySelector<
      HTMLElement
    >(".pimolu-watermark__layer");

    expect(layer).toHaveAttribute(
      "data-mode",
      "text"
    );

    const background =
      layer?.style.backgroundImage ?? "";

    expect(background).toContain(
      "data:image/svg+xml"
    );

    expect(decodeURIComponent(background)).toContain(
      "Confidential"
    );

    expect(layer?.style.backgroundRepeat).toBe(
      "repeat"
    );
  });

  it("uses an image tile when an image is given", () => {
    const { container } = render(
      <Watermark image={LOGO} gap={120}>
        <p>Draft</p>
      </Watermark>
    );

    const layer = container.querySelector<
      HTMLElement
    >(".pimolu-watermark__layer");

    expect(layer).toHaveAttribute(
      "data-mode",
      "image"
    );

    expect(layer?.style.backgroundImage).toContain(
      LOGO
    );

    expect(layer?.style.backgroundSize).toBe(
      "120px 120px"
    );
  });

  it("covers the viewport in fullscreen mode", () => {
    const { container } = render(
      <Watermark text="Preview" fullscreen>
        <p>Page</p>
      </Watermark>
    );

    const root = container.querySelector<
      HTMLElement
    >(".pimolu-watermark");

    const layer = container.querySelector<
      HTMLElement
    >(".pimolu-watermark__layer");

    expect(root).toHaveClass(
      "pimolu-watermark--fullscreen"
    );

    expect(layer?.style.zIndex).toBe("9999");
  });

  it("exposes custom effects as style variables", () => {
    const { container } = render(
      <Watermark
        text="Pimolu"
        opacity={0.2}
        rotate={15}
        gap={40}
        fontSize={18}
        color="#ff0000"
        fontFamily="Georgia, serif"
        zIndex={12}
      >
        <p>Content</p>
      </Watermark>
    );

    const root = container.querySelector<
      HTMLElement
    >(".pimolu-watermark");

    const layer = container.querySelector<
      HTMLElement
    >(".pimolu-watermark__layer");

    expect(
      root?.style.getPropertyValue(
        "--pimolu-watermark-opacity"
      )
    ).toBe("0.2");

    expect(
      root?.style.getPropertyValue(
        "--pimolu-watermark-rotate"
      )
    ).toBe("15deg");

    expect(
      root?.style.getPropertyValue(
        "--pimolu-watermark-gap"
      )
    ).toBe("40px");

    expect(
      root?.style.getPropertyValue(
        "--pimolu-watermark-font-size"
      )
    ).toBe("18px");

    expect(
      root?.style.getPropertyValue(
        "--pimolu-watermark-color"
      )
    ).toBe("#ff0000");

    expect(layer?.style.opacity).toBe("0.2");
    expect(layer?.style.zIndex).toBe("12");
  });
});
