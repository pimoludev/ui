"use client";

import { Button, Lightbox, type PimoluLightboxImage } from "@pimolu/react";
import { useState } from "react";

const gallery: PimoluLightboxImage[] = [
  {
    src: "/images/pimolu-studio.webp",
    alt: "Pimolu Studio product illustration",
    caption: "Pimolu Studio — one design language for web and native.",
    thumbnail: "/images/pimolu-studio.webp",
  },
  {
    src: "/images/pimolu-avatar.svg",
    alt: "Pimolu p emblem on an indigo avatar",
    caption: "Jean Dupont · Design engineer",
    thumbnail: "/images/pimolu-avatar.svg",
  },
  {
    src: "/images/pimolu-studio.webp",
    alt: "Pimolu Studio illustration, detail view",
    caption: "Every preset shares the same component API.",
    thumbnail: "/images/pimolu-studio.webp",
  },
];

export function DemoExample() {
  const [basicOpen, setBasicOpen] = useState(false);
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <Button onClick={() => setBasicOpen(true)}>Open gallery</Button>
            <span className="text-sm text-muted leading-relaxed">Three images · thumbnails · no loop</span>
            <Lightbox
              images={gallery}
              open={basicOpen}
              onOpenChange={setBasicOpen}
              showThumbnails
              classNames={{
                root: "custom-lightbox-root"
              }}
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
    </div>
  );
}
