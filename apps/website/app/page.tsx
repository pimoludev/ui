import { Badge, Link } from "@/components/ui";
import { HomeReveal } from "@/components/home-reveal";
import { IdentityDemo, WorkspaceDemo } from "@/components/home-demos";
import { HomeComponentGallery, HomeDiscoveryStrip, HomeProductWorlds } from "@/components/home-discovery";
import { presetNames } from "@/lib/preferences";
import { StructuredData } from "@/components/structured-data";
import { websiteStructuredData } from "@/lib/structured-data";
import "./home.css";
import "./home-discovery.css";
export const metadata = { alternates: { canonical: "/" } };

const principles = [
  { number: "01", title: "The details are the design.", text: "Clear hierarchy. Deliberate spacing. States that feel connected. A shared visual language, from the smallest control to the whole application.", detail: "Tokens → themes → components" },
  { number: "02", title: "Built to be put together.", text: "Compose forms, navigation and data-rich views with familiar React APIs. Build on the existing pieces and keep control of your application.", detail: "React · TypeScript · plain CSS" },
  { number: "03", title: "Interaction comes included.", text: "Keyboard navigation, focus management and meaningful states live in the components. Your job is to give them a purpose.", detail: "Try the live examples" },
];

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="home-page">
      <StructuredData data={websiteStructuredData} />
      <section className="home-hero home-container" aria-labelledby="home-title">
        <div className="home-hero-label flex flex-wrap items-center gap-3"><Badge variant="primary" appearance="soft">Pimolu UI</Badge><span className="home-eyebrow">Precise. Personal. Yours.</span></div>
        <div className="home-hero-grid">
          <div>
            <h1 id="home-title" className="home-title">One system.<br /><span>Your identity.</span></h1>
            <p className="home-hero-description">Thoughtful React components.<br className="hidden sm:block" /> Endless room to make them your own.</p>
            <div className="mt-8 flex flex-wrap items-center gap-5"><Link href="/docs" className="home-cta">Start building <span aria-hidden="true">↗</span></Link><Link href="#live-demo" variant="muted">Explore the components <span aria-hidden="true">↓</span></Link></div>
            <p className="home-hero-footnote">Open source. Typed in TypeScript. Styled with Pimolu.</p>
          </div>
          <div className="home-identity-art" aria-hidden="true">
            <div className="home-art-grid" />
            <div className="home-art-coordinate">P / 001 <span>FORM & FUNCTION</span></div>
            <div className="home-art-glyph">p<span /></div>
            <div className="home-art-caption"><span>One foundation.</span><span>Every possibility. ↗</span></div>
          </div>
        </div>
      </section>

      <HomeDiscoveryStrip />

      <div className="home-foundations border-y border-border"><div className="home-container flex flex-wrap items-center justify-between gap-5 py-5"><span className="home-eyebrow">A system with room to grow</span><div className="flex flex-wrap gap-x-8 gap-y-2 text-sm"><span>React + Next.js</span><span>Shared design tokens</span><span>{presetNames.length} visual presets</span><span>Light & dark</span></div></div></div>

      <section id="live-demo" className="home-section home-container" aria-labelledby="demo-title">
        <HomeReveal>
          <div className="home-section-heading"><div><p className="home-eyebrow mb-3">01 / From primitives to product</p><h2 id="demo-title" className="home-section-title">Good pieces.<br />Better together.</h2></div><p className="home-section-description">An interface should feel like one idea. Explore a workspace built with the same Pimolu components you can use in your application.</p></div>
          <WorkspaceDemo />
          <div className="home-demo-caption flex flex-wrap justify-between gap-3"><span>INTERACTIVE COMPOSITION / WORKSPACE</span><span>Card · Stat · Tabs · Chart · Dialog · Table</span></div>
        </HomeReveal>
      </section>

      <HomeComponentGallery />

      <section className="home-principles border-y border-border" aria-label="The Pimolu approach"><div className="home-container grid gap-10 py-14 md:grid-cols-3">{principles.map((item) => <article className="home-principle" key={item.number}><span className="home-eyebrow text-primary">{item.number} /</span><h2 className="text-xl font-semibold tracking-tight mt-5">{item.title}</h2><p className="text-muted mt-4 leading-relaxed">{item.text}</p><p className="home-principle-detail">{item.detail}</p></article>)}</div></section>

      <section id="make-it-yours" className="home-section home-container" aria-labelledby="identity-title">
        <HomeReveal>
          <div className="home-section-heading"><div><p className="home-eyebrow mb-3">02 / Your point of view</p><h2 id="identity-title" className="home-section-title">Same foundation.<br />Different feeling.</h2></div><p className="home-section-description">Quiet and professional. Bold and playful. Start with a preset, explore light and dark, and let your product’s personality come through.</p></div>
          <IdentityDemo />
        </HomeReveal>
      </section>

      <HomeProductWorlds />

      <section className="home-closing" aria-labelledby="closing-title">
        <div className="home-container py-16 md:py-24">
          <p className="home-eyebrow">Made for what you have in mind.</p>
          <div className="flex flex-wrap items-end justify-between gap-8 mt-6">
            <h2 id="closing-title" className="home-section-title">Your next idea.<br /><span className="text-primary">Already taking shape.</span>
            </h2>
            <div className="flex flex-wrap items-center gap-6">
              <Link href="/docs" className="home-cta">Find your starting point <span aria-hidden="true">↗</span></Link>
              <Link href="https://github.com/pimoludev/ui" external variant="muted">View on GitHub</Link></div></div><p className="text-muted mt-8 max-w-2xl">Pimolu is growing in the open. Explore the source, try the components, and help shape what comes next.</p></div></section>
    </main>
  );
}
