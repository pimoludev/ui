"use client";

import {
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselThumbnail,
  CarouselThumbnails,
  ThumbnailCarousel,
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
      <ThumbnailCarousel aria-label="Uniform thumbnail rail" loop defaultIndex={1}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselSlide key={slide.title}>
              <img
                src={slide.src}
                alt={slide.alt}
                style={{ display: "block", width: "100%", aspectRatio: "16 / 10", objectFit: "cover" }}
              />
            </CarouselSlide>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselThumbnails>
          {slides.map((slide, index) => (
            <CarouselThumbnail
              key={slide.title}
              index={index}
              src={slide.src}
              alt={`${slide.title} thumbnail`}
              classNames={{ thumbnailImage: "thumbnail-crop" }}
            />
          ))}
        </CarouselThumbnails>
      </ThumbnailCarousel>
      <style>
        {`
.thumbnail-crop {
  object-position: center 35%;
}
`}
      </style>
    </>
  );
}
