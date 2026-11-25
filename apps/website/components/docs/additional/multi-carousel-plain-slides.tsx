"use client";

import { useState } from "react";
import {
  Button,
  CarouselContent,
  CarouselDots,
  CarouselLiveRegion,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  MultiCarousel,
} from "@pimolu/react";

const products = [
  {
    src: "/images/showcase/pimolu-headset.webp",
    alt: "Champagne headphones",
    title: "Studio headset",
  },
  { src: "/images/pimolu-studio.webp", alt: "Pimolu studio artwork", title: "Studio session" },
  { src: "/images/pimolu-atmosphere.webp", alt: "Pimolu landscape artwork", title: "Field notes" },
  {
    src: "/images/showcase/saas-landing.webp",
    alt: "SaaS landing page preview",
    title: "Project workspace",
  },
  {
    src: "/images/showcase/mecanes.webp",
    alt: "Mecanes studio website preview",
    title: "Agency portfolio",
  },
];

export function DemoExample() {
  const [count, setCount] = useState(products.length);
  const [columns, setColumns] = useState(3);

  return (
    <div style={{ display: "grid", gap: "var(--pimolu-spacing-4)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <div
          role="group"
          aria-label="Number of products"
          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
        >
          {[1, 2, products.length].map((size) => (
            <Button
              key={size}
              size="sm"
              variant={count === size ? "primary" : "secondary"}
              aria-pressed={count === size}
              onClick={() => setCount(size)}
            >
              {`${size} ${size === 1 ? "product" : "products"}`}
            </Button>
          ))}
        </div>
        <div
          role="group"
          aria-label="Cards per view"
          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
        >
          {[3, 4].map((value) => (
            <Button
              key={value}
              size="sm"
              variant={columns === value ? "primary" : "secondary"}
              aria-pressed={columns === value}
              onClick={() => setColumns(value)}
            >
              {`${value} columns`}
            </Button>
          ))}
        </div>
      </div>
      <MultiCarousel
        aria-label="Plain product cards"
        loop
        slidesPerView={columns}
        slideAppearance="plain"
        showControlsOnMobile={false}
      >
        <CarouselContent>
          {products.slice(0, count).map((product) => (
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
        <CarouselLiveRegion />
      </MultiCarousel>
    </div>
  );
}
