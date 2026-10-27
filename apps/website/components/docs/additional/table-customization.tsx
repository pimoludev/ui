"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  Badge,
  TableCell,
  TableFooter
} from "@pimolu/react";

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

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <Card>
            <CardHeader>
              <CardTitle>Plans</CardTitle>
              <CardDescription>
                USD, billed monthly. Unused seats roll over for 30 days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table
                caption="Plan comparison (USD, billed monthly)"
                classNames={{
                  root: "custom-table-root",
                  row: "custom-table-row"
                }}
              >
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead aria-sort="ascending" style={{ textAlign: "end" }}>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    plans.map((plan) => (<TableRow key={plan.name}>
                      <TableHead scope="row">
                        {plan.name}
                        {
                          plan.name === "Pro" && (<Badge variant="primary" size="sm">Popular</Badge>)
                        }
                      </TableHead>
                      <TableCell>
                        {plan.seats}
                      </TableCell>
                      <TableCell>
                        {plan.storage}
                      </TableCell>
                      <TableCell style={{ textAlign: "end" }}>
                        {plan.price}
                      </TableCell>
                    </TableRow>))
                  }
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Three plans, one workspace</TableCell>
                    <TableCell style={{ textAlign: "end" }}>$128</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </>)
      }
      <style>
        {
          `
.custom-table-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-table-row {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
