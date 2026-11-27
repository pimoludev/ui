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
  StackCarousel,
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
    "linear-gradient(rgb(0 0 0 / 10%), rgb(0 0 0 / 72%)), " +
    "radial-gradient(circle at 30% 15%, " +
    "color-mix(in srgb, var(--pimolu-primary) 45%, transparent), transparent 55%), " +
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
        gap: 6,
        height: "100%",
        padding: 24,
        color: "white",
      }}
    >
      <span style={{ fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Invitation
      </span>
      <strong style={{ fontSize: "1.25rem" }}>{slide.title}</strong>
      <span style={{ fontSize: "0.875rem" }}>{slide.note}</span>
    </div>
  );
}

function Gallery({ defaultIndex = 0, gap, limit = slides.length, interactive = false }: {
  defaultIndex?: number;
  gap?: number;
  limit?: number;
  interactive?: boolean;
}) {
  return (
    <StackCarousel aria-label="Stacked invitation deck" loop defaultIndex={defaultIndex} gap={gap}>
      <CarouselContent>
        {slides.slice(0, limit).map((slide, index) => (
          <CarouselSlide key={slide.title}>
            {interactive ? (
              <div className="pg-panel">
                <h3>{slide.title}</h3>
                <details>
                  <summary>About {slide.title}</summary>
                  <p className="pg-muted">{slide.note}</p>
                </details>
              </div>
            ) : <Slide index={index} />}
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

function ControlledGallery() {
  const [index, setIndex] = useState(0);
  return (
    <div className="pg-stack">
      <StackCarousel aria-label="Controlled stacked deck" index={index} onIndexChange={setIndex} loop>
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
      </StackCarousel>
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
    <StackCarousel
      aria-label="Invitations empilées"
      loop
      labels={{
        previous: "Précédent",
        next: "Suivant",
        pagination: "Pagination des invitations",
        slide: (index, total) => `Invitation ${index + 1} sur ${total}`,
        goToSlide: (index, total) => `Afficher l’invitation ${index + 1} sur ${total}`,
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
    </StackCarousel>
  );
}

function CustomizedParts() {
  return (
    <>
      <StackCarousel
        aria-label="Customized stacked deck"
        loop
        classNames={{
          root: "custom-stack-carousel-root",
          viewport: "parts-stack-stage",
          slide: "parts-stack-card",
          previous: "parts-stack-control",
          next: "parts-stack-control",
          dots: "parts-stack-dots",
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
      </StackCarousel>
      <style>
        {`
.custom-stack-carousel-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 3px;
}
.parts-stack-stage {
  border-radius: 28px;
  background: var(--pimolu-muted);
}
.parts-stack-card {
  border-radius: 24px;
  box-shadow: var(--pimolu-shadow-raised);
}
.parts-stack-control {
  background: var(--pimolu-primary);
  color: var(--pimolu-primary-foreground);
}
.parts-stack-dots {
  gap: 8px;
}
`}
      </style>
    </>
  );
}

export function StackCarouselPage() {
  return (
    <>
      <PageHeader
        title="StackCarousel"
        hint="Cards sit in a shallow deck behind the active one. Arrow buttons, dots and arrow keys advance the deck; the stack re-orders around the active index."
      />

      <Section title="Basic" hint="The active invitation stays on top while the next cards recede with offset and scale.">
        <Gallery />
      </Section>

      <Section title="Controlled selection" hint="The page owns the active index and receives every arrow, dot and keyboard change.">
        <ControlledGallery />
      </Section>

      <Section title="Localized labels" hint="Previous, next, pagination and slide labels can follow the application language.">
        <LocalizedGallery />
      </Section>

      <Section title="Season opening" hint="A different starting card and a wider gap change the deck without changing the engine.">
        <Gallery defaultIndex={2} gap={20} />
      </Section>

      <Section title="Single slide" hint="The card stays visible. With one slide, the gallery omits navigation and pagination.">
        <Gallery limit={1} />
      </Section>

      <Section title="Interactive cards" hint="Only the top invitation offers interactive details. Move the deck to reveal another invitation.">
        <Gallery interactive />
      </Section>

      <Section title="Named-part customization" hint="Apply local classes to stable named parts without replacing the built-in states.">
        <CustomizedParts />
      </Section>
    </>
  );
}
