"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type SyntheticEvent,
} from "react";

import type {
  PimoluAudioPlayerLabels,
  PimoluAudioPlayerProps,
} from "./audio-player.types";

/* =========================================
   HELPERS
========================================= */

function classes(
  ...values: Array<string | false | undefined>
) {
  return values.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return "0:00";
  }

  const total = Math.floor(value);

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  const paddedSeconds = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(
      2,
      "0"
    )}:${paddedSeconds}`;
  }

  return `${minutes}:${paddedSeconds}`;
}

function normalizeDuration(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function safePlay(media: HTMLAudioElement) {
  try {
    const result = media.play();

    if (
      result &&
      typeof (result as Promise<void>).catch === "function"
    ) {
      (result as Promise<void>).catch(() => {
        /* Autoplay policies are not an error for the UI. */
      });
    }
  } catch {
    /* Detached media elements may throw: the controls stay usable. */
  }
}

/* =========================================
   ICONS
========================================= */

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
} as const;

function PlayIcon() {
  return (
    <svg {...iconProps}>
      <path d="m8 5 11 7-11 7Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg {...iconProps}>
      <path d="M9 5v14" />
      <path d="M15 5v14" />
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <svg {...iconProps}>
      <path d="M11 5 6 9H3v6h3l5 4Z" />

      {muted ? (
        <>
          <path d="m16 9 5 6" />
          <path d="m21 9-5 6" />
        </>
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      )}
    </svg>
  );
}

/* =========================================
   AUDIO PLAYER
========================================= */

export const AudioPlayer = forwardRef<
  HTMLDivElement,
  PimoluAudioPlayerProps
>(function AudioPlayer(
  { classNames,
    src,
    title,
    subtitle,

    playing: controlledPlaying,
    onPlayingChange,

    muted: initialMuted = false,
    defaultVolume = 1,

    seekStep = 5,
    showVolume = true,
    showTime = true,

    autoPlay,
    loop,
    preload = "metadata",

    labels,

    className,
    audioClassName,

    onLoadedMetadata,
    onTimeUpdate,
    onPlay,
    onPause,
    onEnded,
    onVolumeChange,
    onDurationChange,

    "aria-label": ariaLabel,

    ...props
  },
  forwardedRef
) {
  const [partClasses, scopeParts] = usePartClasses("audio-player", classNames, true);

  const mediaRef = useRef<HTMLAudioElement | null>(
    null
  );

  const controlled = controlledPlaying !== undefined;

  const [internalPlaying, setInternalPlaying] =
    useState(false);

  const isPlaying = controlled
    ? controlledPlaying
    : internalPlaying;

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(() =>
    clamp(
      Number.isFinite(defaultVolume)
        ? defaultVolume
        : 1,
      0,
      1
    )
  );

  const [muted, setMuted] =
    useState(initialMuted);

  const announcedPlaying = useRef(
    controlledPlaying ?? false
  );

  const commitPlaying = useCallback(
    (next: boolean) => {
      if (announcedPlaying.current === next) {
        return;
      }

      announcedPlaying.current = next;

      if (!controlled) {
        setInternalPlaying(next);
      }

      onPlayingChange?.(next);
    },
    [controlled, onPlayingChange]
  );

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (
          forwardedRef as {
            current: HTMLDivElement | null;
          }
        ).current = node;
      }
    },
    [forwardedRef]
  );

  useEffect(() => {
    const media = mediaRef.current;

    if (!media) return;

    media.volume = volume;
    media.muted = muted;
    // The values are intentionally read only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A cached source may have metadata before React observes the media event.
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;
    const currentMedia = media;

    function syncDuration() {
      setDuration(normalizeDuration(currentMedia.duration));
    }

    syncDuration();
    media.addEventListener("loadedmetadata", syncDuration);
    media.addEventListener("durationchange", syncDuration);

    return () => {
      media.removeEventListener("loadedmetadata", syncDuration);
      media.removeEventListener("durationchange", syncDuration);
    };
  }, [src]);

  useEffect(() => {
    if (!controlled) return;

    announcedPlaying.current =
      controlledPlaying;

    const media = mediaRef.current;

    if (!media) return;

    if (controlledPlaying && media.paused) {
      safePlay(media);
    } else if (
      !controlledPlaying &&
      !media.paused
    ) {
      media.pause();
    }
  }, [controlled, controlledPlaying]);

  function requestPlayback(next: boolean) {
    const media = mediaRef.current;

    if (media) {
      if (next) {
        safePlay(media);
      } else {
        media.pause();
      }
    }

    commitPlaying(next);
  }

  function seekTo(value: number) {
    const media = mediaRef.current;

    const next =
      duration > 0
        ? clamp(value, 0, duration)
        : Math.max(0, value);

    if (media) {
      try {
        media.currentTime = next;
      } catch {
        /* A media element without a source can reject a seek. */
      }
    }

    setCurrentTime(next);
  }

  function handleSeek(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const next = event.currentTarget.valueAsNumber;

    if (!Number.isFinite(next)) return;

    seekTo(next);
  }

  function handleVolume(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const next = clamp(
      event.currentTarget.valueAsNumber,
      0,
      1
    );

    if (!Number.isFinite(next)) return;

    const media = mediaRef.current;

    if (media) {
      media.volume = next;

      if (next > 0 && media.muted) {
        media.muted = false;
      }

      setMuted(media.muted);
    }

    setVolume(next);
  }

  function toggleMute() {
    const media = mediaRef.current;
    const next = media ? !media.muted : !muted;

    if (media) {
      media.muted = next;
    }

    setMuted(next);
  }

  function handleRootKeyDown(
    event: ReactKeyboardEvent<HTMLDivElement>
  ) {
    const target = event.target;

    if (
      target instanceof HTMLElement &&
      target !== event.currentTarget &&
      target.closest(
        "input, button, a, select, textarea, [contenteditable='true']"
      )
    ) {
      return;
    }

    switch (event.key) {
      case " ":
      case "Spacebar":
      case "k":
      case "K":
        event.preventDefault();
        requestPlayback(!isPlaying);
        break;

      case "ArrowLeft":
        event.preventDefault();
        seekTo(currentTime - seekStep);
        break;

      case "ArrowRight":
        event.preventDefault();
        seekTo(currentTime + seekStep);
        break;

      case "m":
      case "M":
        event.preventDefault();
        toggleMute();
        break;

      default:
        break;
    }
  }

  function handleLoadedMetadata(
    event: SyntheticEvent<HTMLAudioElement>
  ) {
    setDuration(
      normalizeDuration(event.currentTarget.duration)
    );

    onLoadedMetadata?.(event);
  }

  function handleDurationChange(
    event: SyntheticEvent<HTMLAudioElement>
  ) {
    setDuration(
      normalizeDuration(event.currentTarget.duration)
    );

    onDurationChange?.(event);
  }

  function handleTimeUpdate(
    event: SyntheticEvent<HTMLAudioElement>
  ) {
    setCurrentTime(event.currentTarget.currentTime);

    onTimeUpdate?.(event);
  }

  function handlePlay(
    event: SyntheticEvent<HTMLAudioElement>
  ) {
    commitPlaying(true);
    onPlay?.(event);
  }

  function handlePause(
    event: SyntheticEvent<HTMLAudioElement>
  ) {
    commitPlaying(false);
    onPause?.(event);
  }

  function handleEnded(
    event: SyntheticEvent<HTMLAudioElement>
  ) {
    commitPlaying(false);

    setCurrentTime(
      normalizeDuration(event.currentTarget.duration)
    );

    onEnded?.(event);
  }

  function handleVolumeChange(
    event: SyntheticEvent<HTMLAudioElement>
  ) {
    setVolume(event.currentTarget.volume);
    setMuted(event.currentTarget.muted);

    onVolumeChange?.(event);
  }

  const resolvedLabels: Required<
    PimoluAudioPlayerLabels
  > = {
    player:
      labels?.player ?? ariaLabel ?? "Audio player",
    play: labels?.play ?? "Play",
    pause: labels?.pause ?? "Pause",
    mute: labels?.mute ?? "Mute",
    unmute: labels?.unmute ?? "Unmute",
    volume: labels?.volume ?? "Volume",
    timeline:
      labels?.timeline ?? "Audio timeline",
  };

  const regionLabel =
    ariaLabel ??
    title ??
    resolvedLabels.player;

  const currentLabel = formatTime(currentTime);
  const durationLabel = formatTime(duration);

  return scopeParts((
    <div
      ref={setRootRef}
      role="group"
      aria-label={regionLabel}
      tabIndex={0}
      className={mergeClasses(classes(
        "pimolu-audio-player",
        className
      ), partClasses.root)}
      data-playing={isPlaying ? "true" : "false"}
      onKeyDown={handleRootKeyDown}
    >
      <audio
        {...props}
        ref={mediaRef}
        className={mergeClasses(classes(
          "pimolu-audio-player__media",
          audioClassName
        ), partClasses.media)}
        src={src}
        preload={preload}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleDurationChange}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onVolumeChange={handleVolumeChange}
      />

      <div className={mergeClasses("pimolu-audio-player__surface", partClasses.surface)}>
        <button
          type="button"
          className={mergeClasses("pimolu-audio-player__toggle", partClasses.toggle)}
          aria-label={
            isPlaying
              ? resolvedLabels.pause
              : resolvedLabels.play
          }
          onClick={() => requestPlayback(!isPlaying)}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div className={mergeClasses("pimolu-audio-player__info", partClasses.info)}>
          {title && (
            <span className={mergeClasses("pimolu-audio-player__title", partClasses.title)}>
              {title}
            </span>
          )}

          {subtitle && (
            <span className={mergeClasses("pimolu-audio-player__subtitle", partClasses.subtitle)}>
              {subtitle}
            </span>
          )}
        </div>

        {showTime && (
          <span className={mergeClasses("pimolu-audio-player__time", partClasses.time)}>
            {currentLabel} / {durationLabel}
          </span>
        )}

        <div className={mergeClasses("pimolu-audio-player__volume-group", partClasses.volumeGroup)}>
          <button
            type="button"
            className={mergeClasses("pimolu-audio-player__mute", partClasses.mute)}
            aria-label={
              muted
                ? resolvedLabels.unmute
                : resolvedLabels.mute
            }
            aria-pressed={muted}
            onClick={toggleMute}
          >
            <VolumeIcon muted={muted} />
          </button>

          {showVolume && (
            <input
              type="range"
              className={mergeClasses("pimolu-native-range pimolu-audio-player__volume", partClasses.volume)}
              style={{
                "--pimolu-native-range-progress": `${volume * 100}%`,
              } as CSSProperties}
              min={0}
              max={1}
              step={0.05}
              value={volume}
              aria-label={resolvedLabels.volume}
              aria-valuetext={`${Math.round(
                volume * 100
              )}%`}
              onChange={handleVolume}
            />
          )}
        </div>

        <input
          type="range"
          className={mergeClasses("pimolu-native-range pimolu-audio-player__timeline", partClasses.timeline)}
          style={{
            "--pimolu-native-range-progress": `${duration > 0 ? (Math.min(currentTime, duration) / duration) * 100 : 0}%`,
          } as CSSProperties}
          min={0}
          max={duration > 0 ? duration : 0}
          step={0.1}
          value={
            duration > 0
              ? Math.min(currentTime, duration)
              : 0
          }
          disabled={duration <= 0}
          aria-label={resolvedLabels.timeline}
          aria-valuetext={
            duration > 0
              ? `${currentLabel} of ${durationLabel}`
              : undefined
          }
          onChange={handleSeek}
        />
      </div>
    </div>
  ));
});

AudioPlayer.displayName = "PimoluAudioPlayer";
