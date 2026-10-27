"use client";

import { Carousel, Badge } from "@pimolu/react";

const highlights = [
  {
    title: "One design language",
    text: (
      "The same tokens, themes and components on web and native, " +
      "without a second visual system."
    ),
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

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <Carousel
            aria-label="Design system highlights"
            classNames={{
              root: "custom-carousel-root",
              control: "custom-carousel-control"
            }}
          >
            {
              highlights.map((highlight) => (<div
                key={highlight.title}
                className="min-w-0 rounded-lg border border-border p-6"
                style={{
                  minHeight: 200
                }}
              >
                <div className="grid gap-5 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 min-w-0">
                    <Badge variant="secondary">Highlight</Badge>
                  </div>
                  <h3>{highlight.title}</h3>
                  <p className="text-sm text-muted">{highlight.text}</p>
                </div>
              </div>))
            }
          </Carousel>
        </>)
      }
      <style>
        {
          `
.custom-carousel-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-carousel-control {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
