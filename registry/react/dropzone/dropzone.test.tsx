import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Dropzone } from "./dropzone";

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

function dragData(files: File[] = [], types = ["Files"]) {
  return { dataTransfer: { files, types } };
}

describe("Pimolu Dropzone", () => {
  it("renders a labelled zone and the native constraints", () => {
    const { container } = render(
      <Dropzone
        label="Brand assets"
        description="SVG or PNG, up to 10 MB."
        accept="image/*"
        maxFiles={4}
      />
    );

    const zone = screen.getByRole("button", {
      name: /Brand assets Drag files here or click to browse/,
    });

    const input = getInput(container);

    expect(zone).toHaveClass("pimolu-dropzone__zone");
    expect(zone).not.toBeDisabled();

    expect(
      screen.getByText("SVG or PNG, up to 10 MB.")
    ).toBeInTheDocument();

    expect(input).toHaveAttribute("accept", "image/*");
    expect(input).toHaveAttribute("multiple");
    expect(input).not.toBeDisabled();
  });

  it("opens the file picker on click, Enter and Space", () => {
    const { container } = render(
      <Dropzone label="Assets" />
    );

    const zone = screen.getByRole("button", {
      name: /Drag files here/,
    });

    const input = getInput(container);
    const onClick = vi.fn();

    input.addEventListener("click", onClick);

    fireEvent.click(zone);
    expect(onClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(zone, { key: "Enter" });
    expect(onClick).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(zone, { key: " " });
    expect(onClick).toHaveBeenCalledTimes(3);

    fireEvent.keyDown(zone, { key: "Tab" });
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("shows the drag-active state and accepts a drop", () => {
    const onFilesChange = vi.fn();
    const file = makeFile("brand.png");

    const { container } = render(
      <Dropzone onFilesChange={onFilesChange} />
    );

    const zone = screen.getByRole("button", {
      name: /Drag files here/,
    });

    const root = container.querySelector(
      ".pimolu-dropzone"
    );

    fireEvent.dragEnter(zone, dragData());

    expect(zone).toHaveAttribute("data-dragging", "true");
    expect(root).toHaveClass("pimolu-dropzone--dragging");

    fireEvent.dragLeave(zone, dragData());

    expect(zone).not.toHaveAttribute("data-dragging");
    expect(root).not.toHaveClass("pimolu-dropzone--dragging");

    fireEvent.drop(zone, dragData([file]));

    expect(onFilesChange).toHaveBeenCalledWith([file]);

    expect(
      screen.getByText("brand.png")
    ).toBeInTheDocument();

    expect(screen.getByText("5 B")).toBeInTheDocument();
  });

  it("rejects a wrong type and an oversized dropped file", () => {
    const onFilesChange = vi.fn();

    render(
      <Dropzone
        accept="image/*"
        maxSize={2048}
        onFilesChange={onFilesChange}
      />
    );

    const zone = screen.getByRole("button", {
      name: /Drag files here/,
    });

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

    fireEvent.drop(zone, dragData([pdf, big, valid]));

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
  });

  it("ignores a drag that carries no files", () => {
    const onFilesChange = vi.fn();

    render(<Dropzone onFilesChange={onFilesChange} />);

    const zone = screen.getByRole("button", {
      name: /Drag files here/,
    });

    fireEvent.dragEnter(
      zone,
      dragData([], ["text/plain"])
    );

    expect(zone).not.toHaveAttribute("data-dragging");

    fireEvent.drop(
      zone,
      dragData([], ["text/plain"])
    );

    expect(onFilesChange).not.toHaveBeenCalled();
  });

  it("removes a dropped file through an accessible button", () => {
    const onFilesChange = vi.fn();
    const file = makeFile("brand.png");

    render(
      <Dropzone
        defaultFiles={[file]}
        onFilesChange={onFilesChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Remove brand.png",
      })
    );

    expect(onFilesChange).toHaveBeenCalledWith([]);

    expect(
      screen.queryByText("brand.png")
    ).toBeNull();
  });

  it("keeps a single file when multiple is false", () => {
    const onFilesChange = vi.fn();
    const first = makeFile("first.png");
    const second = makeFile("second.png");
    const third = makeFile("third.png");

    render(
      <Dropzone
        multiple={false}
        defaultFiles={[first]}
        onFilesChange={onFilesChange}
      />
    );

    const zone = screen.getByRole("button", {
      name: /Drag a file here/,
    });

    fireEvent.drop(zone, dragData([second, third]));

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

  it("is inert while disabled", () => {
    const onFilesChange = vi.fn();
    const file = makeFile("brand.png");
    const next = makeFile("next.png");

    render(
      <Dropzone
        defaultFiles={[file]}
        disabled
        onFilesChange={onFilesChange}
      />
    );

    const zone = screen.getByRole("button", {
      name: /Drag files here/,
    });

    expect(zone).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Remove brand.png",
      })
    ).toBeDisabled();

    fireEvent.drop(zone, dragData([next]));

    expect(onFilesChange).not.toHaveBeenCalled();
  });
});
