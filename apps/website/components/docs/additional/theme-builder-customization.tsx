"use client";

import {
  ThemeBuilder,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  CardContent,
  Button
} from "@pimolu/react";

const presets = [
  {
    id: "default",
    label: "Default",
    description: "Balanced indigo with soft depth.",
    colors: ["#4F46E5", "#818CF8", "#E0E7FF", "#F8FAFC"],
  },
  {
    id: "monochrome",
    label: "Monochrome",
    description: "Ink, paper and a single accent.",
    colors: ["#171717", "#525252", "#D4D4D4", "#FAFAFA"],
  },
  {
    id: "cartoon",
    label: "Cartoon",
    description: "Playful colour and confident outlines.",
    colors: ["#FF5C8A", "#FFD166", "#06D6A0", "#118AB2"],
  },
  {
    id: "glass",
    label: "Glass",
    description: "Translucent surfaces and cool light.",
    colors: ["#38BDF8", "#A5B4FC", "#E0F2FE", "#F8FAFC"],
  },
  {
    id: "luxury",
    label: "Luxury",
    description: "Warm neutrals, gold and quiet contrast.",
    colors: ["#926A35", "#E8CF9B", "#241F1A", "#FAF6EF"],
  },
  {
    id: "neo-brutalism",
    label: "Neo-brutalism",
    description: "Hard edges, offset shadows, loud accents.",
    colors: ["#FFE600", "#FF5C8A", "#171717", "#FFFFFF"],
  },
];

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <ThemeBuilder
            title="Appearance"
            presets={presets}
            defaultValue="glass"
            preview={<Card
              className="min-w-0 rounded-lg border border-border p-6"
            >
              <CardHeader>
                <div
                  className="flex flex-wrap items-center gap-3 min-w-0 justify-between"
                >
                  <div>
                    <CardTitle>Atlas Cloud</CardTitle>
                    <CardDescription>A project workspace inside the selected theme.</CardDescription>
                  </div>
                  <Badge variant="success" appearance="soft">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-3 min-w-0">
                  <Button size="sm">Create project</Button>
                  <Button size="sm" appearance="outline">Invite teammate</Button>
                </div>
              </CardContent>
            </Card>}
            classNames={{
              root: "custom-theme-builder-root",
              label: "custom-theme-builder-label"
            }}
          />
        </>)
      }
      <style>
        {
          `
.custom-theme-builder-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-theme-builder-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
