"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  Switch,
} from "@pimolu/react";

export function NotificationPreferencesBlock() {
  const [email, setEmail] = useState(true);
  const [product, setProduct] = useState(false);
  const [digest, setDigest] = useState("Weekly");
  const [message, setMessage] = useState("");
  return (
    <div className="mx-auto max-w-2xl p-5 sm:p-8">
      <Card size="lg">
        <CardHeader>
          <CardTitle>Only what matters to you.</CardTitle>
          <p className="text-sm text-muted">
            Choose how your workspace keeps in touch.
          </p>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            onChange={() => setMessage("")}
            onSubmit={(event) => {
              event.preventDefault();
              setMessage(
                `Preferences saved locally: email ${email ? "on" : "off"}, product news ${product ? "on" : "off"}, ${digest.toLowerCase()} digest.`,
              );
            }}
          >
            <Switch
              label="Email notifications"
              description="Mentions, invitations and project updates."
              checked={email}
              onCheckedChange={(value) => {
                setEmail(value);
                setMessage("");
              }}
            />
            <Switch
              label="Product news"
              description="Occasional notes about new features."
              checked={product}
              onCheckedChange={(value) => {
                setProduct(value);
                setMessage("");
              }}
            />
            <Select
              label="Summary frequency"
              value={digest}
              onValueChange={(value) => {
                setDigest(value);
                setMessage("");
              }}
              fullWidth
            >
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Never</option>
            </Select>
            <div className="flex flex-wrap gap-3">
              <Button type="submit">Save preferences</Button>
              <Button
                type="button"
                appearance="outline"
                onClick={() => {
                  setEmail(true);
                  setProduct(false);
                  setDigest("Weekly");
                  setMessage("Defaults restored locally.");
                }}
              >
                Restore defaults
              </Button>
            </div>
            <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
              {message}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
