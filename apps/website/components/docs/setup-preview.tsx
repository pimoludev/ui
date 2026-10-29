"use client";

import { useState } from "react";
import { PimoluProvider, usePimoluTheme } from "@pimolu/react";
import { setupExamples } from "@/content/generated/setup-loaders";

/** A local application provider lets setup controls change their preview only. */
export function SetupPreview({ family, exampleId }: { family: string; exampleId: string }) {
  const parent = usePimoluTheme();
  const [brandColor, setBrandColor] = useState(parent.brandColor);
  const key = `${family}/${exampleId}`;
  const Example = setupExamples[key as keyof typeof setupExamples];
  if (!Example) return null;
  return <PimoluProvider
    defaultTheme={parent.resolvedTheme}
    defaultStylePreset={parent.stylePreset}
    defaultRadius={parent.radius}
    defaultDensity={parent.density}
    brandColor={brandColor}
    onBrandColorChange={setBrandColor}
    persist={false}
  >
    <Example />
  </PimoluProvider>;
}
