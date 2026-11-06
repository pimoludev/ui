"use client";

import { useState } from "react";
import { Badge, Button, Card, Image, Input, Checkbox } from "@pimolu/react";

export function MarketMarketingLaunchBlock() {
  const [message, setMessage] = useState("");
  const [joined, setJoined] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Launch</h2>
      </header>
      <div className="space-y-6">
        <Image
          src="/images/pimolu-studio.webp"
          alt="Pimolu product artwork"
          aspectRatio="4 / 3"
          containerStyle={{
            width: "100%",
          }}
        />
        <div className="grid gap-7 md:grid-cols-[1fr_1fr]">
          <div className="space-y-3">
            <h3 className="text-3xl">Studio / next edition</h3>
            <p>Early access, thoughtful updates, room to shape what comes next.</p>
            <div className="flex flex-wrap gap-3">
              <Badge>Design preview</Badge>
              <Badge>Launch date to be announced</Badge>
            </div>
          </div>
          <Card className="p-6">
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
          </Card>
        </div>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
