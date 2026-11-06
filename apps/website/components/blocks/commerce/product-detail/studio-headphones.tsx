"use client";

import { useState } from "react";
import { Badge, Button, Card, CardContent, Image, Select } from "@pimolu/react";

export function StudioHeadphonesBlock() {
  const [finish, setFinish] = useState("Graphite");
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");
  return (
    <section className="mx-auto grid max-w-5xl items-center gap-8 p-5 sm:p-8 md:grid-cols-2">
      {/* Copy this demo asset into public/images, or replace it with your product photography. */}
      <Image
        src="/images/pimolu-studio.webp"
        alt="Lavender Pimolu studio headphones on a display stand"
        aspectRatio="1 / 1"
        fit="cover"
        containerStyle={{ width: "100%" }}
      />
      <Card size="lg">
        <CardContent className="space-y-5">
          <Badge variant="success">In stock · Sample product</Badge>
          <h2 className="text-3xl font-medium">Studio Headphones</h2>
          <p className="text-sm text-muted">A quieter space for your next idea.</p>
          <p className="text-3xl font-medium">$129</p>
          <Select
            label="Finish"
            value={finish}
            onValueChange={(value) => {
              setFinish(value);
              setMessage("");
            }}
            fullWidth
          >
            <option>Graphite</option>
            <option>Ivory</option>
            <option>Lavender</option>
          </Select>
          <Select
            label="Quantity"
            value={quantity}
            onValueChange={(value) => {
              setQuantity(value);
              setMessage("");
            }}
            fullWidth
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </Select>
          <Button
            fullWidth
            onClick={() =>
              setMessage(
                `${quantity} ${finish.toLowerCase()} headphones added to this local preview bag. Total $${129 * Number(quantity)}.`,
              )
            }
          >
            Add to bag · ${129 * Number(quantity)}
          </Button>
          <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
            {message}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
