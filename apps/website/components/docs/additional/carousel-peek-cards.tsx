"use client";

import {
  PeekCarousel,
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

function SlideCard({ index }: { index: number }) {
  const slide = slides[index];
  return (
    <article className="overflow-hidden rounded-[calc(var(--pimolu-radius-lg)+2px)] border border-border bg-surface">
      <img src={slide.src} alt={slide.alt} className="aspect-[4/3] w-full object-cover" />
      <div className="grid gap-1 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base">{slide.title}</h3>
          <span className="text-xs text-muted tabular-nums">{String(index + 1).padStart(2, "0")} / 05</span>
        </div>
      </div>
    </article>
  );
}

export function DemoExample() {
  return (
    <PeekCarousel aria-label="Peek cards" loop>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselSlide key={slide.title}>
            <SlideCard index={index} />
          </CarouselSlide>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
      <CarouselLiveRegion />
    </PeekCarousel>
  );
}
