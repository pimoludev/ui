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

export function ShopLoginBlock() {
  const [message, setMessage] = useState("");
  return (
    <section className="mx-auto grid max-w-5xl gap-10 p-6 sm:p-10 md:grid-cols-2 md:items-center">
      <div className="space-y-5">
        <Badge>STUDIO STORE</Badge>
        <h2 className="font-serif text-3xl sm:text-4xl">
          Good taste.
          <br />
          Great to see you.
        </h2>
        <Image
          src="/images/pimolu-studio.webp"
          alt="Pimolu studio headphones"
          aspectRatio="4 / 3"
          containerStyle={{
            width: "100%",
          }}
        />
        <p className="text-sm text-muted">
          Your favorites, your bag, your next little discovery.
        </p>
      </div>
      <Card className="p-6 sm:p-8">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setMessage(
              "Sign-in prepared for " +
                new FormData(e.currentTarget).get("email") +
                ". Demo only.",
            );
          }}
        >
          <h3 className="text-2xl font-medium">Welcome back</h3>
          <Input
            label="Shopping email"
            name="email"
            type="email"
            required
            autoComplete="username"
            fullWidth
          />
          <PasswordInput
            label="Store password"
            name="password"
            required
            minLength={8}
            autoComplete="current-password"
            fullWidth
          />
          <Checkbox label="Remember this device" />
          <Button type="submit" fullWidth>
            Return to the store
          </Button>
          <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
            {message}
          </p>
        </form>
      </Card>
    </section>
  );
}
