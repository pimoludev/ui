import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Carousel,
  Image,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const highlights = [
  {
    title: "One design language",
    text: "The same tokens, themes and components on web and native, without a second visual system.",
  },
  {
    title: "Six presets",
    text: "Default, monochrome, cartoon, glass, luxury and neo-brutalism share the same API.",
  },
  {
    title: "Accessible by default",
    text: "Keyboard navigation, visible focus, reduced-motion support and labelled slides.",
  },
];

const products = [
  {
    name: "Pimolu Studio",
    price: "€49",
    description:
      "Tokens, themes and a component gallery for product teams.",
  },
  {
    name: "Pimolu Native",
    price: "€39",
    description:
      "Cross-platform primitives with the same visual contract.",
  },
  {
    name: "Pimolu Icons",
    price: "€19",
    description:
      "A consistent icon set tuned for every preset.",
  },
];

export function CarouselPage() {
  const [slide, setSlide] = useState(0);

  return (
    <>
      <PageHeader
        title="Carousel"
        hint="A scroll-snapped horizontal carousel with previous/next controls, dots, loop and optional autoplay. ArrowLeft, ArrowRight, Home and End move the active slide; the track is focusable and every slide announces its position."
      />

      <Section
        title="Basic"
        hint="Three slides, controls and dots. The previous button is disabled on the first slide until loop is enabled."
      >
        <Carousel aria-label="Design system highlights">
          {highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="pg-panel"
              style={{ minHeight: 200 }}
            >
              <div className="pg-stack">
                <div className="pg-row">
                  <Badge variant="secondary">Highlight</Badge>
                </div>

                <h3>{highlight.title}</h3>
                <p className="pg-muted">{highlight.text}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </Section>

      <Section
        title="Autoplay and loop"
        hint="Autoplay pauses while the pointer or keyboard focus is inside, from the pause control, and stays still when the user prefers reduced motion."
      >
        <Carousel
          aria-label="Autoplaying highlights"
          autoPlay
          loop
          interval={4000}
        >
          {highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="pg-panel"
              style={{ minHeight: 180 }}
            >
              <div className="pg-stack">
                <span className="pg-meta">Auto · 4 s</span>
                <h3>{highlight.title}</h3>
                <p className="pg-muted">{highlight.text}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </Section>

      <Section
        title="Controlled"
        hint="The parent owns the index and receives every navigation, including clicks on the dots."
      >
        <div className="pg-stack">
          <Carousel
            aria-label="Controlled highlights"
            index={slide}
            onIndexChange={setSlide}
          >
            {highlights.map((highlight) => (
              <div
                key={highlight.title}
                className="pg-panel"
                style={{ minHeight: 180 }}
              >
                <div className="pg-stack">
                  <h3>{highlight.title}</h3>
                  <p className="pg-muted">{highlight.text}</p>
                </div>
              </div>
            ))}
          </Carousel>

          <div className="pg-row pg-row--between">
            <Badge variant="primary">
              Slide {slide + 1} of {highlights.length}
            </Badge>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSlide(0)}
            >
              Back to first
            </Button>
          </div>
        </div>
      </Section>

      <Section
        title="Product gallery"
        hint="Slides are ordinary layout containers: images, headings and actions keep their own spacing."
      >
        <Carousel
          aria-label="Product gallery"
          loop
          showDots
        >
          {products.map((product) => (
            <Card key={product.name}>
              <Image
                src="/product.svg"
                alt={`${product.name} cover`}
                aspectRatio={16 / 9}
                fit="cover"
                rounded="none"
                width={400}
                height={300}
              />

              <CardHeader>
                <div className="pg-row pg-row--between">
                  <CardTitle>{product.name}</CardTitle>
                  <Badge variant="secondary">
                    {product.price}
                  </Badge>
                </div>

                <CardDescription>
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Button size="sm">View product</Button>
              </CardContent>
            </Card>
          ))}
        </Carousel>
      </Section>

      <Section
        title="Custom labels and minimal controls"
        hint="Labels can be localized, and the arrow controls can be hidden when the dots are enough."
      >
        <Carousel
          aria-label="Témoignages"
          showControls={false}
          labels={{
            pagination: "Pagination des témoignages",
            slide: (index, total) =>
              `Témoignage ${index} sur ${total}`,
            goToSlide: (index, total) =>
              `Afficher le témoignage ${index} sur ${total}`,
          }}
        >
          <div className="pg-panel">
            <p className="pg-muted">
              “The theme tokens let us ship a consistent
              interface in a week.”
            </p>
            <strong>Amélie Bernard</strong>
          </div>

          <div className="pg-panel">
            <p className="pg-muted">
              “One component API for web and native removed a
              whole class of design bugs.”
            </p>
            <strong>Lucas Moreau</strong>
          </div>

          <div className="pg-panel">
            <p className="pg-muted">
              “The playground makes every state obvious before
              it reaches production.”
            </p>
            <strong>Sofia Rossi</strong>
          </div>
        </Carousel>
      </Section>
    </>
  );
}
