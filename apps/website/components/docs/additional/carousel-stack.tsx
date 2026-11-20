"use client";

import {
  StackCarousel,
  CarouselContent,
  CarouselSlide,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselLiveRegion,
} from "@pimolu/react";

const slides = [
  { src: "/images/pimolu-atmosphere.webp", alt: "Pimolu landscape artwork", title: "Atlas" },
  { src: "/images/pimolu-studio.webp", alt: "Pimolu studio artwork", title: "Prism" },
  { src: "/images/showcase/pimolu-headset.webp", alt: "Pimolu headset product", title: "Signal" },
  { src: "/images/showcase/saas-landing.webp", alt: "SaaS landing page preview", title: "Orbit" },
  { src: "/images/showcase/saas-landing-dark.webp", alt: "Dark SaaS landing page preview", title: "Terra" },
];

export function DemoExample() {
  return (
    <StackCarousel aria-label="Stacked deck" loop>
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
      <CarouselLiveRegion />
    </StackCarousel>
  );
}
