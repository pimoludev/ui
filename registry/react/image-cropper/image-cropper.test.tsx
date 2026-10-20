import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ImageCropper } from "./image-cropper";

const defaultCrop = {
  x: 10,
  y: 10,
  width: 50,
  height: 50,
};

function cropArea() {
  return screen.getByRole("group", {
    name: "Crop area",
  });
}

function zoomSlider() {
  return screen.getByRole("slider", {
    name: "Zoom",
  }) as HTMLInputElement;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Pimolu ImageCropper", () => {
  it("renders the preview, the crop area and the controls", () => {
    render(
      <ImageCropper
        src="/photos/atelier.jpg"
        alt="The atelier"
        onComplete={() => {}}
      />
    );

    expect(
      screen.getByRole("group", {
        name: "Image cropper",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Drag the crop area/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Crop position 0%/)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("img", { name: "The atelier" })
    ).toHaveAttribute("src", "/photos/atelier.jpg");

    const area = cropArea();

    expect(area).toHaveAttribute("tabindex", "0");
    expect(area).toHaveStyle({
      left: "0%",
      top: "0%",
      width: "100%",
      height: "100%",
    });

    for (const name of [
      "Resize top left",
      "Resize top",
      "Resize top right",
      "Resize right",
      "Resize bottom right",
      "Resize bottom",
      "Resize bottom left",
      "Resize left",
    ]) {
      expect(
        screen.getByRole("button", { name })
      ).toBeInTheDocument();
    }

    expect(zoomSlider()).toHaveValue("1");

    expect(
      screen.getByRole("button", { name: "Reset" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Crop image",
      })
    ).toBeInTheDocument();
  });

  it("moves the crop area with the keyboard", () => {
    const onChange = vi.fn();

    render(
      <ImageCropper
        src="/photos/atelier.jpg"
        alt="The atelier"
        defaultCrop={defaultCrop}
        onChange={onChange}
      />
    );

    fireEvent.keyDown(cropArea(), {
      key: "ArrowRight",
    });

    expect(onChange).toHaveBeenLastCalledWith({
      x: 11,
      y: 10,
      width: 50,
      height: 50,
    });

    fireEvent.keyDown(cropArea(), {
      key: "ArrowDown",
      shiftKey: true,
    });

    expect(onChange).toHaveBeenLastCalledWith({
      x: 11,
      y: 15,
      width: 50,
      height: 50,
    });
  });

  it("moves the crop with a pointer drag", () => {
    const onChange = vi.fn();

    render(
      <ImageCropper
        src="/photos/atelier.jpg"
        alt="The atelier"
        defaultCrop={defaultCrop}
        onChange={onChange}
      />
    );

    const area = cropArea();
    const stage = area.parentElement as HTMLElement;

    vi.spyOn(
      stage,
      "getBoundingClientRect"
    ).mockReturnValue({
      width: 200,
      height: 100,
      left: 0,
      top: 0,
      right: 200,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    fireEvent.pointerDown(area, {
      clientX: 50,
      clientY: 25,
      button: 0,
      pointerType: "mouse",
    });

    fireEvent.pointerMove(window, {
      clientX: 70,
      clientY: 35,
    });

    expect(onChange).toHaveBeenLastCalledWith({
      x: 20,
      y: 20,
      width: 50,
      height: 50,
    });

    fireEvent.pointerUp(window);
  });

  it("resizes freely when no ratio is set", () => {
    const onChange = vi.fn();

    render(
      <ImageCropper
        src="/photos/atelier.jpg"
        alt="The atelier"
        defaultCrop={defaultCrop}
        onChange={onChange}
      />
    );

    fireEvent.keyDown(
      screen.getByRole("button", {
        name: "Resize right",
      }),
      { key: "ArrowRight" }
    );

    expect(onChange).toHaveBeenLastCalledWith({
      x: 10,
      y: 10,
      width: 51,
      height: 50,
    });
  });

  it("keeps the requested aspect ratio while resizing", () => {
    const onChange = vi.fn();

    render(
      <ImageCropper
        src="/photos/atelier.jpg"
        alt="The atelier"
        aspectRatio={1}
        defaultCrop={defaultCrop}
        onChange={onChange}
      />
    );

    const stage = cropArea().parentElement as HTMLElement;

    expect(
      stage.style.aspectRatio.split("/")[0].trim()
    ).toBe("1");

    fireEvent.keyDown(
      screen.getByRole("button", {
        name: "Resize right",
      }),
      { key: "ArrowRight" }
    );

    const last = onChange.mock.calls.at(-1)?.[0];

    expect(last.width).toBe(51);
    expect(last.height).toBe(51);
    expect(last.width / last.height).toBe(1);
  });

  it("resizes every handle without crossing the min size", () => {
    const onChange = vi.fn();

    render(
      <ImageCropper
        src="/photos/atelier.jpg"
        alt="The atelier"
        defaultCrop={{
          x: 40,
          y: 40,
          width: 20,
          height: 20,
        }}
        onChange={onChange}
      />
    );

    const left = screen.getByRole("button", {
      name: "Resize left",
    });

    for (let index = 0; index < 20; index += 1) {
      fireEvent.keyDown(left, {
        key: "ArrowRight",
        shiftKey: true,
      });
    }

    const last = onChange.mock.calls.at(-1)?.[0];

    expect(last.width).toBeGreaterThanOrEqual(5);
    expect(last.x).toBeGreaterThanOrEqual(0);
    expect(last.x + last.width).toBeLessThanOrEqual(
      100.0001
    );
  });

  it("zooms and resets to the declared state", () => {
    const onChange = vi.fn();

    render(
      <ImageCropper
        src="/photos/atelier.jpg"
        alt="The atelier"
        defaultCrop={defaultCrop}
        defaultZoom={1.5}
        onChange={onChange}
      />
    );

    fireEvent.change(zoomSlider(), {
      target: { value: "2.2" },
    });

    expect(zoomSlider()).toHaveValue("2.2");

    fireEvent.keyDown(cropArea(), {
      key: "ArrowRight",
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Reset" })
    );

    expect(zoomSlider()).toHaveValue("1.5");

    expect(onChange).toHaveBeenLastCalledWith(
      defaultCrop
    );

    expect(cropArea()).toHaveStyle({
      left: "10%",
      top: "10%",
      width: "50%",
      height: "50%",
    });
  });

  it("follows a controlled crop while still reporting edits", () => {
    const onChange = vi.fn();

    const crop = {
      x: 20,
      y: 20,
      width: 40,
      height: 40,
    };

    render(
      <ImageCropper
        src="/photos/atelier.jpg"
        alt="The atelier"
        crop={crop}
        onChange={onChange}
      />
    );

    fireEvent.keyDown(cropArea(), {
      key: "ArrowRight",
    });

    expect(onChange).toHaveBeenLastCalledWith({
      x: 21,
      y: 20,
      width: 40,
      height: 40,
    });

    expect(cropArea()).toHaveStyle({
      left: "20%",
      width: "40%",
    });
  });

  it("reports the natural image ratio on load", () => {
    render(
      <ImageCropper
        src="/photos/atelier.jpg"
        alt="The atelier"
      />
    );

    const image = screen.getByRole("img", {
      name: "The atelier",
    });

    Object.defineProperty(image, "naturalWidth", {
      configurable: true,
      value: 1_200,
    });

    Object.defineProperty(image, "naturalHeight", {
      configurable: true,
      value: 800,
    });

    fireEvent.load(image);

    expect(
      (cropArea().parentElement as HTMLElement).style.aspectRatio
        .split("/")[0]
        .trim()
    ).toBe("1.5");
  });

  it("crops to a blob through a canvas", () => {
    const onComplete = vi.fn();

    const blob = new Blob(["cropped"], {
      type: "image/png",
    });

    const drawImage = vi.fn();

    const getContext = Object.getOwnPropertyDescriptor(
      HTMLCanvasElement.prototype,
      "getContext"
    );

    const toBlob = Object.getOwnPropertyDescriptor(
      HTMLCanvasElement.prototype,
      "toBlob"
    );

    Object.defineProperty(
      HTMLCanvasElement.prototype,
      "getContext",
      {
        configurable: true,
        value: vi.fn(() => ({ drawImage })),
      }
    );

    Object.defineProperty(
      HTMLCanvasElement.prototype,
      "toBlob",
      {
        configurable: true,
        value: (callback: BlobCallback) =>
          callback(blob),
      }
    );

    try {
      render(
        <ImageCropper
          src="/photos/atelier.jpg"
          alt="The atelier"
          onComplete={onComplete}
        />
      );

      const image = screen.getByRole("img", {
        name: "The atelier",
      });

      Object.defineProperty(image, "naturalWidth", {
        configurable: true,
        value: 800,
      });

      Object.defineProperty(image, "naturalHeight", {
        configurable: true,
        value: 600,
      });

      fireEvent.load(image);

      fireEvent.click(
        screen.getByRole("button", {
          name: "Crop image",
        })
      );

      expect(drawImage).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledTimes(1);

      const [result, crop] =
        onComplete.mock.calls[0];

      expect(result).toBe(blob);
      expect(crop).toEqual({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      });
    } finally {
      if (getContext) {
        Object.defineProperty(
          HTMLCanvasElement.prototype,
          "getContext",
          getContext
        );
      } else {
        delete (
          HTMLCanvasElement.prototype as unknown as Record<
            string,
            unknown
          >
        ).getContext;
      }

      if (toBlob) {
        Object.defineProperty(
          HTMLCanvasElement.prototype,
          "toBlob",
          toBlob
        );
      } else {
        delete (
          HTMLCanvasElement.prototype as unknown as Record<
            string,
            unknown
          >
        ).toBlob;
      }
    }
  });

  it("accepts a File through an object URL", () => {
    const createObjectURL = vi.fn(
      () => "blob:pimolu-preview"
    );

    const revokeObjectURL = vi.fn();

    const createDescriptor =
      Object.getOwnPropertyDescriptor(
        URL,
        "createObjectURL"
      );

    const revokeDescriptor =
      Object.getOwnPropertyDescriptor(
        URL,
        "revokeObjectURL"
      );

    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: createObjectURL,
    });

    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: revokeObjectURL,
    });

    try {
      const file = new File(["pixels"], "photo.png", {
        type: "image/png",
      });

      const { unmount } = render(
        <ImageCropper src={file} alt="Uploaded photo" />
      );

      expect(
        screen.getByRole("img", {
          name: "Uploaded photo",
        })
      ).toHaveAttribute(
        "src",
        "blob:pimolu-preview"
      );

      expect(createObjectURL).toHaveBeenCalledWith(file);

      unmount();

      expect(revokeObjectURL).toHaveBeenCalledWith(
        "blob:pimolu-preview"
      );
    } finally {
      if (createDescriptor) {
        Object.defineProperty(
          URL,
          "createObjectURL",
          createDescriptor
        );
      } else {
        delete (URL as unknown as Record<string, unknown>)
          .createObjectURL;
      }

      if (revokeDescriptor) {
        Object.defineProperty(
          URL,
          "revokeObjectURL",
          revokeDescriptor
        );
      } else {
        delete (URL as unknown as Record<string, unknown>)
          .revokeObjectURL;
      }
    }
  });

  it("disables every interaction", () => {
    render(
      <ImageCropper
        src="/photos/atelier.jpg"
        alt="The atelier"
        disabled
        onComplete={() => {}}
      />
    );

    expect(cropArea()).toHaveAttribute(
      "tabindex",
      "-1"
    );

    expect(zoomSlider()).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Reset" })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Crop image",
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Resize right",
      })
    ).toBeDisabled();
  });

  it("localizes the interface", () => {
    render(
      <ImageCropper
        src="/photos/atelier.jpg"
        alt="L’atelier"
        onComplete={() => {}}
        labels={{
          cropper: "Recadreur d’image",
          instructions:
            "Déplacez le cadre ou utilisez les flèches.",
          cropArea: "Zone de recadrage",
          zoom: "Agrandissement",
          reset: "Réinitialiser",
          apply: "Recadrer l’image",
          resizeRight: "Redimensionner à droite",
        }}
      />
    );

    expect(
      screen.getByRole("group", {
        name: "Recadreur d’image",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Déplacez le cadre ou utilisez les flèches."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("group", {
        name: "Zone de recadrage",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("slider", {
        name: "Agrandissement",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Réinitialiser",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Recadrer l’image",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Redimensionner à droite",
      })
    ).toBeInTheDocument();
  });
});
