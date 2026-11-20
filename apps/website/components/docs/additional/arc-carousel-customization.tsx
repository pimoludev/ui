"use client";

import {
  ArcCarousel,
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
      <ArcCarousel
        aria-label="Customized arc gallery"
        loop
        classNames={{
          root: "custom-arc-carousel-root",
          viewport: "parts-arc-stage",
          slide: "parts-arc-card",
          previous: "parts-arc-control",
          next: "parts-arc-control",
          dots: "parts-arc-dots",
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
      </ArcCarousel>

      <style>
        {`
.custom-arc-carousel-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 3px;
}
.parts-arc-stage {
  border-radius: 28px;
  background: var(--pimolu-muted);
}
.parts-arc-card {
  border-radius: 22px;
  box-shadow: var(--pimolu-shadow-raised);
}
.parts-arc-control {
  background: var(--pimolu-primary);
  color: var(--pimolu-primary-foreground);
}
.parts-arc-dots {
  gap: 8px;
}
`}
      </style>
    </>
  );
}
