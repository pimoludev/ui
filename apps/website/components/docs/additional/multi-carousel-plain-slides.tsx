"use client";

import {
  CarouselContent,
  CarouselDots,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  MultiCarousel,
} from "@pimolu/react";

const products = [
  { src: "/images/showcase/pimolu-headset.webp", alt: "Champagne headphones", title: "Studio headset" },
  { src: "/images/pimolu-studio.webp", alt: "Pimolu studio artwork", title: "Studio session" },
  { src: "/images/pimolu-atmosphere.webp", alt: "Pimolu landscape artwork", title: "Field notes" },
  { src: "/images/showcase/saas-landing.webp", alt: "SaaS landing page preview", title: "Project workspace" },
];

export function DemoExample() {
  return (
    <MultiCarousel
      aria-label="Plain product cards"
      loop
      slidesPerView={3}
      slideAppearance="plain"
      showControlsOnMobile={false}
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselSlide key={product.title}>
            <article
              style={{
                border: "1px solid var(--pimolu-border)",
                borderRadius: "var(--pimolu-radius-lg)",
                background: "var(--pimolu-surface)",
                padding: 16,
                transition: "transform 180ms ease",
              }}
            >
              <img
                src={product.src}
                alt={product.alt}
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "4 / 3",
                  borderRadius: "calc(var(--pimolu-radius-lg) - 4px)",
                  objectFit: "cover",
                }}
              />
              <h3 style={{ marginBlock: "12px 4px", fontSize: "1rem" }}>{product.title}</h3>
              <p style={{ color: "var(--pimolu-muted-foreground)", fontSize: ".875rem" }}>
                The card owns its frame, radius and hover lift.
              </p>
            </article>
          </CarouselSlide>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </MultiCarousel>
  );
}
