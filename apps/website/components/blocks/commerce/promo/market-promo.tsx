"use client";

import { useState } from "react";
import { Button, Card, Input, Image } from "@pimolu/react";

export function MarketPromoBlock() {
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Promotions
        </h2>
      </header>
      <div className="grid gap-7 md:grid-cols-2">
        <Image
          src="/images/pimolu-studio.webp"
          alt="Pimolu product artwork"
          aspectRatio="4 / 3"
          containerStyle={{
            width: "100%",
          }}
        />
        <Card className="space-y-5 p-6">
          <h3 className="text-2xl">Have a little code?</h3>
          <p className="text-sm text-muted">Use code STUDIO10 at checkout.</p>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const ok = code.trim().toUpperCase() === "STUDIO10";
              setApplied(ok);
              setMessage(
                ok
                  ? "10% demo discount applied."
                  : "That sample code is not recognized.",
              );
            }}
          >
            <Input
              label="Discount code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              fullWidth
            />
            <Button type="submit">Apply discount</Button>
          </form>
          <p className="text-3xl">{applied ? "$116.10" : "$129.00"}</p>
        </Card>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
