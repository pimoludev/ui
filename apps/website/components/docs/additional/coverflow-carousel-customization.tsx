"use client";

import {
  CoverflowCarousel,
  CarouselContent,
  CarouselSlide,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
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
      <CoverflowCarousel
        aria-label="Customized coverflow gallery"
        loop
        classNames={{
          root: "custom-coverflow-carousel-root",
          viewport: "parts-coverflow-stage",
          slide: "parts-coverflow-card",
          previous: "parts-coverflow-control",
          next: "parts-coverflow-control",
          dots: "parts-coverflow-dots",
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselSlide key={slide.title}>
              <img src={slide.src} alt={slide.alt} className="h-full w-full object-cover" />
            </CarouselSlide>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </CoverflowCarousel>

      <style>
        {`
.custom-coverflow-carousel-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 3px;
}
.parts-coverflow-stage {
  border-radius: 28px;
  background: var(--pimolu-muted);
}
.parts-coverflow-card {
  box-shadow: var(--pimolu-shadow-raised);
}
.parts-coverflow-control {
  background: var(--pimolu-primary);
  color: var(--pimolu-primary-foreground);
}
.parts-coverflow-dots {
  gap: 8px;
}
`}
      </style>
    </>
  );
}
