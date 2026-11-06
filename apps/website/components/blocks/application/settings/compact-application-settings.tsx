"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Input,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@pimolu/react";

export function CompactApplicationSettingsBlock() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(true);
  const [digest, setDigest] = useState(false);
  const [name, setName] = useState("Maya Chen");
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Settings</h2>
      </header>
      <Tabs defaultValue="profile">
        <TabsList aria-label="Account settings">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <form
            className="mt-6 max-w-lg space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setMessage("Profile for " + name + " saved locally.");
            }}
          >
            <Input
              label="Display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <Button type="submit">Save profile</Button>
          </form>
        </TabsContent>
        <TabsContent value="notifications">
          <Card className="mt-6 p-6">
            <div className="space-y-6">
              <Switch
                label="Email notifications"
                checked={email}
                onCheckedChange={setEmail}
              />
              <Switch
                label="Weekly summary"
                checked={digest}
                onCheckedChange={setDigest}
              />
              <Button
                onClick={() =>
                  setMessage(
                    "Preferences saved locally: email " +
                      (email ? "on" : "off") +
                      ", summary " +
                      (digest ? "on" : "off"),
                  )
                }
              >
                Save preferences
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
