"use client";

import { AudioPlayer } from "@pimolu/react";

const EPISODE_SRC = "/media/design-notes-12.wav";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <AudioPlayer
            src={EPISODE_SRC}
            title="Design notes — episode 12"
            subtitle="Token pipelines without surprises · 16 sec sample"
            classNames={{
              root: "custom-audio-player-root",
              title: "custom-audio-player-title"
            }}
          />
        </>)
      }
      <style>
        {
          `
.custom-audio-player-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-audio-player-title {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
