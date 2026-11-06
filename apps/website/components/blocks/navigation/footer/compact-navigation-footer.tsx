"use client";

import { useState } from "react";
import { Button, Card, Footer } from "@pimolu/react";

export function CompactNavigationFooterBlock() {
  const [message, setMessage] = useState("");
  const [section, setSection] = useState("Product");
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Footer</h2>
      </header>
      <div className="space-y-7">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-7">
          <h3 className="font-serif text-3xl">
            Make something
            <br />
            worth keeping.
          </h3>
          <Button
            appearance="outline"
            onClick={() => setMessage("Contact request prepared locally.")}
          >
            Talk to the studio
          </Button>
        </div>
        <div className="grid gap-7 md:grid-cols-2">
          <div className="space-y-4">
            <strong className="text-2xl">Pimolu / Studio</strong>
            <p className="text-sm text-muted">Design, build, and make it yours.</p>
            <div className="flex flex-wrap gap-2">
              {["Product", "Company", "Resources"].map((x) => (
                <Button
                  key={x}
                  appearance={section === x ? "solid" : "ghost"}
                  aria-pressed={section === x}
                  onClick={() => setSection(x)}
                >
                  {x}
                </Button>
              ))}
            </div>
          </div>
          <Card className="space-y-4 p-5">
            <h4 className="text-xl">{section}</h4>
            <p>
              {section === "Product"
                ? "Collections, details and the story behind each object."
                : section === "Company"
                  ? "The people, principles and process behind the studio."
                  : "Guides, support and practical notes for your next project."}
            </p>
          </Card>
        </div>
        <Footer
          columns={[]}
          appearance="transparent"
          brand="Studio / Independent"
          description="Thoughtful work, made together."
          copyright="Sample studio footer"
        />
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
