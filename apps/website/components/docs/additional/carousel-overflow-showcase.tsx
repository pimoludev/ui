"use client";

import { useState } from "react";
import {
  Button,
  MultiCarousel,
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
        <h3 className="text-base">{slide.title}</h3>
      </div>
    </article>
  );
}

export function DemoExample() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? slides : slides.slice(0, 3);

  return (
    <div className="grid gap-4">
      <MultiCarousel aria-label="Overflow showcase" slidesPerView={3}>
        <CarouselContent>
          {visible.map((slide, index) => (
            <CarouselSlide key={slide.title}>
              <SlideCard index={index} />
            </CarouselSlide>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
        <CarouselLiveRegion />
      </MultiCarousel>
      <Button
        appearance="outline"
        size="sm"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? "Show fewer items" : `Show all ${slides.length} items`}
      </Button>
    </div>
  );
}
