import { CustomizationExample } from "./pdf-viewer-customization-demo";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PDFViewer,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const PDF_SRC = "/documents/pimolu-brand-guidelines.pdf";

export function PDFViewerPage() {
  return (
    <>
      <PageHeader
        title="PDFViewer"
        hint="An <object> embed with a toolbar for opening and downloading the file. Browsers with a built-in PDF viewer render the included two-page sample document; others show fallback links. The standard #page fragment selects an initial page."
      />

      <Section
        title="Brand guidelines"
        hint="The toolbar keeps the title readable while the document keeps its own scroll area. A numeric height maps to pixels."
      >
        <PDFViewer
          src={PDF_SRC}
          title="Pimolu brand guidelines"
          height={560}
          downloadFileName="pimolu-brand-guidelines.pdf"
          initialPage={2}
        />
      </Section>

      <Section
        title="Without the toolbar"
        hint="The embed can stand alone when the page already provides its own heading and actions."
      >
        <PDFViewer
          src={PDF_SRC}
          title="Brand guidelines — reading view"
          height={360}
          showToolbar={false}
          downloadable={false}
        />
      </Section>

      <Section
        title="CSS height"
        hint="`height` accepts a number of pixels or any CSS length, so a document can follow the viewport."
      >
        <PDFViewer
          src={PDF_SRC}
          title="Brand guidelines — viewport height"
          height="60vh"
          openInNewTab={false}
        />
      </Section>

      <Section
        title="Custom fallback"
        hint="When the browser cannot display PDFs inline, the children of the object take over. Replace the default copy with product-specific help."
      >
        <PDFViewer
          src={PDF_SRC}
          title="Brand guidelines — custom fallback"
          downloadable={false}
          openInNewTab={false}
          fallback={
            <div className="pg-stack">
              <strong>
                This preview needs a PDF viewer.
              </strong>
              <p className="pg-muted">
                Download the guidelines or open them in
                your system viewer.
              </p>

              <a href={PDF_SRC} download>
                Download the guidelines
              </a>
            </div>
          }
        />
      </Section>

      <Section
        title="Document card"
        hint="A real-world composition: the viewer and its metadata share a card, and the toolbar actions stay inside the document surface."
      >
        <Card>
          <CardHeader>
            <div className="pg-row pg-row--between">
              <Badge variant="secondary">
                Internal
              </Badge>

              <span className="pg-meta">
                2 pages · Demo document
              </span>
            </div>

            <CardTitle>Brand guidelines</CardTitle>

            <CardDescription>
              Logos, colour, typography and motion for
              every Pimolu UI preset.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <PDFViewer
              src={PDF_SRC}
              title="Brand guidelines — document card"
              height={420}
              downloadFileName="pimolu-brand-guidelines.pdf"
            />
          </CardContent>
        </Card>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
