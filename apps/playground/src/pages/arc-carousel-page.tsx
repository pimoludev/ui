import { useState } from "react";
import {
  ArcCarousel,
  Badge,
  Button,
  CarouselContent,
  CarouselDots,
  CarouselLiveRegion,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
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
    "linear-gradient(rgb(0 0 0 / 20%), rgb(0 0 0 / 80%)), " +
    "radial-gradient(circle at 65% 25%, " +
    "color-mix(in srgb, var(--pimolu-primary) 40%, transparent), transparent 60%), " +
    `linear-gradient(${slide.angle}deg, var(--pimolu-surface), var(--pimolu-background))`;
  return { backgroundImage };
}

function Slide({ index }: { index: number }) {
  const slide = slides[index % slides.length];
  return (
    <div
      style={{
        ...artwork(index),
        display: "grid",
        alignContent: "end",
        gap: 4,
        height: "100%",
        padding: 16,
        color: "white",
      }}
    >
      <strong>{slide.title}</strong>
      <span style={{ fontSize: "0.8125rem" }}>{slide.note}</span>
    </div>
  );
}

function Gallery({ defaultIndex = 0, gap }: { defaultIndex?: number; gap?: number }) {
  return (
    <ArcCarousel aria-label="Arc gallery" loop defaultIndex={defaultIndex} gap={gap}>
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
    </ArcCarousel>
  );
}

function ControlledGallery() {
  const [index, setIndex] = useState(0);
  return (
    <div className="pg-stack">
      <ArcCarousel aria-label="Controlled arc gallery" index={index} onIndexChange={setIndex} loop>
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
      </ArcCarousel>
      <div className="pg-row pg-row--between">
        <Badge variant="primary">
          Card {index + 1} of {slides.length}
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
    <ArcCarousel
      aria-label="Galerie en arc"
      loop
      labels={{
        previous: "Précédent",
        next: "Suivant",
        pagination: "Pagination de la galerie",
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
    </ArcCarousel>
  );
}

function CustomizedParts() {
  return (
    <>
      <ArcCarousel
        aria-label="Customized arc gallery"
        loop
        classNames={{
          root: "custom-arc-carousel-root",
          viewport: "parts-arc-stage",
          slide: "parts-arc-card",
          previous: "parts-arc-control",
          next: "parts-arc-control",
          dots: "parts-arc-dots",
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
      </ArcCarousel>
      <style>
        {`
.custom-arc-carousel-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 3px;
}
.parts-arc-stage {
  border-radius: 28px;
  background: var(--pimolu-muted);
}
.parts-arc-card {
  border-radius: 22px;
  box-shadow: var(--pimolu-shadow-raised);
}
.parts-arc-control {
  background: var(--pimolu-primary);
  color: var(--pimolu-primary-foreground);
}
.parts-arc-dots {
  gap: 8px;
}
`}
      </style>
    </>
  );
}

export function ArcCarouselPage() {
  return (
    <>
      <PageHeader
        title="ArcCarousel"
        hint="Cards fan across a shallow arc with rotation and vertical offset by distance from the active index. Below 640px the outer cards leave the stage and the active pair remains."
      />

      <Section title="Basic" hint="Five cards fan along a shallow arc while the active card stays upright and closest.">
        <Gallery />
      </Section>

      <Section title="Controlled selection" hint="The page owns the active index and receives every arrow, dot and keyboard change.">
        <ControlledGallery />
      </Section>

      <Section title="Localized labels" hint="Previous, next, pagination and slide labels can follow the application language.">
        <LocalizedGallery />
      </Section>

      <Section title="Compact fan" hint="A tighter gap and a different starting card keep the same arc with fewer moving parts.">
        <Gallery defaultIndex={1} gap={12} />
      </Section>

      <Section title="Named-part customization" hint="Apply local classes to stable named parts without replacing the built-in states.">
        <CustomizedParts />
      </Section>
    </>
  );
}
