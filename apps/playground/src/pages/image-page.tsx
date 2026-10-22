import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Image,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const ratios = [
  { ratio: 16 / 9, label: "16 / 9 — hero" },
  { ratio: 4 / 3, label: "4 / 3 — editorial" },
  { ratio: 1, label: "1 / 1 — square" },
  { ratio: 3 / 4, label: "3 / 4 — portrait" },
];

const fits = [
  "cover",
  "contain",
  "fill",
  "scale-down",
] as const;

const radii = ["none", "sm", "md", "lg", "full"] as const;

export function ImagePage() {
  const [cachedVisible, setCachedVisible] = useState(false);
  return (
    <>
      <PageHeader
        title="Image"
        hint="A wrapper around <img> that reserves its box before the pixels arrive, shows a skeleton during loading and falls back gracefully on error. Legacy width/height attributes or an aspect ratio prevent layout shift; alt is required by the type."
      />

      <Section title="Cached images" hint="Reuse the image shown below: hide and show another instance to check that cached files reveal their content, not a lasting skeleton.">
        <div className="pg-stack">
          <Button appearance="outline" onClick={() => setCachedVisible((visible) => !visible)}>{cachedVisible ? "Hide cached image" : "Show cached image"}</Button>
          {cachedVisible && <Image src="/product.svg" alt="Cached Pimolu product" width={400} height={300} aspectRatio={4 / 3} />}
        </div>
      </Section>

      <Section
        title="Aspect ratios"
        hint="The wrapper reserves the box; the image fills it without shifting the page when it decodes."
      >
        <div className="pg-grid">
          {ratios.map((item) => (
            <div key={item.label} className="pg-stack">
              <Image
                src="/product.svg"
                alt={`Pimolu product illustration, ${item.label}`}
                aspectRatio={item.ratio}
                fit="cover"
                rounded="lg"
                width={400}
                height={300}
              />

              <span className="pg-meta">{item.label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Object fit"
        hint="A square box makes cover, contain, fill and scale-down visibly different."
      >
        <div className="pg-grid">
          {fits.map((fit) => (
            <Card key={fit}>
              <CardHeader>
                <CardTitle>{fit}</CardTitle>
                <CardDescription>
                  object-fit: {fit}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Image
                  src="/product.svg"
                  alt={`Product illustration with ${fit} fit`}
                  aspectRatio={1}
                  fit={fit}
                  rounded="md"
                  width={400}
                  height={300}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Rounded corners"
        hint="Radius comes from the shared tokens, so every preset keeps its own character."
      >
        <div className="pg-row">
          {radii.map((rounded) => (
            <div key={rounded} className="pg-stack">
              <Image
                src="/avatars/jean.svg"
                alt={`Avatar with ${rounded} corners`}
                aspectRatio={1}
                rounded={rounded}
                width={128}
                height={128}
                containerStyle={{ width: 96 }}
              />

              <span className="pg-meta">{rounded}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Loading, fallback and retry"
        hint="The skeleton covers the reserved box while loading. A broken source can retry a fallbackSrc, then show custom content or the built-in placeholder."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Skeleton</CardTitle>
              <CardDescription>
                Lazy loading on a capped container.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Image
                src="/product.svg"
                alt="Product illustration loading lazily"
                aspectRatio={16 / 9}
                loading="lazy"
                fit="cover"
                rounded="lg"
                width={400}
                height={300}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Broken source</CardTitle>
              <CardDescription>
                The placeholder keeps the image role and its alt text.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Image
                src="/missing-product.svg"
                alt="Product illustration that cannot load"
                aspectRatio={16 / 9}
                rounded="lg"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Retry, then custom fallback</CardTitle>
              <CardDescription>
                fallbackSrc is tried once before the custom content.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Image
                src="/missing-product.svg"
                fallbackSrc="/also-missing.svg"
                alt="Product illustration with two broken sources"
                aspectRatio={4 / 3}
                rounded="lg"
                fallback={
                  <span className="pg-stack">
                    <strong>Preview unavailable</strong>
                    <span className="pg-meta">
                      Upload a new file or try again later.
                    </span>
                  </span>
                }
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same wrapper."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <Image
              src="/product.svg"
              alt="Pimolu Studio product illustration"
              aspectRatio={16 / 9}
              fit="cover"
              rounded="none"
              width={400}
              height={300}
            />

            <CardHeader>
              <div className="pg-row pg-row--between">
                <CardTitle>Pimolu Studio</CardTitle>
                <Badge variant="success">In stock</Badge>
              </div>

              <CardDescription>
                A design-system starter with tokens, themes and
                cross-platform components.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-row pg-row--between">
                <span className="pg-price">€49</span>
                <span className="pg-meta">
                  Ships in 2–3 days
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="pg-row">
                <Image
                  src="/avatars/jean.svg"
                  alt="Portrait of Jean Dupont"
                  width={128}
                  height={128}
                  rounded="full"
                  containerStyle={{ width: 56 }}
                />

                <div>
                  <CardTitle>Jean Dupont</CardTitle>
                  <CardDescription>
                    Design engineer
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <Image
                  src="/product.svg"
                  alt="Recent work by Jean Dupont"
                  aspectRatio={4 / 3}
                  fit="cover"
                  rounded="md"
                  width={400}
                  height={300}
                />

                <span className="pg-meta">
                  Latest case study · 6 min read
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
