import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { Carousel } from "./carousel";

function slides(count = 3) {
  return Array.from({ length: count }, (_, index) => (
    <div key={index}>Slide {index + 1}</div>
  ));
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Pimolu Carousel", () => {
  it("renders a labelled carousel region and labelled slides", () => {
    render(
      <Carousel aria-label="Featured products">
        {slides()}
      </Carousel>
    );

    const region = screen.getByRole("region", {
      name: "Featured products",
    });

    expect(region).toHaveClass("pimolu-carousel");
    expect(region).toHaveAttribute(
      "aria-roledescription",
      "carousel"
    );

    expect(
      screen.getByRole("group", { name: "1 of 3" })
    ).toHaveAttribute(
      "aria-roledescription",
      "slide"
    );

    expect(
      screen.getByRole("group", { name: "3 of 3" })
    ).toHaveTextContent("Slide 3");
  });

  it("navigates with the next and previous controls", () => {
    const onIndexChange = vi.fn();

    render(
      <Carousel onIndexChange={onIndexChange}>
        {slides()}
      </Carousel>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Next slide",
      })
    );

    expect(onIndexChange).toHaveBeenLastCalledWith(1);

    expect(
      screen.getByRole("group", { name: "2 of 3" })
    ).toHaveAttribute("data-active", "true");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Previous slide",
      })
    );

    expect(onIndexChange).toHaveBeenLastCalledWith(0);
  });

  it("disables the edge controls unless loop is enabled", () => {
    const { rerender } = render(
      <Carousel>{slides()}</Carousel>
    );

    expect(
      screen.getByRole("button", {
        name: "Previous slide",
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Next slide",
      })
    ).toBeEnabled();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Go to slide 3 of 3",
      })
    );

    expect(
      screen.getByRole("button", {
        name: "Next slide",
      })
    ).toBeDisabled();

    rerender(
      <Carousel loop>
        {slides()}
      </Carousel>
    );

    fireEvent.keyDown(
      screen
        .getByRole("region")
        .querySelector(
          ".pimolu-carousel__viewport"
        )!,
      { key: "Home" }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Previous slide",
      })
    );

    expect(
      screen.getByRole("group", { name: "3 of 3" })
    ).toHaveAttribute("data-active", "true");
  });

  it("supports a controlled index", () => {
    const onIndexChange = vi.fn();

    const { rerender } = render(
      <Carousel
        index={0}
        onIndexChange={onIndexChange}
      >
        {slides()}
      </Carousel>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Next slide",
      })
    );

    expect(onIndexChange).toHaveBeenCalledWith(1);

    expect(
      screen.getByRole("group", { name: "1 of 3" })
    ).toHaveAttribute("data-active", "true");

    rerender(
      <Carousel
        index={1}
        onIndexChange={onIndexChange}
      >
        {slides()}
      </Carousel>
    );

    expect(
      screen.getByRole("group", { name: "2 of 3" })
    ).toHaveAttribute("data-active", "true");
  });

  it("navigates with ArrowLeft, ArrowRight, Home and End", () => {
    const onIndexChange = vi.fn();

    render(
      <Carousel onIndexChange={onIndexChange}>
        {slides()}
      </Carousel>
    );

    const track = screen
      .getByRole("region")
      .querySelector(
        ".pimolu-carousel__viewport"
      )!;

    expect(track).toHaveAttribute("tabindex", "0");

    fireEvent.keyDown(track, { key: "ArrowRight" });
    expect(onIndexChange).toHaveBeenLastCalledWith(1);

    fireEvent.keyDown(track, { key: "ArrowLeft" });
    expect(onIndexChange).toHaveBeenLastCalledWith(0);

    fireEvent.keyDown(track, { key: "End" });
    expect(onIndexChange).toHaveBeenLastCalledWith(2);

    fireEvent.keyDown(track, { key: "Home" });
    expect(onIndexChange).toHaveBeenLastCalledWith(0);
  });

  it("jumps to a slide with the dots and marks the current one", () => {
    render(<Carousel>{slides()}</Carousel>);

    const secondDot = screen.getByRole("button", {
      name: "Go to slide 2 of 3",
    });

    expect(
      screen.getByRole("button", {
        name: "Go to slide 1 of 3",
      })
    ).toHaveAttribute("aria-current", "true");

    fireEvent.click(secondDot);

    expect(secondDot).toHaveAttribute(
      "aria-current",
      "true"
    );

    expect(
      screen.getByRole("group", { name: "2 of 3" })
    ).toHaveAttribute("data-active", "true");
  });

  it("accepts custom labels and can hide controls and dots", () => {
    const { rerender } = render(
      <Carousel
        labels={{
          previous: "Précédent",
          next: "Suivant",
          pagination: "Pagination",
          slide: (index, total) =>
            `Diapositive ${index} sur ${total}`,
          goToSlide: (index) =>
            `Aller à la diapositive ${index}`,
        }}
      >
        {slides()}
      </Carousel>
    );

    expect(
      screen.getByRole("button", { name: "Précédent" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("group", {
        name: "Diapositive 2 sur 3",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Aller à la diapositive 3",
      })
    ).toBeInTheDocument();

    rerender(
      <Carousel showControls={false} showDots={false}>
        {slides()}
      </Carousel>
    );

    expect(
      screen.queryByRole("button")
    ).toBeNull();
  });

  it("advances automatically, pauses on hover and respects reduced motion", () => {
    vi.useFakeTimers();

    const { unmount } = render(
      <Carousel autoPlay interval={1000}>
        {slides()}
      </Carousel>
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(
      screen.getByRole("group", { name: "2 of 3" })
    ).toHaveAttribute("data-active", "true");

    fireEvent.mouseEnter(screen.getByRole("region"));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(
      screen.getByRole("group", { name: "2 of 3" })
    ).toHaveAttribute("data-active", "true");

    fireEvent.mouseLeave(screen.getByRole("region"));

    fireEvent.click(
      screen.getByRole("button", {
        name: "Pause autoplay",
      })
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(
      screen.getByRole("group", { name: "2 of 3" })
    ).toHaveAttribute("data-active", "true");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Start autoplay",
      })
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(
      screen.getByRole("group", { name: "3 of 3" })
    ).toHaveAttribute("data-active", "true");

    unmount();

    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        media:
          "(prefers-reduced-motion: reduce)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })
    );

    render(
      <Carousel autoPlay interval={1000}>
        {slides()}
      </Carousel>
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(
      screen.getByRole("group", { name: "1 of 3" })
    ).toHaveAttribute("data-active", "true");
  });
});
