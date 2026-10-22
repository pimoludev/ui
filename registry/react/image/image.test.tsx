import { createRef } from "react";

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

import { Image } from "./image";

describe("Pimolu Image", () => {
  it("reveals a cached image even when its load event preceded hydration", () => {
    const complete = vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
    const naturalWidth = vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(400);
    const onLoad = vi.fn();
    try {
      const { container, rerender } = render(<Image src="/cached.png" alt="Cached product" onLoad={onLoad} />);
      expect(screen.getByAltText("Cached product")).toHaveAttribute("data-loaded", "true");
      expect(container.querySelector(".pimolu-image__skeleton")).toBeNull();
      expect(onLoad).not.toHaveBeenCalled();
      complete.mockReturnValue(false);
      naturalWidth.mockReturnValue(0);
      rerender(<Image src="/another.png" alt="Cached product" onLoad={onLoad} />);
      expect(screen.getByAltText("Cached product")).toHaveAttribute("data-loaded", "false");
      fireEvent.load(screen.getByAltText("Cached product"));
      expect(screen.getByAltText("Cached product")).toHaveAttribute("data-loaded", "true");
      expect(onLoad).toHaveBeenCalledTimes(1);
    } finally { complete.mockRestore(); naturalWidth.mockRestore(); }
  });

  it("does not mistake a completed broken image for a decoded image", () => {
    const complete = vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
    const naturalWidth = vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(0);
    try {
      render(<Image src="/missing.png" alt="Missing image" />);
      const image = screen.getByAltText("Missing image");
      expect(image).toHaveAttribute("data-loaded", "false");
      fireEvent.error(image);
      expect(image).toHaveAttribute("data-state", "error");
    } finally { complete.mockRestore(); naturalWidth.mockRestore(); }
  });

  it("renders the image with a required alternative and native props", () => {
    render(
      <Image
        src="/product.png"
        alt="Pimolu product shot"
        width={400}
        height={300}
        loading="lazy"
        sizes="100vw"
      />
    );

    const image = screen.getByAltText(
      "Pimolu product shot"
    );

    expect(image).toHaveAttribute("src", "/product.png");
    expect(image).toHaveAttribute("width", "400");
    expect(image).toHaveAttribute("height", "300");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("sizes", "100vw");
    expect(image).toHaveClass("pimolu-image__img");
  });

  it("shows a skeleton until the image loads", () => {
    const onLoad = vi.fn();

    const { container } = render(
      <Image
        src="/product.png"
        alt="Product"
        onLoad={onLoad}
      />
    );

    const root = container.firstElementChild;

    expect(root).toHaveAttribute(
      "data-state",
      "loading"
    );

    expect(root).toHaveAttribute("aria-busy", "true");

    expect(
      container.querySelector(
        ".pimolu-image__skeleton"
      )
    ).not.toBeNull();

    fireEvent.load(screen.getByAltText("Product"));

    expect(root).toHaveAttribute(
      "data-state",
      "loaded"
    );

    expect(root).not.toHaveAttribute("aria-busy");

    expect(
      container.querySelector(
        ".pimolu-image__skeleton"
      )
    ).toBeNull();

    expect(onLoad).toHaveBeenCalledOnce();
  });

  it("renders the default fallback when the image fails", () => {
    const onError = vi.fn();

    const { container } = render(
      <Image
        src="/missing.png"
        alt="Missing product"
        onError={onError}
      />
    );

    fireEvent.error(
      screen.getByAltText("Missing product")
    );

    const root = container.firstElementChild;

    expect(root).toHaveAttribute("data-state", "error");

    expect(
      container.querySelector(
        ".pimolu-image__fallback-icon"
      )
    ).not.toBeNull();

    expect(onError).toHaveBeenCalledOnce();
  });

  it("renders custom fallback content", () => {
    const { container } = render(
      <Image
        src="/missing.png"
        alt="Missing product"
        fallback={
          <span data-testid="custom-fallback">
            No preview available
          </span>
        }
      />
    );

    fireEvent.error(
      screen.getByAltText("Missing product")
    );

    expect(
      screen.getByTestId("custom-fallback")
    ).toHaveTextContent("No preview available");

    expect(
      container.querySelector(
        ".pimolu-image__fallback"
      )
    ).toHaveAttribute("data-custom", "true");
  });

  it("retries with fallbackSrc once before failing", () => {
    render(
      <Image
        src="/missing.png"
        fallbackSrc="/product.png"
        alt="Product"
      />
    );

    const image = screen.getByAltText("Product");

    fireEvent.error(image);

    expect(image).toHaveAttribute(
      "src",
      "/product.png"
    );

    expect(
      image.closest(".pimolu-image")
    ).toHaveAttribute("data-state", "loading");

    fireEvent.load(image);

    expect(
      image.closest(".pimolu-image")
    ).toHaveAttribute("data-state", "loaded");

    fireEvent.error(image);

    expect(
      image.closest(".pimolu-image")
    ).toHaveAttribute("data-state", "error");
  });

  it("restarts from the primary source when src changes", () => {
    const { container, rerender } = render(
      <Image
        src="/first.png"
        alt="Product"
      />
    );

    fireEvent.load(screen.getByAltText("Product"));

    expect(container.firstElementChild).toHaveAttribute(
      "data-state",
      "loaded"
    );

    rerender(
      <Image
        src="/second.png"
        alt="Product"
      />
    );

    expect(container.firstElementChild).toHaveAttribute(
      "data-state",
      "loading"
    );

    expect(
      screen.getByAltText("Product")
    ).toHaveAttribute("src", "/second.png");
  });

  it("applies aspect, fit and radius modifiers", () => {
    const { container } = render(
      <Image
        src="/product.png"
        alt="Product"
        aspectRatio="16 / 9"
        fit="contain"
        rounded="lg"
      />
    );

    const root = container.firstElementChild;

    expect(root).toHaveClass(
      "pimolu-image--aspect",
      "pimolu-image--rounded-lg"
    );

    expect(
      screen.getByAltText("Product")
    ).toHaveClass(
      "pimolu-image__img--fit-contain"
    );
  });

  it("forwards the ref to the image and splits wrapper and image classes", () => {
    const ref = createRef<HTMLImageElement>();

    const { container } = render(
      <Image
        ref={ref}
        src="/product.png"
        alt="Product"
        className="custom-image"
        containerClassName="custom-wrapper"
      />
    );

    expect(ref.current?.tagName).toBe("IMG");
    expect(ref.current).toHaveClass("custom-image");
    expect(container.firstElementChild).toHaveClass(
      "custom-wrapper"
    );
  });
});
