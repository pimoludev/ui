import { useState } from "react";

import {
  AudioPlayer,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const EPISODE_SRC = "/media/design-notes-12.mp3";

const episodes = [
  {
    title: "Token pipelines without surprises",
    subtitle: "Episode 12 · 18 min",
    src: "/media/design-notes-12.mp3",
  },
  {
    title: "One API for web and native",
    subtitle: "Episode 11 · 24 min",
    src: "/media/design-notes-11.mp3",
  },
  {
    title: "Auditing themes in practice",
    subtitle: "Episode 10 · 16 min",
    src: "/media/design-notes-10.mp3",
  },
];

export function AudioPlayerPage() {
  const [playing, setPlaying] = useState(false);

  return (
    <>
      <PageHeader
        title="AudioPlayer"
        hint="A compact audio player built on the native <audio> element: play/pause, seek bar, current/duration, mute and volume. The layout collapses cleanly on narrow screens and every control has an accessible name. The demo uses placeholder media paths."
      />

      <Section
        title="Episode"
        hint="The title doubles as the accessible name of the player unless an explicit aria-label is given."
      >
        <AudioPlayer
          src={EPISODE_SRC}
          title="Design notes — episode 12"
          subtitle="Token pipelines without surprises · 18 min"
        />
      </Section>

      <Section
        title="Minimal"
        hint="Hide the volume slider and the time readout when space is tight; the mute button and the seek bar remain."
      >
        <AudioPlayer
          src={EPISODE_SRC}
          title="Quick note"
          subtitle="A 30-second update"
          showVolume={false}
          showTime={false}
        />
      </Section>

      <Section
        title="Controlled playback"
        hint="`playing` and `onPlayingChange` let a parent coordinate several players, a transcript or an external transport bar."
      >
        <div className="pg-stack">
          <AudioPlayer
            src={EPISODE_SRC}
            title="Design notes — episode 12"
            subtitle="Controlled by the badge below"
            playing={playing}
            onPlayingChange={setPlaying}
          />

          <div className="pg-row pg-row--between">
            <Badge
              variant={playing ? "success" : "neutral"}
            >
              {playing ? "Playing" : "Paused"}
            </Badge>

            <span className="pg-meta">
              External state: {String(playing)}
            </span>
          </div>
        </div>
      </Section>

      <Section
        title="Localized labels"
        hint="All control labels can be translated; the native control names never leak into the UI."
      >
        <AudioPlayer
          src={EPISODE_SRC}
          title="Notes de design — épisode 12"
          subtitle="Pipelines de jetons sans surprise"
          labels={{
            play: "Lecture",
            pause: "Pause",
            mute: "Couper le son",
            unmute: "Rétablir le son",
            volume: "Volume sonore",
            timeline: "Progression de l’épisode",
            player: "Lecteur de podcast",
          }}
        />
      </Section>

      <Section
        title="Playlist"
        hint="Several players share the same compact surface. Give each one a distinct title so the group is readable out of context."
      >
        <div className="pg-stack">
          {episodes.map((episode) => (
            <Card key={episode.src}>
              <CardHeader>
                <CardTitle>{episode.title}</CardTitle>
                <CardDescription>
                  {episode.subtitle}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <AudioPlayer
                  src={episode.src}
                  title={episode.title}
                  subtitle={episode.subtitle}
                  showTime={false}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
