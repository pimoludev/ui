import { useState } from "react";
import {
  Badge,
  Button,
  CarouselContent,
  CarouselDots,
  CarouselLiveRegion,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  MultiCarousel,
} from "@pimolu/react";
import { PageHeader, Section } from "../section";

const slides = [
  { title: "Atlas", note: "One token contract for colour, type, spacing and radius.", angle: 122 },
  { title: "Prism", note: "Six presets, light and dark, behind the same component API.", angle: 158 },
  { title: "Signal", note: "Accessible primitives for dense product surfaces.", angle: 196 },
  { title: "Orbit", note: "Feedback that stays calm when reduced motion is requested.", angle: 236 },
  { title: "Terra", note: "Compositions that scale past the first demo screen.", angle: 274 },
];

function artwork(index: number) {
  const slide = slides[index % slides.length];
  const backgroundImage =
    "radial-gradient(circle at 70% 20%, " +
    "color-mix(in srgb, var(--pimolu-primary) 38%, transparent), transparent 58%), " +
    `linear-gradient(${slide.angle}deg, var(--pimolu-surface), var(--pimolu-background))`;
  return { backgroundImage };
}

function Slide({ index }: { index: number }) {
  const slide = slides[index % slides.length];
  return (
    <div className="pg-panel">
      <div
        style={{
          ...artwork(index),
          aspectRatio: "4 / 3",
          borderRadius: "calc(var(--pimolu-radius-lg) - 4px)",
        }}
      />
      <div className="pg-row pg-row--between" style={{ marginTop: 12 }}>
        <h3>{slide.title}</h3>
        <span className="pg-meta">{String(index + 1).padStart(2, "0")} / 05</span>
      </div>
      <p className="pg-muted">{slide.note}</p>
    </div>
  );
}

function Gallery({ defaultIndex = 0, slidesPerView = 3, gap }: { defaultIndex?: number; slidesPerView?: number; gap?: number }) {
  return (
    <MultiCarousel aria-label="Multi item gallery" loop defaultIndex={defaultIndex} slidesPerView={slidesPerView} gap={gap}>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselSlide key={slide.title}>
            <Slide index={index} />
          </CarouselSlide>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
      <CarouselLiveRegion />
    </MultiCarousel>
  );
}

function ControlledGallery() {
  const [index, setIndex] = useState(0);
  return (
    <div className="pg-stack">
      <MultiCarousel aria-label="Controlled multi item gallery" index={index} onIndexChange={setIndex} loop slidesPerView={3}>
        <CarouselContent>
          {slides.map((slide, slideIndex) => (
            <CarouselSlide key={slide.title}>
              <Slide index={slideIndex} />
            </CarouselSlide>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
        <CarouselLiveRegion />
      </MultiCarousel>
      <div className="pg-row pg-row--between">
        <Badge variant="primary">
          Slide {index + 1} of {slides.length}
        </Badge>
        <Button variant="secondary" size="sm" onClick={() => setIndex(0)}>
          Back to first
        </Button>
      </div>
    </div>
  );
}

function LocalizedGallery() {
  return (
    <MultiCarousel
      aria-label="Galerie multi-colonnes"
      loop
      slidesPerView={2}
      labels={{
        previous: "Précédent",
        next: "Suivant",
        pagination: "Pagination de la galerie",
        slide: (index, total) => `Élément ${index + 1} sur ${total}`,
        goToSlide: (index, total) => `Afficher l’élément ${index + 1} sur ${total}`,
      }}
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselSlide key={slide.title}>
            <Slide index={index} />
          </CarouselSlide>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
      <CarouselLiveRegion />
    </MultiCarousel>
  );
}

function PlainGallery() {
  return (
    <MultiCarousel
      aria-label="Plain application cards"
      loop
      slidesPerView={3}
      slideAppearance="plain"
      showControlsOnMobile={false}
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselSlide key={slide.title}>
            <div
              className="pg-panel"
              style={{
                border: "1px solid var(--pimolu-border)",
                borderRadius: "var(--pimolu-radius-lg)",
                background: "var(--pimolu-surface)",
                padding: 16,
                transition: "transform 180ms ease",
              }}
            >
              <Slide index={index} />
            </div>
          </CarouselSlide>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
      <CarouselLiveRegion />
    </MultiCarousel>
  );
}

function CustomizedParts() {
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
          {slides.map((slide, index) => (
            <CarouselSlide key={slide.title}>
              <Slide index={index} />
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

export function MultiCarouselPage() {
  return (
    <>
      <PageHeader
        title="MultiCarousel"
        hint="Several cards per view with a shared scroll-snap track. slidesPerView controls the visible columns; arrows, dots and keyboard navigation keep one active index."
      />

      <Section title="Basic" hint="Three cards per view on one scroll-snap track.">
        <Gallery />
      </Section>

      <Section title="Controlled selection" hint="The page owns the active index and receives every arrow, dot and keyboard change.">
        <ControlledGallery />
      </Section>

      <Section title="Localized labels" hint="Two cards per view with previous, next, pagination and slide labels in French.">
        <LocalizedGallery />
      </Section>

      <Section title="Two-column layout" hint="A narrower composition for comparison pages and compact sidebars.">
        <Gallery defaultIndex={1} slidesPerView={2} gap={20} />
      </Section>

      <Section title="Plain application cards" hint="slideAppearance removes the built-in frame so each product card owns its border and hover transform; arrows are hidden below 640px and swiping remains.">
        <PlainGallery />
      </Section>

      <Section title="Named-part customization" hint="Apply local classes to stable named parts without replacing the built-in states.">
        <CustomizedParts />
      </Section>
    </>
  );
}
