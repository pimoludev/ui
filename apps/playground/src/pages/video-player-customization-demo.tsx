"use client";

import { VideoPlayer } from "@pimolu/react";

const TOUR_SRC = "/media/pimolu-tour.webm";

const TOUR_POSTER = "/product.svg";

function Captions() {
  return (
    <track
      kind="captions"
      src="/media/pimolu-tour.en.vtt"
      srcLang="en"
      label="English"
    />
  );
}

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <VideoPlayer
            src={TOUR_SRC}
            poster={TOUR_POSTER}
            aspectRatio={16 / 9}
            captions={<Captions />}
            aria-label="Pimolu product tour"
            labels={{
              timeline: "Product tour timeline",
            }}
            classNames={{
              root: "custom-video-player-root",
              row: "custom-video-player-row"
            }}
          />
        </>)
      }
      <style>
        {
          `
.custom-video-player-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-video-player-row {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
