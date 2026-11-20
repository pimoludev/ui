"use client";

import {
  CarouselContent,
  CarouselDots,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  PeekCarousel,
} from "@pimolu/react";

const slides = [
  { src: "/images/pimolu-atmosphere.webp", alt: "Pimolu landscape artwork", title: "Atlas" },
  { src: "/images/pimolu-studio.webp", alt: "Pimolu studio artwork", title: "Prism" },
  { src: "/images/showcase/pimolu-headset.webp", alt: "Pimolu headset product", title: "Signal" },
  { src: "/images/showcase/saas-landing.webp", alt: "SaaS landing page preview", title: "Orbit" },
];

export function DemoExample() {
  return (
    <PeekCarousel
      aria-label="Narrow peek cards"
      loop
      defaultIndex={1}
      slideWidth="min(320px, 78vw)"
      showControlsOnMobile={false}
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselSlide key={slide.title}>
            <img
              src={slide.src}
              alt={slide.alt}
              style={{
                display: "block",
                width: "100%",
                aspectRatio: "4 / 3",
                objectFit: "cover",
              }}
            />
            <p style={{ marginBlockStart: 10, fontWeight: 550 }}>{slide.title}</p>
          </CarouselSlide>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </PeekCarousel>
  );
}
