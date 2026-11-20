import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ArcCarousel,
  CarouselContent,
  CarouselDots,
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
} from "@pimolu/react";

const slides = ["Atlas", "Prism", "Signal"];

function Frame({ family }: { family: "thumbnail" | "coverflow" | "peek" | "stack" | "arc" | "multi" }) {
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
  return <MultiCarousel aria-label="Multi" slidesPerView={2}>{content}{controls}</MultiCarousel>;
}

describe("carousel families", () => {
  it.each(["thumbnail", "coverflow", "peek", "stack", "arc", "multi"] as const)("%s exposes slides, controls and keyboard navigation", (family) => {
    render(<Frame family={family} />);
    expect(screen.getByRole("region", { name: /Gallery|Coverflow|Peek|Stack|Arc|Multi/ })).toBeInTheDocument();
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
