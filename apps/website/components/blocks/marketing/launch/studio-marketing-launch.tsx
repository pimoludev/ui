"use client";

import { useState } from "react";
import { Button, Image, Input, Checkbox } from "@pimolu/react";

export function StudioMarketingLaunchBlock() {
  const [message, setMessage] = useState("");
  const [joined, setJoined] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Launch</h2>
      </header>
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <h3 className="font-serif text-3xl sm:text-5xl">
            A new chapter.
            <br />
            Worth waiting for.
          </h3>
          <p className="text-muted">A new space for the things you make.</p>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setJoined(true);
              setMessage(
                "Launch update prepared for " +
                  new FormData(e.currentTarget).get("email") +
                  ". No message sent.",
              );
            }}
          >
            <Input
              label="Launch updates email"
              name="email"
              type="email"
              required
              fullWidth
            />
            <Checkbox label="I agree to receive launch news" required />
            <Button type="submit" fullWidth>
              {joined ? "Update prepared" : "Keep me in the loop"}
            </Button>
          </form>
        </div>
        <Image
          src="/images/pimolu-atmosphere.webp"
          alt="Pimolu launch illustration"
          aspectRatio="4 / 3"
          containerStyle={{
            width: "100%",
          }}
        />
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
