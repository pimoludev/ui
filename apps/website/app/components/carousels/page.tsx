import type { Metadata } from "next";
import { Carousel } from "@pimolu/react";
import { Badge, Code, CodeBlock, Link, PageHeader } from "@/components/ui";
import { BreadcrumbData } from "@/components/structured-data";
import catalog from "@/content/generated/catalog.json";

export const metadata: Metadata = {
  title: "React Carousels: Choose the Right Layout",
  description:
    "Compare the Pimolu carousel families, pick the right layout and start with a minimal accessible example.",
  alternates: { canonical: "/components/carousels" },
};

const order = [
  "carousel",
  "thumbnail-carousel",
  "coverflow-carousel",
  "peek-carousel",
  "stack-carousel",
  "arc-carousel",
  "multi-carousel",
];

const choices = [
  {
    need: "Simple gallery with autoplay, pause, dots and controls",
    family: "carousel",
    why: "The smallest API. Start here when one carousel layout is enough.",
  },
  {
    need: "A main image with a thumbnail rail",
    family: "thumbnail-carousel",
    why: "The selected slide and every thumbnail share one active index.",
  },
  {
    need: "A centred cover with perspective neighbours",
    family: "coverflow-carousel",
    why: "Neighbours recede with scale, rotation and opacity.",
  },
  {
    need: "A centred card with neighbours peeking",
    family: "peek-carousel",
    why: "A scroll-snap rail that keeps both sides visible.",
  },
  {
    need: "A deck of cards, one on top",
    family: "stack-carousel",
    why: "Cards re-order behind the active one.",
  },
  {
    need: "A shallow fan of cards",
    family: "arc-carousel",
    why: "Cards spread along an arc and simplify on narrow screens.",
  },
  {
    need: "Several cards per page",
    family: "multi-carousel",
    why: "A scroll-snap rail that keeps column widths stable after filtering.",
  },
] as const;

const products = [
  { name: "Atlas", note: "One token contract for colour, type, spacing and radius." },
  { name: "Prism", note: "Six presets, light and dark, behind the same component API." },
  { name: "Signal", note: "Accessible primitives for dense product surfaces." },
];

const minimalExample = `import { Carousel } from "@pimolu/react";

const products = [
  { name: "Atlas", note: "One token contract for colour, type, spacing and radius." },
  { name: "Prism", note: "Six presets, light and dark, behind the same component API." },
  { name: "Signal", note: "Accessible primitives for dense product surfaces." },
];

export function Gallery() {
  return (
    <Carousel aria-label="Project highlights" loop>
      {products.map((product) => (
        <article
          key={product.name}
          className="grid min-h-40 content-end gap-2 rounded-[calc(var(--pimolu-radius-lg)+2px)] border border-border bg-surface p-6"
        >
          <h3>{product.name}</h3>
          <p className="text-sm text-muted">{product.note}</p>
        </article>
      ))}
    </Carousel>
  );
}`;

export default function CarouselsOverview() {
  const entries = order
    .map((family) => catalog.find((entry) => entry.family === family))
    .filter((entry): entry is (typeof catalog)[number] => Boolean(entry));
  const titleFor = (family: string) => entries.find((entry) => entry.family === family)?.title ?? family;

  return (
    <article className="space-y-12 pb-16">
      <BreadcrumbData
        items={[
          { name: "Components", path: "/components" },
          { name: "Carousels", path: "/components/carousels" },
        ]}
      />
      <PageHeader
        title="Carousels"
        description="Choose a carousel by the layout you need, then start from a small, accessible example. Every reference shares the same navigation, labels and named-part conventions."
      />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Which carousel should I choose?</h2>
        <p className="max-w-3xl text-sm text-muted">
          Start with <strong>Carousel</strong> when you need a complete gallery
          with autoplay. Choose a layout family when the visual arrangement is
          the point: each family shares one engine and focuses on composition.
        </p>
        <div className="hidden overflow-hidden rounded-xl border border-border sm:block">
          <table className="w-full table-fixed border-collapse text-sm">
            <thead>
              <tr className="bg-surface text-left">
                <th className="w-[42%] px-4 py-3 font-semibold">Need</th>
                <th className="w-[24%] px-4 py-3 font-semibold">Component</th>
                <th className="w-[34%] px-4 py-3 font-semibold">Why</th>
              </tr>
            </thead>
            <tbody>
              {choices.map((choice) => (
                <tr key={choice.family} className="border-t border-border align-top">
                  <td className="px-4 py-4">{choice.need}</td>
                  <td className="px-4 py-4">
                    <Link href={`/components/${choice.family}`} className="font-medium">
                      {titleFor(choice.family)}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-muted">{choice.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 sm:hidden">
          {choices.map((choice) => (
            <article key={choice.family} className="rounded-xl border border-border bg-surface p-4">
              <h3 className="font-medium">{choice.need}</h3>
              <Link href={`/components/${choice.family}`} className="mt-2 inline-block text-sm font-medium">
                {titleFor(choice.family)} ↗
              </Link>
              <p className="mt-2 text-sm text-muted">{choice.why}</p>
            </article>
          ))}
        </div>
        <p className="max-w-3xl text-sm text-muted">
          <strong>Simple or advanced?</strong> <Code>Carousel</Code> is the
          recommended entry point and owns autoplay, pause and the stable
          control contract. The six layout families deliberately leave autoplay
          out: compose your own timer when a layout needs it. All seven
          references use the same keyboard model, slide labels and reduced-motion
          behaviour.
        </p>
        <p className="max-w-3xl text-sm text-muted">
          In the current workspace, single-slide galleries omit navigation.
          <Link href="/components/multi-carousel"> MultiCarousel</Link> also
          hides its navigation when all cards fit and restores it on overflow.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Minimal example</h2>
          <p className="text-sm text-muted">
            Three slides, one loop and no extra state. Every direct child becomes
            a slide; the built-in controls and dots are ready to use.
          </p>
          <div className="rounded-2xl border border-border bg-background p-4">
            <Carousel aria-label="Project highlights" loop>
              {products.map((product) => (
                <article
                  key={product.name}
                  className="grid min-h-40 content-end gap-2 rounded-[calc(var(--pimolu-radius-lg)+2px)] border border-border bg-surface p-6"
                >
                  <h3>{product.name}</h3>
                  <p className="text-sm text-muted">{product.note}</p>
                </article>
              ))}
            </Carousel>
          </div>
        </div>
        <div className="min-w-0">
          <CodeBlock code={minimalExample} language="tsx" filename="gallery.tsx" wrap maxHeight={520} />
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold">Browse the references</h2>
          <p className="mt-2 text-sm text-muted">
            Each reference has its own live examples, customization guidance,
            generated API and source tests.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {entries.map((entry) => {
            const status = entry.status as { kind: "new" | "updated" | "deprecated" } | null;
            return <section key={entry.family} className="space-y-3">
              <Link href={entry.href} className="block">
                <span className="catalog-illustration">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/component-previews/${entry.family}-light.png`}
                    width={640}
                    height={400}
                    className="catalog-image-light w-full"
                    alt={`${entry.title} preview`}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/component-previews/${entry.family}-dark.png`}
                    width={640}
                    height={400}
                    className="catalog-image-dark w-full"
                    alt={`${entry.title} preview`}
                  />
                </span>
                <h3 className="mt-4 flex items-center gap-3 text-lg font-semibold">
                  {entry.title} ↗
                  {status && (
                    <Badge
                      variant={status.kind === "new" ? "success" : "primary"}
                      appearance="soft"
                      size="sm"
                    >
                      {status.kind === "new" ? "New" : "Updated"}
                    </Badge>
                  )}
                </h3>
              </Link>
              <p className="text-sm text-muted">{entry.description}</p>
            </section>;
          })}
        </div>
      </section>
    </article>
  );
}
