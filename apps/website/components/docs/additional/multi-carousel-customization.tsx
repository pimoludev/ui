"use client";

import {
  MultiCarousel,
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
      <MultiCarousel
        aria-label="Customized multi item gallery"
        loop
        slidesPerView={3}
        classNames={{
          root: "custom-multi-carousel-root",
          viewport: "parts-multi-viewport",
          slide: "parts-multi-card",
          previous: "parts-multi-control",
          next: "parts-multi-control",
          dots: "parts-multi-dots",
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
      </MultiCarousel>

      <style>
        {`
.custom-multi-carousel-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 3px;
}
.parts-multi-viewport {
  padding-block: 12px;
}
.parts-multi-card {
  border-radius: 22px;
  box-shadow: var(--pimolu-shadow-raised);
}
.parts-multi-control {
  background: var(--pimolu-primary);
  color: var(--pimolu-primary-foreground);
}
.parts-multi-dots {
  gap: 8px;
}
`}
      </style>
    </>
  );
}
