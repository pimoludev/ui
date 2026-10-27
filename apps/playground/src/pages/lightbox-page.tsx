import { CustomizationExample } from "./lightbox-customization-demo";
import { useState } from "react";

import {
  Badge,
  Button,
  Kbd,
  Image,
  Lightbox,
  type PimoluLightboxImage,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const gallery: PimoluLightboxImage[] = [
  {
    src: "/product.svg",
    alt: "Pimolu Studio product illustration",
    caption:
      "Pimolu Studio — one design language for web and native.",
    thumbnail: "/product.svg",
  },
  {
    src: "/avatars/jean.svg",
    alt: "Portrait of Jean Dupont",
    caption: "Jean Dupont · Design engineer",
    thumbnail: "/avatars/jean.svg",
  },
  {
    src: "/product.svg",
    alt: "Pimolu Studio illustration, detail view",
    caption:
      "Every preset shares the same component API.",
    thumbnail: "/product.svg",
  },
];

export function LightboxPage() {
  const [basicOpen, setBasicOpen] = useState(false);

  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const [localizedOpen, setLocalizedOpen] =
    useState(false);

  return (
    <>
      <PageHeader
        title="Lightbox"
        hint="A modal image viewer with a portal, overlay, body scroll lock and a focus trap. Arrow keys move through the gallery, Home and End jump to the edges, and Escape closes it. The trigger regains focus on close."
      />

      <Section
        title="Basic gallery"
        hint="A thumbnail strip makes every image reachable without leaving the stage. The counter is announced politely."
      >
        <div className="pg-stack">
          <Button
            onClick={() => setBasicOpen(true)}
          >
            Open gallery
          </Button>

          <span className="pg-meta">
            Three images · thumbnails · no loop
          </span>

          <Lightbox
            images={gallery}
            open={basicOpen}
            onOpenChange={setBasicOpen}
            showThumbnails
          />
        </div>
      </Section>

      <Section
        title="Controlled index"
        hint="The parent owns both the open state and the active image. Opening from a card sets the index first, so the viewer starts on the chosen image."
      >
        <div className="pg-stack">
          <div className="pg-row">
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                setIndex((value) =>
                  Math.max(0, value - 1)
                )
              }
            >
              Previous
            </Button>

            <Badge variant="secondary">
              Image {index + 1} / {gallery.length}
            </Badge>

            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                setIndex((value) =>
                  Math.min(
                    gallery.length - 1,
                    value + 1
                  )
                )
              }
            >
              Next
            </Button>

            <Button
              size="sm"
              onClick={() => setOpen(true)}
            >
              Open at {index + 1}
            </Button>
          </div>

          <div className="pg-grid">
            {gallery.map((image, imageIndex) => (
              <button
                key={`${image.src}-${imageIndex}`}
                type="button"
                onClick={() => {
                  setIndex(imageIndex);
                  setOpen(true);
                }}
                aria-label={`Open ${image.alt}`}
                style={{
                  padding: 0,
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <Image
                  src={image.thumbnail ?? image.src}
                  alt={image.alt}
                  aspectRatio={4 / 3}
                  fit="cover"
                  rounded="md"
                  width={400}
                  height={300}
                />
              </button>
            ))}
          </div>

          <Lightbox
            images={gallery}
            open={open}
            onOpenChange={setOpen}
            index={index}
            onIndexChange={setIndex}
            loop
          />
        </div>
      </Section>

      <Section
        title="Keyboard and focus"
        hint="The modal owns the keyboard while it is open; Tab cannot leave it, and the opener receives focus when it closes."
      >
        <div className="pg-row">
          <Kbd>←</Kbd>
          <Kbd>→</Kbd>
          <span className="pg-muted">
            Previous / next
          </span>

          <Kbd>Home</Kbd>
          <Kbd>End</Kbd>
          <span className="pg-muted">First / last</span>

          <Kbd>Esc</Kbd>
          <span className="pg-muted">Close</span>
        </div>
      </Section>

      <Section
        title="Localized labels"
        hint="Counter, thumbnail names and every control accept localized copy."
      >
        <div className="pg-stack">
          <Button
            variant="secondary"
            onClick={() => setLocalizedOpen(true)}
          >
            Ouvrir la galerie
          </Button>

          <Lightbox
            images={gallery}
            open={localizedOpen}
            onOpenChange={setLocalizedOpen}
            aria-label="Galerie Pimolu"
            showThumbnails
            labels={{
              close: "Fermer",
              previous: "Image précédente",
              next: "Image suivante",
              thumbnails: "Choisir une image",
              counter: (position, total) =>
                `Image ${position} sur ${total}`,
              goTo: (position, total) =>
                `Afficher l’image ${position} sur ${total}`,
            }}
          />
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
