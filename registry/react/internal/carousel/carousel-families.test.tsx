import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ArcCarousel,
  CarouselContent,
  CarouselDots,
  CarouselLiveRegion,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselThumbnail,
  CarouselThumbnails,
  CoverflowCarousel,
  MultiCarousel,
  PeekCarousel,
  StackCarousel,
  ThumbnailCarousel,
  TiltedCarousel,
} from "@pimolu/react";

const slides = ["Atlas", "Prism", "Signal"];

function Frame({ family }: { family: "thumbnail" | "coverflow" | "peek" | "stack" | "arc" | "tilted" | "multi" }) {
  const content = (
    <CarouselContent>
      {slides.map((slide) => <CarouselSlide key={slide}>{slide}</CarouselSlide>)}
    </CarouselContent>
  );
  const controls = <><CarouselPrevious /><CarouselNext /><CarouselDots /></>;
  if (family === "thumbnail") return <ThumbnailCarousel aria-label="Gallery">{content}<CarouselThumbnails>{slides.map((slide, index) => <CarouselThumbnail key={slide} index={index} src={`/${slide}.png`} alt={slide} />)}</CarouselThumbnails>{controls}</ThumbnailCarousel>;
  if (family === "coverflow") return <CoverflowCarousel aria-label="Coverflow">{content}{controls}</CoverflowCarousel>;
  if (family === "peek") return <PeekCarousel aria-label="Peek">{content}{controls}</PeekCarousel>;
  if (family === "stack") return <StackCarousel aria-label="Stack">{content}{controls}</StackCarousel>;
  if (family === "arc") return <ArcCarousel aria-label="Arc">{content}{controls}</ArcCarousel>;
  if (family === "tilted") return <TiltedCarousel aria-label="Tilted">{content}{controls}</TiltedCarousel>;
  return <MultiCarousel aria-label="Multi" slidesPerView={2}>{content}{controls}</MultiCarousel>;
}

describe("carousel families", () => {
  it.each(["thumbnail", "coverflow", "peek", "stack", "arc", "tilted", "multi"] as const)("%s exposes slides, controls and keyboard navigation", (family) => {
    render(<Frame family={family} />);
    expect(screen.getByRole("region", { name: /Gallery|Coverflow|Peek|Stack|Arc|Tilted|Multi/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
    expect(screen.getByRole("group", { name: "Slide pagination" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
  });

  it("thumbnail rail selects a slide", () => {
    render(<Frame family="thumbnail" />);
    fireEvent.click(screen.getByRole("button", { name: "Signal" }));
    expect(screen.getAllByRole("button", { name: "Signal" })[0]).toHaveAttribute("aria-current", "true");
  });

  it("limits multi-carousel pagination to reachable pages", () => {
    const five = ["Atlas", "Prism", "Signal", "Orbit", "Terra"];
    render(
      <MultiCarousel aria-label="Multi pages" slidesPerView={3}>
        <CarouselContent>
          {five.map((slide) => <CarouselSlide key={slide}>{slide}</CarouselSlide>)}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </MultiCarousel>
    );
    const dots = screen.getAllByRole("button", { name: /Go to slide/ });
    expect(dots).toHaveLength(3);
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(dots[2]).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
    expect(screen.getByRole("group", { name: "3 of 5" })).toHaveAttribute("data-active", "true");
  });

  it("applies additive named parts from the family and shared part hooks", () => {
    const { container } = render(
      <PeekCarousel
        aria-label="Named parts"
        classNames={{
          root: "family-root",
          viewport: "family-viewport",
          slide: "family-slide",
          previous: "family-previous",
          next: "family-next",
          dots: "family-dots",
        }}
      >
        <CarouselContent classNames={{ viewport: "local-viewport" }}>
          {slides.map((slide) => <CarouselSlide key={slide} classNames={{ slide: "local-slide" }}>{slide}</CarouselSlide>)}
        </CarouselContent>
        <CarouselPrevious classNames={{ previous: "local-previous" }} />
        <CarouselNext classNames={{ next: "local-next" }} />
        <CarouselDots classNames={{ dots: "local-dots" }} />
      </PeekCarousel>
    );
    expect(container.querySelector(".pimolu-peek-carousel")).toHaveClass("family-root");
    expect(container.querySelector(".pimolu-carousel__viewport")).toHaveClass("family-viewport", "local-viewport");
    expect(container.querySelector(".pimolu-carousel__slide")).toHaveClass("family-slide", "local-slide");
    expect(screen.getByRole("button", { name: "Previous slide" })).toHaveClass("family-previous", "local-previous");
    expect(screen.getByRole("button", { name: "Next slide" })).toHaveClass("family-next", "local-next");
    expect(screen.getByRole("group", { name: "Slide pagination" })).toHaveClass("family-dots", "local-dots");
  });

  it("can hide the controls on mobile without removing the swiping surface", () => {
    const { container } = render(
      <MultiCarousel aria-label="Mobile controls" showControlsOnMobile={false}>
        <CarouselContent>
          {slides.map((slide) => <CarouselSlide key={slide}>{slide}</CarouselSlide>)}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </MultiCarousel>
    );
    expect(container.querySelector(".pimolu-multi-carousel")).toHaveAttribute("data-controls-mobile", "hidden");
    expect(screen.getByRole("button", { name: "Next slide" })).toBeInTheDocument();
  });

  it("exposes plain slides and a custom peek width", () => {
    const { container } = render(
      <MultiCarousel aria-label="Plain slides" slideAppearance="plain">
        <CarouselContent>
          {slides.map((slide) => <CarouselSlide key={slide}>{slide}</CarouselSlide>)}
        </CarouselContent>
      </MultiCarousel>
    );
    expect(container.querySelector(".pimolu-multi-carousel")).toHaveAttribute("data-slide-appearance", "plain");

    const { container: peek } = render(
      <PeekCarousel aria-label="Narrow peek" slideWidth="min(320px, 78vw)">
        <CarouselContent>
          {slides.map((slide) => <CarouselSlide key={slide}>{slide}</CarouselSlide>)}
        </CarouselContent>
      </PeekCarousel>
    );
    expect((peek.querySelector(".pimolu-peek-carousel") as HTMLElement).style.getPropertyValue("--pimolu-peek-slide-width")).toBe("min(320px, 78vw)");
  });

  it("advances one tilted slide per arrow press without scroll sync overriding it", () => {
    render(<Frame family="tilted" />);
    const next = screen.getByRole("button", { name: "Next slide" });
    fireEvent.click(next);
    expect(screen.getByRole("group", { name: "2 of 3" })).toHaveAttribute("data-active", "true");
    fireEvent.click(next);
    expect(screen.getByRole("group", { name: "3 of 3" })).toHaveAttribute("data-active", "true");
  });

  it("exposes the tilt amplitude and the continuous scroll direction on the root", () => {
    function Gallery({ tilt, autoScroll, direction, slidesPerView, gap }: { tilt: number; autoScroll?: boolean; direction?: "ltr" | "rtl"; slidesPerView?: number; gap?: number }) {
      return (
        <TiltedCarousel aria-label="Tilted gallery" tilt={tilt} autoScroll={autoScroll} autoScrollDirection={direction} slidesPerView={slidesPerView} gap={gap}>
          <CarouselContent>
            {slides.map((slide) => <CarouselSlide key={slide}>{slide}</CarouselSlide>)}
          </CarouselContent>
        </TiltedCarousel>
      );
    }
    const { container, rerender } = render(<Gallery tilt={6} autoScroll direction="rtl" />);
    const root = container.querySelector<HTMLElement>(".pimolu-tilted-carousel")!;
    expect(container.querySelectorAll(".pimolu-carousel__slide")).toHaveLength(slides.length * 2);
    expect(screen.queryByRole("group", { name: "Slide pagination" })).not.toBeInTheDocument();
    expect(root).toHaveAttribute("data-auto-scroll", "true");
    expect(root).toHaveAttribute("data-auto-scroll-direction", "rtl");
    expect(root.style.getPropertyValue("--pimolu-tilted-tilt")).toBe("6deg");

    rerender(<Gallery tilt={2} />);
    expect(root).not.toHaveAttribute("data-auto-scroll");
    expect(root.style.getPropertyValue("--pimolu-tilted-tilt")).toBe("2deg");
    expect(root.style.getPropertyValue("--pimolu-tilted-slide-width")).toBe("");

    rerender(<Gallery tilt={2} slidesPerView={3} gap={24} />);
    expect(root.style.getPropertyValue("--pimolu-tilted-slide-width")).toContain("/ 3");
    const viewport = container.querySelector<HTMLElement>(".pimolu-carousel__viewport")!;
    expect(viewport.style.getPropertyValue("--pimolu-carousel-gap")).toBe("24px");
  });

  it("hides navigation when a single page is reachable and restores it when the rail grows", async () => {
    const railSlides = ["Atlas", "Prism", "Signal", "Orbit"];
    function Rail({ count }: { count: number }) {
      return (
        <MultiCarousel aria-label="Filtered rail" slidesPerView={3}>
          <CarouselContent>
            {railSlides.slice(0, count).map((slide) => <CarouselSlide key={slide}>{slide}</CarouselSlide>)}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          <CarouselDots />
          <CarouselLiveRegion />
        </MultiCarousel>
      );
    }

    const { rerender } = render(<Rail count={4} />);
    expect(screen.getByRole("button", { name: "Next slide" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Go to slide/ })).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(screen.getAllByRole("button", { name: /Go to slide/ })[1]).toHaveAttribute("aria-current", "true");

    rerender(<Rail count={2} />);
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Next slide" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Previous slide" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /Go to slide/ })).not.toBeInTheDocument();
    });
    expect(screen.queryByText(/\d+ \/ \d+/)).not.toBeInTheDocument();
    // Let the passive clamp effect settle before growing the rail again.
    await new Promise((resolve) => setTimeout(resolve, 0));

    rerender(<Rail count={4} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "Next slide" })).toBeInTheDocument());
    await waitFor(() => expect(screen.getAllByRole("button", { name: /Go to slide/ })[0]).toHaveAttribute("aria-current", "true"));
  });

  it("omits the thumbnail rail for a single image", () => {
    render(
      <ThumbnailCarousel aria-label="Single image">
        <CarouselContent>
          <CarouselSlide>Atlas</CarouselSlide>
        </CarouselContent>
        <CarouselThumbnails>
          <CarouselThumbnail index={0} src="/Atlas.png" alt="Atlas" />
        </CarouselThumbnails>
      </ThumbnailCarousel>
    );
    expect(screen.queryByRole("group", { name: "Slides" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next slide" })).not.toBeInTheDocument();
  });

  it("mirrors horizontal arrow keys in the shared family engine", () => {
    render(
      <div style={{ direction: "rtl" }}>
        <CoverflowCarousel aria-label="RTL coverflow">
          <CarouselContent>
            {slides.map((slide) => <CarouselSlide key={slide}>{slide}</CarouselSlide>)}
          </CarouselContent>
          <CarouselLiveRegion />
        </CoverflowCarousel>
      </div>
    );
    const track = screen.getByRole("region", { name: "RTL coverflow" });
    fireEvent.keyDown(track, { key: "ArrowLeft" });
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    fireEvent.keyDown(track, { key: "ArrowRight" });
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("assigns the thumbnail image named part to the actual image", () => {
    const { container } = render(
      <ThumbnailCarousel aria-label="Thumbnail hook">
        <CarouselContent>
          {slides.map((slide) => <CarouselSlide key={slide}>{slide}</CarouselSlide>)}
        </CarouselContent>
        <CarouselThumbnails>
          {slides.map((slide, index) => (
            <CarouselThumbnail
              key={slide}
              index={index}
              src={`/${slide}.png`}
              alt={slide}
              classNames={{ thumbnailImage: "thumbnail-image" }}
            />
          ))}
        </CarouselThumbnails>
      </ThumbnailCarousel>
    );
    const images = container.querySelectorAll("img.thumbnail-image");
    expect(images).toHaveLength(3);
  });
});
