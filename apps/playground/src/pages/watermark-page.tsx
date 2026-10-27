import { CustomizationExample } from "./watermark-customization-demo";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Watermark,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const LOGO_TILE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><circle cx="48" cy="48" r="30" fill="none" stroke="#0f172a" stroke-width="4"/><path d="M36 62V34h13a9 9 0 0 1 0 18H36" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/></svg>`
)}`;

function FullscreenPreview() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="pg-stack">
      <Watermark
        text="DO NOT DISTRIBUTE · PREVIEW BUILD"
        fullscreen={enabled}
        opacity={0.07}
        gap={110}
        fontSize={16}
        rotate={-24}
      >
        <Card>
          <CardHeader>
            <CardTitle>Roadmap preview</CardTitle>
            <CardDescription>
              A fullscreen watermark covers the viewport while the
              page keeps scroll, focus and pointer behaviour.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="pg-copy">
              Toggle the layer to see it cover the entire viewport,
              not just this card. The layer is fixed, ignores pointer
              events and stays hidden from assistive technology.
            </p>
          </CardContent>

          <CardFooter>
            <Button
              size="sm"
              appearance={enabled ? "solid" : "outline"}
              onClick={() => setEnabled((value) => !value)}
            >
              {enabled
                ? "Hide fullscreen watermark"
                : "Show fullscreen watermark"}
            </Button>

            <Badge variant={enabled ? "warning" : "secondary"}>
              {enabled ? "Viewport wide" : "Card only"}
            </Badge>
          </CardFooter>
        </Card>
      </Watermark>
    </div>
  );
}

export function WatermarkPage() {
  return (
    <>
      <PageHeader
        title="Watermark"
        hint="A decorative, repeated layer above its content. Text tiles are generated as SVG data URLs, images repeat as-is, and the layer never takes pointer input or enters the accessibility tree."
      />

      <Section
        title="Text"
        hint="The default text tile repeats with a gap and a slight counter-clockwise rotation."
      >
        <Watermark text="CONFIDENTIAL">
          <Card>
            <CardHeader>
              <CardTitle>Invoice 2026-042</CardTitle>
              <CardDescription>
                Pimolu Studio · 14 May 2026
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="pg-copy">
                Design system audit, component library maintenance
                and documentation. This preview is watermarked for
                internal review only.
              </p>
            </CardContent>

            <CardFooter>
              <Badge variant="primary">€ 4,800.00</Badge>
              <Badge variant="secondary">Paid</Badge>
            </CardFooter>
          </Card>
        </Watermark>
      </Section>

      <Section
        title="Appearance"
        hint="Opacity, rotation, gap, size, colour and font family are tuned per surface. Values are also exposed as --pimolu-watermark-* variables."
      >
        <div className="pg-grid pg-grid--start">
          <Watermark
            text="DRAFT · INTERNAL REVIEW"
            opacity={0.12}
            rotate={-12}
            gap={56}
            fontSize={13}
            color="#1d4ed8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Draft manuscript</CardTitle>
                <CardDescription>
                  Blue, dense, almost horizontal.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="pg-copy">
                  Chapter 3 — The component contract. Every public
                  prop has a default, a documented state and a
                  matching playground example.
                </p>
              </CardContent>
            </Card>
          </Watermark>

          <Watermark
            text="Do not share"
            opacity={0.16}
            rotate={-32}
            gap={32}
            fontSize={12}
            color="#9a3412"
            fontFamily="Georgia, serif"
          >
            <Card>
              <CardHeader>
                <CardTitle>Pricing worksheet</CardTitle>
                <CardDescription>
                  Warm, tight and diagonal.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="pg-copy">
                  Legacy plan comparison for the migration meeting.
                  Numbers are placeholders and must not be quoted.
                </p>
              </CardContent>
            </Card>
          </Watermark>
        </div>
      </Section>

      <Section
        title="Image"
        hint="An image URL or data URL repeats as the tile. The gap sets the tile size in this mode."
      >
        <Watermark image={LOGO_TILE} gap={96} opacity={0.1}>
          <Card>
            <CardHeader>
              <CardTitle>Brand assets</CardTitle>
              <CardDescription>
                Exported marks for the press kit.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="pg-copy">
                The Pimolu monogram repeats across the sheet. Use a
                transparent PNG or SVG so the surface colour shows
                through the tile.
              </p>
            </CardContent>

            <CardFooter>
              <Badge variant="success">Approved</Badge>
              <Badge variant="secondary">SVG</Badge>
            </CardFooter>
          </Card>
        </Watermark>
      </Section>

      <Section
        title="Fullscreen"
        hint="fullscreen fixes the layer to the viewport, keeps it behind pointer interaction and removes it in forced-colours mode."
      >
        <FullscreenPreview />
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
