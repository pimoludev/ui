"use client";

import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@pimolu/react";

export function TableExample() {
  return <Table caption="Workspace projects" striped>
    <TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
    <TableBody><TableRow><TableHead scope="row">Atlas</TableHead><TableCell><Badge variant="success">Live</Badge></TableCell></TableRow><TableRow><TableHead scope="row">Orbit</TableHead><TableCell><Badge variant="warning">Review</Badge></TableCell></TableRow></TableBody>
  </Table>;
}
