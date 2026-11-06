"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Image,
  Select,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@pimolu/react";

export function MarketProductDetailBlock() {
  const [message, setMessage] = useState("");
  const [finish, setFinish] = useState("Graphite");
  const [quantity, setQuantity] = useState("1");

  return (
    <section className="mx-auto max-w-6xl p-5 sm:p-10">
      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <Image
          src="/images/pimolu-studio.webp"
          alt="Pimolu Studio headphones on a violet display stand"
          aspectRatio="1 / 1"
          containerStyle={{ width: "100%" }}
        />
        <div className="min-w-0 space-y-6">
          <header className="space-y-3">
            <Badge>STUDIO / AUDIO</Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Make room for sound.
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              Soft cushions. A balanced frame. Your own little listening space.
            </p>
            <p className="text-3xl font-medium">${Number(quantity) * 129}</p>
          </header>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Finish" value={finish} onValueChange={setFinish} fullWidth>
              <option>Graphite</option>
              <option>Lilac</option>
              <option>Pearl</option>
            </Select>
            <Select
              label="Quantity"
              value={quantity}
              onValueChange={setQuantity}
              fullWidth
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </Select>
          </div>
          <Button
            fullWidth
            onClick={() =>
              setMessage(`${quantity} ${finish} headphones added to the local bag.`)
            }
          >
            Add to bag
          </Button>
          <Tabs defaultValue="design" variant="line">
            <TabsList aria-label="Product information">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
            </TabsList>
            <TabsContent value="design">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Connection</dt>
                  <dd>Wireless</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Battery</dt>
                  <dd>24 hours</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Weight</dt>
                  <dd>240 g</dd>
                </div>
              </dl>
            </TabsContent>
            <TabsContent value="delivery">
              <p className="text-sm leading-relaxed text-muted">
                Shipping options appear at checkout. Add your store?s delivery regions,
                timelines and return terms here.
              </p>
            </TabsContent>
          </Tabs>
          <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
            {message}
          </p>
        </div>
      </div>
    </section>
  );
}
