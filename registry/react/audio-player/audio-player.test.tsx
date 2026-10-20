import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { AudioPlayer } from "./audio-player";

beforeEach(() => {
  vi.spyOn(
    HTMLMediaElement.prototype,
    "play"
  ).mockImplementation(() => Promise.resolve());

  vi.spyOn(
    HTMLMediaElement.prototype,
    "pause"
  ).mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

function metadata(
  audio: HTMLAudioElement,
  duration: number
) {
  Object.defineProperty(audio, "duration", {
    configurable: true,
    value: duration,
  });

  fireEvent.loadedMetadata(audio);
}

describe("Pimolu AudioPlayer", () => {
  it("renders a compact native audio player", () => {
    render(
      <AudioPlayer
        src="/audio/design-notes.mp3"
        title="Design notes"
        subtitle="Episode 12 · 3 min"
      />
    );

    const region = screen.getByRole("group", {
      name: "Design notes",
    });

    const audio = region.querySelector("audio")!;

    expect(audio).toHaveAttribute(
      "src",
      "/audio/design-notes.mp3"
    );
    expect(audio).not.toHaveAttribute("controls");
    expect(audio).toHaveAttribute(
      "preload",
      "metadata"
    );

    expect(
      screen.getByText("Design notes")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Episode 12 · 3 min")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Play" })
    ).toBeInTheDocument();
  });

  it("shows the duration once metadata arrives", () => {
    render(
      <AudioPlayer
        src="/audio/design-notes.mp3"
        title="Design notes"
      />
    );

    const audio =
      screen.getByRole("group", {
        name: "Design notes",
      }).querySelector("audio")!;

    const timeline = screen.getByRole("slider", {
      name: "Audio timeline",
    });

    expect(timeline).toBeDisabled();
    expect(
      screen.getByText("0:00 / 0:00")
    ).toBeInTheDocument();

    metadata(audio, 225);

    expect(timeline).toBeEnabled();
    expect(timeline).toHaveAttribute("max", "225");
    expect(
      screen.getByText("0:00 / 3:45")
    ).toBeInTheDocument();

    fireEvent.change(timeline, {
      target: { value: "45" },
    });

    expect(
      screen.getByText("0:45 / 3:45")
    ).toBeInTheDocument();
    expect(audio.currentTime).toBe(45);
  });

  it("toggles playback and reports changes", () => {
    const onPlayingChange = vi.fn();

    render(
      <AudioPlayer
        src="/audio/design-notes.mp3"
        title="Design notes"
        onPlayingChange={onPlayingChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Play" })
    );

    expect(
      screen.getByRole("button", { name: "Pause" })
    ).toBeInTheDocument();

    expect(onPlayingChange).toHaveBeenLastCalledWith(
      true
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Pause" })
    );

    expect(
      screen.getByRole("button", { name: "Play" })
    ).toBeInTheDocument();

    expect(onPlayingChange).toHaveBeenLastCalledWith(
      false
    );
  });

  it("follows a controlled playing prop", () => {
    const onPlayingChange = vi.fn();

    const { rerender } = render(
      <AudioPlayer
        src="/audio/design-notes.mp3"
        title="Design notes"
        playing={false}
        onPlayingChange={onPlayingChange}
      />
    );

    rerender(
      <AudioPlayer
        src="/audio/design-notes.mp3"
        title="Design notes"
        playing
        onPlayingChange={onPlayingChange}
      />
    );

    expect(
      screen.getByRole("button", { name: "Pause" })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Pause" })
    );

    expect(onPlayingChange).toHaveBeenCalledWith(false);

    expect(
      screen.getByRole("button", { name: "Pause" })
    ).toBeInTheDocument();
  });

  it("mutes and restores the sound from the volume slider", () => {
    render(
      <AudioPlayer src="/audio/design-notes.mp3" />
    );

    const audio =
      screen.getByRole("group", {
        name: "Audio player",
      }).querySelector("audio")!;

    fireEvent.click(
      screen.getByRole("button", { name: "Mute" })
    );

    expect(audio.muted).toBe(true);

    expect(
      screen.getByRole("button", {
        name: "Unmute",
      })
    ).toHaveAttribute("aria-pressed", "true");

    fireEvent.change(
      screen.getByRole("slider", { name: "Volume" }),
      { target: { value: "0.25" } }
    );

    expect(audio.volume).toBeCloseTo(0.25, 5);
    expect(audio.muted).toBe(false);

    expect(
      screen.getByRole("button", { name: "Mute" })
    ).toBeInTheDocument();
  });

  it("supports keyboard shortcuts", () => {
    render(
      <AudioPlayer src="/audio/design-notes.mp3" />
    );

    const region = screen.getByRole("group", {
      name: "Audio player",
    });

    const audio = region.querySelector("audio")!;

    metadata(audio, 100);

    fireEvent.keyDown(region, { key: " " });

    expect(
      screen.getByRole("button", { name: "Pause" })
    ).toBeInTheDocument();

    fireEvent.keyDown(region, {
      key: "ArrowLeft",
    });

    expect(
      screen.getByRole("slider", {
        name: "Audio timeline",
      })
    ).toHaveValue("0");

    fireEvent.keyDown(region, {
      key: "ArrowRight",
    });

    expect(
      screen.getByText("0:05 / 1:40")
    ).toBeInTheDocument();

    fireEvent.keyDown(region, { key: "M" });

    expect(audio.muted).toBe(true);
  });

  it("can hide the volume slider and the time", () => {
    render(
      <AudioPlayer
        src="/audio/design-notes.mp3"
        showVolume={false}
        showTime={false}
      />
    );

    expect(
      screen.queryByRole("slider", {
        name: "Volume",
      })
    ).toBeNull();

    expect(
      screen.queryByText("0:00 / 0:00")
    ).toBeNull();

    expect(
      screen.getByRole("button", { name: "Mute" })
    ).toBeInTheDocument();
  });

  it("localizes labels and accepts an explicit aria-label", () => {
    render(
      <AudioPlayer
        src="/audio/design-notes.mp3"
        aria-label="Lecteur audio"
        labels={{
          play: "Lecture",
          pause: "Pause",
          mute: "Couper le son",
          unmute: "Rétablir le son",
          timeline: "Progression audio",
          volume: "Volume sonore",
        }}
      />
    );

    expect(
      screen.getByRole("group", {
        name: "Lecteur audio",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Lecture" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("slider", {
        name: "Progression audio",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("slider", {
        name: "Volume sonore",
      })
    ).toBeInTheDocument();
  });

  it("resets the controls at the end of the track", () => {
    render(
      <AudioPlayer src="/audio/design-notes.mp3" />
    );

    const audio =
      screen.getByRole("group", {
        name: "Audio player",
      }).querySelector("audio")!;

    metadata(audio, 90);

    fireEvent.play(audio);

    expect(
      screen.getByRole("button", { name: "Pause" })
    ).toBeInTheDocument();

    fireEvent.ended(audio);

    expect(
      screen.getByRole("button", { name: "Play" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("1:30 / 1:30")
    ).toBeInTheDocument();
  });
});
