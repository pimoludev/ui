"use client";

import { Button, Lightbox, type PimoluLightboxImage } from "@pimolu/react";
import { useState } from "react";

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

export function CustomizationExample() {
  const [basicOpen, setBasicOpen] = useState(false);
  return (
    <>
      {
        (<>
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
              classNames={{ root: "custom-lightbox-root" }}
            />
          </div>
        </>)
      }
      <style>
        {
          `
.custom-lightbox-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
