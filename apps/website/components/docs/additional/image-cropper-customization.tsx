"use client";

import {
  type PimoluCropArea,
  type PimoluImageCropperLabels,
  ImageCropper,
  Badge,
  Code,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@pimolu/react";
import { useState } from "react";

const CROPPER_SRC = "/images/pimolu-studio.webp";

function CropperDemo({ aspectRatio, defaultCrop, defaultZoom, disabled, labels, }: {
  aspectRatio?: number;
  defaultCrop?: PimoluCropArea;
  defaultZoom?: number;
  disabled?: boolean;
  labels?: PimoluImageCropperLabels;
}) {
  const [crop, setCrop] = useState<PimoluCropArea>(defaultCrop ?? {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  });
  const [result, setResult] = useState<string | null>(null);
  return (
    <div className="grid gap-5 min-w-0">
      <ImageCropper
        src={CROPPER_SRC}
        alt="Pimolu Studio product illustration"
        aspectRatio={aspectRatio}
        defaultCrop={defaultCrop}
        defaultZoom={defaultZoom}
        disabled={disabled}
        labels={labels}
        onChange={setCrop}
        onComplete={(blob, area) => {
          if(!blob) {
            setResult("Canvas output is unavailable in this environment.");
            return;
          }
          setResult(`${blob.type || "image"} · ${Math.max(
            1,
            Math.round(blob.size / 1024)
          )} KB · ${Math.round(area.width)}% × ${Math.round(area.height)}%`);
        }}
        classNames={{ root: "custom-image-cropper-root" }}
      />
      <div className="flex flex-wrap items-center gap-3 min-w-0">
        <Badge variant="secondary">
          x {crop.x}%
        </Badge>
        <Badge variant="secondary">
          y {crop.y}%
        </Badge>
        <Badge variant="secondary">
          {crop.width}% ×{" "}
          {crop.height}%
        </Badge>
        {
          result && (<Badge variant="success">
            {result}
          </Badge>)
        }
      </div>
      <Code block>
        {JSON.stringify(crop, null, 2)}
      </Code>
    </div>
  );
}

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0 items-start"
          >
            <CropperDemo
              aspectRatio={1}
              defaultCrop={{
                x: 10,
                y: 10,
                width: 80,
                height: 80,
              }}
              defaultZoom={1.4}
            />
            <Card>
              <CardHeader>
                <CardTitle>What the callbacks receive</CardTitle>
                <CardDescription>
                  onChange fires on every move, resize and reset. onComplete runs
                  only when the crop button is pressed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted">
                  <li>
                    Coordinates are percentages of the stage, so they survive layout
                    changes.
                  </li>
                  <li>aspectRatio locks both the stage and the crop rectangle.</li>
                  <li>
                    The export uses naturalWidth and naturalHeight, then draws the
                    selected pixels into a canvas.
                  </li>
                  <li>
                    Keyboard: arrows move, handle arrows resize, Shift uses larger
                    steps.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-image-cropper-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
