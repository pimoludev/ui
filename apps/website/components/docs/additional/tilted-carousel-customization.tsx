"use client";

import {
  TiltedCarousel,
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
      <TiltedCarousel
        aria-label="Customized tilted gallery"
        loop
        tilt={4}
        slideWidth="min(70%, 280px)"
        viewportHeight="280px"
        classNames={{
          root: "custom-tilted-carousel-root",
          viewport: "parts-tilted-stage",
          slide: "parts-tilted-card",
          previous: "parts-tilted-control",
          next: "parts-tilted-control",
          dots: "parts-tilted-dots",
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
      </TiltedCarousel>

      <style>
        {`
.custom-tilted-carousel-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 3px;
}
.parts-tilted-stage {
  border-radius: 28px;
  background: var(--pimolu-muted);
}
.parts-tilted-stage > .parts-tilted-card {
  border-color: var(--pimolu-primary);
}
.parts-tilted-control {
  background: var(--pimolu-primary);
  color: var(--pimolu-primary-foreground);
}
.parts-tilted-dots {
  gap: 8px;
}
`}
      </style>
    </>
  );
}
