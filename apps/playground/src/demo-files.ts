const PREVIEW_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5B55E7"/>
      <stop offset="1" stop-color="#14B8A6"/>
    </linearGradient>
  </defs>
  <rect width="240" height="160" rx="18" fill="url(#bg)"/>
  <circle cx="120" cy="78" r="44" fill="rgb(255 255 255 / 24%)"/>
  <path d="M72 116c16-34 40-50 72-50 13 0 24 2 34 7-10 28-37 45-75 51Z" fill="rgb(255 255 255 / 58%)"/>
  <circle cx="88" cy="62" r="9" fill="rgb(255 255 255 / 70%)"/>
</svg>
`;

const PDF_CONTENT = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [] /Count 0 >>
endobj
trailer
<< /Root 1 0 R >>
%%EOF
`;

/**
 * Small in-memory files used by the upload demos to show image thumbnails
 * without a network request.
 */
export const previewImageFile = new File(
  [PREVIEW_SVG],
  "brand-cover.svg",
  {
    type: "image/svg+xml",
    lastModified: 1_700_000_000_000,
  }
);

export const previewPdfFile = new File(
  [PDF_CONTENT],
  "brand-notes.pdf",
  {
    type: "application/pdf",
    lastModified: 1_700_000_000_000,
  }
);
