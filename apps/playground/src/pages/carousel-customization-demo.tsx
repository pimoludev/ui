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

export function CustomizationExample() {

  return (
    <>
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
              highlights.map((highlight) => (
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
              ))
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
    </>
  );
}
