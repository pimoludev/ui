"use client";

import { useState } from "react";
import { Button, Card, Image, Select, Input } from "@pimolu/react";

export function MarketCartBlock() {
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [removed, setRemoved] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(false);
  const subtotal = Number(quantity) * 129;
  const total = discount ? subtotal * 0.9 : subtotal;
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Shopping cart
        </h2>
      </header>
      {removed ? (
        <Card className="space-y-4 p-6">
          <h3>Your bag is empty</h3>
          <Button onClick={() => setRemoved(false)}>Restore headphones</Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <Card className="grid gap-6 p-6 sm:grid-cols-2">
            <Image
              src="/images/pimolu-studio.webp"
              alt="Pimolu product artwork"
              aspectRatio="4 / 3"
              containerStyle={{
                width: "100%",
              }}
            />
            <div className="space-y-5">
              <h3 className="text-xl">Studio Headphones</h3>
              <Select
                label="Bag quantity"
                value={quantity}
                onValueChange={setQuantity}
                fullWidth
              >
                {["1", "2", "3"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </Select>
              <Button appearance="ghost" onClick={() => setRemoved(true)}>
                Remove headphones
              </Button>
            </div>
          </Card>
          <Card className="space-y-5 p-6">
            <h3 className="text-2xl">Your total</h3>
            <dl className="grid grid-cols-2 gap-3">
              <dt>Subtotal</dt>
              <dd>{"$" + subtotal.toFixed(2)}</dd>
              <dt>Discount</dt>
              <dd>{discount ? "10%" : "None"}</dd>
              <dt>Total</dt>
              <dd className="font-semibold">{"$" + total.toFixed(2)}</dd>
            </dl>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                setDiscount(coupon.trim().toUpperCase() === "STUDIO10");
                setMessage(
                  coupon.trim().toUpperCase() === "STUDIO10"
                    ? "Demo coupon applied."
                    : "Use demo code STUDIO10.",
                );
              }}
            >
              <Input
                label="Promo code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                fullWidth
              />
              <Button type="submit" appearance="outline">
                Apply code
              </Button>
            </form>
            <Button
              fullWidth
              onClick={() =>
                setMessage("Checkout prepared locally. No payment started.")
              }
            >
              Continue to checkout
            </Button>
          </Card>
        </div>
      )}
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
