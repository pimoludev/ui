
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  AudioHTMLAttributes,
  ReactEventHandler,
  ReactNode,
} from "react";

export interface PimoluAudioPlayerLabels {
  /** Accessible name when neither `aria-label` nor `title` is given. */
  player?: string;

  /** Defaults to "Play". */
  play?: string;

  /** Defaults to "Pause". */
  pause?: string;

  /** Defaults to "Mute". */
  mute?: string;

  /** Defaults to "Unmute". */
  unmute?: string;

  /** Defaults to "Volume". */
  volume?: string;

  /** Defaults to "Audio timeline". */
  timeline?: string;
}

export interface PimoluAudioPlayerProps
  extends Omit<
    AudioHTMLAttributes<HTMLAudioElement>,
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
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"audio-player">;

  /** Audio URL. */
  src: string;

  /** Track name, also used as the accessible name of the player. */
  title?: string;

  /** Artist, album or a short description under the title. */
  subtitle?: ReactNode;

  /**
   * Controlled playback state. Omit to let the player own it.
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

  /** Show the volume slider next to the mute button. Defaults to true. */
  showVolume?: boolean;

  /** Show the current and total time. Defaults to true. */
  showTime?: boolean;

  /** Class applied to the player wrapper. */
  className?: string;

  /** Class applied to the native `<audio>`. */
  audioClassName?: string;

  /** Localizable control labels. */
  labels?: PimoluAudioPlayerLabels;

  onLoadedMetadata?: ReactEventHandler<HTMLAudioElement>;
  onTimeUpdate?: ReactEventHandler<HTMLAudioElement>;
  onPlay?: ReactEventHandler<HTMLAudioElement>;
  onPause?: ReactEventHandler<HTMLAudioElement>;
  onEnded?: ReactEventHandler<HTMLAudioElement>;
  onVolumeChange?: ReactEventHandler<HTMLAudioElement>;
  onDurationChange?: ReactEventHandler<HTMLAudioElement>;
}
