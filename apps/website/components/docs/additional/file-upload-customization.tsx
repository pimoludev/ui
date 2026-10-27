"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  FileUpload
} from "@pimolu/react";

const PREVIEW_SVG = (
  "\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"240\" " +
  "height=\"160\" viewBox=\"0 0 240 160\">\n  <defs>\n    " +
  "<linearGradient id=\"bg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n      " +
  "<stop offset=\"0\" stop-color=\"#5B55E7\"/>\n      <stop offset=\"1\" " +
  "stop-color=\"#14B8A6\"/>\n    </linearGradient>\n  </defs>\n  <rect " +
  "width=\"240\" height=\"160\" rx=\"18\" fill=\"url(#bg)\"/>\n  <circle " +
  "cx=\"120\" cy=\"78\" r=\"44\" fill=\"rgb(255 255 255 / 24%)\"/>\n  <path " +
  "d=\"M72 116c16-34 40-50 72-50 13 0 24 2 34 7-10 28-37 45-75 51Z\" " +
  "fill=\"rgb(255 255 255 / 58%)\"/>\n  <circle cx=\"88\" cy=\"62\" r=\"9\" " +
  "fill=\"rgb(255 255 255 / 70%)\"/>\n</svg>\n"
);
const PDF_CONTENT = (
  "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 " +
  "obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\ntrailer\n<< " +
  "/Root 1 0 R >>\n%%EOF\n"
);
const previewImageFile = new File([PREVIEW_SVG], "brand-cover.svg", {
  type: "image/svg+xml",
  lastModified: 1700000000000,
});
const previewPdfFile = new File([PDF_CONTENT], "brand-notes.pdf", {
  type: "application/pdf",
  lastModified: 1700000000000,
});

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0 items-start"
          >
            <Card>
              <CardHeader>
                <CardTitle>Brand cover and notes</CardTitle>
                <CardDescription>
                  The SVG is previewed; the PDF keeps the document icon until it
                  is removed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  label="Campaign assets"
                  description="SVG, PNG or JPG, plus a short PDF."
                  accept=".pdf,image/*"
                  maxFiles={3}
                  defaultFiles={[
                    previewImageFile,
                    previewPdfFile,
                  ]}
                  classNames={{
                    root: "custom-file-upload-root",
                    label: "custom-file-upload-label"
                  }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Previews disabled</CardTitle>
                <CardDescription>showPreviews=false keeps the compact file icon.</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  label="Archive"
                  description="The file list stays icon-only."
                  accept="image/*"
                  defaultFiles={[previewImageFile]}
                  showPreviews={false}
                  classNames={{
                    root: "custom-file-upload-root",
                    label: "custom-file-upload-label"
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-file-upload-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-file-upload-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
