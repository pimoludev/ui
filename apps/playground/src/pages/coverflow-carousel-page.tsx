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
  CoverflowCarousel,
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
    "linear-gradient(rgb(0 0 0 / 12%), rgb(0 0 0 / 76%)), " +
    "radial-gradient(circle at 70% 20%, " +
    "color-mix(in srgb, var(--pimolu-primary) 42%, transparent), transparent 58%), " +
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
        padding: 20,
        borderRadius: "calc(var(--pimolu-radius-lg) + 2px)",
        overflow: "hidden",
        color: "white",
      }}
    >
      <strong>{slide.title}</strong>
      <span style={{ fontSize: "0.875rem" }}>{slide.note}</span>
    </div>
  );
}

function Gallery({ defaultIndex = 0, gap }: { defaultIndex?: number; gap?: number }) {
  return (
    <CoverflowCarousel aria-label="Coverflow gallery" loop defaultIndex={defaultIndex} gap={gap}>
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
    </CoverflowCarousel>
  );
}

function ControlledGallery() {
  const [index, setIndex] = useState(0);
  return (
    <div className="pg-stack">
      <CoverflowCarousel aria-label="Controlled coverflow gallery" index={index} onIndexChange={setIndex} loop>
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
      </CoverflowCarousel>
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
    <CoverflowCarousel
      aria-label="Galerie en perspective"
      loop
      labels={{
        previous: "Précédent",
        next: "Suivant",
        pagination: "Pagination de la galerie",
        slide: (index, total) => `Diapositive ${index + 1} sur ${total}`,
        goToSlide: (index, total) => `Afficher la diapositive ${index + 1} sur ${total}`,
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
    </CoverflowCarousel>
  );
}

function CustomizedParts() {
  return (
    <>
      <CoverflowCarousel
        aria-label="Customized coverflow gallery"
        loop
        classNames={{
          root: "custom-coverflow-carousel-root",
          viewport: "parts-coverflow-stage",
          slide: "parts-coverflow-card",
          previous: "parts-coverflow-control",
          next: "parts-coverflow-control",
          dots: "parts-coverflow-dots",
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
      </CoverflowCarousel>
      <style>
        {`
.custom-coverflow-carousel-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 3px;
}
.parts-coverflow-stage {
  border-radius: 28px;
  background: var(--pimolu-muted);
}
.parts-coverflow-card {
  box-shadow: var(--pimolu-shadow-raised);
}
.parts-coverflow-control {
  background: var(--pimolu-primary);
  color: var(--pimolu-primary-foreground);
}
.parts-coverflow-dots {
  gap: 8px;
}
`}
      </style>
    </>
  );
}

export function CoverflowCarouselPage() {
  return (
    <>
      <PageHeader
        title="CoverflowCarousel"
        hint="The active card stays centred while its neighbours scale, rotate and fade behind it. Arrow buttons, dots and the arrow keys share one active index."
      />

      <Section title="Basic" hint="Previous and next cards recede with scale, rotation and opacity while the active card stays centred.">
        <Gallery />
      </Section>

      <Section title="Controlled selection" hint="The page owns the active index and receives every arrow, dot and keyboard change.">
        <ControlledGallery />
      </Section>

      <Section title="Localized labels" hint="Previous, next, pagination and slide labels can follow the application language.">
        <LocalizedGallery />
      </Section>

      <Section title="Editorial covers" hint="A wider gap separates the cards and the third cover is selected initially.">
        <Gallery defaultIndex={2} gap={24} />
      </Section>

      <Section title="Named-part customization" hint="Apply local classes to stable named parts without replacing the built-in states.">
        <CustomizedParts />
      </Section>
    </>
  );
}
