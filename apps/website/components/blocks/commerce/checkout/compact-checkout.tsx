"use client";

import { useState } from "react";
import { Badge, Button, Card, Input, Checkbox } from "@pimolu/react";

export function CompactCheckoutBlock() {
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);
  const [delivery] = useState("Standard");
  const [email, setEmail] = useState("");
  const [finished, setFinished] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Checkout</h2>
      </header>
      {finished ? (
        <Card className="space-y-4 p-6">
          <h3 className="text-2xl">Order prepared</h3>

          <Button
            onClick={() => {
              setFinished(false);
              setStep(1);
            }}
          >
            Start another preview
          </Button>
        </Card>
      ) : (
        <div className="mx-auto max-w-lg space-y-6">
          <Card className="p-6">
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (step === 1) setStep(2);
                else {
                  setFinished(true);
                  setMessage(
                    "Demo order prepared for " + email + ". No payment collected.",
                  );
                }
              }}
            >
              <h3 className="text-2xl">
                {step === 1 ? "Your details" : "Review your order"}
              </h3>
              {step === 1 ? (
                <>
                  <Input
                    label="Guest email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                  />
                  <Input label="Recipient" name="name" required fullWidth />
                  <Input label="Delivery address" name="address" required fullWidth />
                  <Checkbox
                    label="Use delivery address for the invoice"
                    defaultChecked
                  />
                </>
              ) : (
                <div className="space-y-4">
                  <p>{email}</p>
                  <p>{delivery + " / Studio Headphones / $129 before tax"}</p>
                  <Button appearance="outline" onClick={() => setStep(1)}>
                    Edit details
                  </Button>
                </div>
              )}
              <Button type="submit" fullWidth>
                {step === 1 ? "Review order" : "Confirm demo order"}
              </Button>
            </form>
          </Card>
          <Card className="space-y-4 p-6">
            <Badge>{"STEP " + step + " OF 2"}</Badge>
            <h3 className="text-xl">Studio Headphones</h3>
            <p className="text-3xl">$129</p>
            <p className="text-sm text-muted">Subtotal before shipping and tax.</p>
          </Card>
        </div>
      )}
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
