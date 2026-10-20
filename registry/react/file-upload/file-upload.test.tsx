import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FileUpload } from "./file-upload";

function makeFile(
  name: string,
  content = "hello",
  type = "image/png"
) {
  return new File([content], name, {
    type,
    lastModified: 1_700_000_000_000,
  });
}

function getInput(container: HTMLElement) {
  return container.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
}

function select(
  input: HTMLInputElement,
  files: File[]
) {
  fireEvent.change(input, { target: { files } });
}

function mockObjectUrls() {
  const createObjectURL = vi.fn(() => "blob:preview");
  const revokeObjectURL = vi.fn();

  const original = {
    create: URL.createObjectURL,
    revoke: URL.revokeObjectURL,
  };

  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: createObjectURL,
  });

  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: revokeObjectURL,
  });

  return {
    createObjectURL,
    revokeObjectURL,
    restore() {
      Object.defineProperty(URL, "createObjectURL", {
        configurable: true,
        value: original.create,
      });

      Object.defineProperty(URL, "revokeObjectURL", {
        configurable: true,
        value: original.revoke,
      });
    },
  };
}

describe("Pimolu FileUpload", () => {
  it("renders an empty state and the native constraints", () => {
    const { container } = render(
      <FileUpload
        label="Photos"
        description="PNG or JPG, up to 3 files."
        accept="image/*"
        maxFiles={3}
      />
    );

    const input = getInput(container);

    expect(
      screen.getByText("Photos")
    ).toBeInTheDocument();

    expect(
      screen.getByText("PNG or JPG, up to 3 files.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("No files selected")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /Choose files/,
      })
    ).toBeInTheDocument();

    expect(input).toHaveAttribute("accept", "image/*");
    expect(input).toHaveAttribute("multiple");
    expect(input).not.toBeDisabled();
  });

  it("adds files, shows their size and resets the input", () => {
    const onFilesChange = vi.fn();

    const { container } = render(
      <FileUpload
        label="Documents"
        onFilesChange={onFilesChange}
      />
    );

    const input = getInput(container);
    const file = makeFile(
      "brief.pdf",
      "abc",
      "application/pdf"
    );

    select(input, [file]);

    expect(onFilesChange).toHaveBeenCalledWith([file]);

    expect(
      screen.getByText("brief.pdf")
    ).toBeInTheDocument();

    expect(screen.getByText("3 B")).toBeInTheDocument();

    /* The native input was cleared so the same file can be picked again. */
    expect(input.value).toBe("");

    expect(
      screen.queryByText("No files selected")
    ).toBeNull();
  });

  it("removes a file through an accessible button", () => {
    const onFilesChange = vi.fn();
    const file = makeFile("brief.pdf");

    render(
      <FileUpload
        defaultFiles={[file]}
        onFilesChange={onFilesChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Remove brief.pdf",
      })
    );

    expect(onFilesChange).toHaveBeenCalledWith([]);

    expect(
      screen.queryByText("brief.pdf")
    ).toBeNull();

    expect(
      screen.getByText("No files selected")
    ).toBeInTheDocument();
  });

  it("rejects a wrong type and an oversized file, keeping the valid one", () => {
    const onFilesChange = vi.fn();

    const { container } = render(
      <FileUpload
        accept="image/*"
        maxSize={2048}
        onFilesChange={onFilesChange}
      />
    );

    const input = getInput(container);

    const pdf = makeFile(
      "notes.pdf",
      "pdf",
      "application/pdf"
    );

    const big = makeFile(
      "huge.png",
      "x".repeat(4096)
    );

    const valid = makeFile("small.png");

    select(input, [pdf, big, valid]);

    expect(onFilesChange).toHaveBeenCalledWith([valid]);

    expect(
      screen.getByText(
        "notes.pdf is not an accepted file type."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "huge.png is larger than 2 KB."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent("huge.png is larger than 2 KB.");
  });

  it("stops at maxFiles and explains the rejection", () => {
    const onFilesChange = vi.fn();
    const first = makeFile("first.png");
    const second = makeFile("second.png");
    const third = makeFile("third.png");

    const { container } = render(
      <FileUpload
        defaultFiles={[first]}
        maxFiles={2}
        onFilesChange={onFilesChange}
      />
    );

    select(getInput(container), [second, third]);

    expect(onFilesChange).toHaveBeenCalledWith([
      first,
      second,
    ]);

    expect(
      screen.getByText(
        "third.png was not added: up to 2 files can be selected."
      )
    ).toBeInTheDocument();
  });

  it("replaces the current file when multiple is false", () => {
    const onFilesChange = vi.fn();
    const first = makeFile("first.png");
    const second = makeFile("second.png");
    const third = makeFile("third.png");

    const { container } = render(
      <FileUpload
        multiple={false}
        defaultFiles={[first]}
        onFilesChange={onFilesChange}
      />
    );

    const input = getInput(container);

    expect(input).not.toHaveAttribute("multiple");

    select(input, [second, third]);

    expect(onFilesChange).toHaveBeenCalledWith([second]);

    expect(
      screen.getByText("second.png")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("first.png")
    ).toBeNull();

    expect(
      screen.getByText(
        "third.png was not added: only one file can be selected."
      )
    ).toBeInTheDocument();
  });

  it("applies a custom validator after the built-in rules", () => {
    const onFilesChange = vi.fn();

    const validateFile = vi.fn((file: File) =>
      file.name.endsWith(".exe")
        ? "Executables are not allowed."
        : null
    );

    const { container } = render(
      <FileUpload
        validateFile={validateFile}
        onFilesChange={onFilesChange}
      />
    );

    select(getInput(container), [
      makeFile("setup.exe", "x", "application/x-msdownload"),
    ]);

    expect(validateFile).toHaveBeenCalledTimes(1);
    expect(onFilesChange).not.toHaveBeenCalled();

    expect(
      screen.getByText(
        "setup.exe: Executables are not allowed."
      )
    ).toBeInTheDocument();
  });

  it("follows a controlled files prop without mutating it", () => {
    const onFilesChange = vi.fn();
    const first = makeFile("first.png");
    const second = makeFile("second.png");

    const { container, rerender } = render(
      <FileUpload
        files={[first]}
        onFilesChange={onFilesChange}
      />
    );

    select(getInput(container), [second]);

    expect(onFilesChange).toHaveBeenCalledWith([
      first,
      second,
    ]);

    /* The parent has not accepted the change yet. */
    expect(
      screen.queryByText("second.png")
    ).toBeNull();

    rerender(
      <FileUpload
        files={[first, second]}
        onFilesChange={onFilesChange}
      />
    );

    expect(
      screen.getByText("second.png")
    ).toBeInTheDocument();
  });

  it("shows image thumbnails and revokes their object URLs", () => {
    const mock = mockObjectUrls();

    try {
      const image = makeFile("cover.png");
      const pdf = makeFile(
        "brief.pdf",
        "pdf",
        "application/pdf"
      );

      const { container, unmount } = render(
        <FileUpload defaultFiles={[image, pdf]} />
      );

      const thumbnail = container.querySelector(
        'img[data-file-preview="image"]'
      );

      expect(thumbnail).toHaveAttribute(
        "src",
        "blob:preview"
      );

      expect(
        container.querySelectorAll("img")
      ).toHaveLength(1);

      expect(
        container.querySelector(
          '[data-file-preview="fallback"]'
        )
      ).toBeInTheDocument();

      expect(mock.createObjectURL).toHaveBeenCalledWith(
        image
      );

      unmount();

      expect(
        mock.revokeObjectURL
      ).toHaveBeenCalledWith("blob:preview");
    } finally {
      mock.restore();
    }
  });

  it("can disable previews while keeping the document icon", () => {
    const mock = mockObjectUrls();

    try {
      const { container } = render(
        <FileUpload
          defaultFiles={[makeFile("cover.png")]}
          showPreviews={false}
        />
      );

      expect(
        container.querySelector("img")
      ).toBeNull();

      expect(
        container.querySelector(
          '[data-file-preview="fallback"]'
        )
      ).toBeInTheDocument();

      expect(mock.createObjectURL).not.toHaveBeenCalled();
    } finally {
      mock.restore();
    }
  });

  it("disables the trigger, the input and every remove button", () => {
    const onFilesChange = vi.fn();
    const first = makeFile("first.png");
    const second = makeFile("second.png");

    const { container } = render(
      <FileUpload
        defaultFiles={[first]}
        multiple={false}
        disabled
        onFilesChange={onFilesChange}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /Replace file/,
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Remove first.png",
      })
    ).toBeDisabled();

    expect(getInput(container)).toBeDisabled();

    select(getInput(container), [second]);

    expect(onFilesChange).not.toHaveBeenCalled();
  });
});
