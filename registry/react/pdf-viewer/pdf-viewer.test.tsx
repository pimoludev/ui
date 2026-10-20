import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PDFViewer } from "./pdf-viewer";

describe("Pimolu PDFViewer", () => {
  it("embeds the document with an accessible name", () => {
    render(
      <PDFViewer
        src="/documents/brand-guidelines.pdf"
        title="Brand guidelines"
      />
    );

    expect(
      screen.getByRole("toolbar", {
        name: "PDF actions",
      })
    ).toBeInTheDocument();

    const object = screen.getByRole("document", {
      name: "Brand guidelines",
    });

    expect(object).toHaveAttribute(
      "data",
      "/documents/brand-guidelines.pdf"
    );
    expect(object).toHaveAttribute(
      "type",
      "application/pdf"
    );
    expect(object).toHaveAttribute(
      "aria-label",
      "Brand guidelines"
    );
    expect(object).toHaveAttribute(
      "role",
      "document"
    );

    expect(
      screen.getByText("Brand guidelines")
    ).toBeInTheDocument();
  });

  it("offers open-in-new-tab and download actions", () => {
    render(
      <PDFViewer
        src="/documents/brand-guidelines.pdf"
        title="Brand guidelines"
        downloadFileName="pimolu-brand.pdf"
      />
    );

    const open = screen.getByRole("link", {
      name: "Open in new tab",
    });

    expect(open).toHaveAttribute(
      "href",
      "/documents/brand-guidelines.pdf"
    );
    expect(open).toHaveAttribute("target", "_blank");
    expect(open).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );

    const download = screen.getByRole("link", {
      name: "Download PDF",
    });

    expect(download).toHaveAttribute(
      "href",
      "/documents/brand-guidelines.pdf"
    );
    expect(download).toHaveAttribute(
      "download",
      "pimolu-brand.pdf"
    );
  });

  it("moves between toolbar actions with the arrow keys", () => {
    render(
      <PDFViewer
        src="/documents/brand-guidelines.pdf"
        title="Brand guidelines"
      />
    );

    const open = screen.getByRole("link", {
      name: "Open in new tab",
    });

    const download = screen.getByRole("link", {
      name: "Download PDF",
    });

    open.focus();

    fireEvent.keyDown(open, { key: "ArrowRight" });

    expect(download).toHaveFocus();

    fireEvent.keyDown(download, { key: "ArrowRight" });

    expect(open).toHaveFocus();

    fireEvent.keyDown(open, { key: "End" });

    expect(download).toHaveFocus();

    fireEvent.keyDown(download, { key: "Home" });

    expect(open).toHaveFocus();
  });

  it("can hide each toolbar action", () => {
    render(
      <PDFViewer
        src="/documents/brand-guidelines.pdf"
        title="Brand guidelines"
        downloadable={false}
        openInNewTab={false}
      />
    );

    expect(
      screen.queryByRole("link", {
        name: "Open in new tab",
      })
    ).toBeNull();

    expect(
      screen.queryByRole("link", {
        name: "Download PDF",
      })
    ).toBeNull();

    /* The fallback keeps a way to open the document. */
    expect(
      screen.getByRole("link", {
        name: "Open the PDF",
      })
    ).toHaveAttribute(
      "href",
      "/documents/brand-guidelines.pdf"
    );

    expect(
      screen.queryByRole("link", {
        name: "Download the PDF",
      })
    ).toBeNull();
  });

  it("can hide the toolbar", () => {
    render(
      <PDFViewer
        src="/documents/brand-guidelines.pdf"
        title="Brand guidelines"
        showToolbar={false}
      />
    );

    expect(
      screen.queryByRole("toolbar")
    ).toBeNull();

    expect(
      screen.getByRole("document", { name: "Brand guidelines" })
    ).toBeInTheDocument();
  });

  it("applies a numeric or CSS height", () => {
    const { rerender } = render(
      <PDFViewer
        src="/documents/brand-guidelines.pdf"
        title="Brand guidelines"
        height={560}
      />
    );

    expect(
      screen.getByRole("document", { name: "Brand guidelines" })
        .parentElement
    ).toHaveStyle({ height: "560px" });

    rerender(
      <PDFViewer
        src="/documents/brand-guidelines.pdf"
        title="Brand guidelines"
        height="70vh"
      />
    );

    const root = screen.getByRole("document", {
      name: "Brand guidelines",
    }).parentElement as HTMLElement;

    expect(root.style.height).toBe("70vh");
  });

  it("opens a page through the standard PDF fragment", () => {
    render(
      <PDFViewer
        src="/documents/brand-guidelines.pdf"
        title="Brand guidelines"
        initialPage={4}
      />
    );

    expect(
      screen.getByRole("document", { name: "Brand guidelines" })
    ).toHaveAttribute(
      "data",
      "/documents/brand-guidelines.pdf#page=4"
    );

    expect(
      screen.getByRole("link", {
        name: "Open in new tab",
      })
    ).toHaveAttribute(
      "href",
      "/documents/brand-guidelines.pdf#page=4"
    );

    /* A download must fetch the clean file, not the fragment. */
    expect(
      screen.getByRole("link", {
        name: "Download PDF",
      })
    ).toHaveAttribute(
      "href",
      "/documents/brand-guidelines.pdf"
    );
  });

  it("keeps an existing fragment when adding the page", () => {
    render(
      <PDFViewer
        src="/documents/brand-guidelines.pdf#toolbar=0"
        title="Brand guidelines"
        initialPage={2}
      />
    );

    expect(
      screen.getByRole("document", { name: "Brand guidelines" })
    ).toHaveAttribute(
      "data",
      "/documents/brand-guidelines.pdf#toolbar=0&page=2"
    );
  });

  it("renders the object fallback with an open link", () => {
    render(
      <PDFViewer
        src="/documents/brand-guidelines.pdf"
        title="Brand guidelines"
      />
    );

    expect(
      screen.getByText(
        "This browser cannot display the PDF inline."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Download the PDF",
      })
    ).toHaveAttribute(
      "download",
      ""
    );
  });

  it("accepts custom fallback content and labels", () => {
    render(
      <PDFViewer
        src="/documents/brand-guidelines.pdf"
        title="Charte graphique"
        aria-label="Document de marque"
        fallback={<p>Installez un lecteur PDF.</p>}
        labels={{
          toolbar: "Actions du PDF",
          openInNewTab: "Ouvrir dans un onglet",
          download: "Télécharger",
          openPdf: "Ouvrir le PDF",
          downloadPdf: "Télécharger le PDF",
        }}
      />
    );

    expect(
      screen.getByText("Installez un lecteur PDF.")
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        "This browser cannot display the PDF inline."
      )
    ).toBeNull();

    expect(
      screen.getByRole("toolbar", {
        name: "Actions du PDF",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Ouvrir dans un onglet",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Document de marque")
    ).toHaveAttribute("data", "/documents/brand-guidelines.pdf");
  });

  it("forwards the load event", () => {
    const onLoad = vi.fn();

    render(
      <PDFViewer
        src="/documents/brand-guidelines.pdf"
        title="Brand guidelines"
        onLoad={onLoad}
      />
    );

    const object = screen.getByRole("document", {
      name: "Brand guidelines",
    });

    fireEvent.load(object);

    expect(onLoad).toHaveBeenCalledTimes(1);
  });
});
