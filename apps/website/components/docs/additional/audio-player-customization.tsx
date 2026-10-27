"use client";

import { AudioPlayer } from "@pimolu/react";

const EPISODE_SRC = "/sounds/action-game.mp3";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <AudioPlayer
            src={EPISODE_SRC}
            title="Action game"
            subtitle="Pimolu / Play | local soundtrack"
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
    </div>
  );
}
