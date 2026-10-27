import { CustomizationExample } from "./video-player-customization-demo";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Kbd,
  VideoPlayer,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

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

export function VideoPlayerPage() {
  const [playing, setPlaying] = useState(false);

  return (
    <>
      <PageHeader
        title="VideoPlayer"
        hint="A native <video> with accessible custom controls: play/pause, timeline, mute, volume, fullscreen and a time readout. `playing` can be controlled, and this demo includes a short original video with captions."
      />

      <Section
        title="Product tour"
        hint="The video keeps a 16 / 9 box while it loads. The timeline is disabled until metadata arrives; the time readout is tabular so it does not jitter."
      >
        <VideoPlayer
          src={TOUR_SRC}
          poster={TOUR_POSTER}
          aspectRatio={16 / 9}
          captions={<Captions />}
          aria-label="Pimolu product tour"
          labels={{
            timeline: "Product tour timeline",
          }}
        />
      </Section>

      <Section
        title="Controlled playback"
        hint="The parent owns `playing`. Every media event and control click reports through `onPlayingChange`, so an external action bar can drive the same playback state."
      >
        <div className="pg-stack">
          <VideoPlayer
            src={TOUR_SRC}
            poster={TOUR_POSTER}
            aspectRatio={16 / 9}
            playing={playing}
            onPlayingChange={setPlaying}
            aria-label="Controlled product tour"
          />

          <div className="pg-row pg-row--between">
            <Badge
              variant={playing ? "success" : "neutral"}
            >
              {playing ? "Playing" : "Paused"}
            </Badge>

            <div className="pg-row">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setPlaying(false)}
              >
                Pause from outside
              </Button>

              <Button
                size="sm"
                onClick={() =>
                  setPlaying((value) => !value)
                }
              >
                {playing ? "Pause" : "Play"}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Muted autoplay and a square frame"
        hint="Muted autoplay is the only autoplay browsers reliably allow. `aspectRatio` can reserve any frame; `showFullscreen={false}` keeps the control bar minimal."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <VideoPlayer
            src={TOUR_SRC}
            poster={TOUR_POSTER}
            aspectRatio={1}
            autoPlay
            loop
            muted
            defaultVolume={0.6}
            showFullscreen={false}
            aria-label="Square product loop"
          />

          <Card>
            <CardHeader>
              <CardTitle>Keyboard shortcuts</CardTitle>
              <CardDescription>
                Focus the player region, then use the
                keys below. The timeline and volume
                sliders keep their native keyboard
                behaviour.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <div className="pg-row">
                  <Kbd>Space</Kbd>
                  <span className="pg-muted">
                    Play or pause
                  </span>
                </div>

                <div className="pg-row">
                  <Kbd>←</Kbd>
                  <Kbd>→</Kbd>
                  <span className="pg-muted">
                    Seek by five seconds
                  </span>
                </div>

                <div className="pg-row">
                  <Kbd>M</Kbd>
                  <span className="pg-muted">
                    Mute or restore the sound
                  </span>
                </div>

                <div className="pg-row">
                  <Kbd>F</Kbd>
                  <span className="pg-muted">
                    Enter or leave fullscreen when
                    available
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Course lesson"
        hint="A real-world composition: the player sits above the lesson notes, with a localized control bar and a captions track."
      >
        <Card>
          <CardHeader>
            <div className="pg-row pg-row--between">
              <Badge variant="primary">
                Lesson 3
              </Badge>

              <span className="pg-meta">
                4 sec · Captions available
              </span>
            </div>

            <CardTitle>
              Designing with semantic tokens
            </CardTitle>

            <CardDescription>
              How one palette feeds every preset, mode
              and platform.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="pg-stack">
              <VideoPlayer
                src={TOUR_SRC}
                poster={TOUR_POSTER}
                captions={<Captions />}
                aria-label="Lesson: designing with semantic tokens"
                labels={{
                  play: "Lecture",
                  pause: "Pause",
                  mute: "Couper le son",
                  unmute: "Rétablir le son",
                  volume: "Volume",
                  timeline: "Progression de la leçon",
                  fullscreen: "Plein écran",
                  exitFullscreen:
                    "Quitter le plein écran",
                  player:
                    "Leçon : concevoir avec des jetons sémantiques",
                }}
              />

              <p className="pg-muted">
                The player is a drop-in replacement for
                the native control bar: it keeps the
                native media pipeline, captions and
                fullscreen, and only replaces the
                chrome.
              </p>
            </div>
          </CardContent>
        </Card>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
