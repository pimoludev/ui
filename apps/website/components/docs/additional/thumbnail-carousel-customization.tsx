"use client";

import {
  ThumbnailCarousel,
  CarouselContent,
  CarouselSlide,
  CarouselPrevious,
  CarouselNext,
  CarouselThumbnails,
  CarouselThumbnail,
} from "@pimolu/react";

const slides = [
  { src: "/images/pimolu-atmosphere.webp", alt: "Pimolu landscape artwork", title: "Atlas" },
  { src: "/images/pimolu-studio.webp", alt: "Pimolu studio artwork", title: "Prism" },
  { src: "/images/showcase/pimolu-headset.webp", alt: "Pimolu headset product", title: "Signal" },
  { src: "/images/showcase/saas-landing.webp", alt: "SaaS landing page preview", title: "Orbit" },
];

export function DemoExample() {
  return (
    <>
      <ThumbnailCarousel
        aria-label="Customized thumbnail gallery"
        loop
        classNames={{
          root: "custom-thumbnail-carousel-root",
          viewport: "parts-thumbnail-stage",
          previous: "parts-thumbnail-control",
          next: "parts-thumbnail-control",
          thumbnails: "parts-thumbnail-rail",
          thumbnail: "parts-thumbnail-item",
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselSlide key={slide.title}>
              <img src={slide.src} alt={slide.alt} className="aspect-[16/10] w-full object-cover" />
            </CarouselSlide>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselThumbnails>
          {slides.map((slide, index) => (
            <CarouselThumbnail key={slide.title} index={index} src={slide.src} alt={`${slide.title} view`} />
          ))}
        </CarouselThumbnails>
      </ThumbnailCarousel>

      <style>
        {`
.custom-thumbnail-carousel-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 3px;
}
.parts-thumbnail-stage {
  border: 1px solid var(--pimolu-primary);
  border-radius: 24px;
}
.parts-thumbnail-control {
  background: var(--pimolu-primary);
  color: var(--pimolu-primary-foreground);
}
.parts-thumbnail-rail {
  padding: 8px;
  border-radius: 16px;
  background: var(--pimolu-muted);
}
.parts-thumbnail-item {
  border-radius: 12px;
}
`}
      </style>
    </>
  );
}
