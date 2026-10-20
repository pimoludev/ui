import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Lightbox } from "./lightbox";

import type { PimoluLightboxImage } from "./lightbox.types";

const images: PimoluLightboxImage[] = [
  {
    src: "/photos/atelier.jpg",
    alt: "The Pimolu atelier",
    caption: "The atelier in Lyon, spring 2026.",
    thumbnail: "/photos/atelier-thumb.jpg",
  },
  {
    src: "/photos/type-specimen.jpg",
    alt: "A type specimen sheet",
    caption: "Specimen covers every style preset.",
  },
  {
    src: "/photos/workshop.jpg",
    alt: "A design workshop",
  },
];

function ControlledExample({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
      >
        Open gallery
      </button>

      <Lightbox
        images={images}
        open={open}
        onOpenChange={(next) => {
          onOpenChange?.(next);
          setOpen(next);
        }}
      />
    </>
  );
}

describe("Pimolu Lightbox", () => {
  it("stays hidden until opened", () => {
    render(<Lightbox images={images} />);

    expect(
      screen.queryByRole("dialog")
    ).toBeNull();
  });

  it("renders an accessible modal from initialIndex", () => {
    render(
      <Lightbox
        images={images}
        defaultOpen
        initialIndex={2}
      />
    );

    const dialog = screen.getByRole("dialog", {
      name: "Image viewer",
    });

    expect(dialog).toHaveAttribute(
      "aria-modal",
      "true"
    );

    expect(
      screen.getByRole("img", {
        name: "A design workshop",
      })
    ).toHaveAttribute("src", "/photos/workshop.jpg");

    expect(
      screen.getByText("3 / 3")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Next image" })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Previous image",
      })
    ).toBeEnabled();

    expect(
      screen.getByRole("button", { name: "Close" })
    ).toHaveFocus();
  });

  it("navigates with previous and next, and reports the index", () => {
    const onIndexChange = vi.fn();

    render(
      <Lightbox
        images={images}
        defaultOpen
        onIndexChange={onIndexChange}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Previous image",
      })
    ).toBeDisabled();

    fireEvent.click(
      screen.getByRole("button", { name: "Next image" })
    );

    expect(onIndexChange).toHaveBeenLastCalledWith(1);

    expect(
      screen.getByRole("img", {
        name: "A type specimen sheet",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("2 / 3")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Previous image",
      })
    );

    expect(onIndexChange).toHaveBeenLastCalledWith(0);

    expect(
      screen.getByRole("img", {
        name: "The Pimolu atelier",
      })
    ).toBeInTheDocument();
  });

  it("supports Left, Right, Home, End and Escape", () => {
    render(<Lightbox images={images} defaultOpen />);

    const dialog = screen.getByRole("dialog");

    fireEvent.keyDown(dialog, {
      key: "ArrowRight",
    });

    expect(
      screen.getByText("2 / 3")
    ).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: "End" });

    expect(
      screen.getByText("3 / 3")
    ).toBeInTheDocument();

    fireEvent.keyDown(dialog, {
      key: "ArrowRight",
    });

    /* Loop is off: the last image is a boundary. */
    expect(
      screen.getByText("3 / 3")
    ).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: "Home" });

    expect(
      screen.getByText("1 / 3")
    ).toBeInTheDocument();

    fireEvent.keyDown(dialog, {
      key: "ArrowLeft",
    });

    expect(
      screen.getByText("1 / 3")
    ).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(
      screen.queryByRole("dialog")
    ).toBeNull();
  });

  it("loops from the last image to the first", () => {
    render(
      <Lightbox
        images={images}
        defaultOpen
        initialIndex={2}
        loop
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Next image",
      })
    ).toBeEnabled();

    fireEvent.click(
      screen.getByRole("button", { name: "Next image" })
    );

    expect(
      screen.getByText("1 / 3")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Previous image",
      })
    );

    expect(
      screen.getByText("3 / 3")
    ).toBeInTheDocument();
  });

  it("closes from the overlay but not from the panel", () => {
    render(<Lightbox images={images} defaultOpen />);

    const dialog = screen.getByRole("dialog");

    fireEvent.pointerDown(dialog);

    expect(
      screen.queryByRole("dialog")
    ).toBeInTheDocument();

    fireEvent.pointerDown(
      document.querySelector(
        ".pimolu-lightbox__overlay"
      )!
    );

    expect(
      screen.queryByRole("dialog")
    ).toBeNull();
  });

  it("keeps the gallery open when overlay dismissal is off", () => {
    render(
      <Lightbox
        images={images}
        defaultOpen
        closeOnOverlayClick={false}
        closeOnEscape={false}
      />
    );

    fireEvent.pointerDown(
      document.querySelector(
        ".pimolu-lightbox__overlay"
      )!
    );

    fireEvent.keyDown(screen.getByRole("dialog"), {
      key: "Escape",
    });

    expect(
      screen.queryByRole("dialog")
    ).toBeInTheDocument();
  });

  it("renders a thumbnail strip and jumps to an image", () => {
    render(
      <Lightbox
        images={images}
        defaultOpen
        showThumbnails
      />
    );

    expect(
      screen.getByRole("group", {
        name: "Choose an image",
      })
    ).toBeInTheDocument();

    const third = screen.getByRole("button", {
      name: "Go to image 3 of 3",
    });

    fireEvent.click(third);

    expect(
      screen.getByText("3 / 3")
    ).toBeInTheDocument();

    expect(third).toHaveAttribute(
      "aria-current",
      "true"
    );
  });

  it("traps Tab at both ends of the dialog", () => {
    render(
      <Lightbox
        images={images}
        defaultOpen
        showThumbnails={false}
      />
    );

    const close = screen.getByRole("button", {
      name: "Close",
    });

    const next = screen.getByRole("button", {
      name: "Next image",
    });

    expect(close).toHaveFocus();

    fireEvent.keyDown(close, {
      key: "Tab",
      shiftKey: true,
    });

    expect(next).toHaveFocus();

    fireEvent.keyDown(next, { key: "Tab" });

    expect(close).toHaveFocus();
  });

  it("follows controlled open and index props", () => {
    const onOpenChange = vi.fn();
    const onIndexChange = vi.fn();

    const { rerender } = render(
      <Lightbox
        images={images}
        open={false}
        index={2}
        onOpenChange={onOpenChange}
        onIndexChange={onIndexChange}
      />
    );

    expect(
      screen.queryByRole("dialog")
    ).toBeNull();

    rerender(
      <Lightbox
        images={images}
        open
        index={2}
        onOpenChange={onOpenChange}
        onIndexChange={onIndexChange}
      />
    );

    expect(
      screen.getByText("3 / 3")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Previous image",
      })
    );

    expect(onIndexChange).toHaveBeenLastCalledWith(1);

    /* The parent still owns the index. */
    expect(
      screen.getByText("3 / 3")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Close" })
    );

    expect(onOpenChange).toHaveBeenLastCalledWith(
      false
    );

    /* The parent still owns the open state. */
    expect(
      screen.getByRole("dialog")
    ).toBeInTheDocument();
  });

  it("returns focus to the opening control", () => {
    render(<ControlledExample />);

    const trigger = screen.getByRole("button", {
      name: "Open gallery",
    });

    trigger.focus();

    fireEvent.click(trigger);

    expect(
      screen.getByRole("button", { name: "Close" })
    ).toHaveFocus();

    fireEvent.keyDown(screen.getByRole("dialog"), {
      key: "Escape",
    });

    expect(
      screen.queryByRole("dialog")
    ).toBeNull();

    expect(trigger).toHaveFocus();
  });

  it("locks the body scroll while open and restores it", () => {
    const initial = document.body.style.overflow;

    const { unmount } = render(
      <Lightbox images={images} defaultOpen />
    );

    expect(document.body.style.overflow).toBe(
      "hidden"
    );

    unmount();

    expect(document.body.style.overflow).toBe(initial);
  });

  it("renders nothing when the gallery is empty", () => {
    render(
      <Lightbox images={[]} open onOpenChange={() => {}} />
    );

    expect(
      screen.queryByRole("dialog")
    ).toBeNull();
  });

  it("localizes its labels and accepts an aria-label", () => {
    render(
      <Lightbox
        images={images}
        defaultOpen
        showThumbnails
        aria-label="Galerie photo"
        labels={{
          close: "Fermer",
          previous: "Image précédente",
          next: "Image suivante",
          thumbnails: "Choisir une image",
          goTo: (position, total) =>
            `Afficher l’image ${position} sur ${total}`,
          counter: (position, total) =>
            `Image ${position} sur ${total}`,
        }}
      />
    );

    expect(
      screen.getByRole("dialog", {
        name: "Galerie photo",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Fermer" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("group", {
        name: "Choisir une image",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Image 1 sur 3")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Afficher l’image 2 sur 3",
      })
    ).toBeInTheDocument();
  });
});
