import { CustomizationExample } from "./skeleton-customization-demo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@pimolu/react";

import {
  skeletonAnimations,
  skeletonShapes,
} from "../demo-data";
import { PageHeader, Section } from "../section";

export function SkeletonPage() {
  return (
    <>
      <PageHeader
        title="Skeleton"
        hint="A placeholder for content that is still loading. Shapes and animations are enumerated from skeletonVariantMap; the styles come from @pimolu/web-styles/skeleton.css."
      />

      <Section
        title="Shapes"
        hint="text, rectangular, rounded and circular."
      >
        <div className="pg-stack">
          {skeletonShapes.map((shape) => (
            <div key={shape} className="pg-demo-item">
              <span className="pg-meta">{shape}</span>

              {shape === "circular" ? (
                <Skeleton
                  shape={shape}
                  animation="none"
                  width={48}
                  height={48}
                />
              ) : (
                <Skeleton
                  shape={shape}
                  animation="none"
                  width="100%"
                  height={16}
                />
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Animations"
        hint="pulse, wave and none. Both stop automatically under prefers-reduced-motion."
      >
        <div className="pg-grid">
          {skeletonAnimations.map((animation) => (
            <div key={animation} className="pg-demo-item">
              <span className="pg-meta">{animation}</span>
              <Skeleton
                animation={animation}
                width="100%"
                height={48}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Dimensions"
        hint="A number means pixels; a string accepts any CSS unit."
      >
        <div className="pg-stack">
          <Skeleton width={200} height={20} animation="none" />
          <Skeleton width="75%" height="1rem" animation="none" />
          <Skeleton width="12rem" height={32} animation="none" />
          <Skeleton
            shape="circular"
            width={48}
            height={48}
            animation="none"
          />
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Article</CardTitle>
              <CardDescription>
                A card waiting for its content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                <Skeleton
                  shape="rounded"
                  width="100%"
                  height={140}
                  animation="wave"
                />
                <Skeleton
                  width="60%"
                  height={20}
                  animation="wave"
                />
                <Skeleton width="100%" animation="wave" />
                <Skeleton width="88%" animation="wave" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                The skeletons stay hidden from assistive
                technology; one status announces the loading.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                <p role="status">Loading profile…</p>

                <div className="pg-row">
                  <Skeleton
                    shape="circular"
                    width={48}
                    height={48}
                  />

                  <div className="pg-demo-item pg-grow">
                    <Skeleton width="60%" height={16} />
                    <Skeleton width="40%" height={14} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>List</CardTitle>
              <CardDescription>
                Repeating rows while a collection loads.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                {[0, 1, 2].map((row) => (
                  <div key={row} className="pg-row">
                    <Skeleton
                      shape="circular"
                      width={36}
                      height={36}
                    />

                    <div className="pg-demo-item pg-grow">
                      <Skeleton width="45%" height={14} />
                      <Skeleton width="75%" height={12} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
