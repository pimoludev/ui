import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const plans = [
  {
    name: "Starter",
    seats: "1",
    storage: "5 GB",
    price: "$0",
  },
  {
    name: "Pro",
    seats: "20",
    storage: "100 GB",
    price: "$29",
  },
  {
    name: "Scale",
    seats: "Unlimited",
    storage: "1 TB",
    price: "$99",
  },
];

const orders = [
  {
    id: "PM-1042",
    customer: "Ada Lovelace",
    status: "Paid",
    tone: "success" as const,
    total: "$128.00",
  },
  {
    id: "PM-1041",
    customer: "Grace Hopper",
    status: "Pending",
    tone: "warning" as const,
    total: "$64.00",
  },
  {
    id: "PM-1040",
    customer: "Tim Berners-Lee",
    status: "Refunded",
    tone: "danger" as const,
    total: "$29.00",
  },
  {
    id: "PM-1039",
    customer: "Margaret Hamilton",
    status: "Paid",
    tone: "success" as const,
    total: "$312.00",
  },
  {
    id: "PM-1038",
    customer: "Linus Torvalds",
    status: "Paid",
    tone: "success" as const,
    total: "$99.00",
  },
];

const densities = ["sm", "md", "lg"] as const;

export function TablePage() {
  return (
    <>
      <PageHeader
        title="Table"
        hint="Semantic table primitives with a horizontal-scroll wrapper, three densities, striped, bordered and sticky-header treatments, captions and native table attributes. Styles come from @pimolu/web-styles/table.css."
      />

      <Section
        title="Pricing table"
        hint="TableHeader, TableBody and TableFooter keep the native table structure; a row header names each plan."
      >
        <Card>
          <CardHeader>
            <CardTitle>Plans</CardTitle>
            <CardDescription>
              USD, billed monthly. Unused seats roll over for
              30 days.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table caption="Plan comparison (USD, billed monthly)">
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Storage</TableHead>
                  <TableHead
                    aria-sort="ascending"
                    style={{ textAlign: "end" }}
                  >
                    Price
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.name}>
                    <TableHead scope="row">
                      {plan.name}

                      {plan.name === "Pro" && (
                        <Badge
                          variant="primary"
                          size="sm"
                        >
                          Popular
                        </Badge>
                      )}
                    </TableHead>

                    <TableCell>{plan.seats}</TableCell>
                    <TableCell>{plan.storage}</TableCell>

                    <TableCell
                      style={{ textAlign: "end" }}
                    >
                      {plan.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>
                    Three plans, one workspace
                  </TableCell>

                  <TableCell
                    style={{ textAlign: "end" }}
                  >
                    $128
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Densities"
        hint="sm, md and lg change padding, body type and header type together."
      >
        <div className="pg-grid pg-grid--start">
          {densities.map((density) => (
            <Card key={density}>
              <CardHeader>
                <CardTitle>{density}</CardTitle>
              </CardHeader>

              <CardContent>
                <Table density={density}>
                  <TableCaption>
                    {density} deployment environments
                  </TableCaption>

                  <TableHeader>
                    <TableRow>
                      <TableHead>Environment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Region</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    <TableRow>
                      <TableHead scope="row">
                        production
                      </TableHead>
                      <TableCell>
                        <Badge variant="success">
                          ready
                        </Badge>
                      </TableCell>
                      <TableCell>eu-west-3</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableHead scope="row">
                        staging
                      </TableHead>
                      <TableCell>
                        <Badge variant="warning">
                          building
                        </Badge>
                      </TableCell>
                      <TableCell>eu-west-3</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Treatments"
        hint="striped alternates body rows; bordered draws cell borders. They compose."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Striped</CardTitle>
            </CardHeader>

            <CardContent>
              <Table striped>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell>space-2</TableCell>
                    <TableCell>8px</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>space-4</TableCell>
                    <TableCell>16px</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>radius-md</TableCell>
                    <TableCell>8px</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bordered and striped</CardTitle>
            </CardHeader>

            <CardContent>
              <Table bordered striped density="sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>Breakpoint</TableHead>
                    <TableHead>Width</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell>sm</TableCell>
                    <TableCell>640px</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>md</TableCell>
                    <TableCell>768px</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>lg</TableCell>
                    <TableCell>1024px</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Sticky header"
        hint="A constrained wrapper scrolls vertically while the header stays in place. The wrapper is focusable for keyboard scrolling."
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>
              The last five orders in the workspace.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table
              stickyHeader
              striped
              containerProps={{
                style: { maxHeight: 260 },
              }}
            >
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead
                    style={{ textAlign: "end" }}
                  >
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableHead scope="row">
                      {order.id}
                    </TableHead>

                    <TableCell>
                      {order.customer}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={order.tone}
                        size="sm"
                      >
                        {order.status}
                      </Badge>
                    </TableCell>

                    <TableCell
                      style={{ textAlign: "end" }}
                    >
                      {order.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>
                    Total captured
                  </TableCell>

                  <TableCell
                    style={{ textAlign: "end" }}
                  >
                    $632.00
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
