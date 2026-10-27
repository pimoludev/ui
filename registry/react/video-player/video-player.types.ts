
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  ReactEventHandler,
  ReactNode,
  VideoHTMLAttributes,
} from "react";

/* Public labels */

export interface PimoluVideoPlayerLabels {
  /** Accessible name of the whole player region. Defaults to "Video player". */
  player?: string;

  /** Name of the play button. Defaults to "Play". */
  play?: string;

  /** Name of the pause button. Defaults to "Pause". */
  pause?: string;

  /** Name of the mute button while the sound is on. Defaults to "Mute". */
  mute?: string;

  /** Name of the mute button while the sound is off. Defaults to "Unmute". */
  unmute?: string;

  /** Name of the volume slider. Defaults to "Volume". */
  volume?: string;

  /** Name of the timeline slider. Defaults to "Video timeline". */
  timeline?: string;

  /** Name of the fullscreen button. Defaults to "Enter fullscreen". */
  fullscreen?: string;

  /** Name of the fullscreen button while fullscreen. Defaults to "Exit fullscreen". */
  exitFullscreen?: string;
}

/* Public props */

export interface PimoluVideoPlayerProps
  extends Omit<
    VideoHTMLAttributes<HTMLVideoElement>,
    | "controls"
    | "children"
    | "className"
    | "onPlay"
    | "onPause"
    | "onEnded"
    | "onTimeUpdate"
    | "onLoadedMetadata"
    | "onVolumeChange"
    | "onDurationChange"
    | "onClick"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"video-player">;

  /** Video URL. Sources may also be provided through `captions`/native markup. */
  src?: string;

  /**
   * Captions and subtitles: typically one or more `<track>` elements. They
   * are rendered inside `<video>`, where the browser expects them.
   */
  captions?: ReactNode;

  /** Native fallback content rendered inside `<video>`. */
  fallback?: ReactNode;

  /** Poster shown before the first frame. */
  poster?: string;

  /**
   * Controlled playback state. Omit to let the player own it. Changing the
   * prop calls `play()` or `pause()` on the media element.
   */
  playing?: boolean;

  /** Called whenever playback starts or stops. */
  onPlayingChange?: (playing: boolean) => void;

  /** Initial muted state when the player mounts. Defaults to false. */
  muted?: boolean;

  /** Initial volume, from 0 to 1. Defaults to 1. */
  defaultVolume?: number;

  /** Seconds skipped by ArrowLeft and ArrowRight. Defaults to 5. */
  seekStep?: number;

  /** Render the fullscreen button when the browser supports it. Defaults to true. */
  showFullscreen?: boolean;

  /** Aspect ratio reserved for the video box, e.g. `16 / 9`. */
  aspectRatio?: number | string;

  /** Class applied to the player wrapper. */
  className?: string;

  /** Class applied to the native `<video>`. */
  videoClassName?: string;

  /** Localizable control labels. */
  labels?: PimoluVideoPlayerLabels;

  /** Called after the media metadata loads. */
  onLoadedMetadata?: ReactEventHandler<HTMLVideoElement>;

  /** Called while the playhead moves. */
  onTimeUpdate?: ReactEventHandler<HTMLVideoElement>;

  /** Called when the media starts playing. */
  onPlay?: ReactEventHandler<HTMLVideoElement>;

  /** Called when the media pauses. */
  onPause?: ReactEventHandler<HTMLVideoElement>;

  /** Called when the media ends. */
  onEnded?: ReactEventHandler<HTMLVideoElement>;

  /** Called when the volume or muted state changes. */
  onVolumeChange?: ReactEventHandler<HTMLVideoElement>;

  /** Called when the duration becomes known or changes. */
  onDurationChange?: ReactEventHandler<HTMLVideoElement>;

  /** Called when the video surface is clicked. Playback still toggles unless prevented. */
  onClick?: ReactEventHandler<HTMLVideoElement>;
}
