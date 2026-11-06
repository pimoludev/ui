"use client";

import { Badge, Card, CardContent, Image, Link } from "@pimolu/react";

export function StudioHeroBlock() {
  return (
    <section className="mx-auto grid max-w-5xl gap-10 p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
      <div className="space-y-6">
        <Badge variant="primary">Independent by design</Badge>
        <h2 className="text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          A little clarity.
          <br />A lot of possibility.
        </h2>
        <p className="max-w-md text-muted leading-relaxed">
          Build a home for your next idea. Thoughtful details, familiar interactions and
          room for your own identity.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/docs/quick-start">Start building →</Link>
          <Link href="/components" variant="muted">
            Explore components
          </Link>
        </div>
      </div>
      <Card size="lg">
        <CardContent className="space-y-8">
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium">Studio / 001</span>
            <Badge variant="success">Open for ideas</Badge>
          </div>
          {/* Copy this asset into your public/images/blocks directory, or use your own photograph. */}
          <Image
            src="/images/blocks/studio-office.jpg"
            alt="A sunlit design studio with wooden walls and plants"
            aspectRatio="4 / 3"
            fit="cover"
            containerStyle={{ width: "100%" }}
          />
          <div>
            <h3 className="text-xl font-medium">Make it feel like you.</h3>
            <p className="mt-2 text-sm text-muted">
              One foundation. Your next chapter.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
