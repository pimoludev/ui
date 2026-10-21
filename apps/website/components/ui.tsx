"use client";

// The registry exports source TS; this explicit boundary keeps its hooks on
// the client while pages and metadata remain Server Components.
export {
  Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription,
  CodeBlock, DocsLayout, Footer, Link, PageHeader, ApiTable, TableOfContents, Alert,
  DescriptionList, DescriptionItem, Code,
} from "@pimolu/react";
