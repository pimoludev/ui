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

import { VideoPlayer } from "./video-player";

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

function setDuration(
  video: HTMLVideoElement,
  value: number
) {
  Object.defineProperty(video, "duration", {
    configurable: true,
    value,
  });
}

function metadata(video: HTMLVideoElement, duration: number) {
  setDuration(video, duration);
  fireEvent.loadedMetadata(video);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Pimolu VideoPlayer", () => {
  it("renders a native video without native controls", () => {
    render(
      <VideoPlayer
        src="/media/tour.mp4"
        poster="/media/tour.jpg"
        aria-label="Product tour"
        captions={
          <track
            kind="captions"
            src="/media/tour.vtt"
            srcLang="en"
            label="English"
          />
        }
      />
    );

    const video =
      screen.getByLabelText("Product tour")
        .querySelector("video")!;

    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("src", "/media/tour.mp4");
    expect(video).toHaveAttribute(
      "poster",
      "/media/tour.jpg"
    );
    expect(video).not.toHaveAttribute("controls");
    expect(video).toHaveAttribute(
      "preload",
      "metadata"
    );
    expect(
      video.querySelector("track[kind='captions']")
    ).toBeInTheDocument();
  });

  it("starts paused with a disabled timeline and a time readout", () => {
    render(<VideoPlayer src="/media/tour.mp4" />);

    expect(
      screen.getByRole("button", { name: "Play" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("slider", {
        name: "Video timeline",
      })
    ).toBeDisabled();

    expect(
      screen.getByText("0:00 / 0:00")
    ).toBeInTheDocument();
  });

  it("reads a cached video's duration when metadata is already available", () => {
    vi.spyOn(HTMLMediaElement.prototype, "duration", "get").mockReturnValue(4.1);

    render(<VideoPlayer src="/media/cached-tour.webm" />);

    expect(screen.getByText("0:00 / 0:04")).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Video timeline" })).toBeEnabled();
  });

  it("shows the duration and seeks with the timeline", () => {
    render(<VideoPlayer src="/media/tour.mp4" />);

    const video =
      screen.getByLabelText("Video player")
        .querySelector("video")!;

    metadata(video, 125);

    const timeline = screen.getByRole("slider", {
      name: "Video timeline",
    });

    expect(timeline).toBeEnabled();
    expect(timeline).toHaveAttribute("max", "125");
    expect(
      screen.getByText("0:00 / 2:05")
    ).toBeInTheDocument();

    fireEvent.change(timeline, {
      target: { value: "65" },
    });

    expect(
      screen.getByText("1:05 / 2:05")
    ).toBeInTheDocument();
    expect(video.currentTime).toBe(65);
  });

  it("toggles playback and reports the change once", () => {
    const onPlayingChange = vi.fn();

    render(
      <VideoPlayer
        src="/media/tour.mp4"
        onPlayingChange={onPlayingChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Play" })
    );

    expect(
      screen.getByRole("button", { name: "Pause" })
    ).toBeInTheDocument();

    expect(onPlayingChange).toHaveBeenCalledTimes(1);
    expect(onPlayingChange).toHaveBeenLastCalledWith(
      true
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Pause" })
    );

    expect(
      screen.getByRole("button", { name: "Play" })
    ).toBeInTheDocument();

    expect(onPlayingChange).toHaveBeenCalledTimes(2);
    expect(onPlayingChange).toHaveBeenLastCalledWith(
      false
    );
  });

  it("follows a controlled playing prop", () => {
    const onPlayingChange = vi.fn();

    const { rerender } = render(
      <VideoPlayer
        src="/media/tour.mp4"
        playing={false}
        onPlayingChange={onPlayingChange}
      />
    );

    rerender(
      <VideoPlayer
        src="/media/tour.mp4"
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

    /* The parent still owns the value. */
    expect(
      screen.getByRole("button", { name: "Pause" })
    ).toBeInTheDocument();
  });

  it("toggles mute and changes the volume", () => {
    render(<VideoPlayer src="/media/tour.mp4" />);

    const video =
      screen.getByLabelText("Video player")
        .querySelector("video")!;

    const mute = screen.getByRole("button", {
      name: "Mute",
    });

    fireEvent.click(mute);

    expect(
      screen.getByRole("button", {
        name: "Unmute",
      })
    ).toHaveAttribute("aria-pressed", "true");

    expect(video.muted).toBe(true);

    const volume = screen.getByRole("slider", {
      name: "Volume",
    });

    fireEvent.change(volume, {
      target: { value: "0.4" },
    });

    expect(video.volume).toBeCloseTo(0.4, 5);
    expect(video.muted).toBe(false);

    expect(
      screen.getByRole("button", { name: "Mute" })
    ).toBeInTheDocument();
  });

  it("supports keyboard shortcuts on the player region", () => {
    render(<VideoPlayer src="/media/tour.mp4" />);

    const region = screen.getByLabelText(
      "Video player"
    );

    const video =
      region.querySelector("video")!;

    metadata(video, 125);

    fireEvent.timeUpdate(video);

    fireEvent.keyDown(region, { key: " " });

    expect(
      screen.getByRole("button", { name: "Pause" })
    ).toBeInTheDocument();

    fireEvent.keyDown(region, {
      key: "ArrowRight",
    });

    expect(
      screen.getByText("0:05 / 2:05")
    ).toBeInTheDocument();

    fireEvent.keyDown(region, { key: "m" });

    expect(video.muted).toBe(true);

    fireEvent.keyDown(region, { key: " " });

    expect(
      screen.getByRole("button", { name: "Play" })
    ).toBeInTheDocument();
  });

  it("toggles playback from a click on the video", () => {
    render(<VideoPlayer src="/media/tour.mp4" />);

    const video =
      screen.getByLabelText("Video player")
        .querySelector("video")!;

    fireEvent.click(video);

    expect(
      screen.getByRole("button", { name: "Pause" })
    ).toBeInTheDocument();
  });

  it("resets the controls when the media ends", () => {
    render(<VideoPlayer src="/media/tour.mp4" />);

    const video =
      screen.getByLabelText("Video player")
        .querySelector("video")!;

    metadata(video, 65);

    fireEvent.play(video);

    expect(
      screen.getByRole("button", { name: "Pause" })
    ).toBeInTheDocument();

    fireEvent.ended(video);

    expect(
      screen.getByRole("button", { name: "Play" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("1:05 / 1:05")
    ).toBeInTheDocument();
  });

  it("hides fullscreen when the browser cannot enter it", () => {
    render(<VideoPlayer src="/media/tour.mp4" />);

    expect(
      screen.queryByRole("button", {
        name: /fullscreen/i,
      })
    ).toBeNull();
  });

  it("exposes fullscreen when the API is available", () => {
    const original = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "requestFullscreen"
    );

    const requestFullscreen = vi.fn(
      () => Promise.resolve()
    );

    Object.defineProperty(
      HTMLElement.prototype,
      "requestFullscreen",
      {
        configurable: true,
        value: requestFullscreen,
      }
    );

    try {
      render(<VideoPlayer src="/media/tour.mp4" />);

      const button = screen.getByRole("button", {
        name: "Enter fullscreen",
      });

      fireEvent.click(button);

      expect(requestFullscreen).toHaveBeenCalledTimes(
        1
      );
    } finally {
      if (original) {
        Object.defineProperty(
          HTMLElement.prototype,
          "requestFullscreen",
          original
        );
      } else {
        delete (
          HTMLElement.prototype as unknown as Record<
            string,
            unknown
          >
        ).requestFullscreen;
      }
    }
  });

  it("localizes the region and the controls", () => {
    render(
      <VideoPlayer
        src="/media/tour.mp4"
        aria-label="Lecteur vidéo"
        labels={{
          play: "Lecture",
          pause: "Pause",
          mute: "Couper le son",
          unmute: "Rétablir le son",
          timeline: "Progression de la vidéo",
          volume: "Volume du son",
        }}
      />
    );

    expect(
      screen.getByRole("group", {
        name: "Lecteur vidéo",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Lecture" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("slider", {
        name: "Progression de la vidéo",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("slider", {
        name: "Volume du son",
      })
    ).toBeInTheDocument();
  });
});
