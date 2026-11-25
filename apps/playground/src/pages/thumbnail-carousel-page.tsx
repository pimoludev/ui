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
  CarouselThumbnail,
  CarouselThumbnails,
  ThumbnailCarousel,
} from "@pimolu/react";
import { PageHeader, Section } from "../section";

const slides = [
  { title: "Atlas", note: "One token contract for colour, type, spacing and radius.", angle: 122 },
  { title: "Prism", note: "Six presets, light and dark, behind the same component API.", angle: 158 },
  { title: "Signal", note: "Accessible primitives for dense product surfaces.", angle: 196 },
  { title: "Orbit", note: "Feedback that stays calm when reduced motion is requested.", angle: 236 },
  { title: "Terra", note: "Compositions that scale past the first demo screen.", angle: 274 },
];

const thumbnailColors = ["#4f46e5", "#0f172a", "#0ea5e9", "#db2777", "#ea580c"];

function artwork(index: number) {
  const slide = slides[index % slides.length];
  const backgroundImage =
    "radial-gradient(circle at 70% 20%, " +
    "color-mix(in srgb, var(--pimolu-primary) 38%, transparent), transparent 58%), " +
    `linear-gradient(${slide.angle}deg, var(--pimolu-surface), var(--pimolu-background))`;
  return { backgroundImage };
}

function thumbnail(index: number) {
  const slide = slides[index % slides.length];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120">` +
    `<rect width="160" height="120" fill="${thumbnailColors[index % thumbnailColors.length]}"/>` +
    `<text x="12" y="76" fill="white" font-family="sans-serif" font-size="30">${slide.title}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function Slide({ index, compact = false }: { index: number; compact?: boolean }) {
  const slide = slides[index % slides.length];
  return (
    <div className="pg-panel">
      <div
        style={{
          ...artwork(index),
          aspectRatio: compact ? "4 / 3" : "16 / 10",
          borderRadius: "calc(var(--pimolu-radius-lg) - 4px)",
        }}
      />
      <div className="pg-row pg-row--between" style={{ marginTop: 12 }}>
        <h3>{slide.title}</h3>
        <span className="pg-meta">{String(index + 1).padStart(2, "0")} / 05</span>
      </div>
      {!compact && <p className="pg-muted">{slide.note}</p>}
    </div>
  );
}

function Gallery({ compact = false, defaultIndex = 0, gap, limit = slides.length }: { compact?: boolean; defaultIndex?: number; gap?: number; limit?: number }) {
  return (
    <ThumbnailCarousel aria-label="Thumbnail gallery" loop defaultIndex={defaultIndex} gap={gap}>
      <CarouselContent>
        {slides.slice(0, limit).map((slide, index) => (
          <CarouselSlide key={slide.title}>
            <Slide index={index} compact={compact} />
          </CarouselSlide>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselThumbnails>
        {slides.slice(0, limit).map((slide, index) => (
          <CarouselThumbnail key={slide.title} index={index} src={thumbnail(index)} alt={`${slide.title} view`} />
        ))}
      </CarouselThumbnails>
      <CarouselLiveRegion />
    </ThumbnailCarousel>
  );
}

function ControlledGallery() {
  const [index, setIndex] = useState(0);
  return (
    <div className="pg-stack">
      <ThumbnailCarousel aria-label="Controlled thumbnail gallery" index={index} onIndexChange={setIndex} loop>
        <CarouselContent>
          {slides.map((slide, slideIndex) => (
            <CarouselSlide key={slide.title}>
              <Slide index={slideIndex} compact />
            </CarouselSlide>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselThumbnails>
          {slides.map((slide, slideIndex) => (
            <CarouselThumbnail key={slide.title} index={slideIndex} src={thumbnail(slideIndex)} alt={`${slide.title} view`} />
          ))}
        </CarouselThumbnails>
        <CarouselLiveRegion />
      </ThumbnailCarousel>
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
    <ThumbnailCarousel
      aria-label="Galerie de produits"
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
      <CarouselThumbnails>
        {slides.map((slide, index) => (
          <CarouselThumbnail key={slide.title} index={index} src={thumbnail(index)} alt={`Vue ${slide.title}`} />
        ))}
      </CarouselThumbnails>
      <CarouselDots />
      <CarouselLiveRegion />
    </ThumbnailCarousel>
  );
}

function mixedThumbnail(index: number, height: number) {
  const slide = slides[index % slides.length];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 ${height}">` +
    `<rect width="160" height="${height}" fill="${thumbnailColors[index % thumbnailColors.length]}"/>` +
    `<text x="12" y="${Math.round(height * 0.62)}" fill="white" font-family="sans-serif" font-size="26">${slide.title}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function MixedRail() {
  const heights = [120, 180, 90, 150];
  return (
    <ThumbnailCarousel aria-label="Uniform thumbnail rail" loop defaultIndex={1}>
      <CarouselContent>
        {slides.slice(0, heights.length).map((slide, index) => (
          <CarouselSlide key={slide.title}>
            <Slide index={index} compact />
          </CarouselSlide>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselThumbnails>
        {slides.slice(0, heights.length).map((slide, index) => (
          <CarouselThumbnail
            key={slide.title}
            index={index}
            src={mixedThumbnail(index, heights[index])}
            alt={`${slide.title} crop`}
            classNames={{ thumbnailImage: "parts-thumbnail-image" }}
          />
        ))}
      </CarouselThumbnails>
    </ThumbnailCarousel>
  );
}

function CustomizedParts() {
  return (
    <>
      <ThumbnailCarousel
        aria-label="Customized thumbnail gallery"
        loop
        classNames={{
          root: "custom-thumbnail-carousel-root",
          viewport: "parts-thumbnail-stage",
          previous: "parts-thumbnail-control",
          next: "parts-thumbnail-control",
          thumbnails: "parts-thumbnail-rail",
          thumbnail: "parts-thumbnail-item",
        }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselSlide key={slide.title}>
              <Slide index={index} compact />
            </CarouselSlide>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselThumbnails>
          {slides.map((slide, index) => (
            <CarouselThumbnail key={slide.title} index={index} src={thumbnail(index)} alt={`${slide.title} view`} />
          ))}
        </CarouselThumbnails>
      </ThumbnailCarousel>
      <style>
        {`
.custom-thumbnail-carousel-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 3px;
}
.parts-thumbnail-stage {
  border-radius: 24px;
  border: 1px solid var(--pimolu-primary);
}
.parts-thumbnail-control {
  background: var(--pimolu-primary);
  color: var(--pimolu-primary-foreground);
}
.parts-thumbnail-rail {
  padding: 8px;
  border-radius: 16px;
  background: var(--pimolu-muted);
}
.parts-thumbnail-item {
  border-radius: 12px;
}
.parts-thumbnail-image {
  object-position: center 35%;
}
`}
      </style>
    </>
  );
}

export function ThumbnailCarouselPage() {
  return (
    <>
      <PageHeader
        title="ThumbnailCarousel"
        hint="A main stage with a thumbnail rail. The active thumbnail is selected, every thumbnail is a real button, and the shared engine keeps dots, arrows and keyboard navigation in sync."
      />

      <Section title="Basic" hint="A large selected slide with a thumbnail rail underneath; arrow buttons and the rail share one active index.">
        <Gallery />
      </Section>

      <Section title="Controlled selection" hint="The page owns the active index and receives every rail, arrow and keyboard change.">
        <ControlledGallery />
      </Section>

      <Section title="Localized labels" hint="Previous, next, pagination and slide labels can follow the application language.">
        <LocalizedGallery />
      </Section>

      <Section title="Compact editorial gallery" hint="A smaller stage that keeps the thumbnail rail visible with five captioned images.">
        <Gallery compact defaultIndex={2} gap={20} />
      </Section>

      <Section title="Uniform thumbnail rail" hint="Mixed source ratios keep one square crop through --pimolu-carousel-thumbnail-aspect-ratio; classNames.thumbnailImage targets the image itself.">
        <MixedRail />
      </Section>

      <Section title="Single slide" hint="The main image stays visible. With one image, there are no arrows or thumbnails to navigate.">
        <Gallery limit={1} />
      </Section>

      <Section title="Named-part customization" hint="Apply local classes to stable named parts without replacing the built-in states.">
        <CustomizedParts />
      </Section>
    </>
  );
}
