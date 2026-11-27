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
  TiltedCarousel,
} from "@pimolu/react";
import { PageHeader, Section } from "../section";

const slides = [
  { title: "Atlas", note: "One token contract for every surface.", angle: 128 },
  { title: "Prism", note: "Six presets behind a single API.", angle: 164 },
  { title: "Signal", note: "Accessible primitives for dense layouts.", angle: 202 },
  { title: "Orbit", note: "Motion that respects reduced-motion.", angle: 238 },
  { title: "Terra", note: "Compositions that scale past the fold.", angle: 276 },
];

const categories = [
  "Remodeling",
  "Landscaping",
  "Med spas",
  "Dental",
  "Gyms",
  "Auto repair",
];

function artwork(angle: number) {
  return {
    backgroundImage:
      "linear-gradient(rgb(0 0 0 / 12%), rgb(0 0 0 / 78%)), " +
      `linear-gradient(${angle}deg, var(--pimolu-surface), var(--pimolu-muted) 55%, var(--pimolu-background))`,
  };
}

function Cover({ title, note, angle }: { title: string; note: string; angle: number }) {
  return (
    <div
      style={{
        ...artwork(angle),
        display: "grid",
        alignContent: "end",
        gap: 6,
        height: "100%",
        padding: 20,
        color: "white",
      }}
    >
      <strong style={{ fontSize: "1.5rem" }}>{title}</strong>
      <span style={{ fontSize: "0.875rem" }}>{note}</span>
    </div>
  );
}

function CategoryCover({ category, index }: { category: string; index: number }) {
  return (
    <div
      style={{
        ...artwork(130 + index * 26),
        display: "flex",
        alignItems: "flex-end",
        height: "100%",
        padding: 18,
      }}
    >
      <strong
        style={{
          color: "white",
          fontStyle: "italic",
          fontSize: "1.25rem",
          letterSpacing: "0.04em",
          textShadow: "0 2px 10px rgb(0 0 0 / 65%)",
          textTransform: "uppercase",
        }}
      >
        {category}
      </strong>
    </div>
  );
}

function Gallery({ defaultIndex = 0, gap, tilt, limit = slides.length }: { defaultIndex?: number; gap?: number; tilt?: number; limit?: number }) {
  return (
    <TiltedCarousel aria-label="Tilted gallery" defaultIndex={defaultIndex} gap={gap} tilt={tilt} loop>
      <CarouselContent>
        {slides.slice(0, limit).map((slide) => (
          <CarouselSlide key={slide.title}>
            <Cover title={slide.title} note={slide.note} angle={slide.angle} />
          </CarouselSlide>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
      <CarouselLiveRegion />
    </TiltedCarousel>
  );
}

function ControlledGallery() {
  const [index, setIndex] = useState(0);
  return (
    <div className="pg-stack">
      <TiltedCarousel aria-label="Controlled tilted gallery" index={index} onIndexChange={setIndex} loop>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselSlide key={slide.title}>
              <Cover title={slide.title} note={slide.note} angle={slide.angle} />
            </CarouselSlide>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
        <CarouselLiveRegion />
      </TiltedCarousel>
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
    <TiltedCarousel
      aria-label="Galerie inclinée"
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
        {slides.map((slide) => (
          <CarouselSlide key={slide.title}>
            <Cover title={slide.title} note={slide.note} angle={slide.angle} />
          </CarouselSlide>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </TiltedCarousel>
  );
}

function ScrollingGallery() {
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [playing, setPlaying] = useState(false);
  const [perView, setPerView] = useState(2);
  const [gap, setGap] = useState(24);
  return (
    <div className="pg-stack">
      <TiltedCarousel
        aria-label="Scrolling service categories"
        autoScroll={playing}
        autoScrollDirection={direction}
        speed={50}
        pauseLabel="Pause service ticker"
        resumeLabel="Resume service ticker"
        classNames={{ playback: "parts-tilted-playback" }}
        gap={gap}
        slidesPerView={perView}
      >
        <CarouselContent>
          {categories.map((category, index) => (
            <CarouselSlide key={category}>
              <CategoryCover category={category} index={index} />
            </CarouselSlide>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </TiltedCarousel>
      <div className="pg-row pg-row--between">
        <div className="pg-row">
          <Button variant="secondary" size="sm" onClick={() => setDirection((value) => value === "ltr" ? "rtl" : "ltr")}>
            Reverse direction
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setPlaying((value) => !value)}>
            {playing ? "Pause" : "Play"}
          </Button>
          {[1, 2, 3].map((count) => (
            <Button key={count} variant={perView === count ? "primary" : "secondary"} size="sm" onClick={() => setPerView(count)}>
              {count} visible
            </Button>
          ))}
          {[12, 24, 36].map((space) => (
            <Button key={space} variant={gap === space ? "primary" : "secondary"} size="sm" onClick={() => setGap(space)}>
              {space}px gap
            </Button>
          ))}
        </div>
        <Badge variant="primary">{direction === "ltr" ? "Cards move left" : "Cards move right"} · {perView} cards · {gap}px gap</Badge>
      </div>
      <style>{".parts-tilted-playback { border: 1px solid var(--pimolu-control-border); }"}</style>
    </div>
  );
}

function ServiceCategories() {
  return (
    <TiltedCarousel aria-label="Service categories" gap={28}>
      <CarouselContent>
        {categories.map((category, index) => (
          <CarouselSlide key={category}>
            <CategoryCover category={category} index={index} />
          </CarouselSlide>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
      <CarouselLiveRegion />
    </TiltedCarousel>
  );
}

function CustomizedParts() {
  return (
    <>
      <TiltedCarousel
        aria-label="Customized tilted gallery"
        loop
        slideWidth="min(70%, 280px)"
        viewportHeight="280px"
        classNames={{
          root: "custom-tilted-carousel-root",
          viewport: "parts-tilted-stage",
          slide: "parts-tilted-card",
          previous: "parts-tilted-control",
          next: "parts-tilted-control",
          dots: "parts-tilted-dots",
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselSlide key={slide.title}>
              <Cover title={slide.title} note={slide.note} angle={slide.angle} />
            </CarouselSlide>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </TiltedCarousel>
      <style>
        {`
.custom-tilted-carousel-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 3px;
}
.parts-tilted-stage {
  border-radius: 28px;
  background: var(--pimolu-muted);
}
.parts-tilted-card {
  border-color: var(--pimolu-primary);
}
.parts-tilted-control {
  background: var(--pimolu-primary);
  color: var(--pimolu-primary-foreground);
}
.parts-tilted-dots {
  gap: 8px;
}
`}
      </style>
    </>
  );
}

export function TiltedCarouselPage() {
  return (
    <>
      <PageHeader
        title="TiltedCarousel"
        hint="A horizontal rail of separate, slightly rotated cards with visible gaps. It can scroll continuously in either direction."
      />

      <Section title="Basic" hint="Choose a page with the arrows, dots or arrow keys. On narrow screens the controls sit below the cards.">
        <Gallery />
      </Section>

      <Section title="Controlled selection" hint="The page owns the active index and receives every arrow, dot and keyboard change.">
        <ControlledGallery />
      </Section>

      <Section title="Localized labels" hint="Previous, next, pagination and slide labels can follow the application language.">
        <LocalizedGallery />
      </Section>

      <Section title="Continuous scroll" hint="Play the decorative service ticker in either direction. Its own pause button returns to manual navigation. Hover and focus pause motion temporarily, and reduced motion keeps the rail manual.">
        <ScrollingGallery />
      </Section>

      <Section title="Tilt amplitude" hint="tilt sets the maximum rotation in degrees; a wider gap spreads the cards.">
        <Gallery tilt={7} gap={32} defaultIndex={2} />
      </Section>

      <Section title="Single slide" hint="The card stays visible. With one slide, the gallery omits navigation and pagination.">
        <Gallery limit={1} />
      </Section>

      <Section title="Examples" hint="A services gallery: editorial category covers turn the tilted rail into a real navigation surface.">
        <ServiceCategories />
      </Section>

      <Section title="Named-part customization" hint="Set slideWidth and viewportHeight to fit the layout, and style the rail, cards and controls with classNames.">
        <CustomizedParts />
      </Section>
    </>
  );
}
