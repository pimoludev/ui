import { CustomizationExample } from "./pagination-customization-demo";
import { useState } from "react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Pagination,
} from "@pimolu/react";

import { paginationSizes } from "../demo-data";
import { PageHeader, Section } from "../section";

function ControlledPagination() {
  const [page, setPage] = useState(4);

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Badge variant="primary">page {page}</Badge>

        <span className="pg-meta">of 20</span>
      </div>

      <Pagination
        page={page}
        pageCount={20}
        onPageChange={setPage}
      />
    </div>
  );
}

export function PaginationPage() {
  return (
    <>
      <PageHeader
        title="Pagination"
        hint="A navigation landmark for long result sets. It generates page buttons, keeps first/last pages visible, adds ellipses when needed, and exposes aria-current on the active page. Styles come from @pimolu/web-styles/pagination.css."
      />

      <Section
        title="Controlled"
        hint="page and onPageChange keep the current page in the page."
      >
        <ControlledPagination />
      </Section>

      <Section
        title="Sizes"
        hint="Enumerated from paginationVariantMap: sm, md and lg."
      >
        <div className="pg-stack">
          {paginationSizes.map((size) => (
            <div key={size} className="pg-stack">
              <span className="pg-meta">{size}</span>

              <Pagination
                pageCount={12}
                defaultPage={5}
                size={size}
                aria-label={`Pagination, ${size}`}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Few pages and labels"
        hint="With five pages there is no ellipsis; the arrow labels can be localised."
      >
        <Pagination
          pageCount={5}
          defaultPage={3}
          previousLabel="Page précédente"
          nextLabel="Page suivante"
        />
      </Section>

      <Section
        title="Examples"
        hint="A result footer normally pairs the pagination with a count."
      >
        <Card>
          <CardHeader>
            <CardTitle>Search results</CardTitle>
            <CardDescription>
              120 components, 10 per page.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="pg-row pg-row--between">
              <span className="pg-meta">
                Showing 41–50 of 120
              </span>

              <Pagination
                pageCount={12}
                defaultPage={5}
                size="sm"
              />
            </div>
          </CardContent>
        </Card>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
