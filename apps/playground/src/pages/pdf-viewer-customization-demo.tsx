"use client";

import { PDFViewer } from "@pimolu/react";

const PDF_SRC = "/documents/pimolu-brand-guidelines.pdf";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <PDFViewer
            src={PDF_SRC}
            title="Pimolu brand guidelines"
            height={560}
            downloadFileName="pimolu-brand-guidelines.pdf"
            initialPage={2}
            classNames={{
              root: "custom-pdf-viewer-root",
              title: "custom-pdf-viewer-title"
            }}
          />
        </>)
      }
      <style>
        {
          `
.custom-pdf-viewer-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-pdf-viewer-title {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
