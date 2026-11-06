"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Image,
  Input,
  PasswordInput,
} from "@pimolu/react";

export function ShopRegisterBlock() {
  const [message, setMessage] = useState("");
  return (
    <section className="mx-auto grid max-w-5xl gap-8 p-6 md:grid-cols-2 md:items-center">
      <div className="space-y-6">
        <Badge variant="primary">THE STUDIO CLUB</Badge>
        <h2 className="font-serif text-3xl sm:text-4xl">
          A little more
          <br />
          of what you love.
        </h2>
        <Image
          src="/images/pimolu-studio.webp"
          alt="Lavender studio headphones"
          aspectRatio="1 / 1"
          containerStyle={{
            width: "100%",
          }}
        />
        <p className="text-sm text-muted">
          Save your favorites and discover the next collection.
        </p>
      </div>
      <Card className="p-6">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            setMessage(
              "Profile prepared for " +
                data.get("name") +
                ". No account has been created.",
            );
          }}
        >
          <h3 className="text-2xl font-medium">Make yourself at home</h3>
          <Input
            label="Your name"
            name="name"
            required
            maxLength={80}
            autoComplete="name"
            fullWidth
          />
          <Input
            label="Your email"
            name="email"
            type="email"
            required
            autoComplete="email"
            fullWidth
          />
          <PasswordInput
            label="Choose a password"
            name="password"
            required
            minLength={10}
            autoComplete="new-password"
            fullWidth
          />
          <p className="text-sm text-muted">Use at least 10 characters.</p>
          <Checkbox name="news" label="Send me collection updates (optional)" />
          <Button type="submit" fullWidth>
            Create store profile
          </Button>
          <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
            {message}
          </p>
        </form>
      </Card>
    </section>
  );
}
