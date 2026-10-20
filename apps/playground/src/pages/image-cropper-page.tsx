import { useState } from "react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Code,
  ImageCropper,
  type PimoluCropArea,
  type PimoluImageCropperLabels,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const CROPPER_SRC = "/product.svg";

function CropperDemo({
  aspectRatio,
  defaultCrop,
  defaultZoom,
  disabled,
  labels,
}: {
  aspectRatio?: number;
  defaultCrop?: PimoluCropArea;
  defaultZoom?: number;
  disabled?: boolean;
  labels?: PimoluImageCropperLabels;
}) {
  const [crop, setCrop] = useState<PimoluCropArea>(
    defaultCrop ?? { x: 0, y: 0, width: 100, height: 100 }
  );

  const [result, setResult] = useState<string | null>(
    null
  );

  return (
    <div className="pg-stack">
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
          if (!blob) {
            setResult(
              "Canvas output is unavailable in this environment."
            );
            return;
          }

          setResult(
            `${blob.type || "image"} · ${Math.max(
              1,
              Math.round(blob.size / 1024)
            )} KB · ${Math.round(
              area.width
            )}% × ${Math.round(area.height)}%`
          );
        }}
      />

      <div className="pg-row">
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

        {result && (
          <Badge variant="success">{result}</Badge>
        )}
      </div>

      <Code block>
        {JSON.stringify(crop, null, 2)}
      </Code>
    </div>
  );
}

export function ImageCropperPage() {
  return (
    <>
      <PageHeader
        title="ImageCropper"
        hint="A dependency-free cropper with pointer and keyboard handles, a zoom slider and a canvas export. The stage uses the source ratio unless aspectRatio locks the crop. Crop coordinates are percentages of the visible stage; onComplete receives a Blob (or null when a canvas is unavailable) and the final crop."
      />

      <Section
        title="Square avatar"
        hint="Drag the crop area to move it, drag a handle to resize it, or use the arrow keys. Shift moves by five percent. The default zoom enlarges the image inside the stage without changing the crop rectangle."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
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
              <CardTitle>
                What the callbacks receive
              </CardTitle>
              <CardDescription>
                onChange fires on every move, resize
                and reset. onComplete runs only when the
                crop button is pressed.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="pg-muted">
                <li>
                  Coordinates are percentages of the
                  stage, so they survive layout changes.
                </li>
                <li>
                  aspectRatio locks both the stage and
                  the crop rectangle.
                </li>
                <li>
                  The export uses naturalWidth and
                  naturalHeight, then draws the selected
                  pixels into a canvas.
                </li>
                <li>
                  Keyboard: arrows move, handle arrows
                  resize, Shift uses larger steps.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Cover crop"
        hint="A 16 / 9 stage with a locked ratio is ready for a hero image. The stage crops the source with object-fit: cover and maps the visible rectangle back to the source pixels on export."
      >
        <CropperDemo
          aspectRatio={16 / 9}
          defaultCrop={{
            x: 5,
            y: 5,
            width: 90,
            height: 90,
          }}
        />
      </Section>

      <Section
        title="Free crop and disabled state"
        hint="Without aspectRatio, width and height resize independently. The same component can be disabled while an upload or a save is in flight."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <CropperDemo
            defaultCrop={{
              x: 15,
              y: 10,
              width: 60,
              height: 55,
            }}
          />

          <CropperDemo
            defaultCrop={{
              x: 20,
              y: 20,
              width: 60,
              height: 60,
            }}
            disabled
          />
        </div>
      </Section>

      <Section
        title="Profile photo"
        hint="A localized composition for an account settings page. Every handle label, the zoom control, the reset and the crop action are translatable."
      >
        <Card>
          <CardHeader>
            <div className="pg-row pg-row--between">
              <Badge variant="primary">
                Account
              </Badge>

              <span className="pg-meta">
                PNG · square · 512 px
              </span>
            </div>

            <CardTitle>Profile photo</CardTitle>

            <CardDescription>
              Choose the part of the image shown next
              to your name.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <CropperDemo
              aspectRatio={1}
              defaultCrop={{
                x: 12,
                y: 12,
                width: 76,
                height: 76,
              }}
              labels={{
                cropper: "Recadreur de photo",
                instructions:
                  "Déplacez le cadre ou utilisez les flèches. Tirez une poignée pour redimensionner ; Maj accélère le déplacement.",
                cropArea: "Zone de recadrage",
                zoom: "Agrandissement",
                reset: "Réinitialiser",
                apply: "Enregistrer la photo",
                resizeTopLeft:
                  "Redimensionner en haut à gauche",
                resizeTop: "Redimensionner en haut",
                resizeTopRight:
                  "Redimensionner en haut à droite",
                resizeRight:
                  "Redimensionner à droite",
                resizeBottomRight:
                  "Redimensionner en bas à droite",
                resizeBottom:
                  "Redimensionner en bas",
                resizeBottomLeft:
                  "Redimensionner en bas à gauche",
                resizeLeft:
                  "Redimensionner à gauche",
              }}
            />
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
