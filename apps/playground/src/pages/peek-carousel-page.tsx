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
  PeekCarousel,
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
        <span className="pg-copy text-xs">{String(index + 1).padStart(2, "0")} / 05</span>
      </div>
      <p className="pg-copy">{slide.note}</p>
    </div>
  );
}

function Gallery({ defaultIndex = 0, gap }: { defaultIndex?: number; gap?: number }) {
  return (
    <PeekCarousel aria-label="Peek card gallery" loop defaultIndex={defaultIndex} gap={gap}>
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
    </PeekCarousel>
  );
}

function ControlledGallery() {
  const [index, setIndex] = useState(0);
  return (
    <div className="pg-stack">
      <PeekCarousel aria-label="Controlled peek card gallery" index={index} onIndexChange={setIndex} loop>
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
      </PeekCarousel>
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
    <PeekCarousel
      aria-label="Cartes en aperçu"
      loop
      labels={{
        previous: "Précédent",
        next: "Suivant",
        pagination: "Pagination des cartes",
        slide: (index, total) => `Carte ${index + 1} sur ${total}`,
        goToSlide: (index, total) => `Afficher la carte ${index + 1} sur ${total}`,
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
    </PeekCarousel>
  );
}

function NarrowGallery() {
  return (
    <PeekCarousel
      aria-label="Narrow peek gallery"
      loop
      defaultIndex={1}
      slideWidth="min(320px, 78vw)"
      showControlsOnMobile={false}
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
    </PeekCarousel>
  );
}

function CustomizedParts() {
  return (
    <>
      <PeekCarousel
        aria-label="Customized peek card gallery"
        loop
        classNames={{
          root: "custom-peek-carousel-root",
          viewport: "parts-peek-viewport",
          slide: "parts-peek-card",
          previous: "parts-peek-control",
          next: "parts-peek-control",
          dots: "parts-peek-dots",
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
      </PeekCarousel>
      <style>
        {`
.custom-peek-carousel-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 3px;
}
.parts-peek-viewport {
  padding-block: 16px;
}
.parts-peek-card {
  border-radius: 26px;
  box-shadow: var(--pimolu-shadow-raised);
}
.parts-peek-control {
  background: var(--pimolu-primary);
  color: var(--pimolu-primary-foreground);
}
.parts-peek-dots {
  gap: 8px;
}
`}
      </style>
    </>
  );
}

export function PeekCarouselPage() {
  return (
    <>
      <PageHeader
        title="PeekCarousel"
        hint="A centred card with both neighbours peeking into the viewport. Arrow buttons, dots and arrow keys keep the selection in sync while the rail scrolls."
      />

      <Section title="Basic" hint="The active card sits in the centre while its neighbours stay visible on both sides.">
        <Gallery defaultIndex={1} />
      </Section>

      <Section title="Controlled selection" hint="The page owns the active index and receives every arrow, dot and keyboard change.">
        <ControlledGallery />
      </Section>

      <Section title="Localized labels" hint="Previous, next, pagination and slide labels can follow the application language.">
        <LocalizedGallery />
      </Section>

      <Section title="Editorial cards" hint="A wider gap and a different starting card change the rhythm without changing the engine.">
        <Gallery defaultIndex={1} gap={24} />
      </Section>

      <Section title="Custom slide width" hint="slideWidth sets the card width as a CSS length; 320px keeps more neighbours visible without touching the engine.">
        <NarrowGallery />
      </Section>

      <Section title="Named-part customization" hint="Apply local classes to stable named parts without replacing the built-in states.">
        <CustomizedParts />
      </Section>
    </>
  );
}
