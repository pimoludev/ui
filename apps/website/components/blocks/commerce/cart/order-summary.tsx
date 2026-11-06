"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  Switch,
} from "@pimolu/react";

export function OrderSummaryBlock() {
  const [quantity, setQuantity] = useState("1");
  const [gift, setGift] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [message, setMessage] = useState("");
  const subtotal = removed ? 0 : 129 * Number(quantity);
  const total = subtotal + (!removed && gift ? 5 : 0);
  return (
    <div className="mx-auto max-w-2xl p-5 sm:p-8">
      <Card size="lg">
        <CardHeader>
          <Badge variant="primary">Your bag</Badge>
          <CardTitle>A little something, for you.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {removed ? (
            <div className="space-y-4">
              <p>Your bag is empty.</p>
              <Button
                appearance="outline"
                onClick={() => {
                  setRemoved(false);
                  setMessage("");
                }}
              >
                Restore item
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-medium">Studio Headphones</h3>
                  <p className="text-sm text-muted">Graphite · $129 each</p>
                </div>
                <Button
                  appearance="ghost"
                  size="sm"
                  onClick={() => {
                    setRemoved(true);
                    setMessage("Item removed from the local bag.");
                  }}
                >
                  Remove item
                </Button>
              </div>
              <Select
                label="Bag quantity"
                value={quantity}
                onValueChange={(value) => {
                  setQuantity(value);
                  setMessage("");
                }}
                fullWidth
              >
                <option value="1">1 item</option>
                <option value="2">2 items</option>
                <option value="3">3 items</option>
              </Select>
              <Switch
                label="Gift wrapping"
                description="A thoughtful finish. $5 per order."
                checked={gift}
                onCheckedChange={(value) => {
                  setGift(value);
                  setMessage("");
                }}
              />
            </>
          )}
          <dl className="space-y-3 border-t border-border pt-5">
            <div className="flex justify-between gap-4">
              <dt>Subtotal</dt>
              <dd>${subtotal}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Gift wrapping</dt>
              <dd>${!removed && gift ? 5 : 0}</dd>
            </div>
            <div className="flex justify-between gap-4 text-xl font-medium">
              <dt>Total before tax</dt>
              <dd>${total}</dd>
            </div>
          </dl>
          <Button
            fullWidth
            disabled={removed}
            onClick={() =>
              setMessage(
                `Checkout prepared for $${total} before tax. Demo only; no payment or order created.`,
              )
            }
          >
            Review checkout
          </Button>
          <p role="status" className="text-sm text-muted">
            {message ||
              "Shipping and taxes must be calculated by your checkout service."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
