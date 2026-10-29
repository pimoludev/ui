import { Fragment } from "react";
import { Link } from "@/components/ui";
import { setupExampleId, type ComponentSetup as SetupContent } from "@/content/component-setups";
import { ExampleCard } from "./additional-examples";

function SetupParagraph({ text }: { text: string }) {
  return <p>{text.split(/(`[^`]+`)/g).map((part, index) =>
    part.startsWith("`")
      ? <code key={index}>{part.slice(1, -1)}</code>
      : <Fragment key={index}>{part}</Fragment>
  )}</p>;
}

export function ComponentSetup({ family, content }: { family: string; content: SetupContent }) {
  return <section id="setup" className="docs-section">
    <h2>{content.title}</h2>
    {content.paragraphs.map((text) => <SetupParagraph key={text} text={text} />)}
    {content.examples.map((example) => <Fragment key={example.filename}>
      {example.title && <h3 id={example.id}>{example.title}</h3>}
      {example.paragraphs?.map((text) => <SetupParagraph key={text} text={text} />)}
      <ExampleCard
        family={family}
        example={{
          id: setupExampleId(example.filename),
          title: example.title ?? content.title,
          description: "",
          origin: "Authored setup example",
        }}
        initialSource={example.code}
        filename={example.filename}
        showHeading={false}
        surface="setup"
      />
    </Fragment>)}
    {content.notes && <>
      <h3>Integration notes</h3>
      {content.notes.map((text) => <SetupParagraph key={text} text={text} />)}
    </>}
    <p>New to Pimolu? Follow the <Link href="/docs/quick-start">Quick start</Link> or the <Link href="/docs/nextjs">Next.js guide</Link> for the shared stylesheet and application provider.</p>
  </section>;
}
