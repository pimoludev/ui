"use client";

import {
  Hero,
  Card,
  CardHeader,
  Badge,
  CardTitle,
  CardDescription,
  CardContent,
  Stat,
  Button,
  HeroContent,
  HeroEyebrow,
  HeroTitle,
  HeroDescription,
  HeroActions
} from "@pimolu/react";

function HeroPreview() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-3 min-w-0 justify-between">
          <Badge variant="secondary">Live preview</Badge>
          <span className="text-sm text-muted leading-relaxed">v1.0</span>
        </div>
        <CardTitle>Pimolu Studio</CardTitle>
        <CardDescription>A calmer surface for the design system.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 min-w-0">
          <Stat
            label="Components"
            value="129"
            delta="+17"
            trend="up"
            description="this iteration"
          />
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <Button size="sm">Open workspace</Button>
            <Button size="sm" appearance="outline">View source</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <Hero
            variant="gradient"
            media={<HeroPreview />}
            classNames={{
              root: "custom-hero-root",
              title: "custom-hero-title"
            }}
          >
            <HeroContent>
              <HeroEyebrow>Pimolu UI 1.0</HeroEyebrow>
              <HeroTitle as="h2">One design system for every surface</HeroTitle>
              <HeroDescription>
                Build the web and the app from the same tokens, components and
                accessibility contract. No translation layer, no second visual
                system.
              </HeroDescription>
              <HeroActions>
                <Button>Get started</Button>
                <Button appearance="outline">Read the docs</Button>
              </HeroActions>
            </HeroContent>
          </Hero>
        </>)
      }
      <style>
        {
          `
.custom-hero-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-hero-title {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
