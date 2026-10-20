"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type SyntheticEvent,
} from "react";

import type {
  PimoluVideoPlayerLabels,
  PimoluVideoPlayerProps,
} from "./video-player.types";

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

/**
 * jsdom has no media pipeline: `play()` is a no-op that may return
 * `undefined` instead of a promise. Never assume the promise exists.
 */
function safePlay(media: HTMLVideoElement) {
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
    /* A detached media element can throw: the controls stay usable. */
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

function FullscreenIcon({
  active,
}: {
  active: boolean;
}) {
  return (
    <svg {...iconProps}>
      {active ? (
        <>
          <path d="M9 3v6H3" />
          <path d="M15 3v6h6" />
          <path d="M9 21v-6H3" />
          <path d="M15 21v-6h6" />
        </>
      ) : (
        <>
          <path d="M3 9V3h6" />
          <path d="M21 9V3h-6" />
          <path d="M3 15v6h6" />
          <path d="M21 15v6h-6" />
        </>
      )}
    </svg>
  );
}

/* =========================================
   VIDEO PLAYER
========================================= */

export const VideoPlayer = forwardRef<
  HTMLDivElement,
  PimoluVideoPlayerProps
>(function VideoPlayer(
  {
    src,
    poster,
    captions,
    fallback,

    playing: controlledPlaying,
    onPlayingChange,

    muted: initialMuted = false,
    defaultVolume = 1,

    seekStep = 5,
    showFullscreen = true,

    aspectRatio,

    autoPlay,
    loop,
    preload = "metadata",
    playsInline = true,

    labels,

    className,
    videoClassName,

    onLoadedMetadata,
    onTimeUpdate,
    onPlay,
    onPause,
    onEnded,
    onVolumeChange,
    onDurationChange,
    onClick,

    "aria-label": ariaLabel,

    ...props
  },
  forwardedRef
) {
  const mediaRef = useRef<HTMLVideoElement | null>(
    null
  );

  const rootRef = useRef<HTMLDivElement | null>(null);

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

  const [canFullscreen, setCanFullscreen] =
    useState(false);

  const [fullscreen, setFullscreen] =
    useState(false);

  /*
   * The media element and the UI can both change playback. Remembering the
   * last value we announced suppresses the duplicate callback that a native
   * `play` event would otherwise emit after our own click.
   */
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
      rootRef.current = node;

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

  /* Initial volume is a media property, not an HTML attribute. */

  useEffect(() => {
    const media = mediaRef.current;

    if (!media) return;

    media.volume = volume;
    media.muted = muted;
    // The values are intentionally read only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* A controlled `playing` prop drives the media element. */

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

  /* Fullscreen capability and the browser's own fullscreen state. */

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    setCanFullscreen(
      document.fullscreenEnabled === true ||
        typeof document.documentElement
          .requestFullscreen === "function"
    );

    function handleFullscreenChange() {
      setFullscreen(
        Boolean(document.fullscreenElement)
      );
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () =>
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
  }, []);

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

      /* Moving the slider restores the sound, as native players do. */
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

  async function toggleFullscreen() {
    const root = rootRef.current;

    if (!root || typeof document === "undefined") {
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen?.();
      } else {
        await root.requestFullscreen?.();
      }
    } catch {
      /* Fullscreen can be denied by the browser or an iframe policy. */
    }
  }

  function handleRootKeyDown(
    event: ReactKeyboardEvent<HTMLDivElement>
  ) {
    const target = event.target;

    /* Native inputs and buttons keep their own keyboard contract. */
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

      case "f":
      case "F":
        if (!canFullscreen) return;
        event.preventDefault();
        void toggleFullscreen();
        break;

      default:
        break;
    }
  }

  function handleLoadedMetadata(
    event: SyntheticEvent<HTMLVideoElement>
  ) {
    setDuration(
      normalizeDuration(event.currentTarget.duration)
    );

    onLoadedMetadata?.(event);
  }

  function handleDurationChange(
    event: SyntheticEvent<HTMLVideoElement>
  ) {
    setDuration(
      normalizeDuration(event.currentTarget.duration)
    );

    onDurationChange?.(event);
  }

  function handleTimeUpdate(
    event: SyntheticEvent<HTMLVideoElement>
  ) {
    setCurrentTime(event.currentTarget.currentTime);

    onTimeUpdate?.(event);
  }

  function handlePlay(
    event: SyntheticEvent<HTMLVideoElement>
  ) {
    commitPlaying(true);
    onPlay?.(event);
  }

  function handlePause(
    event: SyntheticEvent<HTMLVideoElement>
  ) {
    /*
     * A pause event also fires when playback ends. Keeping the state false
     * in both cases is what the controls show.
     */
    commitPlaying(false);
    onPause?.(event);
  }

  function handleEnded(
    event: SyntheticEvent<HTMLVideoElement>
  ) {
    commitPlaying(false);
    setCurrentTime(
      normalizeDuration(event.currentTarget.duration)
    );

    onEnded?.(event);
  }

  function handleVolumeChange(
    event: SyntheticEvent<HTMLVideoElement>
  ) {
    setVolume(event.currentTarget.volume);
    setMuted(event.currentTarget.muted);

    onVolumeChange?.(event);
  }

  function handleVideoClick(
    event: ReactMouseEvent<HTMLVideoElement>
  ) {
    onClick?.(event);

    if (event.defaultPrevented) return;

    requestPlayback(!isPlaying);
  }

  const resolvedLabels: Required<
    Omit<PimoluVideoPlayerLabels, "player">
  > & { player: string } = {
    player: labels?.player ?? ariaLabel ?? "Video player",
    play: labels?.play ?? "Play",
    pause: labels?.pause ?? "Pause",
    mute: labels?.mute ?? "Mute",
    unmute: labels?.unmute ?? "Unmute",
    volume: labels?.volume ?? "Volume",
    timeline: labels?.timeline ?? "Video timeline",
    fullscreen:
      labels?.fullscreen ?? "Enter fullscreen",
    exitFullscreen:
      labels?.exitFullscreen ?? "Exit fullscreen",
  };

  const currentLabel = formatTime(currentTime);
  const durationLabel = formatTime(duration);

  return (
    <div
      ref={setRootRef}
      role="group"
      aria-label={resolvedLabels.player}
      tabIndex={0}
      className={classes(
        "pimolu-video-player",
        className
      )}
      data-playing={isPlaying ? "true" : "false"}
      data-fullscreen={fullscreen ? "true" : "false"}
      style={{
        ...(aspectRatio !== undefined
          ? { aspectRatio }
          : {}),
      }}
      onKeyDown={handleRootKeyDown}
    >
      <video
        {...props}
        ref={mediaRef}
        className={classes(
          "pimolu-video-player__media",
          videoClassName
        )}
        src={src}
        poster={poster}
        preload={preload}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        onClick={handleVideoClick}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleDurationChange}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onVolumeChange={handleVolumeChange}
      >
        {captions}
        {fallback}
      </video>

      <div className="pimolu-video-player__controls">
        <div className="pimolu-video-player__row">
          <button
            type="button"
            className="pimolu-video-player__button pimolu-video-player__toggle"
            aria-label={
              isPlaying
                ? resolvedLabels.pause
                : resolvedLabels.play
            }
            onClick={() =>
              requestPlayback(!isPlaying)
            }
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <span className="pimolu-video-player__time">
            {currentLabel} / {durationLabel}
          </span>

          <input
            type="range"
            className="pimolu-native-range pimolu-video-player__timeline"
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

        <div className="pimolu-video-player__row pimolu-video-player__row--secondary">
          <button
            type="button"
            className="pimolu-video-player__button"
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

          <input
            type="range"
            className="pimolu-native-range pimolu-video-player__volume"
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

          {showFullscreen && canFullscreen && (
            <button
              type="button"
              className="pimolu-video-player__button pimolu-video-player__fullscreen"
              aria-label={
                fullscreen
                  ? resolvedLabels.exitFullscreen
                  : resolvedLabels.fullscreen
              }
              aria-pressed={fullscreen}
              onClick={() => void toggleFullscreen()}
            >
              <FullscreenIcon active={fullscreen} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

VideoPlayer.displayName = "PimoluVideoPlayer";
