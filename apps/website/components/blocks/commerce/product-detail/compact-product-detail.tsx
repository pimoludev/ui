"use client";

import { useState } from "react";
import { Badge, Button, Card, Image, Select } from "@pimolu/react";

export function CompactProductDetailBlock() {
  const [message, setMessage] = useState("");
  const [finish, setFinish] = useState("Graphite");
  const [quantity, setQuantity] = useState("1");
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Product detail
        </h2>
      </header>
      <div className="grid gap-8 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <Image
            src="/images/pimolu-studio.webp"
            alt="Pimolu product artwork"
            aspectRatio="4 / 3"
            containerStyle={{
              width: "100%",
            }}
          />
          <div className="grid grid-cols-2 gap-3">
            <Badge>24 h sample battery</Badge>
            <Badge>240 g sample weight</Badge>
          </div>
        </div>
        <Card className="p-6">
          <div className="space-y-5">
            <Badge>STUDIO / AUDIO</Badge>
            <h3 className="font-serif text-3xl">Make room for sound.</h3>
            <p className="text-muted">
              Wireless listening. A 24-hour battery in a light, 240 g frame.
            </p>
            <Select label="Finish" value={finish} onValueChange={setFinish} fullWidth>
              {["Graphite", "Lilac", "Pearl"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </Select>
            <Select
              label="Quantity"
              value={quantity}
              onValueChange={setQuantity}
              fullWidth
            >
              {["1", "2", "3"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </Select>
            <p className="text-3xl">{"$" + Number(quantity) * 129}</p>
            <Button
              fullWidth
              onClick={() =>
                setMessage(
                  quantity + " " + finish + " headphones added to the local bag.",
                )
              }
            >
              Add to bag
            </Button>
          </div>
        </Card>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
