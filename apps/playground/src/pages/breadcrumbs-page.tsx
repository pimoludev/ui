import { CustomizationExample } from "./breadcrumbs-customization-demo";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

export function BreadcrumbsPage() {
  return (
    <>
      <PageHeader
        title="Breadcrumbs"
        hint="A navigation landmark listing the path to the current page. Links stay muted, the current page is marked with aria-current, and separators are hidden from assistive technology. Styles come from @pimolu/web-styles/breadcrumbs.css."
      />

      <Section
        title="Basic"
        hint="The last item is the current page, not a link."
      >
        <Breadcrumbs>
          <BreadcrumbItem>
            <BreadcrumbLink href="#/overview">
              Overview
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink href="#/card">
              Components
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumbs</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumbs>
      </Section>

      <Section
        title="Custom separator"
        hint="Any node can replace the default slash; it stays decorative."
      >
        <Breadcrumbs>
          <BreadcrumbItem>
            <BreadcrumbLink href="#/overview">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator>›</BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbLink href="#/card">
              Library
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator>›</BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbPage>
              Navigation and display
            </BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumbs>
      </Section>

      <Section
        title="Long path"
        hint="The list wraps on narrow containers instead of overflowing."
      >
        <Breadcrumbs label="Current location">
          <BreadcrumbItem>
            <BreadcrumbLink href="#/overview">Pimolu UI</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink href="#/overview">
              Documentation
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink href="#/overview">
              Components
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink href="#/overview">
              Navigation
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumbs</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumbs>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
