import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DescriptionItem,
  DescriptionList,
} from "@pimolu/react";

import {
  descriptionListLayouts,
  descriptionListSizes,
  descriptionListVariants,
} from "../demo-data";
import { PageHeader, Section } from "../section";

export function DescriptionListPage() {
  return (
    <>
      <PageHeader
        title="DescriptionList"
        hint="A native dl for property/value pairs, with stacked or inline layouts, plain, divided or bordered treatments and three densities. Styles come from @pimolu/web-styles/description-list.css."
      />

      <Section
        title="Layouts"
        hint="stacked puts the term above the value; inline puts them side by side."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          {descriptionListLayouts.map((layout) => (
            <Card key={layout}>
              <CardHeader>
                <CardTitle>{layout}</CardTitle>
              </CardHeader>

              <CardContent>
                <DescriptionList layout={layout}>
                  <DescriptionItem
                    term="Status"
                    details={<Badge variant="success">Active</Badge>}
                  />
                  <DescriptionItem
                    term="Owner"
                    details="Ada Lovelace"
                  />
                  <DescriptionItem
                    term="Region"
                    details="eu-west-3"
                  />
                </DescriptionList>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Variants"
        hint="Enumerated from descriptionListVariantMap: plain, divided and bordered."
      >
        <div className="pg-grid pg-grid--start">
          {descriptionListVariants.map((variant) => (
            <Card key={variant}>
              <CardHeader>
                <CardTitle>{variant}</CardTitle>
              </CardHeader>

              <CardContent>
                <DescriptionList
                  variant={variant}
                  layout="inline"
                >
                  <DescriptionItem term="Plan" details="Pro" />
                  <DescriptionItem term="Seats" details="12" />
                  <DescriptionItem
                    term="Renewal"
                    details="19 Oct 2026"
                  />
                </DescriptionList>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Sizes"
        hint="Enumerated from descriptionListVariantMap: sm, md and lg."
      >
        <div className="pg-stack">
          {descriptionListSizes.map((size) => (
            <div key={size} className="pg-stack">
              <span className="pg-meta">{size}</span>

              <DescriptionList
                size={size}
                layout="inline"
              >
                <DescriptionItem
                  term="Status"
                  details="Active"
                />
                <DescriptionItem
                  term="Owner"
                  details="Ada Lovelace"
                />
              </DescriptionList>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Property panels normally pair the list with a heading and actions."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>
                Settings that do not fit in a form.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <DescriptionList variant="divided" layout="inline">
                <DescriptionItem
                  term="Plan"
                  details="Pro"
                />
                <DescriptionItem
                  term="Seats"
                  details="12 of 20"
                />
                <DescriptionItem
                  term="Storage"
                  details="42 GB of 100 GB"
                />
                <DescriptionItem
                  term="Region"
                  details="eu-west-3"
                />
                <DescriptionItem
                  term="Renewal"
                  details="19 Oct 2026"
                />
              </DescriptionList>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deployment</CardTitle>
              <CardDescription>
                A bordered list for a compact summary.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <DescriptionList variant="bordered">
                <DescriptionItem
                  term="Environment"
                  details="production"
                />
                <DescriptionItem
                  term="Commit"
                  details={<code>fde3d86</code>}
                />
                <DescriptionItem
                  term="Status"
                  details={<Badge variant="success">ready</Badge>}
                />
              </DescriptionList>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
