"use client";

import {
  StackCarousel,
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
      <StackCarousel
        aria-label="Customized stacked deck"
        loop
        classNames={{
          root: "custom-stack-carousel-root",
          viewport: "parts-stack-stage",
          slide: "parts-stack-card",
          previous: "parts-stack-control",
          next: "parts-stack-control",
          dots: "parts-stack-dots",
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
      </StackCarousel>

      <style>
        {`
.custom-stack-carousel-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 3px;
}
.parts-stack-stage {
  border-radius: 28px;
  background: var(--pimolu-muted);
}
.parts-stack-card {
  border-radius: 24px;
  box-shadow: var(--pimolu-shadow-raised);
}
.parts-stack-control {
  background: var(--pimolu-primary);
  color: var(--pimolu-primary-foreground);
}
.parts-stack-dots {
  gap: 8px;
}
`}
      </style>
    </>
  );
}
