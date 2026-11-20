"use client";

import {
  PeekCarousel,
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
      <PeekCarousel
        aria-label="Customized peek cards"
        loop
        classNames={{
          root: "custom-peek-carousel-root",
          viewport: "parts-peek-viewport",
          slide: "parts-peek-card",
          previous: "parts-peek-control",
          next: "parts-peek-control",
          dots: "parts-peek-dots",
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselSlide key={slide.title}>
              <img src={slide.src} alt={slide.alt} className="aspect-[4/3] w-full object-cover" />
            </CarouselSlide>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </PeekCarousel>

      <style>
        {`
.custom-peek-carousel-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 3px;
}
.parts-peek-viewport {
  padding-block: 16px;
}
.parts-peek-card {
  border-radius: 26px;
  box-shadow: var(--pimolu-shadow-raised);
}
.parts-peek-control {
  background: var(--pimolu-primary);
  color: var(--pimolu-primary-foreground);
}
.parts-peek-dots {
  gap: 8px;
}
`}
      </style>
    </>
  );
}
