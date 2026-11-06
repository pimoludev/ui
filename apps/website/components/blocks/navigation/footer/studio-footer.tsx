"use client";

import { useState } from "react";
import { Badge, Button, Footer } from "@pimolu/react";

export function StudioFooterBlock() {
  const [section, setSection] = useState("Studio");
  return (
    <section className="mx-auto max-w-5xl space-y-10 p-6 sm:p-10">
      <div className="space-y-4" tabIndex={-1} data-footer-top>
        <Badge>INDEPENDENT STUDIO</Badge>
        <h2 className="font-serif text-3xl sm:text-5xl">
          Let&apos;s make
          <br />
          something matter.
        </h2>
        <p role="status" className="text-muted">
          {section === "Work"
            ? "Selected work: Atlas, Paper and Orbit. Sample projects."
            : section === "Contact"
              ? "Studio inquiries: replace this panel with your own contact details."
              : "Thoughtful interfaces. Good people. Room to grow."}
        </p>
      </div>
      <Footer
        appearance="transparent"
        brand={<strong>pimolu / studio</strong>}
        description="Designing the next chapter, together."
        columns={[]}
        actions={
          <div className="flex flex-wrap gap-3">
            {["Studio", "Work", "Contact"].map((x) => (
              <Button
                key={x}
                appearance="ghost"
                aria-pressed={section === x}
                onClick={() => setSection(x)}
              >
                {x}
              </Button>
            ))}
          </div>
        }
        copyright="Sample studio footer"
        bottom={
          <Button
            appearance="outline"
            onClick={(e) => {
              const target = e.currentTarget
                .closest("section")
                ?.querySelector<HTMLElement>("[data-footer-top]");
              target?.focus({
                preventScroll: true,
              });
              target?.scrollIntoView({
                behavior: "auto",
                block: "nearest",
              });
            }}
          >
            Back to top
          </Button>
        }
      />
    </section>
  );
}
